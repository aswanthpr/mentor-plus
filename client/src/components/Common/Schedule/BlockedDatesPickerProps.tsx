import { Calendar, Trash2 } from "lucide-react";

export const BlockedDatesPicker = ({
  blockedDates,
  onAdd,
  onRemove,
  onUpdate,
}: BlockedDatesPickerProps) => {
  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Blocked Dates</h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-700"
        >
          <Calendar size={20} />
          <span>Add Blocked Date</span>
        </button>
      </div>
      <div className="space-y-2">
        {blockedDates.map((blocked, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="date"
              value={blocked.date}
              onChange={(e) => onUpdate(index, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
            />
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BlockedDatesPicker;
