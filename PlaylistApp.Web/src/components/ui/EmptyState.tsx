export const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500 w-full">
            {message}
        </div>
    );
};