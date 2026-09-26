export const LoadingState = ({ message }: { message: string }) => {
    return (
        <div className="text-center p-10 text-gray-500 w-full">
            <span className="animate-pulse">{message}</span>
        </div>
    );
};