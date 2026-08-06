import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Artist } from "../types/artist";
import { deleteArtist } from "../api/client";
import { ApiMessages, UIButtons, UILabels, UIPrompts } from "../constants/uiText";
import { EditArtistModal } from "./EditArtistModal";
import { useArtists } from "../hooks/useArtists";
import { Link } from "react-router-dom";

export const ArtistList = () => {
    const queryClient = useQueryClient();
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

    const { data: artists, isLoading, isError, error } = useArtists();

    const deleteMutation = useMutation({
        mutationFn: deleteArtist,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['artists'] });
        },
        onError: (err) => {
            alert(ApiMessages.DeleteArtistError(err.message));
        },
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(UIPrompts.ConfirmDelete(name))) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center p-10 text-gray-500 w-full">
                <span className="animate-pulse">{UILabels.LoadingArtistLibrary}</span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="bg-red-500 text-red-700 p-4 rounded-lg border border-red-200 w-full">
                <h3 className="font-bold">{UILabels.ErrorLoadingArtistsHeader}</h3>
                <p className="text-sm">{(error as Error).message}</p>
            </div>
        )
    }

    if (!artists || artists.length === 0) {
        return (
            <div className="text-center p-10 bg-gray-50 rounded-lg border border-dashed text-gray-500 w-full">
                {UILabels.EmptyArtistLibrary}
            </div>
        )
    }
    
    return (
        <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">{UILabels.ArtistLibraryHeader}</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <table className="w-full min-w-full text-sm table-fixed">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-3/12">{UILabels.TableName}</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-4/12">{UILabels.TableBio}</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-2/12">{UILabels.TableActiveFrom}</th>
                            <th className="h-12 px-4 text-left font-medium text-gray-500 w-2/12">{UILabels.TableCountry}</th>
                            <th className="h-12 px-4 text-right font-medium text-gray-500 w-1/12">{UILabels.TableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {artists.map((artist) => (
                            <tr key={artist.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900 truncate">
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
                                </td>
                                <td className="p-4 text-gray-600 truncate">{artist.bio || "-"}</td>
                                <td className="p-4 text-gray-600">{artist.activeFromYear || "-"}</td>
                                <td className="p-4 text-gray-600 truncate">{artist.country || "-"}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setEditingArtist(artist)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        {UIButtons.Edit}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(artist.id, artist.name)}
                                        disabled={deleteMutation.isPending}
                                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        {deleteMutation.isPending && deleteMutation.variables === artist.id ? UIButtons.Deleting : UIButtons.Delete}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingArtist && (
                <EditArtistModal 
                    artist={editingArtist}
                    onClose={() => setEditingArtist(null)}
                />
            )}
        </div>
    )
};