import { useEffect, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useTelegram } from './context/TelegramContext';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { DebtCard } from './components/DebtCard';
import { AddDebtModal } from './components/AddDebtModal';
import type { Debt } from './types/debt';

type FilterType = 'all' | 'unpaid' | 'paid';

function App() {
  const { userId, isReady, webApp } = useTelegram();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (isReady && userId) {
      loadDebts();
    }
  }, [isReady, userId]);

  const loadDebts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDebts(data || []);
    } catch (error) {
      console.error('Error loading debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDebt = async (debtData: {
    debtor_name: string;
    phone: string;
    amount: number;
    currency: string;
    due_date: string;
    note: string;
  }) => {
    try {
      const { error } = await supabase.from('debts').insert({
        user_id: userId!,
        ...debtData,
        status: 'unpaid',
      });

      if (error) throw error;

      webApp?.HapticFeedback.notificationOccurred('success');
      await loadDebts();
    } catch (error) {
      console.error('Error adding debt:', error);
      webApp?.HapticFeedback.notificationOccurred('error');
    }
  };

  const handleMarkAsPaid = async (debtId: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', debtId);

      if (error) throw error;

      webApp?.HapticFeedback.notificationOccurred('success');
      await loadDebts();
    } catch (error) {
      console.error('Error marking debt as paid:', error);
      webApp?.HapticFeedback.notificationOccurred('error');
    }
  };

  const filteredDebts = debts.filter((debt) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'paid' && debt.status === 'paid') ||
      (filter === 'unpaid' && debt.status === 'unpaid');

    const matchesSearch = debt.debtor_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: debts.length,
    unpaid: debts.filter((d) => d.status === 'unpaid').length,
    paid: debts.filter((d) => d.status === 'paid').length,
    totalAmount: debts
      .filter((d) => d.status === 'unpaid')
      .reduce((sum, d) => sum + Number(d.amount), 0),
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <div className="px-6 -mt-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-5 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{stats.unpaid}</div>
            <div className="text-xs text-gray-500 mt-1">Unpaid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <div className="text-xs text-gray-500 mt-1">Paid</div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="px-6 mb-4">
        <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('unpaid')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'unpaid'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unpaid ({stats.unpaid})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              filter === 'paid'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Paid ({stats.paid})
          </button>
        </div>
      </div>

      <div className="px-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredDebts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No debts found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Add your first debt to get started'}
            </p>
          </div>
        ) : (
          filteredDebts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} onMarkAsPaid={handleMarkAsPaid} />
          ))
        )}
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        <Plus className="w-8 h-8" />
      </button>

      <AddDebtModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDebt}
      />
    </div>
  );
}

export default App;
