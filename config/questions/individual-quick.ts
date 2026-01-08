import { Question } from '@/types';

export const individualQuickQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Who are you in one paragraph?',
    type: 'textarea',
    placeholder: 'Your role, what you do, and the context you operate in...',
    required: true,
  },
  {
    id: 'q2',
    question: 'What are you trying to accomplish?',
    type: 'textarea',
    placeholder: "The problems you're solving or outcomes you're working toward...",
    required: true,
  },
  {
    id: 'q3',
    question: 'What do you value and what do you avoid?',
    type: 'textarea',
    placeholder: "Core principles you operate by, and things you explicitly don't want...",
    required: true,
  },
  {
    id: 'q4',
    question: 'How do you prefer to work and receive information?',
    type: 'textarea',
    placeholder: 'Your style: detailed vs. concise, structured vs. exploratory...',
    required: true,
  },
  {
    id: 'q5',
    question: 'What are you currently working on?',
    type: 'textarea',
    placeholder: 'Active projects, their status, and any blockers...',
    required: true,
  },
];

export type QuickQuestionAnswers = {
  [key: string]: string;
};
