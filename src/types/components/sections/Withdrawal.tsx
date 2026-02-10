import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { View, User, WithdrawalRequest } from '@/types';
import { MIN_WITHDRAWAL } from '@/types';
import { 
  ArrowLeft, 
  Wallet, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Send
} from 'lucide-react';

interface WithdrawalProps {
  onNavigate: (view: View) => void;
  user: User;
  onWithdraw: (withdrawal: WithdrawalRequest) => void;
  pendingWithdrawals: WithdrawalRequest[];
}

export function Withdrawal({ 
  onNavigate, 
  user, 
  onWithdraw,
  pendingWithdrawals 
}: WithdrawalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const maxWithdrawable = user.balance;
  const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = maxWithdrawable - pendingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const withdrawAmount = parseInt(amount);

    if (!withdrawAmount || withdrawAmount < MIN_WITHDRAWAL) {
      setError(`Minimal penarikan adalah Rp${MIN_WITHDRAWAL}`);
      return;
    }

    if (withdrawAmount > availableBalance) {
      setError('Saldo tidak mencukupi');
      return;
    }

    if (pendingWithdrawals.length > 0) {
      setError('Anda masih memiliki permintaan penarikan yang pending');
      return;
    }

    setLoading(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const withdrawal: WithdrawalRequest = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      danaNumber: user.danaNumber,
      danaName: user.danaName,
      amount: withdrawAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onWithdraw(withdrawal);
    setSuccess(true);
    setAmount('');
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Permintaan Terkirim!
            </h2>
            <p className="text-gray-600 mb-6">
              Permintaan penarikan Anda telah dikirim ke admin. 
              Pembayaran akan diproses dalam 1-3 hari kerja.
            </p>
            <Button 
              onClick={() => onNavigate('dashboard')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
            >
              Kembali ke Dashboard
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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Tarik Saldo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Balance Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Saldo Total:</span>
                <span className="font-semibold">Rp{user.balance.toLocaleString('id-ID')}</span>
              </div>
              {pendingAmount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Pending Penarikan:</span>
                  <span className="font-semibold">-Rp{pendingAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Saldo Tersedia:</span>
                <span className="text-green-600">Rp{availableBalance.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {pendingWithdrawals.length > 0 && (
              <Alert className="bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  Anda memiliki {pendingWithdrawals.length} permintaan penarikan yang sedang diproses.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Penarikan</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Minimal Rp${MIN_WITHDRAWAL}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    min={MIN_WITHDRAWAL}
                    max={availableBalance}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Akun Tujuan</Label>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Nama:</div>
                  <div className="font-medium">{user.danaName}</div>
                  <div className="text-sm text-gray-600 mt-1">Nomor DANA:</div>
                  <div className="font-medium">{user.danaNumber}</div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={loading || availableBalance < MIN_WITHDRAWAL || pendingWithdrawals.length > 0}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <><Send className="mr-2 h-4 w-4" /> Ajukan Penarikan</>
                )}
              </Button>
            </form>

            {/* Info */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <h4 className="font-semibold mb-2">Informasi Penting:</h4>
              <ul className="space-y-1">
                <li>• Minimal penarikan: Rp{MIN_WITHDRAWAL}</li>
                <li>• Proses pembayaran: 1-3 hari kerja</li>
                <li>• Pembayaran ke akun DANA terdaftar</li>
                <li>• Satu permintaan penarikan pada satu waktu</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
