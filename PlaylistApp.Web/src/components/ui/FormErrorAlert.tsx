import { ApiValidationError } from '../../core/api/client';

interface FormErrorAlertProps {
  error: Error;
  titlePrefix?: string;
}

export const FormErrorAlert = ({ error, titlePrefix }: FormErrorAlertProps) => {
  return (
    <div className="mb-4 w-full rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {titlePrefix && <strong className="mb-2 block font-semibold">{titlePrefix}</strong>}
      <ul className="list-disc space-y-1 pl-5">
        {error instanceof ApiValidationError ? (
          error.messages.map((message, index) => <li key={index}>{message}</li>)
        ) : (
          <li>{error.message}</li>
        )}
      </ul>
    </div>
  );
};
