
import { DollarSign, X } from "lucide-react";
import { useState } from "react";
import Modal from "../common4All/Modal";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
    action: 'add' | 'withdraw';
    maxAmount?: number; 
  }
  
 export  const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit, action, maxAmount }) => {
    const [amount, setAmount] = useState<string>('');
  
    if (!isOpen) return null;
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = parseFloat(amount);
      if (numAmount > 0 && (action === 'add' || numAmount <= maxAmount!)) {
        onSubmit(numAmount);
        setAmount('');
        onClose();
      }
    };
  
    return (

        <Modal
    isOpen={isOpen}
    onClose={onClose}
    
    children={
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">{action === 'add' ? 'Add Money to Wallet' : 'Withdraw Money'}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount {action === 'withdraw' && maxAmount && `(Max: $${maxAmount})`}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  max={action === 'withdraw' ? maxAmount : undefined}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
  
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!amount || parseFloat(amount) <= 0 || (action === 'withdraw' && parseFloat(amount) > maxAmount!)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {action === 'add' ? 'Add Money' : 'Withdraw'}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
    />
    );
  };
  