import type { Song } from '../types';
import { useState } from 'react';
import { EditSongModal } from './EditSongModal';
import { useDeleteSong, useSongs } from '../hooks/useSongs';
import { Link, useSearchParams } from 'react-router-dom';
import { useArtists } from '../../artists/hooks/useArtists';
import { SongQueryParams, SongUILabels } from '../constants/uiText';
import { CoreUIButtons, CoreUILabels, CoreUIPrompts } from '../../../core/constants/uiText';
import { ArtistUILabels } from '../../artists/constants/uiText';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';
import { EmptyState } from '../../../components/ui/EmptyState';
import {
  Table,
  TableAction,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
} from '../../../components/ui/Table';
import { ROUTES } from '../../../core/constants/routes';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export const SongList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [songToDelete, setSongToDelete] = useState<{ id: string; title: string } | null>(null);

  const selectedArtistId = searchParams.get(SongQueryParams.ArtistId) || '';

  const { data: songs, isLoading, isError, error } = useSongs(selectedArtistId || undefined);
  const { data: artists } = useArtists();
  const { mutate: deleteSong, isPending, variables } = useDeleteSong();

  const confirmDelete = () => {
    if (!songToDelete) return;

    deleteSong(songToDelete.id, {
      onSuccess: () => setSongToDelete(null),
    });
  };

  const handleArtistFilterChange = (artistId: string) => {
    setSearchParams(
      (prevParams) => {
        if (artistId) {
          prevParams.set(SongQueryParams.ArtistId, artistId);
        } else {
          prevParams.delete(SongQueryParams.ArtistId);
        }
        return prevParams;
      },
      { replace: true },
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Header & Filter Section - Always Visible */}
      <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-semibold tracking-tight">{SongUILabels.LibraryHeader}</h2>
        <div className="w-full sm:w-64">
          <label htmlFor="artist-filter" className="sr-only">
            {SongUILabels.FilterByArtist}
          </label>
          <select
            id="artist-filter"
            value={selectedArtistId}
            onChange={(e) => handleArtistFilterChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm"
          >
            <option value="">{SongUILabels.AllArtists}</option>
            {artists?.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conditionally Rendered Content Area */}
      {isLoading ? (
        <LoadingState message={SongUILabels.LoadingLibrary} />
      ) : isError ? (
        <ErrorBanner title={SongUILabels.ErrorLoadingHeader} message={error.message} />
      ) : !songs || songs.length === 0 ? (
        <EmptyState
          message={selectedArtistId ? ArtistUILabels.EmptyDiscography : SongUILabels.EmptyLibrary}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHeadCell className="w-8/12 sm:w-6/12 md:w-5/12 lg:w-5/12">
              {SongUILabels.TableTitle}
            </TableHeadCell>
            <TableHeadCell className="hidden sm:table-cell sm:w-4/12 md:w-4/12 lg:w-4/12">
              {SongUILabels.Artists}
            </TableHeadCell>
            <TableHeadCell className="hidden text-right md:table-cell md:w-2/12 lg:w-2/12">
              {SongUILabels.TableDuration}
            </TableHeadCell>
            <TableHeadCell className="w-4/12 text-right sm:w-2/12 md:w-1/12 lg:w-1/12">
              {CoreUILabels.TableActions}
            </TableHeadCell>
          </TableHeader>
          <TableBody>
            {songs.map((song) => (
              <TableRow key={song.id}>
                <TableCell className="truncate font-medium text-gray-900">
                  <Link
                    to={ROUTES.SONG_DETAILS(song.id)}
                    className="transition-colors hover:text-blue-600 hover:underline"
                  >
                    {song.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden truncate sm:table-cell">
                  {song.artists && song.artists.length > 0 ? (
                    song.artists.map((artist, index) => (
                      <span key={artist.id}>
                        <Link
                          to={ROUTES.ARTIST_DETAILS(artist.id)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {artist.name}
                        </Link>
                        {index < song.artists.length - 1 && ', '}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">{CoreUILabels.EmptyValueFallback}</span>
                  )}
                </TableCell>
                <TableCell className="hidden text-right md:table-cell">{song.duration}</TableCell>
                <TableCell className="text-right">
                  <TableAction onClick={() => setEditingSong(song)}>
                    {CoreUIButtons.Edit}
                  </TableAction>

                  <TableAction
                    variant="danger"
                    onClick={() => setSongToDelete({ id: song.id, title: song.title })}
                    disabled={isPending}
                  >
                    {isPending && variables === song.id
                      ? CoreUIButtons.Deleting
                      : CoreUIButtons.Delete}
                  </TableAction>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editingSong && <EditSongModal song={editingSong} onClose={() => setEditingSong(null)} />}

      <ConfirmDialog
        isOpen={songToDelete !== null}
        title={SongUILabels.DeleteSongHeader}
        message={songToDelete ? CoreUIPrompts.ConfirmDelete(songToDelete.title) : ''}
        onConfirm={confirmDelete}
        onCancel={() => setSongToDelete(null)}
        isPending={isPending}
      />
    </div>
  );
};
