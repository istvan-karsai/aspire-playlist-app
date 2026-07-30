import { SongForm } from "../components/SongForm";
import { SongList } from "../components/SongList";

export const SongsPage = () => {
    return (
        <div className="space-y-8">
            <SongForm />
            <SongList />
        </div>
    );
};