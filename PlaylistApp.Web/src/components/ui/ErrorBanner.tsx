export const ErrorBanner = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
};
