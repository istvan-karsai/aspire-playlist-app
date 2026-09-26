export const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 bg-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                <p>
                    Built by <span className="font-semibold text-gray-700">István Karsai</span>
                    {' • '}
                    <a 
                        href="https://github.com/istvan-karsai/aspire-playlist-app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        GitHub
                    </a>
                    {' • '}
                    <a 
                        href="mailto:contact@istvankarsai.com"
                        className="text-blue-600 hover:underline"
                    >
                        contact@istvankarsai.com
                    </a>
                </p>
            </div>
        </footer>
    );
};