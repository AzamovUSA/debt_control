export interface Debt {
  id: string;
  user_id: string;
  debtor_name: string;
  phone: string | null;
  amount: number;
  currency: string;
  due_date: string;
  status: 'paid' | 'unpaid';
  note: string | null;
  created_at: string;
  paid_at: string | null;
}
