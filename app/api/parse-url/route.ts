import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

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
