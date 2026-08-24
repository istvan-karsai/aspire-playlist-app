import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSong, deleteSong, fetchSongs, updateSong } from "../api/songsClient";
import type { SongPayload } from "../types";
import { SongApiMessages } from "../constants/uiText";

export const useSongs = (artistId?: string) => {
    return useQuery({
        queryKey: ['songs', { artistId }],
        queryFn: () => fetchSongs(artistId),
    });
};

export const useCreateSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });
        },
    });
};

export const useUpdateSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: SongPayload }) => updateSong(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });
        },
    });
};

export const useDeleteSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['songs'] });
        },
        onError: (err) => {
            alert(SongApiMessages.DeleteError(err.message));
        }
    });
};