import { CoreUILabels } from '../../core/constants/uiText';

export interface MultiSelectOption {
  id: string;
  label: string;
  subLabel?: string;
}

interface MultiSelectBoxProps {
  label: string;
  options?: MultiSelectOption[];
  selectedIds: string[];
  isLoading?: boolean;
  emptyMessage: string;
  onToggle: (id: string) => void;
}

export const MultiSelectBox = ({
  label,
  options,
  selectedIds,
  isLoading,
  emptyMessage,
  onToggle,
}: MultiSelectBoxProps) => {
  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}{' '}
        {isLoading && (
          <span className="ml-2 animate-pulse text-xs text-gray-400">
            {CoreUILabels.LoadingStatus}
          </span>
        )}
      </label>
      <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border border-gray-300 bg-white p-2">
        {options?.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center space-x-2 rounded p-1 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              value={option.id}
              checked={selectedIds.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="truncate text-sm text-gray-700 select-none">
              {option.label}
              {option.subLabel && (
                <span className="ml-1 text-xs text-gray-400">- {option.subLabel}</span>
              )}
            </span>
          </label>
        ))}
        {!isLoading && options?.length === 0 && (
          <span className="text-sm text-gray-500 italic">{emptyMessage}</span>
        )}
      </div>
    </div>
  );
};
