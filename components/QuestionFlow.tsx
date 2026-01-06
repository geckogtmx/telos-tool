'use client';

import { useState } from 'react';
import type { Question, QuestionAnswers } from '@/config/questions/individual';

type QuestionFlowProps = {
  questions: Question[];
  onComplete: (answers: QuestionAnswers) => void;
  initialAnswers?: QuestionAnswers;
};

type ValidationErrors = {
  [key: string]: string;
};

export default function QuestionFlow({ questions, onComplete, initialAnswers = {} }: QuestionFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswers>(initialAnswers);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const validateAnswer = (question: Question, value: string): string | null => {
    // Required field validation
    if (question.required && !value.trim()) {
      return 'This field is required';
    }

    // Minimum length validation
    if (value.trim() && value.trim().length < question.minLength) {
      return `Please enter at least ${question.minLength} characters`;
    }

    return null;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    // Clear error when user starts typing
    if (errors[currentQuestion.id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[currentQuestion.id];
        return newErrors;
      });
    }
  };

  const handleBlur = () => {
    setTouched(prev => new Set(prev).add(currentQuestion.id));

    const answer = answers[currentQuestion.id] || '';
    const error = validateAnswer(currentQuestion, answer);

    if (error) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: error
      }));
    }
  };

  const handleNext = () => {
    const answer = answers[currentQuestion.id] || '';
    const error = validateAnswer(currentQuestion, answer);

    if (error) {
      setErrors(prev => ({
        ...prev,
        [currentQuestion.id]: error
      }));
      setTouched(prev => new Set(prev).add(currentQuestion.id));
      return;
    }

    if (isLastQuestion) {
      // Validate all required questions before completing
      const allErrors: ValidationErrors = {};
      questions.forEach(q => {
        const ans = answers[q.id] || '';
        const err = validateAnswer(q, ans);
        if (err) {
          allErrors[q.id] = err;
        }
      });

      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        // Find first question with error and navigate to it
        const firstErrorIndex = questions.findIndex(q => allErrors[q.id]);
        if (firstErrorIndex !== -1) {
          setCurrentQuestionIndex(firstErrorIndex);
        }
        return;
      }

      onComplete(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (!currentQuestion.required) {
      if (isLastQuestion) {
        onComplete(answers);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const currentAnswer = answers[currentQuestion.id] || '';
  const hasError = touched.has(currentQuestion.id) && errors[currentQuestion.id];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-gray-500">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex gap-2 flex-wrap">
        {questions.map((q, index) => {
          const isAnswered = answers[q.id] && answers[q.id].trim().length > 0;
          const hasQuestionError = errors[q.id];
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => handleQuestionJump(index)}
              className={`
                w-10 h-10 rounded-full text-sm font-medium transition-colors
                ${isCurrent
                  ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                  : hasQuestionError
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : isAnswered
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              title={q.question}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentQuestion.question}
            </h3>
            {!currentQuestion.required && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Optional
              </span>
            )}
          </div>
          {currentQuestion.helperText && (
            <p className="text-sm text-gray-600">
              {currentQuestion.helperText}
            </p>
          )}
        </div>

        {currentQuestion.type === 'text' ? (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={currentQuestion.placeholder}
            className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors
              ${hasError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
            `}
          />
        ) : (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={currentQuestion.placeholder}
            rows={6}
            className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none
              ${hasError
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
            `}
          />
        )}

        {hasError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors[currentQuestion.id]}</span>
          </div>
        )}

        {currentAnswer && (
          <div className="text-xs text-gray-500">
            {currentAnswer.trim().length} characters
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors
            ${isFirstQuestion
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          {!currentQuestion.required && (
            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isLastQuestion ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
