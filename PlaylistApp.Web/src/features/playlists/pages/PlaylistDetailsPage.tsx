import { Link, useParams } from "react-router-dom";
import { usePlaylist } from "../hooks/usePlaylists";
import { PlaylistUILabels } from "../constants/uiText";

export const PlaylistDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: playlist, isLoading: isPlaylistLoading, isError: isPlaylistError } = usePlaylist(id!);

    if (isPlaylistLoading) {
        return <div className="text-gray-500 py-8">{PlaylistUILabels.LoadingPlaylistDetails}</div>;
    }

    if (isPlaylistError || !playlist) {
        return <div className="text-red-500 py-8">{PlaylistUILabels.ErrorLoadingPlaylistProfile}</div>;
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <Link
                    to="/playlists"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
                >
                    &larr; {PlaylistUILabels.BackToPlaylists}
                </Link>

                <h3 className="text-2xl leading-6 font-bold text-gray-900">
                    {playlist.name}
                </h3>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {playlist.description && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">{PlaylistUILabels.Description}</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {playlist.description}
                            </dd>
                        </div>
                    )}

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">{PlaylistUILabels.Tracks} ({playlist.songs.length})</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {playlist.songs.length > 0 ? (
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {playlist.songs.map((song) => (
                                        <li key={song.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <span className="ml-2 flex-1 w-0 truncate font-medium">
                                                    {song.title}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-gray-500 italic">{PlaylistUILabels.EmptyTracks}</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};