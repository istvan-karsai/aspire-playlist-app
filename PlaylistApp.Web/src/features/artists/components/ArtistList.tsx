import { useState } from "react";
import type { Artist } from "../types";
import { EditArtistModal } from "./EditArtistModal";
import { useArtists, useDeleteArtist } from "../hooks/useArtists";
import { Link } from "react-router-dom";
import { ArtistUILabels } from "../constants/uiText";
import { CoreUIButtons, CoreUILabels, CoreUIPrompts } from "../../../core/constants/uiText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Table, TableAction, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from "../../../components/ui/Table";

export const ArtistList = () => {
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

    const { data: artists, isLoading, isError, error } = useArtists();
    const { mutate: deleteArtist, isPending, variables } = useDeleteArtist();

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(CoreUIPrompts.ConfirmDelete(name))) {
            deleteArtist(id);
        }
    };

    if (isLoading) {
        return <LoadingState message={ArtistUILabels.LoadingArtistLibrary} />;
    }

    if (isError) {
        return <ErrorBanner title={ArtistUILabels.ErrorLoadingArtistsHeader} message={error.message} />;
    }

    if (!artists || artists.length === 0) {
        return <EmptyState message={ArtistUILabels.EmptyArtistLibrary} />;
    }
    
    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">{ArtistUILabels.ArtistLibraryHeader}</h2>
            <Table>
                    <TableHeader>
                            <TableHeadCell className="w-6/12 lg:w-3/12">{ArtistUILabels.TableName}</TableHeadCell>
                            <TableHeadCell className="hidden lg:table-cell lg:w-4/12">{ArtistUILabels.TableBio}</TableHeadCell>
                            <TableHeadCell className="hidden sm:table-cell sm:w-3/12">{ArtistUILabels.TableCountry}</TableHeadCell>
                            <TableHeadCell className="text-right w-3/12 sm:w-1/12">{ArtistUILabels.TableActiveFrom}</TableHeadCell>
                            <TableHeadCell className="text-right w-3/12 sm:w-2/12 lg:w-1/12">{CoreUILabels.TableActions}</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {artists.map((artist) => (
                            <TableRow key={artist.id}>
                                <TableCell className="font-medium text-gray-900 truncate">
                                    <Link
                                        to={`/artists/${artist.id}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        {artist.imageUrl && (
                                            <img 
                                                src={artist.imageUrl} 
                                                alt={artist.name} 
                                                className="w-8 h-8 rounded-full object-cover shrink-0 group-hover:opacity-80 transition-opacity" 
                                            />
                                        )}
                                        <span className="truncate group-hover:text-blue-600 group-hover:underline transition-colors">
                                            {artist.name}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell truncate">{artist.bio || CoreUILabels.EmptyValueFallback}</TableCell>
                                <TableCell className="hidden sm:table-cell truncate">{artist.country || CoreUILabels.EmptyValueFallback}</TableCell>
                                <TableCell className="text-right">{artist.activeFromYear || CoreUILabels.EmptyValueFallback}</TableCell>
                                <TableCell className="text-right">
                                    <TableAction onClick={() => setEditingArtist(artist)}>
                                        {CoreUIButtons.Edit}
                                    </TableAction>

                                    <TableAction
                                        variant="danger"
                                        onClick={() => handleDelete(artist.id, artist.name)}
                                        disabled={isPending}
                                    >
                                        {isPending && variables === artist.id ? CoreUIButtons.Deleting : CoreUIButtons.Delete}
                                    </TableAction>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            {editingArtist && (
                <EditArtistModal 
                    artist={editingArtist}
                    onClose={() => setEditingArtist(null)}
                />
            )}
        </div>
    )
};