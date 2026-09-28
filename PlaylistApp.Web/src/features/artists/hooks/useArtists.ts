import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createArtist, deleteArtist, fetchArtistById, fetchArtists, updateArtist } from "../api/artistsClient";
import type { ArtistPayload } from "../types";
import { ArtistApiMessages } from "../constants/uiText";
import { artistKeys } from "../../../core/api/config";

export const useArtists = () => {
    return useQuery({
        queryKey: artistKeys.all,
        queryFn: fetchArtists,
    });
};

export const useArtist = (id: string | undefined) => {
    return useQuery({
        queryKey: id ? artistKeys.detail(id) : artistKeys.all,
        queryFn: () => {
            if (!id) throw new Error(ArtistApiMessages.IdRequired);
            return fetchArtistById(id);
        },
        enabled: !!id,
    });
}; 

export const useCreateArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createArtist,
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: artistKeys.all });
        },
    });
};

export const useUpdateArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ArtistPayload }) => updateArtist(id, payload),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: artistKeys.all });
        },
    });
};

export const useDeleteArtist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteArtist,
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: artistKeys.all });
        }
    });
};