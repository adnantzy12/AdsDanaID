import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { View, WithdrawalRequest, AdWatch, ReferralRecord } from '@/types';
import { 
  ArrowLeft, 
  HistoryIcon, 
  Eye, 
  Wallet, 
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface HistoryProps {
  onNavigate: (view: View) => void;
  withdrawals: WithdrawalRequest[];
  adWatches: AdWatch[];
  referrals: ReferralRecord[];
}

export function History({ 
  onNavigate, 
  withdrawals, 
  adWatches, 
  referrals 
}: HistoryProps) {
  const [activeTab, setActiveTab] = useState('ads');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><AlertCircle className="h-3 w-3 mr-1" /> Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <HistoryIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Riwayat Aktivitas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ads" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Iklan</span>
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Penarikan</span>
                </TabsTrigger>
                <TabsTrigger value="referrals" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span className="hidden sm:inline">Referral</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ads" className="mt-4">
                {adWatches.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Belum ada riwayat iklan</p>
                    <p className="text-sm">Mulai nonton iklan untuk mendapatkan reward!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adWatches.map((ad) => (
                      <div 
                        key={ad.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Eye className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">Nonton Iklan</div>
                            <div className="text-xs text-gray-500">
                              {new Date(ad.watchedAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          +Rp{ad.amount.toLocaleString('id-ID')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="withdrawals" className="mt-4">
                {withdrawals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Belum ada riwayat penarikan</p>
                    <p className="text-sm">Ajukan penarikan setelah saldo mencukupi!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((withdrawal) => (
                      <div 
                        key={withdrawal.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">Penarikan ke DANA</div>
                            <div className="text-xs text-gray-500">
                              {new Date(withdrawal.createdAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            Rp{withdrawal.amount.toLocaleString('id-ID')}
                          </div>
                          <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="referrals" className="mt-4">
                {referrals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Gift className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Belum ada riwayat referral</p>
                    <p className="text-sm">Bagikan kode referral Anda untuk mendapatkan bonus!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div 
                        key={referral.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Gift className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">Bonus Referral</div>
                            <div className="text-xs text-gray-500">
                              {new Date(referral.createdAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          +Rp{referral.bonus.toLocaleString('id-ID')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
