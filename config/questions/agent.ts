import { Question } from '@/types';

export const agentQuestions: Question[] = [
  {
    id: 'identity',
    question: 'If this agent had a job title and a personality, what would they be?',
    type: 'textarea',
    placeholder: 'e.g., "A strict Senior React dev who loves clean code" or "A chaotic neutral creative writing partner"...',
    required: true,
    minLength: 10,
    description: "Start by defining the persona. Is it authoritative or collaborative? Formal or casual? What 'vibe' should the user get immediately?",
    examples: [
      'The "Clean Code" Enforcer. Strict, professional, and intolerant of sloppy formatting.',
      'The Empathetic Troubleshooter. Patient, apologetic, and speaks in simple terms to non-technical users.',
      'The Dungeon Master. Descriptive, mysterious, and always ends responses with a hook or question.'
    ]
  },
  {
    id: 'goal',
    question: 'What is the one thing this agent must achieve to be successful?',
    type: 'textarea',
    placeholder: 'The primary metric of success...',
    required: true,
    minLength: 20,
    description: "Cut through the noise. What is the singular goal? Solving the ticket? Finding the bug? Entertaining the user?",
    examples: [
      'It must catch at least 90% of accessibility errors before they reach QA.',
      'The user must feel understood and leave the conversation with a resolved login issue.',
      'The user should feel inspired to write the next chapter.'
    ]
  },
  {
    id: 'workflow',
    question: 'Walk me through a typical interaction. How does it think?',
    type: 'textarea',
    placeholder: 'Step-by-step reasoning process...',
    required: true,
    minLength: 20,
    description: "Describe the 'Chain of Thought'. When a user asks X, does the agent immediately answer, or does it ask clarifying questions first?",
    examples: [
      '1. Verify the user\'s tech stack. 2. analyze the code snippet. 3. Cite the documentation. 4. Provide the fix.',
      'First, acknowledge the frustration. Second, check the system status. Third, offer the reset link.',
      'It should never give the answer directly. It should offer three distinct options (Safe, Risky, Chaotic) and let the user choose.'
    ]
  },
  {
    id: 'constraints',
    question: 'What are the hard "No-Go" zones?',
    type: 'textarea',
    placeholder: 'Absolute prohibitions and safety rails...',
    required: true,
    minLength: 10,
    description: "What will get this agent 'fired'? Hallucinating features? being rude? giving medical advice?",
    examples: [
      'Never invent API endpoints that don\'t exist. If unsure, say "I don\'t know".',
      'Never ask for passwords. Never blame the user.',
      'Never write the story for me. Only outline it.'
    ]
  },
  {
    id: 'tone',
    question: 'Describe the voice/tone with 3 adjectives.',
    type: 'textarea',
    placeholder: 'e.g., Concise, Technical, Dry...',
    required: true,
    minLength: 5,
    description: "Quick style check. How should the text feel?",
    examples: [
      'Brutal, Efficient, Accurate.',
      'Warm, Bubbly, Helpful.',
      'Dark, Gritty, immersive.'
    ]
  },
  {
    id: 'tools',
    question: 'What tools or knowledge does it need access to?',
    type: 'textarea',
    placeholder: 'APIs, documentation, specific files...',
    required: false,
    description: "Does it need to browse the web? Access a database? Read a specific PDF?",
    examples: [
      'Needs access to the WCAG 2.1 guidelines.',
      'Needs the user database (read-only) and the password reset API.',
      'Needs context on D&D 5e rules and the campaign setting notes.'
    ]
  }
];

export type AgentQuestionAnswers = {
  [key: string]: string;
};
