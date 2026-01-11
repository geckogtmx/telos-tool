import { Question } from '@/types';

export const organizationQuestions: Question[] = [
  {
    id: 'problems',
    question: 'What problems does your organization solve?',
    type: 'textarea',
    placeholder: 'The core issues you address in the market or society...',
    required: true,
    minLength: 20,
    description: "The specific pain points or gaps your organization exists to fix. Be specific about the friction your customers or beneficiaries face without you.",
    examples: [
      'Small businesses struggle to get loans because traditional banks take 6 weeks to approve them. We solve the liquidity gap by using API data to approve loans in 24 hours.',
      'Remote teams feel disconnected and lonely. We solve the culture gap by providing structured, asynchronous social rituals that don\'t feel like forced fun.',
      'Artists can\'t monetize their work without selling out to algorithms. We provide a direct patronage platform that removes the need for ads or sponsors.'
    ]
  },
  {
    id: 'mission',
    question: "What's your organization's mission?",
    type: 'textarea',
    placeholder: 'Clear statement of organizational purpose...',
    required: true,
    minLength: 10,
    description: "Your north star. A clear, concise statement of why you exist and what you hope to achieve. This guides every strategic decision.",
    examples: [
      'To make capital accessible to anyone with a solvent business model, regardless of their zip code.',
      'Building the operating system for trustworthy AI.',
      'To accelerate the world\'s transition to sustainable energy.',
      'To organize the world\'s information and make it universally accessible and useful.'
    ]
  },
  {
    id: 'values',
    question: 'What are your core organizational values?',
    type: 'textarea',
    placeholder: 'The principles that guide decisions and culture...',
    required: true,
    minLength: 20,
    description: "The non-negotiable principles that drive behavior. What do you hire for? What do you fire for? Focus on actionable values, not just generic words like 'Integrity'.",
    examples: [
      'Customer Obsession: We start with the customer and work backward. Bias for Action: Speed matters in business. Frugality: Accomplish more with less.',
      'Radical Candor: We care personally but challenge directly. Default to Open: access to information is the default setting. Asynchronous first: We document everything so time zones don\'t matter.',
      'Don\'t ship junk. We\'d rather miss a deadline than ship a broken experience. Design is not a veneer. Privacy is a human right.'
    ]
  },
  {
    id: 'constraints',
    question: 'What does your organization explicitly avoid?',
    type: 'textarea',
    placeholder: 'Boundaries, anti-goals, things you won\'t do...',
    required: true,
    minLength: 10,
    description: "Your anti-goals. The paths you refuse to take, the customers you won't serve, or the revenue models you reject. Strategy is what you don't do.",
    examples: [
      'We do not sell user data. Ever. Even if it would double our revenue.',
      'No enterprise sales. We engage only with self-serve users. If they need a contract, they aren\'t our customer.',
      'We won\'t build features just to close a deal. We build for the market, not for one loud client.',
      'No consulting. We act like a product company. If a problem requires human service to solve, we don\'t solve it.'
    ]
  },
  {
    id: 'operations',
    question: 'How does your organization operate and make decisions?',
    type: 'textarea',
    placeholder: 'Structure, processes, decision-making approach...',
    required: true,
    minLength: 20,
    description: "Your operating system. How do you meet? How do you decide? Are you hierarchical or flat? Consensus-driven or single-threaded ownership?",
    examples: [
      'We run on 6-week cycles (Shape Up). Decisions are top-down for strategy, bottom-up for execution. We don\'t do recurring status meetings.',
      'We are a fully distributed DAO. Decisions are made via proposals and voting. All communication is public in Discord.',
      'Standard corporate hierarchy but with a "disagree and commit" culture. We use OKRs to align quarterly. Weekly all-hands for transparency.'
    ]
  },
  {
    id: 'initiatives',
    question: 'What are your current initiatives or programs?',
    type: 'textarea',
    placeholder: 'Active projects, their status, and priorities...',
    required: true,
    minLength: 20,
    description: "What is actually happening right now? The key projects, campaigns, or product launches that are consuming resources this quarter.",
    examples: [
      'Project Titanium: Rewriting the billing engine (60% complete). Mobile App Launch: Beta testing with 500 users. Hiring: Looking for a VP of Engineering.',
      'Q4 Goals: 1. Launch new website. 2. Close Series A funding. 3. Reduce churn to <2%.',
      'Community Outreach: Hosting monthly meetups in 5 cities. Content: Publishing the "State of the Industry" report.'
    ]
  },
  {
    id: 'stakeholders',
    question: 'Who are your key stakeholders?',
    type: 'textarea',
    placeholder: 'Internal and external parties that matter (optional)...',
    required: false,
    description: "Who do you answer to? Investors, board members, community, employees, or regulators.",
    examples: [
      'Series B investors (expecting 3x growth). The Board (meets quarterly). Our 50 employees.',
      'Our Patreon supporters (they fund us directly). The open-source community that contributes code.',
      'Public shareholders. The FDA (regulatory compliance is #1). Patients.'
    ]
  },
];

export type OrganizationQuestionAnswers = {
  [key: string]: string;
};
