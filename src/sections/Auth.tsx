import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIP } from '@/hooks/useIP';
import { generateId, generateReferralCode } from '@/hooks/useStorage';
import type { User } from '@/types';
import { Wallet, UserPlus, LogIn, AlertTriangle, Gift } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  users: User[];
  addUser: (user: User) => void;
  getUserByDanaNumber: (danaNumber: string) => User | undefined;
  getUserByIP: (ip: string) => User | undefined;
  getUserByReferralCode: (code: string) => User | undefined;
  isIPBlocked: (ip: string) => boolean;
}

export function Auth({ 
  onLogin, 
  addUser, 
  getUserByDanaNumber, 
  getUserByIP,
  getUserByReferralCode,
  isIPBlocked 
}: AuthProps) {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [danaNumber, setDanaNumber] = useState('');
  const [danaName, setDanaName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { ip, loading: ipLoading } = useIP();

  const validateDanaNumber = (number: string): boolean => {
    // Dana number should be 10-13 digits
    return /^\d{10,13}$/.test(number);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateDanaNumber(danaNumber)) {
      setError('Nomor DANA harus 10-13 digit angka');
      return;
    }

    const user = getUserByDanaNumber(danaNumber);
    if (!user) {
      setError('Nomor DANA tidak terdaftar. Silakan daftar terlebih dahulu.');
      return;
    }

    // Check if IP is blocked
    if (isIPBlocked(ip)) {
      setError('Akses ditolak. IP Anda telah diblokir.');
      return;
    }

    // Update last active
    const updatedUser = { ...user, lastActive: new Date().toISOString() };
    onLogin(updatedUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateDanaNumber(danaNumber)) {
      setError('Nomor DANA harus 10-13 digit angka');
      return;
    }

    if (danaName.trim().length < 3) {
      setError('Nama akun DANA minimal 3 karakter');
      return;
    }

    // Check if IP is already registered (anti-multi account)
    const existingUserByIP = getUserByIP(ip);
    if (existingUserByIP) {
      setError('Perangkat ini sudah terdaftar. Satu perangkat hanya boleh memiliki satu akun.');
      return;
    }

    // Check if Dana number already exists
    if (getUserByDanaNumber(danaNumber)) {
      setError('Nomor DANA sudah terdaftar. Silakan login.');
      return;
    }

    // Validate referral code if provided
    let referredBy: string | null = null;
    if (referralCode.trim()) {
      const referrer = getUserByReferralCode(referralCode.trim().toUpperCase());
      if (!referrer) {
        setError('Kode referral tidak valid');
        return;
      }
      referredBy = referrer.id;
    }

    const newUser: User = {
      id: generateId(),
      danaNumber,
      danaName: danaName.trim(),
      balance: 0,
      totalEarned: 0,
      ipAddress: ip,
      referralCode: generateReferralCode(),
      referredBy,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      adsWatched: 0,
      referralCount: 0,
      referralEarnings: 0,
    };

    addUser(newUser);
    
    // If has referrer, update referrer's referral count
    if (referredBy) {
      const referrer = getUserByReferralCode(referralCode.trim().toUpperCase());
      if (referrer) {
        // Update in parent component will handle this
        console.log('Referrer found:', referrer.danaName);
      }
    }

    setSuccess('Pendaftaran berhasil! Silakan login.');
    setView('login');
    setDanaNumber('');
    setDanaName('');
    setReferralCode('');
  };

  if (ipLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="AdsDanaID" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AdsDanaID</h1>
          <p className="text-gray-600 mt-2">Nonton Iklan, Dapat Cuan!</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {view === 'login' ? 'Masuk' : 'Daftar'}
            </CardTitle>
            <CardDescription className="text-center">
              {view === 'login' 
                ? 'Masuk dengan nomor DANA Anda' 
                : 'Buat akun baru dengan nomor DANA'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="danaNumber">Nomor DANA</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="danaNumber"
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={danaNumber}
                    onChange={(e) => setDanaNumber(e.target.value.replace(/\D/g, ''))}
                    className="pl-10"
                    maxLength={13}
                  />
                </div>
              </div>

              {view === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="danaName">Nama Akun DANA</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="danaName"
                        type="text"
                        placeholder="Nama sesuai akun DANA"
                        value={danaName}
                        onChange={(e) => setDanaName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralCode">
                      Kode Referral <span className="text-gray-400">(Opsional)</span>
                    </Label>
                    <div className="relative">
                      <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="referralCode"
                        type="text"
                        placeholder="Masukkan kode referral"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Dapatkan bonus Rp50 dengan kode referral!
                    </p>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {view === 'login' ? (
                  <><LogIn className="mr-2 h-4 w-4" /> Masuk</>
                ) : (
                  <><UserPlus className="mr-2 h-4 w-4" /> Daftar</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {view === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                <button
                  onClick={() => {
                    setView(view === 'login' ? 'register' : 'login');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {view === 'login' ? 'Daftar sekarang' : 'Masuk'}
                </button>
              </p>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Keuntungan AdsDanaID:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Rp35-50 per iklan yang ditonton</li>
                <li>• Minimal penarikan hanya Rp100</li>
                <li>• Bonus Rp50 per teman yang mendaftar</li>
                <li>• Komisi 20% dari penghasilan referral</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Dengan mendaftar, Anda menyetujui syarat dan ketentuan kami.
          <br />
          Satu perangkat = Satu akun (Sistem IP Lock)
        </p>
      </div>
    </div>
  );
}
