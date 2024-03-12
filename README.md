# Common Tracks Playlist Creator

This project is a web application that creates a new Spotify playlist containing common tracks from multiple user-specified playlists.

## Features

- User authentication with Spotify
- Input fields for multiple Spotify playlist URLs
- Creation of a new playlist with common tracks
- Responsive design for desktop and mobile devices

## How to Use

1. Open the web application in your browser.
2. Click the "Login with Spotify" button to authenticate.
3. Enter the URLs of the Spotify playlists you want to compare in the input fields.
4. Click the "Add Playlist" button to add more input fields for additional playlists.
5. Enter a name for your new playlist in the designated field.
6. Click the "Create Playlist" button to generate a new playlist with common tracks.
7. A link to the newly created playlist will be displayed on the screen.

## Technology Stack

- HTML
- CSS
- JavaScript
- Spotify Web API

## Setup

To run this project locally, you'll need to have a Spotify Developer account and register your application to obtain a client ID. You'll also need to configure the redirect URI in your Spotify Developer Dashboard to match the one used in the application.

1. Clone the repository: git clone https://github.com/your-username/common-tracks-playlist.git
2. Open `script.js` and replace the `clientId` variable with your Spotify client ID.
3. Replace the `redirectUri` variable with your configured redirect URI.
4. Open `index.html` in your browser to start the application.