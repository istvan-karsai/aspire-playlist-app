import type { Song } from "../types";
import { useState } from "react";
import { EditSongModal } from "./EditSongModal";
import { useDeleteSong, useSongs } from "../hooks/useSongs";
import { Link, useSearchParams } from "react-router-dom";
import { useArtists } from "../../artists/hooks/useArtists";
import { SongUILabels } from "../constants/uiText";
import { CoreUIButtons, CoreUILabels, CoreUIPrompts } from "../../../core/constants/uiText";
import { ArtistUILabels } from "../../artists/constants/uiText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Table, TableAction, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "../../../components/ui/Table";

export const SongList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [editingSong, setEditingSong] = useState<Song | null>(null);

    const selectedArtistId = searchParams.get('artistId') || "";
    
    const { data: songs, isLoading, isError, error } = useSongs(selectedArtistId || undefined);
    const { data: artists } = useArtists();
    const { mutate: deleteSong, isPending, variables } = useDeleteSong();

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(CoreUIPrompts.ConfirmDelete(title))) {
            deleteSong(id);
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
                <h2 className="text-2xl font-semibold tracking-tight">{SongUILabels.LibraryHeader}</h2>
                <div className="w-full sm:w-64">
                    <label htmlFor="artist-filter" className="sr-only">{SongUILabels.FilterByArtist}</label>
                    <select 
                        id="artist-filter"
                        value={selectedArtistId}
                        onChange={(e) => handleArtistFilterChange(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white text-sm"                    
                    >
                        <option value="">{SongUILabels.AllArtists}</option>
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
                <LoadingState message={SongUILabels.LoadingLibrary} />
            ) : isError ? (
                <ErrorBanner title={SongUILabels.ErrorLoadingHeader} message={error.message} />
            ) : !songs || songs.length === 0 ? (
                <EmptyState message={selectedArtistId ? ArtistUILabels.EmptyDiscography : SongUILabels.EmptyLibrary} />
            ) : (
                <Table>
                        <TableHeader>
                                <TableHeadCell className="w-8/12 sm:w-6/12 md:w-5/12 lg:w-5/12">{SongUILabels.TableTitle}</TableHeadCell>
                                <TableHeadCell className="hidden sm:table-cell sm:w-4/12 md:w-4/12 lg:w-4/12">{SongUILabels.Artists}</TableHeadCell>
                                <TableHeadCell className="hidden md:table-cell text-right md:w-2/12 lg:w-2/12">{SongUILabels.TableDuration}</TableHeadCell>
                                <TableHeadCell className="text-right w-4/12 sm:w-2/12 md:w-1/12 lg:w-1/12">{CoreUILabels.TableActions}</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {songs.map((song) => (
                                <TableRow key={song.id}>
                                    <TableCell className="font-medium text-gray-900 truncate">
                                        <Link
                                            to={`/songs/${song.id}`}
                                            className="hover:text-blue-600 hover:underline transition-colors"
                                        >
                                            {song.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell truncate">
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
                                            <span className="text-gray-400 italic">{CoreUILabels.EmptyValueFallback}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">{song.duration}</TableCell>
                                    <TableCell className="text-right">
                                        <TableAction onClick={() => setEditingSong(song)}>
                                            {CoreUIButtons.Edit}
                                        </TableAction>
                                        
                                        <TableAction
                                            variant="danger"
                                            onClick={() => handleDelete(song.id, song.title)}
                                            disabled={isPending}
                                        >
                                            {isPending && variables === song.id ? CoreUIButtons.Deleting : CoreUIButtons.Delete}
                                        </TableAction>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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