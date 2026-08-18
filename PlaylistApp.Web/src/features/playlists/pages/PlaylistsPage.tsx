import { PlaylistForm } from "../components/PlaylistForm";
import { PlaylistList } from "../components/PlaylistList";

export const PlaylistsPage = () => {
    return (
        <div className="space-y-8">
            <PlaylistForm />
            <PlaylistList />
        </div>
    );
};