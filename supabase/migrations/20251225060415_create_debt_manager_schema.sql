/*
  # Debt Manager Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `telegram_id` (bigint, unique) - Telegram user ID
      - `name` (text) - User's display name
      - `is_premium` (boolean) - Premium subscription status
      - `created_at` (timestamptz) - Account creation timestamp
    
    - `debts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - References users table
      - `debtor_name` (text) - Name of person who owes money
      - `phone` (text, nullable) - Optional phone number
      - `amount` (decimal) - Debt amount
      - `currency` (text) - Currency code (UZS/USD)
      - `due_date` (date) - When debt should be paid
      - `status` (text) - Status: 'unpaid' or 'paid'
      - `note` (text, nullable) - Optional note about the debt
      - `created_at` (timestamptz) - When debt was recorded
      - `paid_at` (timestamptz, nullable) - When debt was marked as paid

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
    - Policies for SELECT, INSERT, UPDATE operations
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint UNIQUE NOT NULL,
  name text NOT NULL,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  debtor_name text NOT NULL,
  phone text,
  amount decimal(15, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'UZS',
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'unpaid',
  note text,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint)
  WITH CHECK (telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint);

CREATE POLICY "Users can view own debts"
  ON debts FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users 
    WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint
  ));

CREATE POLICY "Users can insert own debts"
  ON debts FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint
  ));

CREATE POLICY "Users can update own debts"
  ON debts FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users 
    WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint
  ));

CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
CREATE INDEX IF NOT EXISTS idx_debts_due_date ON debts(due_date);