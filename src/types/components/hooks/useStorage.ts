import { useState, useEffect, useCallback } from 'react';
import type { User, WithdrawalRequest, AdWatch, ReferralRecord } from '@/types';

const STORAGE_KEYS = {
  USERS: 'adsdana_users',
  WITHDRAWALS: 'adsdana_withdrawals',
  AD_WATCHES: 'adsdana_ad_watches',
  REFERRALS: 'adsdana_referrals',
  CURRENT_USER: 'adsdana_current_user',
  BLOCKED_IPS: 'adsdana_blocked_ips',
};

// User Management
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse users:', e);
      }
    }
  }, []);

  const saveUsers = useCallback((newUsers: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
    setUsers(newUsers);
  }, []);

  const addUser = useCallback((user: User) => {
    const newUsers = [...users, user];
    saveUsers(newUsers);
  }, [users, saveUsers]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    const newUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    saveUsers(newUsers);
  }, [users, saveUsers]);

  const getUserById = useCallback((userId: string) => {
    return users.find(u => u.id === userId);
  }, [users]);

  const getUserByDanaNumber = useCallback((danaNumber: string) => {
    return users.find(u => u.danaNumber === danaNumber);
  }, [users]);

  const getUserByIP = useCallback((ip: string) => {
    return users.find(u => u.ipAddress === ip);
  }, [users]);

  const getUserByReferralCode = useCallback((code: string) => {
    return users.find(u => u.referralCode === code);
  }, [users]);

  return {
    users,
    addUser,
    updateUser,
    getUserById,
    getUserByDanaNumber,
    getUserByIP,
    getUserByReferralCode,
  };
}

// Current User Session
export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse current user:', e);
      }
    }
  }, []);

  const login = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
  }, []);

  const updateBalance = useCallback((amount: number) => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        balance: currentUser.balance + amount,
        totalEarned: amount > 0 ? currentUser.totalEarned + amount : currentUser.totalEarned,
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
      setCurrentUser(updated);
      return updated;
    }
    return null;
  }, [currentUser]);

  return { currentUser, login, logout, updateBalance, setCurrentUser };
}

// Withdrawal Requests
export function useWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    if (stored) {
      try {
        setWithdrawals(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse withdrawals:', e);
      }
    }
  }, []);

  const saveWithdrawals = useCallback((newWithdrawals: WithdrawalRequest[]) => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(newWithdrawals));
    setWithdrawals(newWithdrawals);
  }, []);

  const addWithdrawal = useCallback((withdrawal: WithdrawalRequest) => {
    const newWithdrawals = [...withdrawals, withdrawal];
    saveWithdrawals(newWithdrawals);
  }, [withdrawals, saveWithdrawals]);

  const updateWithdrawal = useCallback((id: string, updates: Partial<WithdrawalRequest>) => {
    const newWithdrawals = withdrawals.map(w => w.id === id ? { ...w, ...updates } : w);
    saveWithdrawals(newWithdrawals);
  }, [withdrawals, saveWithdrawals]);

  const getUserWithdrawals = useCallback((userId: string) => {
    return withdrawals.filter(w => w.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [withdrawals]);

  const getPendingWithdrawals = useCallback(() => {
    return withdrawals.filter(w => w.status === 'pending').sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [withdrawals]);

  return {
    withdrawals,
    addWithdrawal,
    updateWithdrawal,
    getUserWithdrawals,
    getPendingWithdrawals,
  };
}

// Ad Watches
export function useAdWatches() {
  const [adWatches, setAdWatches] = useState<AdWatch[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AD_WATCHES);
    if (stored) {
      try {
        setAdWatches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse ad watches:', e);
      }
    }
  }, []);

  const saveAdWatches = useCallback((newAdWatches: AdWatch[]) => {
    localStorage.setItem(STORAGE_KEYS.AD_WATCHES, JSON.stringify(newAdWatches));
    setAdWatches(newAdWatches);
  }, []);

  const addAdWatch = useCallback((adWatch: AdWatch) => {
    const newAdWatches = [...adWatches, adWatch];
    saveAdWatches(newAdWatches);
  }, [adWatches, saveAdWatches]);

  const getUserAdWatches = useCallback((userId: string) => {
    return adWatches.filter(a => a.userId === userId).sort((a, b) => 
      new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
    );
  }, [adWatches]);

  const getTodayAdWatches = useCallback((userId: string) => {
    const today = new Date().toDateString();
    return adWatches.filter(a => 
      a.userId === userId && new Date(a.watchedAt).toDateString() === today
    );
  }, [adWatches]);

  return {
    adWatches,
    addAdWatch,
    getUserAdWatches,
    getTodayAdWatches,
  };
}

// Referrals
export function useReferrals() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    if (stored) {
      try {
        setReferrals(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse referrals:', e);
      }
    }
  }, []);

  const saveReferrals = useCallback((newReferrals: ReferralRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(newReferrals));
    setReferrals(newReferrals);
  }, []);

  const addReferral = useCallback((referral: ReferralRecord) => {
    const newReferrals = [...referrals, referral];
    saveReferrals(newReferrals);
  }, [referrals, saveReferrals]);

  const getUserReferrals = useCallback((userId: string) => {
    return referrals.filter(r => r.referrerId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [referrals]);

  const getReferrerEarnings = useCallback((userId: string) => {
    return referrals
      .filter(r => r.referrerId === userId)
      .reduce((sum, r) => sum + r.bonus, 0);
  }, [referrals]);

  return {
    referrals,
    addReferral,
    getUserReferrals,
    getReferrerEarnings,
  };
}

// Blocked IPs (for security)
export function useBlockedIPs() {
  const getBlockedIPs = useCallback((): string[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.BLOCKED_IPS);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const blockIP = useCallback((ip: string) => {
    const blocked = getBlockedIPs();
    if (!blocked.includes(ip)) {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_IPS, JSON.stringify([...blocked, ip]));
    }
  }, [getBlockedIPs]);

  const isIPBlocked = useCallback((ip: string): boolean => {
    return getBlockedIPs().includes(ip);
  }, [getBlockedIPs]);

  return { getBlockedIPs, blockIP, isIPBlocked };
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate referral code
export function generateReferralCode(): string {
  return 'AD' + Math.random().toString(36).substr(2, 6).toUpperCase();
}
