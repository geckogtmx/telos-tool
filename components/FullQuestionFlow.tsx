'use client';

import { useState, useMemo, useEffect } from 'react';
import { FullQuestion, FullQuestionAnswers } from '@/config/questions/individual-full';

type FullQuestionFlowProps = {
  questions: FullQuestion[];
  onComplete: (answers: FullQuestionAnswers) => void;
  initialAnswers?: FullQuestionAnswers;
};

type ValidationErrors = {
  [key: string]: string;
};

export default function FullQuestionFlow({
  questions,
  onComplete,
  initialAnswers = {},
}: FullQuestionFlowProps) {
  // Group questions by section
  const sections = useMemo(() => {
    const uniqueSections: string[] = [];
    const sectionMap: Record<string, FullQuestion[]> = {};

    questions.forEach((q) => {
      if (!sectionMap[q.section]) {
        sectionMap[q.section] = [];
        uniqueSections.push(q.section);
      }
      sectionMap[q.section].push(q);
    });

    return uniqueSections.map((sectionId) => ({
      id: sectionId,
      title: sectionMap[sectionId][0].sectionTitle,
      description: sectionMap[sectionId][0].sectionDescription,
      questions: sectionMap[sectionId],
    }));
  }, [questions]);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<FullQuestionAnswers>(initialAnswers);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isReviewing, setIsReviewing] = useState(false);

  // Initialize answers from props whenever they change (e.g. from upgrade)
  useEffect(() => {
    if (Object.keys(initialAnswers).length > 0) {
      setAnswers(prev => ({ ...prev, ...initialAnswers }));
    }
  }, [initialAnswers]);

  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;

  const validateSection = (sectionIndex: number) => {
    const sectionQuestions = sections[sectionIndex].questions;
    const newErrors: ValidationErrors = {};
    let isValid = true;

    sectionQuestions.forEach((q) => {
      const answer = answers[q.id] || '';
      if (q.required && !answer.trim()) {
        newErrors[q.id] = 'This field is required';
        isValid = false;
      } else if (q.minLength && answer.trim().length < q.minLength) {
        newErrors[q.id] = `Please enter at least ${q.minLength} characters`;
        isValid = false;
      }
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNext = () => {
    if (validateSection(currentSectionIndex)) {
      if (isLastSection) {
        setIsReviewing(true);
      } else {
        setCurrentSectionIndex((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (isReviewing) {
      setIsReviewing(false);
    } else {
      setCurrentSectionIndex((prev) => prev - 1);
    }
    window.scrollTo(0, 0);
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

  const handleFinish = () => {
    onComplete(answers);
  };

  if (isReviewing) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Review Your Answers</h2>
        
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={section.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-400">{section.title}</h3>
                <button 
                  onClick={() => {
                    setCurrentSectionIndex(idx);
                    setIsReviewing(false);
                    window.scrollTo(0, 0);
                  }}
                  className="text-sm text-gray-400 hover:text-white underline"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                {section.questions.map(q => (
                  <div key={q.id}>
                    <p className="text-sm font-medium text-gray-300 mb-1">{q.question}</p>
                    <p className="text-gray-100 whitespace-pre-wrap text-sm pl-4 border-l-2 border-gray-600">
                      {answers[q.id] || <span className="text-gray-500 italic">Not provided</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-700">
          <button
            onClick={handleBack}
            className="px-6 py-3 rounded-lg font-medium bg-gray-800 text-gray-200 hover:bg-gray-700"
          >
            Back to Edit
          </button>
          <button
            onClick={handleFinish}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 font-bold shadow-lg"
          >
            Generate Full TELOS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="hidden md:flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-0 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${(currentSectionIndex / (sections.length - 1)) * 100}%` }}
        ></div>
        
        {sections.map((section, idx) => {
          const isCompleted = idx < currentSectionIndex;
          const isCurrent = idx === currentSectionIndex;
          const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
          
          return (
            <div key={section.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border-2 
                  ${isCompleted || isCurrent ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'}
                `}
              >
                {isCompleted ? '✓' : romanNumerals[idx]}
              </div>
              <span className={`text-xs mt-2 font-medium hidden lg:block ${isCurrent ? 'text-blue-400' : 'text-gray-500'}`}>
                {section.title.split('.')[1].trim().split('&')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Section {currentSectionIndex + 1} of {sections.length}</span>
          <span>{Math.round(((currentSectionIndex + 1) / sections.length) * 100)}%</span>
        </div>
        <div className="text-xs text-blue-400 font-medium">{currentSection.title}</div>
      </div>

      {/* Current Section */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-100">{currentSection.title}</h2>
          {currentSection.description && (
            <p className="text-gray-400 mt-1">{currentSection.description}</p>
          )}
        </div>

        <div className="space-y-8">
          {currentSection.questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <label htmlFor={q.id} className="block text-lg font-medium text-gray-200">
                {q.question}
                {q.required && <span className="text-blue-400 ml-1">*</span>}
              </label>
              
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
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={handleBack}
          disabled={currentSectionIndex === 0}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors
            ${currentSectionIndex === 0
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }
          `}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          {isLastSection ? 'Review Answers' : 'Next Section'}
        </button>
      </div>
    </div>
  );
}
