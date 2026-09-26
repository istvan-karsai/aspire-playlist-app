import { Link, useParams } from "react-router-dom";
import { useSong } from "../hooks/useSongs";
import { SongUILabels } from "../constants/uiText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { DetailCard, DetailCardHeader, DetailCardList, DetailCardListItem, DetailRelationList, DetailRelationListItem } from "../../../components/ui/DetailCard";

export const SongDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: song, isLoading, isError, error } = useSong(id);

    if (isLoading) {
        return <LoadingState message={SongUILabels.LoadingSongDetails} />;
    }

    if (isError) {
        return <ErrorBanner title={SongUILabels.ErrorLoadingSong} message={error.message} />;
    }

    if (!song) return null;

    return (
        <DetailCard>
            <DetailCardHeader
                title={song.title}
                subtitle={`${SongUILabels.TableDuration}: ${song.duration}`}
                backTo="/songs"
                backLabel={SongUILabels.BackToSongs}
            />
            <DetailCardList>
                <DetailCardListItem label={SongUILabels.Artists}>
                    <DetailRelationList isEmpty={!song.artists || song.artists.length === 0} emptyMessage={SongUILabels.EmptyArtistsList}>
                        {song.artists?.map((artist) => (
                            <DetailRelationListItem key={artist.id}>
                                <Link
                                    to={`/artists/${artist.id}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                    {artist.name}
                                </Link>
                            </DetailRelationListItem>
                        ))}
                    </DetailRelationList>
                </DetailCardListItem>
            </DetailCardList>
        </DetailCard>
    );
};