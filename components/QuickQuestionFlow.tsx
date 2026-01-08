'use client';

import { useState } from 'react';
import { Question } from '@/types';
import { QuestionAnswers } from '@/config/questions/individual';

type QuickQuestionFlowProps = {
  questions: Question[];
  onComplete: (answers: QuestionAnswers) => void;
  initialAnswers?: QuestionAnswers;
};

type ValidationErrors = {
  [key: string]: string;
};

export default function QuickQuestionFlow({
  questions,
  onComplete,
  initialAnswers = {},
}: QuickQuestionFlowProps) {
  const [answers, setAnswers] = useState<QuestionAnswers>(initialAnswers);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = () => {
    const newErrors: ValidationErrors = {};
    questions.forEach((q) => {
      const answer = answers[q.id] || '';
      if (q.required && !answer.trim()) {
        newErrors[q.id] = 'This field is required';
      } else if (q.minLength && answer.trim().length < q.minLength) {
        newErrors[q.id] = `Please enter at least ${q.minLength} characters`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete(answers);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="space-y-3">
            <label htmlFor={q.id} className="block text-lg font-medium text-gray-100">
              {q.question}
              {q.required && <span className="text-blue-400 ml-1">*</span>}
            </label>
            {q.helperText && (
              <p className="text-sm text-gray-400 mb-2">{q.helperText}</p>
            )}
            
            {q.type === 'text' ? (
              <input
                id={q.id}
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
                  bg-gray-800 text-gray-100 placeholder-gray-500 caret-blue-400
                  ${errors[q.id] ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}
                `}
              />
            ) : (
              <textarea
                id={q.id}
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={4}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none
                  bg-gray-800 text-gray-100 placeholder-gray-500 caret-blue-400
                  ${errors[q.id] ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'}
                `}
              />
            )}
            
            {errors[q.id] && (
              <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors[q.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-800">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-500 transition-colors font-bold text-lg"
        >
          Generate Quick TELOS
        </button>
      </div>
    </form>
  );
}
