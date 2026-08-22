export interface Artist {
    id: string;
    name: string;
    bio?: string;
    activeFromYear?: number;
    country?: string;
    imageUrl?: string;
}

export type ArtistPayload = Omit<Artist, 'id'>;