interface ScheduleTypeSelectorProps {
    value: 'normal' | 'recurring';
    onChange: (value: 'normal' | 'recurring') => void;
  }
  
  export const ScheduleTypeSelector = ({ value, onChange }: ScheduleTypeSelectorProps) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Schedule Type
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as 'normal' | 'recurring')}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-500"
        >
          <option value="normal">Normal</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>
    );
  };