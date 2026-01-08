import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import dns from 'dns/promises';

// Check if an IP address is private/internal (SSRF protection)
function isPrivateIP(ip: string): boolean {
  // IPv4 private/internal ranges
  const ipv4Patterns = [
    /^127\./, // Loopback
    /^10\./, // Class A private
    /^192\.168\./, // Class C private
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Class B private
    /^169\.254\./, // Link-local / cloud metadata
    /^0\./, // Current network
    /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Carrier-grade NAT
    /^192\.0\.0\./, // IETF protocol assignments
    /^192\.0\.2\./, // TEST-NET-1
    /^198\.51\.100\./, // TEST-NET-2
    /^203\.0\.113\./, // TEST-NET-3
    /^224\./, // Multicast
    /^240\./, // Reserved
    /^255\.255\.255\.255$/, // Broadcast
  ];

  // IPv6 private/internal patterns
  const ipv6Patterns = [
    /^::1$/, // Loopback
    /^fe80:/i, // Link-local
    /^fc00:/i, // Unique local
    /^fd[0-9a-f]{2}:/i, // Unique local
    /^::ffff:(127|10|192\.168|172\.(1[6-9]|2[0-9]|3[0-1]))\./i, // IPv4-mapped
  ];

  for (const pattern of ipv4Patterns) {
    if (pattern.test(ip)) return true;
  }
  for (const pattern of ipv6Patterns) {
    if (pattern.test(ip)) return true;
  }
  return false;
}

// Check if hostname is obviously internal
function isInternalHostname(host: string): boolean {
  return (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  );
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // URL Validation (SSRF Protection)
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);

      // Protocol check
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return NextResponse.json({ success: false, error: 'Invalid protocol' }, { status: 400 });
      }

      // Port check - only allow standard ports
      const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');
      if (port !== '80' && port !== '443') {
        return NextResponse.json({ success: false, error: 'Non-standard ports are not allowed' }, { status: 400 });
      }

      const host = parsedUrl.hostname.toLowerCase();

      // Quick hostname check first
      if (isInternalHostname(host)) {
        return NextResponse.json({ success: false, error: 'Access to internal URLs is restricted' }, { status: 400 });
      }

      // DNS resolution check - prevents DNS rebinding attacks
      try {
        const addresses = await dns.resolve4(host).catch(() => []);
        const addresses6 = await dns.resolve6(host).catch(() => []);
        const allAddresses = [...addresses, ...addresses6];

        // If no addresses resolved, it might be an IP directly
        if (allAddresses.length === 0) {
          // Check if the host itself is an IP
          if (isPrivateIP(host)) {
            return NextResponse.json({ success: false, error: 'Access to internal IPs is restricted' }, { status: 400 });
          }
        } else {
          // Check all resolved IPs
          for (const ip of allAddresses) {
            if (isPrivateIP(ip)) {
              return NextResponse.json({ success: false, error: 'Access to internal IPs is restricted' }, { status: 400 });
            }
          }
        }
      } catch {
        // DNS resolution failed - could be invalid domain, but let fetch handle it
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
    }

    try {
      // Add timeout and size limits
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      // Content size limit (5MB max to prevent DoS)
      const contentLength = response.headers.get('content-length');
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (contentLength && parseInt(contentLength, 10) > maxSize) {
        throw new Error('Response too large');
      }

      const html = await response.text();

      // Double-check actual size (content-length can be missing or wrong)
      if (html.length > maxSize) {
        throw new Error('Response too large');
      }

      // Basic extraction of text from body
      // 1. Remove scripts and styles
      let text = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                     .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
      
      // 2. Extract body content if possible
      const bodyMatch = text.match(/<body\b[^>]*>([\s\S]*?)<\/body>/im);
      if (bodyMatch) {
        text = bodyMatch[1];
      }

      // 3. Strip HTML tags
      text = text.replace(/<[^>]+>/g, "\n");

      // 4. Decode HTML entities (basic ones)
      text = text.replace(/&nbsp;/g, " ")
                 .replace(/&amp;/g, "&")
                 .replace(/&lt;/g, "<")
                 .replace(/&gt;/g, ">")
                 .replace(/&quot;/g, '"');

      // 5. Clean up whitespace
      text = text.replace(/\s+/g, " ").trim();

      if (text.length < 50) {
          throw new Error('Could not extract meaningful text from URL');
      }

      return NextResponse.json({
        success: true,
        text: text
      });

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Could not fetch content from this URL. Please try pasting the text instead.' },
        { status: 422 }
      );
    }

  } catch (error) {
    console.error('Parse URL error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
