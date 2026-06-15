import type { User } from './user';

export type PaymentStatus = 'unpaid' | 'paid' | 'overdue';
export type FeeType = 'property' | 'parking' | 'utilities' | 'renovation_deposit' | 'garbage_fee';

export interface Payment {
  id: number;
  userId: number;
  feeType: FeeType;
  amount: number;
  month: string;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  user?: User;
}
