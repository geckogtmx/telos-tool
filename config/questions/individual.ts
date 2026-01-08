import { Question } from '@/types';

export const individualQuestions: Question[] = [
  {
    id: 'problems',
    question: 'What problems are you trying to solve?',
    type: 'textarea',
    placeholder: 'Describe the challenges, issues, or problems you focus on addressing in your work...',
    required: true,
    minLength: 10,
    helperText: 'Think about the core challenges that drive your work and career choices.'
  },
  {
    id: 'mission',
    question: "What's your mission in one sentence?",
    type: 'text',
    placeholder: 'My mission is to...',
    required: true,
    minLength: 5,
    helperText: 'A clear, concise statement of your professional purpose.'
  },
  {
    id: 'values',
    question: 'What are your top 3-5 values?',
    type: 'textarea',
    placeholder: 'List and briefly describe the core values that guide your decisions...',
    required: true,
    minLength: 10,
    helperText: 'The principles and beliefs that are most important to you in your work.'
  },
  {
    id: 'constraints',
    question: 'What do you actively avoid or constrain?',
    type: 'textarea',
    placeholder: 'Describe things you deliberately avoid, limit, or set boundaries around...',
    required: true,
    minLength: 10,
    helperText: 'Understanding what you say "no" to is as important as what you say "yes" to.'
  },
  {
    id: 'workStyle',
    question: 'Describe your ideal work style and rhythm',
    type: 'textarea',
    placeholder: 'How do you prefer to work? What environment, schedule, and collaboration style suits you best?',
    required: true,
    minLength: 10,
    helperText: 'Think about when and how you do your best work.'
  },
  {
    id: 'projects',
    question: 'What are your current active projects?',
    type: 'textarea',
    placeholder: 'List and briefly describe the projects you are actively working on...',
    required: true,
    minLength: 10,
    helperText: 'Current initiatives, goals, or work streams you are focused on.'
  },
  {
    id: 'lifeContext',
    question: 'Any life context that affects your work?',
    type: 'textarea',
    placeholder: 'Optional: Family, location, health, or other personal factors that influence your professional life...',
    required: false,
    minLength: 10,
    helperText: 'This is optional. Share only what you are comfortable with and find relevant.'
  }
];

export type QuestionAnswers = {
  [key: string]: string;
};
