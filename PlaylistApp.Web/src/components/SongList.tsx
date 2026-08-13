import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSong } from "../api/client";
import type { Song } from "../types/song";
import { useState } from "react";
import { EditSongModal } from "./EditSongModal";
import { ApiMessages, UIButtons, UILabels, UIPrompts } from "../constants/uiText";
import { useSongs } from "../hooks/useSongs";
import { Link, useSearchParams } from "react-router-dom";
import { useArtists } from "../hooks/useArtists";

export const SongList = () => {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const [editingSong, setEditingSong] = useState<Song | null>(null);

    const selectedArtistId = searchParams.get('artistId') || "";
    
    const { data: songs, isLoading, isError, error } = useSongs(selectedArtistId || undefined);

    const { data: artists } = useArtists();

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

    const handleArtistFilterChange = (artistId: string) => {
        setSearchParams((prevParams) => {
            if (artistId) {
                prevParams.set('artistId', artistId);
            } else {
                prevParams.delete('artistId');
            }
            return prevParams;
        }, { replace: true });
    };

    return (
        <div className="space-y-4 w-full">
            {/* Header & Filter Section - Always Visible */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">{UILabels.LibraryHeader}</h2>
                <div className="w-full sm:w-64">
                    <label htmlFor="artist-filter" className="sr-only">{UILabels.FilterByArtist}</label>
                    <select 
                        id="artist-filter"
                        value={selectedArtistId}
                        onChange={(e) => handleArtistFilterChange(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white text-sm"                    
                    >
                        <option value="">{UILabels.AllArtists}</option>
                        {artists?.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                                {artist.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Conditionally Rendered Content Area */}
            {isLoading ? (
                <div className="text-center p-10 text-gray-500 w-full">
                    <span className="animate-pulse">{UILabels.LoadingLibrary}</span>
                </div>
            ) : isError ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 w-full">
                    <h3 className="font-bold">{UILabels.ErrorLoadingHeader}</h3>
                    <p className="text-sm">{(error as Error).message}</p>
                </div>
            ) : !songs || songs.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500 w-full">
                    {selectedArtistId ? UILabels.EmptyDiscography : UILabels.EmptyLibrary}
                </div>
            ) : (
                <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                    <table className="w-full min-w-full text-sm table-fixed">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="h-12 px-4 text-left font-medium text-gray-500 w-8/12 sm:w-6/12 md:w-5/12 lg:w-5/12">{UILabels.TableTitle}</th>
                                <th className="hidden sm:table-cell h-12 px-4 text-left font-medium text-gray-500 sm:w-4/12 md:w-4/12 lg:w-4/12">{UILabels.Artists}</th>
                                <th className="hidden md:table-cell h-12 px-4 text-right font-medium text-gray-500 md:w-2/12 lg:w-2/12">{UILabels.TableDuration}</th>
                                <th className="h-12 px-4 text-right font-medium text-gray-500 w-4/12 sm:w-2/12 md:w-1/12 lg:w-1/12">{UILabels.TableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {songs.map((song) => (
                                <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900 truncate">{song.title}</td>
                                    <td className="hidden sm:table-cell p-4 text-gray-600 truncate">
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
                                    <td className="hidden md:table-cell p-4 text-gray-600 text-right">{song.duration}</td>
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
            )}

            {editingSong && (
                <EditSongModal 
                    song={editingSong} 
                    onClose={() => setEditingSong(null)} 
                />
            )}
        </div>
    );
};