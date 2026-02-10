import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import type { User, View, WithdrawalRequest, AdWatch, ReferralRecord } from '@/types';
import { 
  Play, 
  Gift, 
  History, 
  LogOut, 
  Wallet, 
  Users, 
  Eye,
  TrendingUp,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { MIN_WITHDRAWAL } from '@/types';

interface DashboardProps {
  user: User;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  withdrawals: WithdrawalRequest[];
  adWatches: AdWatch[];
  referrals: ReferralRecord[];
}

export function Dashboard({ 
  user, 
  onNavigate, 
  onLogout, 
  withdrawals, 
  adWatches, 
  referrals 
}: DashboardProps) {
  const [copied, setCopied] = useState(false);
  
  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0);
  
  const pendingWithdrawal = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const todayAds = adWatches.filter(a => {
    const watchDate = new Date(a.watchedAt);
    const today = new Date();
    return watchDate.toDateString() === today.toDateString();
  }).length;

  const referralEarnings = referrals.reduce((sum, r) => sum + r.bonus, 0);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressToWithdrawal = Math.min((user.balance / MIN_WITHDRAWAL) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AdsDanaID" className="w-10 h-10" />
              <div>
                <h1 className="font-bold text-lg text-gray-900">AdsDanaID</h1>
                <p className="text-xs text-gray-500">Selamat datang, {user.danaName}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-200" />
                <span className="text-blue-100">Saldo Anda</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {user.adsWatched} Iklan Ditonton
              </Badge>
            </div>
            <div className="text-4xl font-bold mb-2">
              Rp{user.balance.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span>Total Ditarik: Rp{totalWithdrawn.toLocaleString('id-ID')}</span>
              {pendingWithdrawal > 0 && (
                <span className="text-yellow-300">
                  (Pending: Rp{pendingWithdrawal.toLocaleString('id-ID')})
                </span>
              )}
            </div>
            
            {/* Progress to minimum withdrawal */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-blue-100 mb-1">
                <span>Progress ke minimal penarikan (Rp{MIN_WITHDRAWAL})</span>
                <span>{Math.round(progressToWithdrawal)}%</span>
              </div>
              <Progress value={progressToWithdrawal} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{todayAds}</div>
              <div className="text-xs text-gray-500">Iklan Hari Ini</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{user.referralCount}</div>
              <div className="text-xs text-gray-500">Referral</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <Gift className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                Rp{referralEarnings.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-gray-500">Bonus Referral</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                Rp{user.totalEarned.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-gray-500">Total Penghasilan</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            onClick={() => onNavigate('quiz')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Mulai Nonton Iklan</h3>
                    <p className="text-green-100 text-sm">Dapatkan Rp35-50 per iklan</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow ${
              user.balance >= MIN_WITHDRAWAL 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}
            onClick={() => user.balance >= MIN_WITHDRAWAL && onNavigate('withdraw')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    user.balance >= MIN_WITHDRAWAL ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    <Wallet className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Tarik Saldo</h3>
                    <p className={user.balance >= MIN_WITHDRAWAL ? 'text-purple-100' : ''}>
                      Minimal Rp{MIN_WITHDRAWAL}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-600" />
              Program Referral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-800 mb-3">
                Undang teman dan dapatkan:
              </p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Rp50 saat teman mendaftar & menyelesaikan 1x iklan</li>
                <li>• 20% komisi dari penghasilan teman Anda</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kode Referral Anda:</Label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg flex items-center justify-between">
                  <span>{user.referralCode}</span>
                  <button 
                    onClick={copyReferralCode}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate('referral')}
            >
              <Users className="mr-2 h-4 w-4" />
              Lihat Detail Referral
            </Button>
          </CardContent>
        </Card>

        {/* History */}
        <Card 
          className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate('history')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Riwayat Aktivitas</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
