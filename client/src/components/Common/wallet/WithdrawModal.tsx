import React, { useCallback, useState } from "react";
import { X } from "lucide-react";
import { validateWalletInput } from "../../../Validation/Validation";

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string>("");
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const result = validateWalletInput(amount);
      if (result.length > 0) {
        setError(result);
        return;
      }
      const numAmount = parseFloat(amount);

      onSubmit(numAmount);
      setAmount("");
      onClose();

      return;
    },
    [amount, onClose, onSubmit]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Withdraw Money</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="">
              {/* <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" /> */}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="500"
                max={5000}
                step="10"
                className="w-full pl-5 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] focus:border-transparent"
                placeholder="₹ 0.00"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
              disabled={
                !amount || parseFloat(amount) <= 0 || parseFloat(amount) < 500
              }
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Withdraw
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
