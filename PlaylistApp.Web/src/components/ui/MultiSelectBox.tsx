import { CoreUILabels } from "../../core/constants/uiText";

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
    onToggle
}: MultiSelectBoxProps) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {isLoading && <span className="text-gray-400 text-xs ml-2 animate-pulse">{CoreUILabels.LoadingStatus}</span>}
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white space-y-2">
                {options?.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input 
                            type="checkbox"
                            value={option.id}
                            checked={selectedIds.includes(option.id)}
                            onChange={() => onToggle(option.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-sm text-gray-700 select-none truncate">
                            {option.label}
                            {option.subLabel && (
                                <span className="text-gray-400 text-xs ml-1">- {option.subLabel}</span>
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