import { Link, useParams } from "react-router-dom";
import { usePlaylist } from "../hooks/usePlaylists";
import { PlaylistUILabels } from "../constants/uiText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { DetailCard, DetailCardHeader, DetailCardList, DetailCardListItem, DetailRelationList, DetailRelationListItem } from "../../../components/ui/DetailCard";

export const PlaylistDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: playlist, isLoading: isPlaylistLoading, isError: isPlaylistError, error: playlistError } = usePlaylist(id!);

    if (isPlaylistLoading) {
        return <LoadingState message={PlaylistUILabels.LoadingPlaylistDetails} />;
    }

    if (isPlaylistError) {
        return <ErrorBanner title={PlaylistUILabels.ErrorLoadingPlaylistProfile} message={playlistError.message} />;
    }

    if (!playlist) return null;

    return (
        <DetailCard>
            <DetailCardHeader 
                title={playlist.name}
                backTo="/playlists"
                backLabel={PlaylistUILabels.BackToPlaylists}
            />
            <DetailCardList>
                {playlist.description && (
                    <DetailCardListItem label={PlaylistUILabels.Description}>
                        {playlist.description}
                    </DetailCardListItem>
                )}

                <DetailCardListItem label={`${PlaylistUILabels.Tracks} (${playlist.songs.length})`}>
                    <DetailRelationList isEmpty={playlist.songs.length === 0} emptyMessage={PlaylistUILabels.EmptyTracks}>
                        {playlist.songs.map((song) => (
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