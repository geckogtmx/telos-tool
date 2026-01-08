import { Question } from '@/types';

export const agentQuestions: Question[] = [
  {
    id: 'function',
    question: 'What is this agent\'s primary function?',
    type: 'textarea',
    placeholder: 'Core purpose in one sentence...', 
    required: true,
    minLength: 10,
  },
  {
    id: 'problems',
    question: 'What problems does this agent solve?',
    type: 'textarea',
    placeholder: 'Issues it addresses for its principal or users...', 
    required: true,
    minLength: 20,
  },
  {
    id: 'parameters',
    question: 'What are this agent\'s operating parameters?',
    type: 'textarea',
    placeholder: 'Values, priorities, how it makes decisions...', 
    required: true,
    minLength: 20,
  },
  {
    id: 'constraints',
    question: 'What should this agent never do?',
    type: 'textarea',
    placeholder: 'Hard constraints, prohibitions, boundaries...', 
    required: true,
    minLength: 10,
  },
  {
    id: 'communication',
    question: 'How should this agent communicate?',
    type: 'textarea',
    placeholder: 'Tone, style, interaction patterns...', 
    required: true,
    minLength: 10,
  },
  {
    id: 'tasks',
    question: 'What are this agent\'s current active tasks?',
    type: 'textarea',
    placeholder: 'Capabilities and scope of work...', 
    required: true,
    minLength: 20,
  },
  {
    id: 'context',
    question: 'What system context affects this agent?',
    type: 'textarea',
    placeholder: 'Integration points, dependencies, environment (optional)...',
    required: false,
  },
];

export type AgentQuestionAnswers = {
  [key: string]: string;
};
