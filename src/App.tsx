import { useState, useEffect, useCallback } from 'react';
import { Auth } from './sections/Auth';
import { Dashboard } from './sections/Dashboard';
import { Quiz } from './sections/Quiz';
import { WatchAd } from './sections/WatchAd';
import { Withdrawal } from './sections/Withdrawal';
import { Referral } from './sections/Referral';
import { History } from './sections/History';
import { AdminPanel } from './sections/AdminPanel';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { User, View, WithdrawalRequest, AdWatch, ReferralRecord } from './types';
import { 
  useUsers, 
  useCurrentUser, 
  useWithdrawals, 
  useAdWatches, 
  useReferrals,
  useBlockedIPs,
  generateId 
} from './hooks/useStorage';

import { REFERRAL_BONUS, REFERRAL_COMMISSION } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  
  const { 
    users, 
    addUser, 
    updateUser, 
    getUserById, 
    getUserByDanaNumber, 
    getUserByIP,
    getUserByReferralCode 
  } = useUsers();
  
  const { currentUser, login, logout, setCurrentUser } = useCurrentUser();
  const { withdrawals, addWithdrawal, updateWithdrawal, getUserWithdrawals } = useWithdrawals();
  const { addAdWatch, getUserAdWatches } = useAdWatches();
  const { addReferral, getUserReferrals } = useReferrals();
  const { isIPBlocked, blockIP } = useBlockedIPs();

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('referral_code', refCode);
    }
  }, []);

  // Sync current user with users array
  useEffect(() => {
    if (currentUser) {
      const updated = getUserById(currentUser.id);
      if (updated) {
        setCurrentUser(updated);
      }
    }
  }, [users, currentUser?.id]);

  const handleLogin = useCallback((user: User) => {
    login(user);
    setCurrentView('dashboard');
    toast.success(`Selamat datang, ${user.danaName}!`);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
    setCurrentView('login');
    toast.info('Anda telah keluar');
  }, [logout]);

  const handleQuizComplete = useCallback(() => {
    setCurrentView('watch-ad');
  }, []);

  const handleAdReward = useCallback((amount: number) => {
    if (currentUser) {
      // Update user balance
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance + amount,
        totalEarned: currentUser.totalEarned + amount,
        adsWatched: currentUser.adsWatched + 1,
      };
      
      updateUser(currentUser.id, updatedUser);
      setCurrentUser(updatedUser);

      // Record ad watch
      const adWatch: AdWatch = {
        id: generateId(),
        userId: currentUser.id,
        amount,
        watchedAt: new Date().toISOString(),
      };
      addAdWatch(adWatch);

      // Give referral commission if user was referred
      if (currentUser.referredBy) {
        const referrer = getUserById(currentUser.referredBy);
        if (referrer) {
          const commission = Math.floor(amount * REFERRAL_COMMISSION);
          if (commission > 0) {
            updateUser(referrer.id, {
              balance: referrer.balance + commission,
              referralEarnings: referrer.referralEarnings + commission,
            });
            
            const referralRecord: ReferralRecord = {
              id: generateId(),
              referrerId: referrer.id,
              referredId: currentUser.id,
              bonus: commission,
              createdAt: new Date().toISOString(),
            };
            addReferral(referralRecord);
          }
        }
      }

      toast.success(`+Rp${amount.toLocaleString('id-ID')} telah ditambahkan ke saldo Anda!`);
    }
  }, [currentUser, updateUser, addAdWatch, getUserById, addReferral]);

  const handleWithdraw = useCallback((withdrawal: WithdrawalRequest) => {
    addWithdrawal(withdrawal);
    
    // Deduct balance
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance - withdrawal.amount,
      };
      updateUser(currentUser.id, updatedUser);
      setCurrentUser(updatedUser);
    }
    
    toast.success('Permintaan penarikan berhasil diajukan!');
  }, [addWithdrawal, currentUser, updateUser]);

  const handleRegister = useCallback((newUser: User) => {
    addUser(newUser);
    
    // Check if there's a pending referral
    const refCode = localStorage.getItem('referral_code');
    if (refCode) {
      const referrer = getUserByReferralCode(refCode);
      if (referrer && referrer.id !== newUser.id) {
        // Give signup bonus to new user
        const updatedNewUser = {
          ...newUser,
          balance: REFERRAL_BONUS,
          referredBy: referrer.id,
        };
        updateUser(newUser.id, updatedNewUser);
        
        // Update referrer
        updateUser(referrer.id, {
          referralCount: referrer.referralCount + 1,
        });
        
        // Add referral record
        const referralRecord: ReferralRecord = {
          id: generateId(),
          referrerId: referrer.id,
          referredId: newUser.id,
          bonus: 0, // Will be added when user watches first ad
          createdAt: new Date().toISOString(),
        };
        addReferral(referralRecord);
        
        localStorage.removeItem('referral_code');
        toast.success(`Bonus pendaftaran Rp${REFERRAL_BONUS} telah ditambahkan!`);
      }
    }
  }, [addUser, getUserByReferralCode, updateUser, addReferral]);

  // Render current view
  const renderView = () => {
    if (!currentUser) {
      return (
        <Auth
          onLogin={handleLogin}
          users={users}
          addUser={handleRegister}
          getUserByDanaNumber={getUserByDanaNumber}
          getUserByIP={getUserByIP}
          getUserByReferralCode={getUserByReferralCode}
          isIPBlocked={isIPBlocked}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            withdrawals={getUserWithdrawals(currentUser.id)}
            adWatches={getUserAdWatches(currentUser.id)}
            referrals={getUserReferrals(currentUser.id)}
          />
        );
      case 'quiz':
        return (
          <Quiz
            onNavigate={setCurrentView}
            onComplete={handleQuizComplete}
          />
        );
      case 'watch-ad':
        return (
          <WatchAd
            onNavigate={setCurrentView}
            onReward={handleAdReward}
            user={currentUser}
          />
        );
      case 'withdraw':
        return (
          <Withdrawal
            onNavigate={setCurrentView}
            user={currentUser}
            onWithdraw={handleWithdraw}
            pendingWithdrawals={getUserWithdrawals(currentUser.id).filter(w => w.status === 'pending')}
          />
        );
      case 'referral':
        return (
          <Referral
            onNavigate={setCurrentView}
            user={currentUser}
            referrals={getUserReferrals(currentUser.id)}
            getUserById={getUserById}
          />
        );
      case 'history':
        return (
          <History
            onNavigate={setCurrentView}
            withdrawals={getUserWithdrawals(currentUser.id)}
            adWatches={getUserAdWatches(currentUser.id)}
            referrals={getUserReferrals(currentUser.id)}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            onNavigate={setCurrentView}
            users={users}
            withdrawals={withdrawals}
            updateWithdrawal={updateWithdrawal}
            blockIP={blockIP}
            getUserById={getUserById}
          />
        );
      default:
        return (
          <Dashboard
            user={currentUser}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            withdrawals={getUserWithdrawals(currentUser.id)}
            adWatches={getUserAdWatches(currentUser.id)}
            referrals={getUserReferrals(currentUser.id)}
          />
        );
    }
  };

  return (
    <>
      {renderView()}
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
