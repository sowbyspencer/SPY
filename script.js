const clientId = "2882f838873f4ecd98e6d20250f1934c";
const redirectUri = "https://sowbyspencer.github.io/spotify/";
// const redirectUri = "http://127.0.0.1:5500/index.html"

//Saved?

let accessToken;
let userId;

const authorize = async () => {
    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=playlist-modify-public playlist-modify-private&response_type=token&state=123&show_dialog=true`;
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
    let lists = [];

    for (const playlistUri of playlistUris) {
        const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistUri.split("/")[4]}/tracks`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();

        // Extract the track IDs from the tracks and add them to the set
        trackUris = data.items.map((item) => item.track.uri);
        lists.push(trackUris);
    }










    // const limit = 100; // Number of items per request
    // let offset = 0; // Initial index of the first item to retrieve

    // let allSongs = []; // Array to store all songs

    // // Function to retrieve songs
    // async function getSongs(accessToken, playlistUri) {

    //     try {
    //         let response = await fetch(`https://api.spotify.com/v1/playlists/${playlistUri.split("/")[4]}/tracks?limit=${limit}&offset=${offset}`, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });
    //         let data = await response.json();
    //         allSongs.push(data.items); // Add the retrieved songs to the array
    //         offset += limit;
    //         console.log(offset);
    //         if (data.next) {
    //             // If there's a next page, call the function again with the new offset
    //             getSongs(accessToken, playlistUri);
    //         }
    //         else {
    //             // Extract the track IDs from the tracks and add them to the set
    //             trackUris = allSongs.items.map((item) => item.track.uri);
    //             lists.push(trackUris);
    //         }
    //     } catch (error) {
    //         console.log('Error retrieving songs:', error);
    //     }
    // }








    // for (const playlistUri of playlistUris) {
    //     getSongs(accessToken, playlistUri);

    //     // Extract the track IDs from the tracks and add them to the set
    //     // trackUris = temp.items.map((item) => item.track.uri);
    //     // lists.push(trackUris);
    // }















    let intersection = lists[0];

    for (let i = 1; i < lists.length; i++) {
        intersection = intersection.filter(item => lists[i].includes(item));
    }



    let pName = document.getElementById("playlist-name").value;
    if (pName.length == 0) {
        pName = new Date().toLocaleString();
    }

    // Display success message
    const responseEl = document.getElementById("response");
    responseEl.innerHTML = "Playlist created successfully!";
    responseEl.style.color = "green";

    if (intersection.length != 0) {

        // Create a new playlist
        const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: pName,
                description: "Songs that are on all selected playlists"
            }),
        });



        const data = await res.json();
        const playlistId = data.id;


        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${intersection.join(',')}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            console.log('Songs added to playlist!');
            responseEl.innerHTML = `Playlist created successfully! Songs added to playlist <a href="http://open.spotify.com/playlist/${playlistId}" target="_blank" >${pName}</a>`;
        } catch (error) {
            console.log('Error adding songs to playlist:', error);
            responseEl.innerHTML = `Playlist created successfully! Error adding songs to playlist:, ${error}`;
        }
    }
    else {
        responseEl.innerHTML = `There were no songs that matched.`;
    }
}

const addPlaylistInput = () => {
    const input = document.createElement("input");
    input.type = "text"
    input.placeholder = "Enter Spotify playlist URI";
    document.getElementById("playlist-inputs").appendChild(input);
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-button").addEventListener("click", authorize);
    const params = getHashParams();
    accessToken = params.access_token;
    if (!accessToken) {
        document.getElementById("playlist-form").style.display = "none";
        console.log("No accessToken");
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

