import type { ViewState } from "../types/navigation";
import { UILabels } from "../constants/uiText";

interface NavbarProps {
    currentView: ViewState;
    onViewChange: (view: ViewState) => void;
}

export const Navbar = ({ currentView, onViewChange }: NavbarProps) => {
    const getTabClass = (tabName: ViewState) => {
        return currentView === tabName
            ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors";
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">
                                {UILabels.AppTitle}
                            </span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <button 
                                onClick={() => onViewChange('songs')}
                                className={getTabClass('songs')}
                            >
                                {UILabels.NavSongs}
                            </button>
                            <button
                                onClick={() => onViewChange('artists')}
                                className={getTabClass('artists')}
                            >
                                {UILabels.NavArtists}
                            </button>
                            <span className="border-transparent text-gray-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-not-allowed">
                                {UILabels.NavPlaylists}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};