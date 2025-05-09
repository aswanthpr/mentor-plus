import React, { useState } from "react";
import { X } from "lucide-react";
import { MENTE_PROFILE_PASS_CHANGE } from "../../Constants/initialStates";
import { validateProfilePass } from "../../Validation/Validation";

const EditPassword: React.FC<EditPasswordModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [passwords, setPasswords] = useState<IPass>(MENTE_PROFILE_PASS_CHANGE);
  const [errors, setErrors] = useState<Partial<Record<keyof IPass, string>>>(
    MENTE_PROFILE_PASS_CHANGE
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatePasswords = validateProfilePass(
      passwords?.newPassword as string,
      passwords?.currentPassword as string,
      passwords?.confirmPassword as string
    );
    if (Object.keys(validatePasswords).length != 0) {
      setErrors(validatePasswords);
      return;
    }
    onUpdate(passwords);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => {
                setPasswords({ ...passwords, currentPassword: e.target.value });
                setErrors({ ...errors, currentPassword: undefined });
              }}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.currentPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#ff8800] focus:ring-[#ff8800]"
              }`}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => {
                setPasswords({ ...passwords, newPassword: e.target.value });
                setErrors({ ...errors, newPassword: undefined });
              }}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.newPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#ff8800] focus:ring-[#ff8800]"
              }`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => {
                setPasswords({ ...passwords, confirmPassword: e.target.value });
                setErrors({ ...errors, confirmPassword: undefined });
              }}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-[#ff8800] focus:ring-[#ff8800]"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
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
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff8800] hover:bg-[#ff9900] rounded-lg transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;
