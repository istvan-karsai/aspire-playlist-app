import { useQuery } from "@tanstack/react-query";
import { fetchArtistById, fetchArtists } from "../api/artistsClient";

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