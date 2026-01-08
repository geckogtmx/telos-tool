import { Question } from '@/types';

export const individualCombinedQuestions: Question[] = [
  // --- PART 1: QUICK QUESTIONS (5) ---
  {
    id: 'q1',
    question: 'Who are you in one paragraph?',
    type: 'textarea',
    placeholder: 'Your role, what you do, and the context you operate in...',
    required: true,
    minLength: 50,
    helperText: 'Quick Start Q1: This sets the foundation for your identity.'
  },
  {
    id: 'q2',
    question: 'What are you trying to accomplish?',
    type: 'textarea',
    placeholder: "The problems you're solving or outcomes you're working toward...",
    required: true,
    minLength: 20,
  },
  {
    id: 'q3',
    question: 'What do you value and what do you avoid?',
    type: 'textarea',
    placeholder: "Core principles you operate by, and things you explicitly don't want...",
    required: true,
    minLength: 20,
  },
  {
    id: 'q4',
    question: 'How do you prefer to work and receive information?',
    type: 'textarea',
    placeholder: 'Your style: detailed vs. concise, structured vs. exploratory...',
    required: true,
    minLength: 20,
  },
  {
    id: 'q5',
    question: 'What are you currently working on?',
    type: 'textarea',
    placeholder: 'Active projects, their status, and any blockers...',
    required: true,
    minLength: 20,
  },

  // --- PART 2: FULL EXPANSION QUESTIONS (19) ---
  
  // Section 1 Expansion
  {
    id: 'q1a',
    question: "What's your professional background?",
    type: 'textarea',
    placeholder: 'Brief summary of your career path and key transitions...',
    required: true,
    minLength: 20,
  },
  {
    id: 'q1b',
    question: 'What domains are you an expert in?',
    type: 'textarea',
    placeholder: 'Areas where you have deep knowledge and experience...',
    required: true,
    minLength: 10,
  },
  {
    id: 'q1c',
    question: 'What domains are you actively learning?',
    type: 'textarea',
    placeholder: 'Skills or topics you are currently upskilling in...',
    required: false,
  },

  // Section 2 Expansion
  {
    id: 'q2a',
    question: 'What problems are you actively trying to solve?',
    type: 'textarea',
    placeholder: 'Specific challenges you are addressing right now...',
    required: true,
    minLength: 20,
  },
  {
    id: 'q2b',
    question: "What's your mission or purpose statement?",
    type: 'textarea',
    placeholder: 'A clear, concise statement of your professional purpose...',
    required: true,
    minLength: 10,
  },
  {
    id: 'q2c',
    question: 'What are your current goals with rough timelines?',
    type: 'textarea',
    placeholder: 'Short-term and long-term objectives...',
    required: false,
  },

  // Section 3 Expansion
  {
    id: 'q3a',
    question: 'What are your anti-goals?',
    type: 'textarea',
    placeholder: 'Outcomes you specifically want to prevent...',
    required: false,
  },
  {
    id: 'q3b',
    question: 'What are your hard constraints?',
    type: 'textarea',
    placeholder: 'Non-negotiable boundaries (time, location, ethics)...',
    required: true,
    minLength: 10,
  },

  // Section 4 Expansion
  {
    id: 'q4a',
    question: "What's your typical session type?",
    type: 'text',
    placeholder: 'e.g., Deep work sprints, collaborative brainstorming...',
    required: false,
  },
  {
    id: 'q4b',
    question: "When you're stuck, what do you want?",
    type: 'textarea',
    placeholder: 'Do you want suggestions, space, or a rubber duck?',
    required: true,
    minLength: 10,
  },
  {
    id: 'q4c',
    question: 'How much pushback do you want?',
    type: 'text',
    placeholder: 'None, gentle challenges, or ruthless critique?',
    required: true,
  },
  {
    id: 'q4d',
    question: "What's your feedback style preference?",
    type: 'textarea',
    placeholder: 'Direct/blunt, sandwich method, async only?',
    required: true,
    minLength: 10,
  },

  // Section 5 (New)
  {
    id: 'q5a',
    question: "What's your technical setup?",
    type: 'textarea',
    placeholder: 'OS, key hardware, monitor setup...',
    required: false,
  },
  {
    id: 'q5b',
    question: "What's your technical skill level?",
    type: 'text',
    placeholder: 'Beginner, Intermediate, Expert (by domain)...',
    required: false,
  },
  {
    id: 'q5c',
    question: 'What programming languages/tools do you use?',
    type: 'textarea',
    placeholder: 'List languages, frameworks, and tools you rely on...',
    required: false,
  },

  // Section 6 (Expanded)
  {
    id: 'q6a',
    question: 'What are your active projects and their status?',
    type: 'textarea',
    placeholder: 'List current projects and where they stand...',
    required: true,
    minLength: 20,
  },
  {
    id: 'q6b',
    question: 'What recurring challenges do you face?',
    type: 'textarea',
    placeholder: 'Persistent blockers or issues...',
    required: false,
  },

  // Section 7 (New)
  {
    id: 'q7a',
    question: 'What life context affects how you work?',
    type: 'textarea',
    placeholder: 'Family, health, location, or other factors...',
    required: false,
  },
  {
    id: 'q7b',
    question: 'Anything else an AI collaborator should know?',
    type: 'textarea',
    placeholder: 'Quirks, preferences, or other details...',
    required: false,
  },
];

export type IndividualQuestionAnswers = Record<string, string>;
