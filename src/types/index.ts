export interface User {
  id: string;
  danaNumber: string;
  danaName: string;
  balance: number;
  totalEarned: number;
  ipAddress: string;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
  lastActive: string;
  adsWatched: number;
  referralCount: number;
  referralEarnings: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  danaNumber: string;
  danaName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
}

export interface AdWatch {
  id: string;
  userId: string;
  amount: number;
  watchedAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredId: string;
  bonus: number;
  createdAt: string;
}

export interface Quiz {
  id: string;
  question: string;
  answer: string;
  options: string[];
}

export type View = 'login' | 'register' | 'dashboard' | 'quiz' | 'watch-ad' | 'withdraw' | 'referral' | 'history' | 'admin';

export const MIN_WITHDRAWAL = 100;
export const AD_REWARD_MIN = 35;
export const AD_REWARD_MAX = 50;
export const REFERRAL_BONUS = 50;
export const REFERRAL_COMMISSION = 0.20;
