import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { ArtistDetailsPage } from "./ArtistDetailsPage";
import { mockValidArtist } from "../tests/artistMocks";
import { server } from "../../../tests/mocks/server";
import { mockValidSong } from "../../songs/tests/songMocks";
import { ArtistUILabels } from "../constants/uiText";
import { API_ENDPOINTS } from "../../../core/api/config";
import { renderWithRouteParams } from "../../../tests/utils/test-utils";

const renderArtistDetailsPage = (artistId: string) => {
    return renderWithRouteParams(<ArtistDetailsPage />, {
        routePath: "/artists/:id",
        initialUrl: `/artists/${artistId}`
    });
};

describe('ArtistDetailsPage Component', () => {
    it('displays a loading indicator while fetching data', () => {
        renderArtistDetailsPage(mockValidArtist.id);

        expect(screen.getByText(ArtistUILabels.LoadingArtistDetails)).toBeInTheDocument();
    });

    it('displays an error message if the artist fetch fails', async () => {
        server.use(
            http.get(`${API_ENDPOINTS.artists}/:id`, () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderArtistDetailsPage(mockValidArtist.id);

        expect(await screen.findByText(ArtistUILabels.ErrorLoadingArtistProfile)).toBeInTheDocument();
    });

    it('displays the artist profile and discography on successful fetch', async () => {
        renderArtistDetailsPage(mockValidArtist.id);

        expect(await screen.findByText(mockValidArtist.name)).toBeInTheDocument();
        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: new RegExp(ArtistUILabels.BackToArtists, 'i') })).toBeInTheDocument();
    });

    it('displays an empty discography message if the artist has no songs', async () => {
        server.use(
            http.get(API_ENDPOINTS.songs, () => {
                return HttpResponse.json([]);
            })
        );

        renderArtistDetailsPage(mockValidArtist.id);

        expect(await screen.findByText(mockValidArtist.name)).toBeInTheDocument();
        expect(screen.getByText(ArtistUILabels.EmptyDiscography)).toBeInTheDocument();
    });
});