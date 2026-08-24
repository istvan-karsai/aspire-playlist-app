import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createArtist, deleteArtist, fetchArtistById, fetchArtists, updateArtist } from "../api/artistsClient";
import type { ArtistPayload } from "../types";
import { ArtistApiMessages } from "../constants/uiText";

export const useArtists = () => {
    return useQuery({
        queryKey: ['artists'],
        queryFn: fetchArtists,
    });
};

export const useArtist = (id: string | undefined) => {
    return useQuery({
        queryKey: ['artists', id],
        queryFn: () => fetchArtistById(id!),
        enabled: !!id,
    });
}; 

export const useCreateArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createArtist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artists'] });
        },
    });
};

export const useUpdateArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ArtistPayload }) => updateArtist(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artists'] });
        },
    });
};

export const useDeleteArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteArtist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['artists'] });
        },
        onError: (err) => {
            alert(ArtistApiMessages.DeleteArtistError(err.message));
        }
    });
};