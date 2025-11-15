"use client";

import { useState, useEffect } from "react";

interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Quiz {
  question: string;
  answers: QuizAnswer[];
  correctMessage?: string;
}

interface QuizDisplayProps {
  quiz: Quiz;
  onAnswered?: (isCorrect: boolean) => void;
}

export default function QuizDisplay({ quiz, onAnswered }: QuizDisplayProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  // Reset quiz when component mounts or quiz changes
  useEffect(() => {
    setSelectedAnswerId(null);
    setAnswered(false);
  }, [quiz]);

  const handleSelectAnswer = (answerId: string) => {
    if (!answered) {
      setSelectedAnswerId(answerId);
      setAnswered(true);
      
      // Find if answer is correct
      const selectedAnswer = quiz.answers.find((a) => a.id === answerId);
      onAnswered?.(selectedAnswer?.isCorrect || false);
    }
  };

  const selectedAnswer = quiz.answers.find((a) => a.id === selectedAnswerId);
  const isCorrect = selectedAnswer?.isCorrect;

  return (
    <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      {/* Question */}
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
        {quiz.question}
      </h3>

      {/* Answers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {quiz.answers.map((answer) => {
          const isSelected = selectedAnswerId === answer.id;
          let buttonClass = "bg-white/15 hover:bg-white/25 text-white border border-white/20";

          if (answered && isSelected) {
            if (isCorrect) {
              buttonClass =
                "bg-green-500/80 text-white animate-pulse-green shadow-lg shadow-green-500/60 border border-green-400/50";
            } else {
              buttonClass =
                "bg-red-500/80 text-white animate-pulse-red shadow-lg shadow-red-500/60 border border-red-400/50";
            }
          }

          return (
            <button
              key={answer.id}
              onClick={() => handleSelectAnswer(answer.id)}
              disabled={answered}
              className={`px-6 py-4 rounded-xl font-semibold transition-all active:scale-95 backdrop-blur-sm ${buttonClass} ${
                answered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {answer.text}
            </button>
          );
        })}
      </div>

      {/* Feedback - Only show for correct answers */}
      {answered && isCorrect && (
        <div className="text-center mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <p className="text-green-300 font-bold text-lg drop-shadow-lg">
            {quiz.correctMessage || "✓ Correct!"}
          </p>
        </div>
      )}
    </div>
  );
}
