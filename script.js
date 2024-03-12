const clientId = "2882f838873f4ecd98e6d20250f1934c";
// const redirectUri = "https://sowbyspencer.github.io/spotify/";
const redirectUri = "http://127.0.0.1:5500/index.html"

//Saved?

let accessToken;
let userId;

/**
 * The function `authorize` redirects the user to the Spotify authorization page
 * with specific parameters.
 */
const authorize = async () => {
    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=playlist-modify-public playlist-modify-private&response_type=token&state=123&show_dialog=true`;
    window.location.href = authorizeUrl;
};

/**
 * The function `getHashParams` extracts and decodes hash parameters from the URL
 * in JavaScript.
 * @returns The `getHashParams` function returns an object containing key-value
 * pairs parsed from the hash parameters in the URL of the current window.
 */
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

/**
 * The function `createPlaylist` in JavaScript fetches tracks from multiple
 * Spotify playlists, finds the common tracks, creates a new playlist with those
 * tracks, and adds them to the playlist.
 * @param e - The `e` parameter in your `createPlaylist` function is typically an
 * event object that represents an event that occurs in the DOM, such as a form
 * submission. In this case, it seems like the function is intended to handle a
 * form submission event, as indicated by `e.preventDefault()` at the
 */
const createPlaylist = async (e) => {
    e.preventDefault();
    const playlistInputs = document.querySelectorAll("#playlist-inputs input");
    const playlistUris = Array.from(playlistInputs).map((input) => input.value);

    // Initialize a set to store all the tracks
    let lists = [];
    let names = [];

    for (const playlistUri of playlistUris) {
        let id = playlistUri.split("/")[4].slice(0, 22)
        const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();

        // Extract the track IDs from the tracks and add them to the set
        trackUris = data.tracks.items.map((item) => item.track.uri);
        lists.push(trackUris);
        names.push(data.name);
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

    // let Q1 = intersection.slice(0, 25);
    let Q1 = intersection;



    /* This code snippet is checking if the value of the input field with the id
    "playlist-name" is empty. If the input field is empty (its length is 0), it
    assigns the current date and time in a human-readable format (using `new
    Date().toLocaleString()`) to the variable `pName`. This ensures that if the
    user does not provide a name for the playlist, the current date and time
    will be used as the default name. */
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
                description: `Songs that are on all selected playlists: ${names.join(', ')}`
            }),
        });



        const data = await res.json();
        const playlistId = data.id;


        /* The `try {` statement in JavaScript is used to start a block of code
        that will be tested for errors while it is being executed. If an error
        occurs within the `try` block, it will be caught by the subsequent
        `catch` block, allowing for error handling and recovery. */
        try {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${Q1.join(',')}`, {
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

/**
 * The `addPlaylistInput` function dynamically creates a label and input field for
 * entering a Spotify playlist URL.
 */
const addPlaylistInput = () => {
    const label = document.createElement("label");
    label.innerText = "Enter Spotify playlist URL";
    document.getElementById("playlist-inputs").appendChild(label);

    const input = document.createElement("input");
    input.type = "text"
    input.placeholder = "https://open.spotify.com/playlist/";
    document.getElementById("playlist-inputs").appendChild(input);
};

/* This block of code is an event listener that waits for the DOM content to be
fully loaded before executing the provided callback function. Once the DOM
content is loaded, it performs the following actions: */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-button").addEventListener("click", authorize);
    const params = getHashParams();
    accessToken = params.access_token;
    if (!accessToken) {
        document.getElementById("playlist-form").style.display = "none";
        console.log("No accessToken");
        responseEl.innerHTML = `No accessToken`;
    } else {
        document.getElementById("playlist-form").style.display = "block";
        document.getElementById("login-button").style.display = "none";
        fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                userId = data.id;
                document.getElementById("add-playlist").addEventListener("click", addPlaylistInput);
                document.getElementById("playlist-form").addEventListener("submit", createPlaylist);
            });
    }
});

