import { useQuery } from "@tanstack/react-query";
import { fetchSongs } from "../api/client";
import type { Song } from "../types/song";

export const SongList = () => {
    const { data: songs, isLoading, isError, error } = useQuery<Song[]>({
        queryKey: ['songs'],
        queryFn: fetchSongs,
    });

    if (isLoading) {
        return (
            <div className="text-center p-10 text-gray-500 w-full">
                <span className="animate-pulse">Loading the song library...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 w-full">
                <h3 className="font-bold">Error loading songs</h3>
                <p className="text-sm">{(error as Error).message}</p>
            </div>
        );
    }

    if (!songs || songs.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500 w-full">
                Your library is currently empty. Add your first song to get started!
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">Current Library</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <table className="w-full min-w-full text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-1/3">Title</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-1/3">Artist</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-1/3">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {songs.map((song) => (
                            <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900 truncate">{song.title}</td>
                                <td className="p-4 text-gray-600 truncate">{song.artist}</td>
                                <td className="p-4 text-gray-600">{song.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};