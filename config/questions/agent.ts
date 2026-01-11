import { Question } from '@/types';

export const agentQuestions: Question[] = [
  {
    id: 'function',
    question: 'What is this agent\'s primary function?',
    type: 'textarea',
    placeholder: 'Core purpose in one sentence...',
    required: true,
    minLength: 10,
    description: "The single most important job this agent does. If it could only do one thing, what would it be? Be specific about the input it takes and the output it produces.",
    examples: [
      'You are a senior frontend engineer who reviews Pull Requests for accessibility and performance issues.',
      'You are a friendly customer support agent who helps users reset their passwords and troubleshoot login issues. You never express frustration.',
      'You are a creative writing partner who helps brainstorm plot twists but never writes the actual prose.'
    ]
  },
  {
    id: 'problems',
    question: 'What problems does this agent solve?',
    type: 'textarea',
    placeholder: 'Issues it addresses for its principal or users...',
    required: true,
    minLength: 20,
    description: "Why does this agent exist? What pain points, inefficiencies, or lack of expertise is it addressing?",
    examples: [
      'Junior developers often miss accessibility attributes (ARIA labels) which causes legal risk. This agent catches them before merge.',
      'Customers wait 4 hours for simple password resets. This agent solves it instantly, reducing ticket volume by 30%.',
      'Writer\'s block. I get stuck on "what happens next?" and need a sounding board to offer options, not to do the work for me.'
    ]
  },
  {
    id: 'parameters',
    question: 'What are this agent\'s operating parameters?',
    type: 'textarea',
    placeholder: 'Values, priorities, how it makes decisions...',
    required: true,
    minLength: 20,
    description: "The rules of engagement. How does it weigh trade-offs? (e.g. Speed vs. Accuracy, Creativity vs. Safety). What is its reasoning process?",
    examples: [
      'Prioritize security over UX. If a request is ambiguous, reject it rather than guessing. Always cite MDN documentation.',
      'Be extremely empathetic. Apologize for frustration even if it\'s not our fault. Never blame the user. If you don\'t know, escalate to a human immediately.',
      'Rule of Cool: Prioritize interesting/dramatic plot ideas over realistic ones. Challenge my assumptions. If I say "cliché", offer a subversion.'
    ]
  },
  {
    id: 'constraints',
    question: 'What should this agent never do?',
    type: 'textarea',
    placeholder: 'Hard constraints, prohibitions, boundaries...',
    required: true,
    minLength: 10,
    description: "Hard boundaries. actions that are strictly forbidden. This prevents the agent from hallucinating capabilities or overstepping authority.",
    examples: [
      'NEVER suggest code that introduces XSS vulnerabilities. NEVER approve a PR without a passing test suite.',
      'NEVER ask for the user\'s password or credit card. NEVER promise a refund (you don\'t have access).',
      'NEVER write the actual scene. Only summaries/outlines. NEVER use modern slang in a fantasy setting.'
    ]
  },
  {
    id: 'communication',
    question: 'How should this agent communicate?',
    type: 'textarea',
    placeholder: 'Tone, style, interaction patterns...',
    required: true,
    minLength: 10,
    description: "Persona and voice. How does it sound? concise, verbose, formal, casual, pirate-themed? How does it format its answers?",
    examples: [
      'Strict, professional, code-heavy. Use markdown for all code. No small talk. "Line 42: Missing alt tag."',
      'Warm, patient, non-technical. Use emojis sparingly. "I can help with that! Let\'s try resetting clear your cache first."',
      'Excited, collaborative, asking questions back. "Ooh! What if the butler was actually a ghost??"'
    ]
  },
  {
    id: 'tasks',
    question: 'What are this agent\'s current active tasks?',
    type: 'textarea',
    placeholder: 'Capabilities and scope of work...',
    required: true,
    minLength: 20,
    description: "The specific functional capabilities. What tools does it use? What specific requests can it handle?",
    examples: [
      'Reviewing PR #402. checking for WCAG compliance. analyzing bundle size impact.',
      'Handling ticket queue for "Login Issues". verifying user email addresses against the database.',
      'Brainstorming for Chapter 5. Developing a backstory for the villain.'
    ]
  },
  {
    id: 'context',
    question: 'What system context affects this agent?',
    type: 'textarea',
    placeholder: 'Integration points, dependencies, environment (optional)...',
    required: false,
    description: "External factors. What APIs does it access? What is the date/time? What previous messages should it remember?",
    examples: [
      'Context: React 18 codebase, TypeScript strict mode, Tailwind CSS. We use Jest for testing.',
      'Context: User is on mobile web (iOS). System status shows "All Systems Operational".',
      'Context: High fantasy setting (dnd 5e rules). Magic costs health.'
    ]
  },
];

export type AgentQuestionAnswers = {
  [key: string]: string;
};
