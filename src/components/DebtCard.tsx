import { Calendar, CheckCircle2, Clock, Phone, StickyNote } from 'lucide-react';
import type { Debt } from '../types/debt';

interface DebtCardProps {
  debt: Debt;
  onMarkAsPaid: (id: string) => void;
}

export const DebtCard = ({ debt, onMarkAsPaid }: DebtCardProps) => {
  const dueDate = new Date(debt.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const isOverdue = daysUntilDue < 0 && debt.status === 'unpaid';
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3 && debt.status === 'unpaid';
  const isPaid = debt.status === 'paid';

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' ' + currency;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${
        isPaid
          ? 'border-green-200 opacity-75'
          : isOverdue
          ? 'border-red-300 shadow-red-100'
          : isDueSoon
          ? 'border-orange-300 shadow-orange-100'
          : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{debt.debtor_name}</h3>
          {debt.phone && (
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{debt.phone}</span>
            </div>
          )}
        </div>
        {isPaid && (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Paid</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-gray-900">{formatCurrency(debt.amount, debt.currency)}</span>
      </div>

      <div className="flex items-center gap-4 text-sm mb-3">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Created: {formatDate(debt.created_at)}</span>
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 text-sm mb-3 ${
          isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
        }`}
      >
        <Clock className="w-4 h-4" />
        <span>Due: {formatDate(debt.due_date)}</span>
        {!isPaid && (
          <span className="ml-1 font-medium">
            {isOverdue
              ? `(${Math.abs(daysUntilDue)} days overdue)`
              : daysUntilDue === 0
              ? '(Due today!)'
              : daysUntilDue === 1
              ? '(Due tomorrow)'
              : `(${daysUntilDue} days left)`}
          </span>
        )}
      </div>

      {debt.note && (
        <div className="flex items-start gap-1.5 text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
          <StickyNote className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="flex-1">{debt.note}</span>
        </div>
      )}

      {isPaid ? (
        <div className="text-sm text-green-600 font-medium">Paid on {formatDate(debt.paid_at!)}</div>
      ) : (
        <button
          onClick={() => onMarkAsPaid(debt.id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors active:scale-98"
        >
          Mark as Paid
        </button>
      )}
    </div>
  );
};
