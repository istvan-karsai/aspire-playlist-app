import { Link, useParams } from "react-router-dom";
import { useArtist } from "../hooks/useArtists";
import { useSongs } from "../../songs/hooks/useSongs";
import { ArtistUILabels } from "../constants/uiText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { DetailCard, DetailCardHeader, DetailCardList, DetailCardListItem, DetailRelationList, DetailRelationListItem } from "../../../components/ui/DetailCard";

export const ArtistDetailsPage = () => {
    const { id } = useParams<{ id: string}>();

    const { data: artist, isLoading: isArtistsLoading, isError: isArtistError, error: artistError } = useArtist(id);
    const { data: songs, isLoading: isSongsLoading, isError: isSongsError, error: songsError } = useSongs(id);

    if (isArtistsLoading || isSongsLoading) {
        return <LoadingState message={ArtistUILabels.LoadingArtistDetails} />;
    }
    
    if (isArtistError) {
        return <ErrorBanner title={ArtistUILabels.ErrorLoadingArtistProfile} message={artistError.message} />;
    }

    if (isSongsError) {
        return <ErrorBanner title={ArtistUILabels.ErrorLoadingDiscography} message={songsError.message} />;
    }

    if (!artist) return null;

    return (
        <DetailCard>
            <DetailCardHeader 
                title={artist.name}
                subtitle={artist.country ? `${artist.country} • ${ArtistUILabels.ActiveSince} ${artist.activeFromYear}` : undefined}
                backTo="/artists"
                backLabel={ArtistUILabels.BackToArtists}
            />

            <DetailCardList>
                {artist.bio && (
                    <DetailCardListItem label={ArtistUILabels.Biography}>
                        {artist.bio}
                    </DetailCardListItem>
                )}

                <DetailCardListItem label={`${ArtistUILabels.Discography} (${songs?.length || 0})`}>
                    <DetailRelationList isEmpty={!songs || songs.length === 0} emptyMessage={ArtistUILabels.EmptyDiscography}>
                        {songs?.map((song) => (
                            <DetailRelationListItem key={song.id}>
                                <Link
                                    to={`/songs/${song.id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                    {song.title}
                                </Link>
                            </DetailRelationListItem>
                        ))}
                    </DetailRelationList>
                </DetailCardListItem>
            </DetailCardList>
        </DetailCard>
    );
};