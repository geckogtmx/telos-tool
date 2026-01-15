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

export const skillQuestions: Question[] = [
  {
    id: 'name',
    question: 'What do you want to call this skill?',
    type: 'text',
    placeholder: 'e.g., PostgresExplorer, HeadlessBrowser, LogAnalyzer...',
    required: true,
    minLength: 3,
    description: "A short, PascalCase name for the tool.",
    examples: [
      'PostgresExplorer',
      'HeadlessBrowser',
      'LogAnalyzer'
    ]
  },
  {
    id: 'functionality',
    question: 'What specific task should this skill perform?',
    type: 'textarea',
    placeholder: 'e.g., Query database schemas, scrape dynamic websites, grep logs...',
    required: true,
    minLength: 15,
    description: "Define the core capability. What super-power are you giving the agent?",
    examples: [
      'Execute read-only SQL queries against a PostgreSQL database to inspect schema and sample data.',
      'Navigate a headless Chrome browser to take screenshots and extract main content text.',
      'Search the local filesystem for files matching a regex pattern and return their content.'
    ]
  },
  {
    id: 'trigger',
    question: 'When should the agent decide to use this tool?',
    type: 'textarea',
    placeholder: 'e.g., When the user needs to debug data...',
    required: true,
    minLength: 15,
    description: "The 'Activation Phrase'. Under what conditions is this skill relevant?",
    examples: [
      'When the user asks to debug a database issue or check table structure.',
      'When the user provides a URL that needs visual verification or scraping.',
      'When the user needs to find a specific code snippet or config file.'
    ]
  },
  {
    id: 'inputs',
    question: 'What data does the skill need from the user?',
    type: 'textarea',
    placeholder: 'e.g., SQL Query, URL, Regex pattern...',
    required: true,
    minLength: 10,
    description: "What constraints or arguments must be passed to the function?",
    examples: [
      'SQL Query (string) and Database Connection ID (string).',
      'Target URL (string) and Viewport Size (object).',
      'Search Pattern (string) and Root Directory (string).'
    ]
  },
  {
    id: 'execution',
    question: 'Describe the logic: APIs, scripts, or calculations.',
    type: 'textarea',
    placeholder: 'Step-by-step logic...',
    required: true,
    minLength: 20,
    description: "How does it work under the hood? Does it run a python script? Call a REST API?",
    examples: [
      '1. Connect via `pg`. 2. Run query in read-only transaction. 3. Return rows as JSON.',
      '1. Launch Puppeteer. 2. `page.goto(url)`. 3. `page.screenshot()`. 4. Return base64 image.',
      '1. Use `ripgrep` for fast search. 2. Filter exclusions. 3. Read top 5 matches.'
    ]
  },
  {
    id: 'outputs',
    question: 'What does a successful output look like?',
    type: 'textarea',
    placeholder: 'e.g., Markdown table, JSON blob, File list...',
    required: true,
    minLength: 10,
    description: "What does the skill return to the conversation context?",
    examples: [
      'A Markdown table representing the query results, truncated to 10 rows.',
      'A structured JSON with `screenshot_b64` and `text_content` fields.',
      'A list of file paths with line numbers and context snippets.'
    ]
  }
];
