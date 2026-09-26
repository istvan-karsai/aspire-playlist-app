import { ApiValidationError } from "../../core/api/client";

interface FormErrorAlertProps {
    error: Error;
    titlePrefix?: string;
}

export const FormErrorAlert = ({ error, titlePrefix }: FormErrorAlertProps) => {
    return (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm w-full">
            {titlePrefix && (
                <strong className="font-semibold block mb-2">{titlePrefix}</strong>
            )}
            <ul className="list-disc pl-5 space-y-1">
                {error instanceof ApiValidationError ? (
                    error.messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))
                ) : (
                    <li>{error.message}</li>
                )}
            </ul>
        </div>
    );
};