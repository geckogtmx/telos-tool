import { Question } from '@/types';

export const organizationQuestions: Question[] = [
  {
    id: 'problems',
    question: 'What problems does your organization solve?',
    type: 'textarea',
    placeholder: 'The core issues you address in the market or society...', 
    required: true,
    minLength: 20,
  },
  {
    id: 'mission',
    question: "What's your organization's mission?",
    type: 'textarea',
    placeholder: 'Clear statement of organizational purpose...',
    required: true,
    minLength: 10,
  },
  {
    id: 'values',
    question: 'What are your core organizational values?',
    type: 'textarea',
    placeholder: 'The principles that guide decisions and culture...',
    required: true,
    minLength: 20,
  },
  {
    id: 'constraints',
    question: 'What does your organization explicitly avoid?',
    type: 'textarea',
    placeholder: 'Boundaries, anti-goals, things you won\'t do...',
    required: true,
    minLength: 10,
  },
  {
    id: 'operations',
    question: 'How does your organization operate and make decisions?',
    type: 'textarea',
    placeholder: 'Structure, processes, decision-making approach...',
    required: true,
    minLength: 20,
  },
  {
    id: 'initiatives',
    question: 'What are your current initiatives or programs?',
    type: 'textarea',
    placeholder: 'Active projects, their status, and priorities...',
    required: true,
    minLength: 20,
  },
  {
    id: 'stakeholders',
    question: 'Who are your key stakeholders?',
    type: 'textarea',
    placeholder: 'Internal and external parties that matter (optional)...',
    required: false,
  },
];

export type OrganizationQuestionAnswers = {
  [key: string]: string;
};
