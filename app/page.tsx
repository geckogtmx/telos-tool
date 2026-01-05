import Link from 'next/link';
import Button from '@/components/ui/Button';
import { APP_NAME, APP_DESCRIPTION } from '@/config/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Your <span className="text-blue-600">TELOS File</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What is TELOS?
          </h2>
          <div className="space-y-4 text-lg text-gray-700">
            <p>
              TELOS (Teleological Operating System) is a comprehensive framework that defines the purpose,
              values, constraints, and operating principles of an entity - whether that's an individual,
              organization, or AI agent.
            </p>
            <p>
              Think of it as a living document that captures not just what you do, but <strong>why</strong> you
              do it, <strong>how</strong> you make decisions, and <strong>what</strong> guides your actions.
            </p>
            <p className="text-gray-600 italic border-l-4 border-blue-600 pl-4">
              Currently in Beta - All features free during preview period. Early users will receive special benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Three Types of TELOS
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Individual</h3>
            <p className="text-gray-600">
              Transform your CV and career goals into a comprehensive personal TELOS that guides your professional journey.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Organization</h3>
            <p className="text-gray-600">
              Convert your organization's mission and values into a structured TELOS that aligns your team.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Agent</h3>
            <p className="text-gray-600">
              Build clear operating parameters for AI agents with defined purpose, constraints, and communication style.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-lg shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your TELOS?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get started in minutes with our guided generation process
          </p>
          <Link href="/generate">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Generating
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
