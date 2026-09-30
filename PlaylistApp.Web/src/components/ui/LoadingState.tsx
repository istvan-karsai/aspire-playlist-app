export const LoadingState = ({ message }: { message: string }) => {
  return (
    <div className="w-full p-10 text-center text-gray-500">
      <span className="animate-pulse">{message}</span>
    </div>
  );
};
