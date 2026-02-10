import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { View, User } from '@/types';
import { 
  ArrowLeft, 
  Play, 
  Volume2, 
  VolumeX, 
  Clock,
  Coins
} from 'lucide-react';
import { AD_REWARD_MIN, AD_REWARD_MAX } from '@/types';

interface WatchAdProps {
  onNavigate: (view: View) => void;
  onReward: (amount: number) => void;
  user: User;
}

export function WatchAd({ onNavigate, onReward }: WatchAdProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAd = () => {
    setIsPlaying(true);
    setRewardAmount(Math.floor(Math.random() * (AD_REWARD_MAX - AD_REWARD_MIN + 1)) + AD_REWARD_MIN);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        setProgress(((30 - timeLeft + 1) / 30) * 100);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      completeAd();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const completeAd = () => {
    setCompleted(true);
    onReward(rewardAmount);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleFinish = () => {
    onNavigate('dashboard');
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Coins className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reward Diterima!
            </h2>
            <p className="text-4xl font-bold text-green-600 mb-4">
              +Rp{rewardAmount.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-600 mb-6">
              Terima kasih telah menonton iklan. Saldo Anda telah bertambah!
            </p>
            <Button 
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current);
                onNavigate('dashboard');
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </button>
            {isPlaying && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {!isPlaying ? (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Siap Menonton?
                </h2>
                <p className="text-gray-600 mb-6">
                  Tonton iklan selama 30 detik untuk mendapatkan reward Rp{AD_REWARD_MIN}-{AD_REWARD_MAX}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={startAd}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Mulai Nonton Iklan
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onNavigate('dashboard')}
                    className="w-full"
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <Progress value={progress} className="h-1 rounded-none" />
            </div>

            {/* Simulated Ad Container */}
            <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
              {/* Simulated Google Ad */}
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-white">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">Ad</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Iklan Simulasi Google Ads</h3>
                  <p className="text-gray-300 mb-4">
                    Ini adalah simulasi iklan. Dalam implementasi nyata, 
                    iklan Google AdSense akan ditampilkan di sini.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Tonton sampai selesai ({timeLeft}s)</span>
                  </div>
                </div>

                {/* Simulated Ad Content */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="font-bold">G</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Produk Berkualitas</h4>
                      <p className="text-sm text-gray-300">Dapatkan diskon 50% hari ini!</p>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Kunjungi
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Info */}
            <div className="bg-gray-800 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Iklan akan selesai dalam</span>
                  <span className="font-bold text-white">{timeLeft} detik</span>
                </div>
                <div className="text-sm">
                  Reward: <span className="font-bold text-green-400">Rp{rewardAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
