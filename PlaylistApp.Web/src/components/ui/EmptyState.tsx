export const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="w-full rounded-lg border border-dashed bg-gray-50 p-10 text-center text-gray-500">
      {message}
    </div>
  );
};
