import { ArtistForm } from "../components/ArtistForm";
import { ArtistList } from "../components/ArtistList";

export const ArtistsPage = () => {
    return (
        <div className="space-y-8">
            <ArtistForm />
            <ArtistList />
        </div>
    );
};