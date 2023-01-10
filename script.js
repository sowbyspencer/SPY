const clientId = "2882f838873f4ecd98e6d20250f1934c";
const redirectUri = "https://sowbyspencer.github.io/SPY/";

let accessToken;
let userId;

const authorize = async () => {
    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=playlist-modify-public&response_type=token&state=123`;
    window.location.href = authorizeUrl;
};

const getHashParams = () => {
    const hashParams = {};
    let e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
};

const createPlaylist = async (e) => {
    e.preventDefault();
    const playlistInputs = document.querySelectorAll("#playlist-inputs input");
    const playlistUris = Array.from(playlistInputs).map((input) => input.value);

    // Initialize a set to store all the tracks
    let allTracks = new Set();

    for (const playlistUri of playlistUris) {
        const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistUri.split(":")[2]}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();

        // Extract the track IDs from the tracks and add them to the set
        const trackIds = data.items.map((item) => item.track.id);
        allTracks = new Set([...allTracks, ...trackIds]);
    }

    // Create a new playlist
    const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "Common Tracks",
            description: "Songs that are on all selected playlists"
        }),
    });
    const data = await res.json();
    const playlistId = data.id;

    // Add songs to the new playlist
    await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uris: [...allTracks],
            }),
        }
    );

    // Display success message
    const response = document.getElementById("response");
    response.innerHTML = "Playlist created successfully!";
    response.style.color = "green";
}

const addPlaylistInput = () => {
    const input = document.createElement("input");
    input.placeholder = "Enter Spotify playlist URI";
    document.getElementById("playlist-inputs").appendChild(input);
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-button").addEventListener("click", authorize);
    const params = getHashParams();
    accessToken = params.access_token;
    if (!accessToken) {
        document.getElementById("playlist-form").style.display = "none";
    } else {
        document.getElementById("playlist-form").style.display = "block";
        fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                userId = data.id;
                document
                    .getElementById("add-playlist")
                    .addEventListener("click", addPlaylistInput);
                document
                    .getElementById("playlist-form")
                    .addEventListener("submit", createPlaylist);
            });
    }
});

