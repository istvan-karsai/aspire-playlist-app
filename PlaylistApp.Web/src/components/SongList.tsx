import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSong } from "../api/client";
import type { Song } from "../types/song";
import { useState } from "react";
import { EditSongModal } from "./EditSongModal";
import { ApiMessages, UIButtons, UILabels, UIPrompts } from "../constants/uiText";
import { useSongs } from "../hooks/useSongs";
import { Link } from "react-router-dom";

export const SongList = () => {
    const queryClient = useQueryClient();

    const [editingSong, setEditingSong] = useState<Song | null>(null);
    
    const { data: songs, isLoading, isError, error } = useSongs();

    const deleteMutation = useMutation({
        mutationFn: deleteSong,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['songs'] });
        },
        onError: (err) => {
            alert(ApiMessages.DeleteError(err.message));
        }
    });

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(UIPrompts.ConfirmDelete(title))) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center p-10 text-gray-500 w-full">
                <span className="animate-pulse">{UILabels.LoadingLibrary}</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 w-full">
                <h3 className="font-bold">{UILabels.ErrorLoadingHeader}</h3>
                <p className="text-sm">{(error as Error).message}</p>
            </div>
        );
    }

    if (!songs || songs.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500 w-full">
                {UILabels.EmptyLibrary}
            </div>
        );
    }

    console.log("Cache State:", queryClient.getQueryCache().getAll());
    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">{UILabels.LibraryHeader}</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <table className="w-full min-w-full text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-5/12">{UILabels.TableTitle}</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-4/12">{UILabels.Artists}</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-2/12">{UILabels.TableDuration}</th>
                            <th className="h-12 px-4 text-right font-medium text-gray-500 w-1/12">{UILabels.TableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {songs.map((song) => (
                            <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900 truncate">{song.title}</td>
                                <td className="p-4 text-gray-600 truncate">
                                    {song.artists && song.artists.length > 0 ? (
                                        song.artists.map((artist, index) => (
                                            <span key={artist.id}>
                                                <Link
                                                    to={`/artists/${artist.id}`}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {artist.name}
                                                </Link>
                                                {index < song.artists.length - 1 && ", "}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">{UILabels.EmptyArtistsFallback}</span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600">{song.duration}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setEditingSong(song)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        {UIButtons.Edit}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(song.id, song.title)}
                                        disabled={deleteMutation.isPending}
                                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        {deleteMutation.isPending && deleteMutation.variables === song.id ? UIButtons.Deleting : UIButtons.Delete}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingSong && (
                <EditSongModal 
                    song={editingSong} 
                    onClose={() => setEditingSong(null)} 
                />
            )}
        </div>
    );
};