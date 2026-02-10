import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { View, User, ReferralRecord } from '@/types';
import { 
  ArrowLeft, 
  Gift, 
  Users, 
  Copy, 
  Check, 
  Share2,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { REFERRAL_BONUS, REFERRAL_COMMISSION } from '@/types';

interface ReferralProps {
  onNavigate: (view: View) => void;
  user: User;
  referrals: ReferralRecord[];
  getUserById: (id: string) => User | undefined;
}

export function Referral({ 
  onNavigate, 
  user, 
  referrals,
  getUserById 
}: ReferralProps) {
  const [copied, setCopied] = useState(false);
  
  const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
  
  const totalEarnings = referrals.reduce((sum, r) => sum + r.bonus, 0);
  
  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AdsDanaID - Nonton Iklan, Dapat Cuan!',
          text: `Gabung AdsDanaID dengan kode referral ${user.referralCode} dan dapatkan bonus!`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="text-3xl font-bold">{user.referralCount}</div>
              <div className="text-sm text-purple-100">Total Referral</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-3xl font-bold">
                Rp{totalEarnings.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-green-100">Total Bonus</div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Kode Referral Anda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kode Referral:</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-100 rounded-lg px-4 py-4 font-mono text-2xl text-center font-bold flex items-center justify-between">
                  <span className="w-full text-center">{user.referralCode}</span>
                  <button 
                    onClick={copyReferralCode}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Link Referral:</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm truncate">
                  {referralLink}
                </div>
                <Button variant="outline" onClick={copyReferralLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={shareReferral}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-3">Keuntungan Referral:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-medium text-purple-900">Bonus Pendaftaran</div>
                    <div className="text-sm text-purple-700">
                      Dapatkan Rp{REFERRAL_BONUS} saat teman mendaftar dan menyelesaikan 1x iklan
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <div className="font-medium text-green-900">Komisi Berkelanjutan</div>
                    <div className="text-sm text-green-700">
                      Dapatkan {REFERRAL_COMMISSION * 100}% dari penghasilan teman Anda setiap kali mereka nonton iklan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <Button 
              onClick={shareReferral}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Bagikan ke Teman
            </Button>
          </CardContent>
        </Card>

        {/* Referral List */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Daftar Referral
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Belum ada referral</p>
                <p className="text-sm">Bagikan kode referral Anda untuk mulai mengumpulkan bonus!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => {
                  const referredUser = getUserById(referral.referredId);
                  return (
                    <div 
                      key={referral.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-purple-600">
                            {referredUser?.danaName.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {referredUser?.danaName || 'Pengguna'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(referral.createdAt).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        +Rp{referral.bonus.toLocaleString('id-ID')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
