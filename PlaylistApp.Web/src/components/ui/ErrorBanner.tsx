export const ErrorBanner = ({ title, message }: { title: string; message: string }) => {
    return (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 w-full">
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm">{message}</p>
        </div>
    );
};