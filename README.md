# TripMate — Smart Travel Planner

A responsive trip planner built with **HTML, CSS, and vanilla JavaScript**.

## Features
- Create trips with destination, dates, travelers, budget, and travel style
- Automatic trip duration and personalized daily activity ideas
- Destination-specific suggestions for selected locations
- Live **current** destination weather via Open-Meteo (not a future-trip forecast)
- Save, view, and delete trips using browser LocalStorage
- Download a text itinerary or print it
- Mobile-friendly design and form validation

## Run locally
Open `index.html` in your browser. No installation or API key required. For best results, use the VS Code Live Server extension.

## Deploy to GitHub Pages
1. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
2. Open your repository's **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

## Notes
- Trips are stored in the browser where they were created; they do not sync across devices.
- Open-Meteo weather and Google Fonts require an internet connection.
- Itinerary activities are suggestions and should be verified before visiting.
