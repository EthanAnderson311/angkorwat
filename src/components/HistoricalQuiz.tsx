import React, { useState } from 'react';
import { QuizQuestion } from '../data/angkorHistoryData';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HistoricalQuizProps {
  questions: QuizQuestion[];
}

export const HistoricalQuiz: React.FC<HistoricalQuizProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsSubmitted(false);
    setIsCompleted(false);
  };

  return (
    <div className="bg-neutral-900 border border-amber-900/40 rounded-3xl p-6 md:p-8 shadow-2xl my-12 text-amber-100">
      <div className="flex items-center justify-between mb-6 border-b border-amber-900/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-200">
              Royal Khmer Historian Trivia
            </h3>
            <p className="text-xs text-amber-300/70">Test your knowledge of true Angkor Wat history</p>
          </div>
        </div>

        {!isCompleted && (
          <div className="text-xs font-mono px-3 py-1 bg-neutral-950 border border-amber-900/40 rounded-full text-amber-400">
            Question {currentIndex + 1} / {questions.length}
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          <h4 className="text-lg md:text-xl font-serif font-semibold text-amber-100 leading-snug">
            {currentQ.question}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((optionText, idx) => {
              let optionStyle = 'bg-neutral-950/80 border-neutral-800 text-amber-200 hover:border-amber-500/50';

              if (selectedOption === idx) {
                optionStyle = 'bg-amber-500/20 border-amber-400 text-amber-100 font-semibold shadow-lg shadow-amber-500/10';
              }

              if (isSubmitted) {
                if (idx === currentQ.correctAnswer) {
                  optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                } else if (selectedOption === idx) {
                  optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <span className="flex-1">{optionText}</span>
                  {isSubmitted && idx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && selectedOption === idx && idx !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Submit */}
          {isSubmitted && (
            <div className="p-4 bg-neutral-950 border border-amber-900/50 rounded-2xl text-xs text-amber-200/90 leading-relaxed animate-fade-in">
              <span className="font-bold text-amber-400 block mb-1">Historical Fact Explanation:</span>
              {currentQ.explanation}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="flex justify-end pt-2">
            {!isSubmitted ? (
              <button
                id="submit-quiz-answer-btn"
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold text-xs rounded-2xl transition-all shadow-lg"
              >
                Confirm Answer
              </button>
            ) : (
              <button
                id="next-quiz-question-btn"
                onClick={handleNext}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-2xl transition-all shadow-lg flex items-center gap-2"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Royal Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completion View */
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>
          <h4 className="text-2xl font-serif font-bold text-amber-200">
            Khmer History Challenge Complete!
          </h4>
          <p className="text-amber-100/80 text-sm max-w-md mx-auto">
            You scored <span className="font-bold text-amber-400 text-lg">{score}</span> out of {questions.length} questions correctly.
          </p>

          <div className="p-4 bg-neutral-950 border border-amber-500/30 rounded-2xl max-w-sm mx-auto text-xs text-amber-300 font-serif">
            🏆 Awarded: <span className="font-bold text-amber-400">Royal Angkor History Scholar Badge</span>
          </div>

          <button
            id="restart-quiz-btn"
            onClick={handleRestart}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-2xl transition-all shadow-lg inline-flex items-center gap-2 mt-4"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake History Challenge</span>
          </button>
        </div>
      )}
    </div>
  );
};
