import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { View, User, WithdrawalRequest } from '@/types';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Wallet, 
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Ban,
  TrendingUp
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (view: View) => void;
  users: User[];
  withdrawals: WithdrawalRequest[];
  updateWithdrawal: (id: string, updates: Partial<WithdrawalRequest>) => void;
  blockIP: (ip: string) => void;
  getUserById: (id: string) => User | undefined;
}

const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

export function AdminPanel({ 
  onNavigate, 
  users, 
  withdrawals, 
  updateWithdrawal,
  blockIP,
  getUserById 
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [actionType, setActionType] = useState<'complete' | 'reject' | null>(null);
  const [activeTab, setActiveTab] = useState('withdrawals');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password salah');
    }
  };

  const handleAction = () => {
    if (selectedWithdrawal && actionType) {
      updateWithdrawal(selectedWithdrawal.id, {
        status: actionType === 'complete' ? 'completed' : 'rejected',
        processedAt: new Date().toISOString(),
      });
      setSelectedWithdrawal(null);
      setActionType(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.danaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.danaNumber.includes(searchTerm) ||
    user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');

  const totalPaid = completedWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <p className="text-gray-500">Masukkan password admin</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Masuk
              </Button>
            </form>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <h1 className="font-bold text-xl">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('dashboard')}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Users</span>
              </div>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">Total Dibayar</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                Rp{totalPaid.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Pending</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                Rp{pendingAmount.toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Pending Count</span>
              </div>
              <div className="text-2xl font-bold">{pendingWithdrawals.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="withdrawals" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Penarikan
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pengguna
            </TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals" className="mt-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Permintaan Penarikan</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Belum ada permintaan penarikan</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.sort((a, b) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).map((withdrawal) => {
                      const user = getUserById(withdrawal.userId);
                      return (
                        <div 
                          key={withdrawal.id} 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Wallet className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">{user?.danaName || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{withdrawal.danaNumber}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(withdrawal.createdAt).toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              Rp{withdrawal.amount.toLocaleString('id-ID')}
                            </div>
                            <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
                            {withdrawal.status === 'pending' && (
                              <div className="mt-2 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => {
                                    setSelectedWithdrawal(withdrawal);
                                    setActionType('complete');
                                  }}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Bayar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedWithdrawal(withdrawal);
                                    setActionType('reject');
                                  }}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Tolak
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Pengguna</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama, nomor, atau kode referral..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Tidak ada pengguna ditemukan</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.sort((a, b) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {user.danaName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.danaName}</div>
                            <div className="text-sm text-gray-500">{user.danaNumber}</div>
                            <div className="text-xs text-gray-400">
                              IP: {user.ipAddress} | Ref: {user.referralCode}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            Rp{user.balance.toLocaleString('id-ID')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.adsWatched} iklan | {user.referralCount} referral
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 mt-1"
                            onClick={() => blockIP(user.ipAddress)}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Block IP
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Action Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'complete' ? 'Konfirmasi Pembayaran' : 'Konfirmasi Penolakan'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'complete' 
                ? 'Pastikan Anda telah mentransfer dana ke akun DANA pengguna.' 
                : 'Penarikan akan ditolak dan saldo akan dikembalikan ke pengguna.'}
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium">{getUserById(selectedWithdrawal.userId)?.danaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nomor DANA:</span>
                  <span className="font-medium">{selectedWithdrawal.danaNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-medium">Rp{selectedWithdrawal.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
              Batal
            </Button>
            <Button 
              onClick={handleAction}
              className={actionType === 'complete' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              {actionType === 'complete' ? 'Konfirmasi Pembayaran' : 'Tolak Penarikan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
