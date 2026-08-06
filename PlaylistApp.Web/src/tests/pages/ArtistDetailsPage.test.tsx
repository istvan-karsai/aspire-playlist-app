import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ArtistDetailsPage } from "../../pages/ArtistDetailsPage";
import { describe, expect, it } from "vitest";
import { mockValidArtist, mockValidSong } from "../mocks/mockData";
import { UILabels } from "../../constants/uiText";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

const renderArtistDetailsPage = (artistId: string) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            {/* initialEntries simulates the user navigating directly to this URL */}
            <MemoryRouter initialEntries={[`/artists/${artistId}`]}>
                <Routes>
                    <Route path="/artists/:id" element={<ArtistDetailsPage />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('ArtistDetailsPage Component', () => {
    it('displays a loading indicator while fetching data', () => {
        renderArtistDetailsPage(mockValidArtist.id);

        expect(screen.getByText(UILabels.LoadingArtistDetails)).toBeInTheDocument();
    });

    it('displays an error message if the artist fetch fails', async () => {
        server.use(
            http.get('/api/artists/:id', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        renderArtistDetailsPage(mockValidArtist.id);

        expect(await screen.findByText(UILabels.ErrorLoadingArtistProfile)).toBeInTheDocument();
    });

    it('displays the artist profile and discography on successful fetch', async () => {
        renderArtistDetailsPage(mockValidArtist.id);

        expect(await screen.findByText(mockValidArtist.name)).toBeInTheDocument();
        expect(await screen.findByText(mockValidSong.title)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: new RegExp(UILabels.BackToArtists, 'i') })).toBeInTheDocument();
    });

    it('displays an empty discography message if the artist has no songs', async () => {
        server.use(
            http.get('/api/songs', () => {
                return HttpResponse.json([]);
            })
        );

        renderArtistDetailsPage(mockValidArtist.id);

        expect(await screen.findByText(mockValidArtist.name)).toBeInTheDocument();
        expect(screen.getByText(UILabels.EmptyDiscography)).toBeInTheDocument();
    });
});