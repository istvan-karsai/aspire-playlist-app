import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSong, deleteSong, fetchSongById, fetchSongs, updateSong } from "../api/songsClient";
import type { SongPayload } from "../types";
import { SongApiMessages } from "../constants/uiText";
import { songKeys } from "../../../core/api/config";

export const useSongs = (artistId?: string) => {
    return useQuery({
        queryKey: songKeys.list(artistId),
        queryFn: () => fetchSongs(artistId),
    });
};

export const useSong = (id: string | undefined) => {
    return useQuery({
        queryKey: id ? songKeys.detail(id) : songKeys.all,
        queryFn: () => {
            if (!id) throw new Error(SongApiMessages.IdRequired);
            return fetchSongById(id);
        },
        enabled: !!id,
    });
}; 

export const useCreateSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSong,
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: songKeys.all });
        },
    });
};

export const useUpdateSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: SongPayload }) => updateSong(id, payload),
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: songKeys.all });
        },
    });
};

export const useDeleteSong = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSong,
        onSuccess: () => {
            return queryClient.invalidateQueries({ queryKey: songKeys.all });
        }
    });
};