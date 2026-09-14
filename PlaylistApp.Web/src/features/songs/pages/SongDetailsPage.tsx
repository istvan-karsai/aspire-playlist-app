import { Link, useParams } from "react-router-dom";
import { useSong } from "../hooks/useSongs";
import { SongUILabels } from "../constants/uiText";

export const SongDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: song, isLoading, isError } = useSong(id);

    if (isLoading) {
        return <div className="text-gray-500 py-8">{SongUILabels.LoadingSongDetails}</div>;
    }

    if (isError || !song) {
        return <div className="text-red-500 py-8">{SongUILabels.ErrorLoadingSong}</div>;
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <Link
                    to="/songs"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
                >
                    &larr; {SongUILabels.BackToSongs}
                </Link>

                <h3 className="text-2xl leading-6 font-bold text-gray-900">
                    {song.title}
                </h3>

                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {SongUILabels.TableDuration}: {song.duration}
                </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">{SongUILabels.Artists}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {song.artists && song.artists.length > 0 ? (
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {song.artists.map((artist) => (
                                        <li key={artist.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <Link
                                                    to={`/artists/${artist.id}`}
                                                    className="ml-2 flex-1 w-0 truncate font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {artist.name}
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-gray-400 italic">{SongUILabels.EmptyArtistsList}</span>
                            )}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};