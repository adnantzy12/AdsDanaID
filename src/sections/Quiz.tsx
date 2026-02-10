import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getRandomQuiz } from '@/data/quizzes';
import type { Quiz as QuizType, View } from '@/types';
import { ArrowLeft, Clock, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  onNavigate: (view: View) => void;
  onComplete: () => void;
}

export function Quiz({ onNavigate, onComplete }: QuizProps) {
  const [currentQuiz, setCurrentQuiz] = useState<QuizType>(getRandomQuiz());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, quizCompleted]);

  const handleTimeUp = () => {
    setIsCorrect(false);
    setShowResult(true);
    setTimeout(() => {
      resetQuiz();
    }, 2000);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuiz.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        setQuizCompleted(true);
      }, 1500);
    } else {
      setTimeout(() => {
        resetQuiz();
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(getRandomQuiz());
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(15);
  };

  const handleProceedToAd = () => {
    onComplete();
    onNavigate('watch-ad');
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Jawaban Benar!
            </h2>
            <p className="text-gray-600 mb-6">
              Selamat! Anda telah menjawab dengan benar. Sekarang tonton iklan untuk mendapatkan reward.
            </p>
            <Button 
              onClick={handleProceedToAd}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Lanjutkan ke Iklan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </button>
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Timer Progress */}
        <div className="mb-6">
          <Progress 
            value={(timeLeft / 15) * 100} 
            className="h-2"
          />
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-xl">Jawab Teka-teki</CardTitle>
            <p className="text-sm text-gray-500">
              Jawab dengan benar untuk melanjutkan ke iklan
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Question */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-center text-gray-900">
                {currentQuiz.question}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${showResult 
                      ? option === currentQuiz.answer
                        ? 'border-green-500 bg-green-50'
                        : option === selectedAnswer && option !== currentQuiz.answer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && option === currentQuiz.answer && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {showResult && option === selectedAnswer && option !== currentQuiz.answer && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isCorrect 
                  ? 'Benar! Mengalihkan ke halaman iklan...' 
                  : 'Salah! Silakan coba lagi...'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Jawab dengan cepat! Waktu terbatas.</p>
        </div>
      </main>
    </div>
  );
}
