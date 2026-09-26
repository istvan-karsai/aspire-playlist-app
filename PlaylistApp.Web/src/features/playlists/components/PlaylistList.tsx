import { useState } from "react";
import { useDeletePlaylist, usePlaylists } from "../hooks/usePlaylists";
import { EditPlaylistModal } from "./EditPlaylistModal";
import type { Playlist } from "../types";
import { CoreUIButtons, CoreUILabels, CoreUIPrompts } from "../../../core/constants/uiText";
import { PlaylistUILabels } from "../constants/uiText";
import { Link } from "react-router-dom";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Table, TableAction, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "../../../components/ui/Table";

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
        return <LoadingState message={PlaylistUILabels.LoadingPlaylistLibrary} />;
    }

    if (isError) {
        return <ErrorBanner title={PlaylistUILabels.ErrorLoadingPlaylistsHeader} message={error.message} />;
    }

    if (!playlists || playlists.length === 0) {
        return <EmptyState message={PlaylistUILabels.EmptyPlaylistLibrary} />;
    }

    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">{PlaylistUILabels.PlaylistLibraryHeader}</h2>
            <Table>
                    <TableHeader>
                            <TableHeadCell className="w-5/12 sm:w-4/12 md:w-3/12">{PlaylistUILabels.TableName}</TableHeadCell>
                            <TableHeadCell className="hidden sm:table-cell sm:w-4/12 md:w-5/12">{PlaylistUILabels.TableDescription}</TableHeadCell>
                            <TableHeadCell className="text-right w-3/12 sm:w-2/12">{PlaylistUILabels.Songs}</TableHeadCell>
                            <TableHeadCell className="text-right w-4/12 sm:w-2/12">{CoreUILabels.TableActions}</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {playlists.map((playlist) => (
                            <TableRow key={playlist.id}>
                                <TableCell className="font-medium text-gray-900 truncate">
                                    <Link
                                        to={`/playlists/${playlist.id}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                                    >
                                        {playlist.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell truncate" title={playlist.description || ""}>
                                    {playlist.description || CoreUILabels.EmptyValueFallback}
                                </TableCell>
                                <TableCell className="text-right">
                                    {playlist.songs.length}
                                </TableCell>
                                <TableCell className="text-right">
                                    <TableAction onClick={() => setEditingPlaylist(playlist)}>
                                        {CoreUIButtons.Edit}
                                    </TableAction>
                                    
                                    <TableAction
                                        variant="danger"
                                        onClick={() => handleDelete(playlist.id, playlist.name)}
                                        disabled={isPending && variables === playlist.id}
                                    >
                                        {isPending && variables === playlist.id ? CoreUIButtons.Deleting : CoreUIButtons.Delete}
                                    </TableAction>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            {editingPlaylist && (
                <EditPlaylistModal
                    playlist={editingPlaylist}
                    onClose={() => setEditingPlaylist(null)}
                />
            )}
        </div>
    );
};