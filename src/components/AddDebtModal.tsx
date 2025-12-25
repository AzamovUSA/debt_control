import { X } from 'lucide-react';
import { useState } from 'react';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (debt: {
    debtor_name: string;
    phone: string;
    amount: number;
    currency: string;
    due_date: string;
    note: string;
  }) => void;
}

export const AddDebtModal = ({ isOpen, onClose, onAdd }: AddDebtModalProps) => {
  const [debtorName, setDebtorName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('UZS');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!debtorName || !amount || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    onAdd({
      debtor_name: debtorName,
      phone: phone.trim(),
      amount: parseFloat(amount),
      currency,
      due_date: dueDate,
      note: note.trim(),
    });

    setDebtorName('');
    setPhone('');
    setAmount('');
    setCurrency('UZS');
    setDueDate('');
    setNote('');
    onClose();
  };

  const handleClose = () => {
    setDebtorName('');
    setPhone('');
    setAmount('');
    setCurrency('UZS');
    setDueDate('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">Add New Debt</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Debtor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={debtorName}
              onChange={(e) => setDebtorName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="+998 90 123 45 67"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Add a note (e.g., Bought groceries)"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors active:scale-98"
          >
            Add Debt
          </button>
        </form>
      </div>
    </div>
  );
};
