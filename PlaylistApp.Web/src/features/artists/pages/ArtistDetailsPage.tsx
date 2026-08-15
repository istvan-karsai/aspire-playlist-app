import { Link, useParams } from "react-router-dom";
import { useArtist } from "../hooks/useArtists";
import { useSongs } from "../../songs/hooks/useSongs";
import { UILabels } from "../../../constants/uiText";

export const ArtistDetailsPage = () => {
    const { id } = useParams<{ id: string}>();

    const { data: artist, isLoading: isArtistsLoading, isError: isArtistError } = useArtist(id);

    const { data: songs, isLoading: isSongsLoading, isError: isSongsError } = useSongs(id);

    if (isArtistsLoading || isSongsLoading) {
        return <div className="text-gray-500 py-8">{UILabels.LoadingArtistDetails}</div>
    }

    if (isArtistError || !artist) {
        return <div className="text-red-500 py-8">{UILabels.ErrorLoadingArtistProfile}</div>
    }

    if (isSongsError) {
        return <div className="text-red-500 py-8">{UILabels.ErrorLoadingDiscography}</div>
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <Link
                    to="/artists"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
                >
                    &larr; {UILabels.BackToArtists}
                </Link>

                <h3 className="text-2xl leading-6 font-bold text-gray-900">
                    {artist.name}
                </h3>

                {artist.country && (
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {artist.country} • {UILabels.ActiveSince} {artist.activeFromYear}
                    </p>
                )}
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {artist.bio && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">{UILabels.Biography}</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {artist.bio}
                            </dd>
                        </div>
                    )}

                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">{UILabels.Discography} ({songs?.length || 0})</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {songs && songs.length > 0 ? (
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {songs.map((song) => (
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
                                <span className="text-gray-500 italic">{UILabels.EmptyDiscography}</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};