export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          telegram_id: number;
          name: string;
          is_premium: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          telegram_id: number;
          name: string;
          is_premium?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          telegram_id?: number;
          name?: string;
          is_premium?: boolean;
          created_at?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          user_id: string;
          debtor_name: string;
          phone: string | null;
          amount: number;
          currency: string;
          due_date: string;
          status: string;
          note: string | null;
          created_at: string;
          paid_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          debtor_name: string;
          phone?: string | null;
          amount: number;
          currency?: string;
          due_date: string;
          status?: string;
          note?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          debtor_name?: string;
          phone?: string | null;
          amount?: number;
          currency?: string;
          due_date?: string;
          status?: string;
          note?: string | null;
          created_at?: string;
          paid_at?: string | null;
        };
      };
    };
  };
}
