import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { useMediaPlayer } from "./3_useMediaPlayer";
import { HomePage } from "./4_HomePage";
import { createNewPlaylist, uploadMusicTracks } from "./5_actions";
import { PlaylistPage } from "./6_PlaylistPage";
import { InvitePage } from "./7_InvitePage";
import { Button } from "./basicComponents/Button";
import { FileUploadButton } from "./basicComponents/FileUploadButton";
import { PlayerControls } from "./components/PlayerControls";
import "./index.css";

import { MusicaAccount } from "@/1_schema";
import { createJazzReactContext, DemoAuth } from "jazz-react";

export const Jazz = createJazzReactContext({
    auth: DemoAuth({ appName: "Musica Jazz", accountSchema: MusicaAccount }),
    peer: `wss://mesh.jazz.tools/?key=example@email.com`,
});

export const { useAccount, useCoState, useAcceptInvite } = Jazz;

function Main() {
    const mediaPlayer = useMediaPlayer();

    const { me } = useAccount();

    async function handleFileLoad(files: FileList) {
        if (!me) return;

        await uploadMusicTracks(me, files);
    }

    async function handleCreatePlaylist() {
        if (!me) return;

        const playlist = await createNewPlaylist(me);

        router.navigate(`/playlist/${playlist.id}`);
    }

    const router = createHashRouter([
        {
            path: "/",
            element: <HomePage mediaPlayer={mediaPlayer} />,
        },
        {
            path: "/playlist/:playlistId",
            element: <PlaylistPage mediaPlayer={mediaPlayer} />,
        },
        {
            path: "/invite/*",
            element: <InvitePage />,
        },
    ]);

    return (
        <>
            <div className="flex items-center bg-gray-300">
                <img src="jazz-logo.png" className="px-3 h-[20px]" />
                <div className="text-nowrap">Jazz music player</div>
                <div className="flex w-full gap-1 justify-end">
                    <FileUploadButton onFileLoad={handleFileLoad}>
                        Add file
                    </FileUploadButton>
                    <Button onClick={handleCreatePlaylist}>
                        Create new playlist
                    </Button>
                </div>
            </div>
            <RouterProvider router={router} />
            <PlayerControls mediaPlayer={mediaPlayer} />
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Jazz.Provider>
            <Main />
        </Jazz.Provider>
    </React.StrictMode>,
);
