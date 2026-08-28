import { useState } from "react";
import { useDeletePlaylist, usePlaylists } from "../hooks/usePlaylists";
import { EditPlaylistModal } from "./EditPlaylistModal";
import type { Playlist } from "../types";
import { CoreUIButtons, CoreUILabels, CoreUIPrompts } from "../../../core/constants/uiText";
import { PlaylistUILabels } from "../constants/uiText";
import { Link } from "react-router-dom";

export const PlaylistList = () => {
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

    const { data: playlists, isLoading, isError, error } = usePlaylists();
    const { mutate: deletePlaylist, isPending, variables } = useDeletePlaylist();

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(CoreUIPrompts.ConfirmDelete(name))) {
            deletePlaylist(id);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center p-10 text-gray-500 w-full">
                <span className="animate-pulse">{PlaylistUILabels.LoadingPlaylistLibrary}</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 w-full">
                <h3 className="font-bold">{PlaylistUILabels.ErrorLoadingPlaylistsHeader}</h3>
                <p className="text-sm">{(error as Error).message}</p>
            </div>
        );
    }

    if (!playlists || playlists.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500 w-full">
                {PlaylistUILabels.EmptyPlaylistLibrary}
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">{PlaylistUILabels.PlaylistLibraryHeader}</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <table className="w-full min-w-full text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-5/12 sm:w-4/12 md:w-3/12">{PlaylistUILabels.TableName}</th>
                            <th className="hidden sm:table-cell h-12 px-4 text-left font-medium text-gray-500 sm:w-4/12 md:w-5/12">{PlaylistUILabels.TableDescription}</th>
                            <th className="h-12 px-4 text-right font-medium text-gray-500 w-3/12 sm:w-2/12">{PlaylistUILabels.Songs}</th>
                            <th className="h-12 px-4 text-right font-medium text-gray-500 w-4/12 sm:w-2/12">{CoreUILabels.TableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {playlists.map((playlist) => (
                            <tr key={playlist.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900 truncate">
                                    <Link
                                        to={`/playlists/${playlist.id}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                                    >
                                        {playlist.name}
                                    </Link>
                                </td>
                                <td className="hidden sm:table-cell p-4 text-gray-600 truncate" title={playlist.description || ""}>
                                    {playlist.description || "-"}
                                </td>
                                <td className="p-4 text-gray-600 text-right">
                                    {playlist.songs.length}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setEditingPlaylist(playlist)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium transition-colors"
                                    >
                                        {CoreUIButtons.Edit}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(playlist.id, playlist.name)}
                                        disabled={isPending && variables === playlist.id}
                                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        {isPending && variables === playlist.id ? CoreUIButtons.Deleting : CoreUIButtons.Delete}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingPlaylist && (
                <EditPlaylistModal
                    playlist={editingPlaylist}
                    onClose={() => setEditingPlaylist(null)}
                />
            )}
        </div>
    );
};