import { Question } from '@/types';

export interface FullQuestion extends Question {
  section: string;
  sectionTitle: string;
  sectionDescription?: string;
}

export const individualFullQuestions: FullQuestion[] = [
  // Section 1: Identity & Background
  {
    id: 'q1',
    section: 'identity',
    sectionTitle: 'I. Identity & Background',
    sectionDescription: 'Who you are, your history, and your expertise.',
    question: 'Who are you in one paragraph?',
    type: 'textarea',
    placeholder: 'Your role, what you do, and the context you operate in...',
    required: true,
    minLength: 50,
  },
  {
    id: 'q1a',
    section: 'identity',
    sectionTitle: 'I. Identity & Background',
    question: "What's your professional background?",
    type: 'textarea',
    placeholder: 'Brief summary of your career path and key transitions...',
    required: true,
  },
  {
    id: 'q1b',
    section: 'identity',
    sectionTitle: 'I. Identity & Background',
    question: 'What domains are you an expert in?',
    type: 'textarea',
    placeholder: 'Areas where you have deep knowledge and experience...',
    required: true,
  },
  {
    id: 'q1c',
    section: 'identity',
    sectionTitle: 'I. Identity & Background',
    question: 'What domains are you actively learning?',
    type: 'textarea',
    placeholder: 'Skills or topics you are currently upskilling in...',
    required: false,
  },

  // Section 2: Problems & Mission
  {
    id: 'q2',
    section: 'mission',
    sectionTitle: 'II. Problems & Mission',
    sectionDescription: 'What you are solving and why.',
    question: 'What are you trying to accomplish?',
    type: 'textarea',
    placeholder: "The problems you're solving or outcomes you're working toward...",
    required: true,
  },
  {
    id: 'q2a',
    section: 'mission',
    sectionTitle: 'II. Problems & Mission',
    question: 'What problems are you actively trying to solve?',
    type: 'textarea',
    placeholder: 'Specific challenges you are addressing right now...',
    required: true,
  },
  {
    id: 'q2b',
    section: 'mission',
    sectionTitle: 'II. Problems & Mission',
    question: "What's your mission or purpose statement?",
    type: 'textarea',
    placeholder: 'A clear, concise statement of your professional purpose...',
    required: true,
  },
  {
    id: 'q2c',
    section: 'mission',
    sectionTitle: 'II. Problems & Mission',
    question: 'What are your current goals with rough timelines?',
    type: 'textarea',
    placeholder: 'Short-term and long-term objectives...',
    required: false,
  },

  // Section 3: Values & Constraints
  {
    id: 'q3',
    section: 'values',
    sectionTitle: 'III. Values & Constraints',
    sectionDescription: 'Your operating principles and boundaries.',
    question: 'What do you value and what do you avoid?',
    type: 'textarea',
    placeholder: "Core principles you operate by...",
    required: true,
  },
  {
    id: 'q3a',
    section: 'values',
    sectionTitle: 'III. Values & Constraints',
    question: 'What are your anti-goals?',
    type: 'textarea',
    placeholder: 'Outcomes you specifically want to prevent...',
    required: false,
  },
  {
    id: 'q3b',
    section: 'values',
    sectionTitle: 'III. Values & Constraints',
    question: 'What are your hard constraints?',
    type: 'textarea',
    placeholder: 'Non-negotiable boundaries (time, location, ethics)...',
    required: true,
  },

  // Section 4: Work Style & Preferences
  {
    id: 'q4',
    section: 'style',
    sectionTitle: 'IV. Work Style & Preferences',
    sectionDescription: 'How you operate best.',
    question: 'How do you prefer to work and receive information?',
    type: 'textarea',
    placeholder: 'Your style: detailed vs. concise, structured vs. exploratory...',
    required: true,
  },
  {
    id: 'q4a',
    section: 'style',
    sectionTitle: 'IV. Work Style & Preferences',
    question: "What's your typical session type?",
    type: 'text',
    placeholder: 'e.g., Deep work sprints, collaborative brainstorming...',
    required: false,
  },
  {
    id: 'q4b',
    section: 'style',
    sectionTitle: 'IV. Work Style & Preferences',
    question: "When you're stuck, what do you want?",
    type: 'textarea',
    placeholder: 'Do you want suggestions, space, or a rubber duck?',
    required: true,
  },
  {
    id: 'q4c',
    section: 'style',
    sectionTitle: 'IV. Work Style & Preferences',
    question: 'How much pushback do you want?',
    type: 'text',
    placeholder: 'None, gentle challenges, or ruthless critique?',
    required: true,
  },
  {
    id: 'q4d',
    section: 'style',
    sectionTitle: 'IV. Work Style & Preferences',
    question: "What's your feedback style preference?",
    type: 'textarea',
    placeholder: 'Direct/blunt, sandwich method, async only?',
    required: true,
  },

  // Section 5: Technical Context
  {
    id: 'q5a',
    section: 'technical',
    sectionTitle: 'V. Technical Context',
    sectionDescription: 'Your tools and environment.',
    question: "What's your technical setup?",
    type: 'textarea',
    placeholder: 'OS, key hardware, monitor setup...',
    required: false,
  },
  {
    id: 'q5b',
    section: 'technical',
    sectionTitle: 'V. Technical Context',
    question: "What's your technical skill level?",
    type: 'text',
    placeholder: 'Beginner, Intermediate, Expert (by domain)...',
    required: false,
  },
  {
    id: 'q5c',
    section: 'technical',
    sectionTitle: 'V. Technical Context',
    question: 'What programming languages/tools do you use?',
    type: 'textarea',
    placeholder: 'List languages, frameworks, and tools you rely on...',
    required: false,
  },

  // Section 6: Active Projects
  {
    id: 'q6a',
    section: 'projects',
    sectionTitle: 'VI. Active Projects & Challenges',
    sectionDescription: 'What is on your plate right now.',
    question: 'What are your active projects and their status?',
    type: 'textarea',
    placeholder: 'List current projects and where they stand...',
    required: true,
  },
  {
    id: 'q6b',
    section: 'projects',
    sectionTitle: 'VI. Active Projects & Challenges',
    question: 'What recurring challenges do you face?',
    type: 'textarea',
    placeholder: 'Persistent blockers or issues...',
    required: false,
  },

  // Section 7: Context Layer
  {
    id: 'q7a',
    section: 'context',
    sectionTitle: 'VII. Life Context Layer',
    sectionDescription: 'Broader factors influencing your work.',
    question: 'What life context affects how you work?',
    type: 'textarea',
    placeholder: 'Family, health, location, or other factors...',
    required: false,
  },
  {
    id: 'q7b',
    section: 'context',
    sectionTitle: 'VII. Life Context Layer',
    question: 'Anything else an AI collaborator should know?',
    type: 'textarea',
    placeholder: 'Quirks, preferences, or other details...',
    required: false,
  },
];

export type FullQuestionAnswers = {
  [key: string]: string;
};
