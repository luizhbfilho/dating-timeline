"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";

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

interface QuizEditorProps {
  quiz?: Quiz;
  onUpdateQuiz: (quiz: Quiz | undefined) => void;
}

export default function QuizEditor({ quiz, onUpdateQuiz }: QuizEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState(quiz?.question || "");
  const [correctMessage, setCorrectMessage] = useState(quiz?.correctMessage || "✓ Correct!");
  const [answers, setAnswers] = useState<QuizAnswer[]>(
    quiz?.answers || [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false },
      { id: "4", text: "", isCorrect: false },
    ]
  );

  const handleSaveQuiz = () => {
    // Validate quiz
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const filledAnswers = answers.filter((a) => a.text.trim());
    if (filledAnswers.length < 2) {
      alert("Please add at least 2 answers");
      return;
    }

    if (!filledAnswers.some((a) => a.isCorrect)) {
      alert("Please mark one answer as correct");
      return;
    }

    onUpdateQuiz({
      question,
      answers: filledAnswers,
      correctMessage: correctMessage || "✓ Correct!",
    });

    setIsOpen(false);
  };

  const handleRemoveQuiz = () => {
    if (confirm("Remove quiz from this slide?")) {
      onUpdateQuiz(undefined);
    }
  };

  const handleAddAnswer = () => {
    if (answers.length < 4) {
      setAnswers([
        ...answers,
        { id: Date.now().toString(), text: "", isCorrect: false },
      ]);
    }
  };

  const handleRemoveAnswer = (id: string) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((a) => a.id !== id));
    }
  };

  const handleUpdateAnswer = (id: string, text: string) => {
    setAnswers(answers.map((a) => (a.id === id ? { ...a, text } : a)));
  };

  const handleSetCorrect = (id: string) => {
    setAnswers(
      answers.map((a) => ({
        ...a,
        isCorrect: a.id === id,
      }))
    );
  };

  if (!isOpen) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-200">Quiz</p>
            <p className="text-xs text-gray-400">
              {quiz ? "✓ Quiz added" : "No quiz"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all active:scale-95 text-sm"
            >
              {quiz ? "Edit Quiz" : "Add Quiz"}
            </button>
            {quiz && (
              <button
                onClick={handleRemoveQuiz}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-700 bg-gray-700 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-100 mb-4">Quiz Editor</h3>

      {/* Question */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          Question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your quiz question..."
          className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          maxLength={200}
        />
        <p className="text-xs text-gray-400 mt-1">
          {question.length}/200 characters
        </p>
      </div>

      {/* Correct Message */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          Correct Answer Message
        </label>
        <input
          type="text"
          value={correctMessage}
          onChange={(e) => setCorrectMessage(e.target.value)}
          placeholder="e.g., ✓ Correct! or Great job!"
          className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          maxLength={100}
        />
        <p className="text-xs text-gray-400 mt-1">
          {correctMessage.length}/100 characters
        </p>
      </div>

      {/* Answers */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          Answers (max 4)
        </label>
        <div className="space-y-2">
          {answers.map((answer, index) => (
            <div key={answer.id} className="flex gap-2 items-center">
              <button
                onClick={() => handleSetCorrect(answer.id)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  answer.isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                }`}
                title="Mark as correct answer"
              >
                <Check className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleUpdateAnswer(answer.id, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder-gray-500"
                maxLength={100}
              />
              {answers.length > 2 && (
                <button
                  onClick={() => handleRemoveAnswer(answer.id)}
                  className="flex-shrink-0 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {answers.length < 4 && (
          <button
            onClick={handleAddAnswer}
            className="mt-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Answer
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSaveQuiz}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Save Quiz
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
