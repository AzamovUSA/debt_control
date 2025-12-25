import { useTelegram } from '../context/TelegramContext';
import { Crown, Wallet } from 'lucide-react';

export const Header = () => {
  const { user } = useTelegram();

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-8 rounded-b-3xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Debt Manager</h1>
            <p className="text-blue-100 text-sm">Track your debts easily</p>
          </div>
        </div>
        {user?.is_premium && (
          <div className="bg-yellow-400 bg-opacity-20 border border-yellow-300 text-yellow-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Crown className="w-4 h-4" />
            <span className="text-xs font-semibold">PRO</span>
          </div>
        )}
      </div>
      {user && (
        <div className="text-blue-100">
          Welcome, <span className="font-semibold text-white">{user.first_name}</span>
        </div>
      )}
    </div>
  );
};
