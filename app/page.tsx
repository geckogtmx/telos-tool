import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: System Prompts & Agent Skills
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
            Build <span className="text-blue-400">AI-Ready</span> Identity Documents
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Generate TELOS files, production system prompts, and installable agent skills—all from one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/generate">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="#what-you-can-create">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See What You Can Create
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Can Create Section */}
      <section id="what-you-can-create" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4 text-center">
          Three Powerful Outputs
        </h2>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-2xl mx-auto">
          Choose the format that fits your needs
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* TELOS Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all group">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">TELOS Document</h3>
            <p className="text-gray-400 mb-4">
              Comprehensive identity and purpose documentation for individuals, organizations, and AI agents.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Mission & values
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Strategic goals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Operating principles
              </li>
            </ul>
          </div>

          {/* System Prompt Card */}
          <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
              NEW
            </div>
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">System Prompt</h3>
            <p className="text-gray-400 mb-4">
              Production-ready prompts optimized for your target platform. Copy and use immediately.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Platform-optimized
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Ready to deploy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Best practices built-in
              </li>
            </ul>
          </div>

          {/* Agent Skill Card */}
          <div className="bg-gradient-to-br from-green-900/30 to-gray-900 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
              NEW
            </div>
            <div className="text-5xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">Agent Skill</h3>
            <p className="text-gray-400 mb-4">
              Installable skill packages compatible with Claude Code, Gemini, and other AI coding agents.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Anthropic format
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Auto-discovery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Scripts & references
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-2 text-center">
            Optimized for Your Platform
          </h2>
          <p className="text-gray-400 mb-8 text-center">
            Generate outputs tailored for the AI tools you use
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { name: 'Universal', icon: '🌐', desc: 'Works everywhere' },
              { name: 'Claude', icon: '🟡', desc: 'Anthropic' },
              { name: 'Gemini', icon: '🔵', desc: 'Google' },
              { name: 'OpenAI', icon: '🟢', desc: 'GPT-4' },
              { name: 'Cursor', icon: '⬛', desc: 'IDE' },
              { name: 'Windsurf', icon: '🌊', desc: 'Codeium' },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col items-center gap-2 px-6 py-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <span className="text-3xl">{platform.icon}</span>
                <span className="text-white font-medium">{platform.name}</span>
                <span className="text-xs text-gray-500">{platform.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entity Types Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4 text-center">
          Three Entity Types
        </h2>
        <p className="text-xl text-gray-400 mb-12 text-center max-w-2xl mx-auto">
          Define purpose for any type of entity
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Individual</h3>
            <p className="text-gray-400 text-sm mb-4">
              Transform your CV and career goals into a comprehensive personal TELOS.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">TELOS</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">Organization</h3>
            <p className="text-gray-400 text-sm mb-4">
              Convert your organization&apos;s mission and values into a structured TELOS.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">TELOS</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all relative">
            <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              3 outputs
            </div>
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">AI Agent</h3>
            <p className="text-gray-400 text-sm mb-4">
              Build operating parameters, system prompts, or installable skills for AI agents.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">TELOS</span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Prompt</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Skill</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is TELOS Section */}
      <section id="what-is-telos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
            What is TELOS?
          </h2>
          <div className="space-y-4 text-lg text-gray-300">
            <p>
              <strong className="text-white">Telos</strong> (Ancient Greek: τέλος) refers to the inherent purpose or final cause.
              It&apos;s an open-source framework by{' '}
              <a
                href="https://github.com/danielmiessler/Telos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Daniel Miessler
              </a>{' '}
              for documenting what entities are about and how they pursue their purpose.
            </p>
            <p>
              This tool extends that framework to generate not just documentation, but also
              <span className="text-purple-400"> production-ready system prompts</span> and
              <span className="text-green-400"> installable agent skills</span>—making your AI agents instantly deployable.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            Ready to Build Your AI Identity?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create TELOS documents, system prompts, or agent skills in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg">
                Start Creating
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            Built with Claude & Gemini • Inspired by{' '}
            <a href="https://github.com/danielmiessler/Telos" className="text-blue-400 hover:underline">
              Daniel Miessler&apos;s TELOS
            </a>
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/generate" className="hover:text-white transition-colors">Generate</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <a href="https://github.com/geckogtmx/telos-tool" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
