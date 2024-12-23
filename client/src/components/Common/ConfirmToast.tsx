
// Reusable Toast Component
interface ToastNotificationProps {
  message: string;
  description: string;
  onReply: () => void;
  onIgnore: () => void;
  ariaLabel: string;
}

const ConfirmToast: React.FC<ToastNotificationProps> = ({ message, description, onReply, onIgnore ,ariaLabel}) => {
  return (
    <div className="grid grid-cols-[1fr_1px_80px] w-full" aria-label={ariaLabel}>
      <div className="flex flex-col p-4">
        <h3 className="text-zinc-800 text-sm font-semibold">{message}</h3>
        <p className="text-sm">{description}</p>
      </div>
      {/* Vertical divider */}
      <div className="bg-zinc-900/20 h-full" />
      <div className="grid grid-rows-[1fr_1px_1fr] h-full">
        <button onClick={onReply} className="text-purple-600">
          confirm
        </button>
        <div className="bg-zinc-900/20 w-full" />
        <button onClick={onIgnore}>Ignore</button>
      </div>
    </div>
  );
};



export default ConfirmToast;
