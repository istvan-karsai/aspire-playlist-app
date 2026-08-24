import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPlaylist, deletePlaylist, fetchPlaylistById, fetchPlaylists, updatePlaylist } from "../api/playlistsClient";
import type { PlaylistPayload } from "../types";
import { PlaylistApiMessages } from "../constants/uiText";

export const usePlaylists = () => {
    return useQuery({
        queryKey: ['playlists'],
        queryFn: fetchPlaylists
    });
};

export const usePlaylist = (id: string) => {
    return useQuery({
        queryKey: ['playlists', id],
        queryFn: () => fetchPlaylistById(id!),
        enabled: !!id,
    });
};

export const useCreatePlaylist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPlaylist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
        },
    });
};

export const useUpdatePlaylist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: PlaylistPayload }) => updatePlaylist(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
        },
    });
};

export const useDeletePlaylist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePlaylist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
        },
        onError: (err) => {
            alert(PlaylistApiMessages.DeletePlaylistError(err.message));
        }
    });
};