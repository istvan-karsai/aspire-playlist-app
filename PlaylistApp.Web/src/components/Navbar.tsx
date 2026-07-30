export const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">
                                István's Playlist Manager
                            </span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="#" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Songs
                            </a>
                            <span className="border-transparent text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-not-allowed">
                                Artists
                            </span>
                            <span className="border-transparent text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-not-allowed">
                                Playlists
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};