import Link from 'next/link';
import Button from '@/components/ui/Button';
import { APP_DESCRIPTION } from '@/config/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
            Generate Your <span className="text-blue-400">TELOS File</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            {APP_DESCRIPTION}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/generate">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="#what-is-telos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is TELOS Section */}
      <section id="what-is-telos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
            What is TELOS?
          </h2>
          <div className="space-y-4 text-lg text-gray-300">
            <p>
              The term Telos (Ancient Greek: τέλος) refers to the inherent purpose or final cause of an object,
              organism, or action. For example, the telos of a coffee mug is to hold a beverage, and for Aristotle,
              the ultimate human telos (highest good) was eudaimonia (happiness or fulfillment).
            </p>
            <p>
              Telos is also an open-sourced framework developed by Daniel Miessler for creating Deep Context about
              things that matter to humans. The purpose of the Telos project is to help entities of any size—from
              individuals to planets—articulate what they are about and how they&apos;re pursuing their purpose in life.
              It provides a structured framework for capturing the main components of an entity, including its
              mission, goals, problems, strategies, KPIs, etc.
            </p>
            <p>
              This &quot;Telos Tool&quot; project takes from Daniel Miessler&apos;s work -{' '}
              <a
                href="https://github.com/danielmiessler/Telos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                https://github.com/danielmiessler/Telos
              </a>
              {' '} - and serves as a helper tool to create, store and distribute Telos files for 3 main entities:
              Individuals, Organizations and Agents.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-12 text-center">
          Three Types of TELOS
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-100 mb-3">Individual</h3>
            <p className="text-gray-400">
              Transform your CV and career goals into a comprehensive personal TELOS that guides your professional journey.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-100 mb-3">Organization</h3>
            <p className="text-gray-400">
              Convert your organization&apos;s mission and values into a structured TELOS that aligns your team.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg hover:border-blue-500 transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-100 mb-3">AI Agent</h3>
            <p className="text-gray-400">
              Build clear operating parameters for AI agents with defined purpose, constraints, and communication style.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            Ready to Create Your TELOS?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get started in minutes with our guided generation process
          </p>
          <Link href="/generate">
            <Button size="lg">
              Start Generating
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
