# ✈️ TripMate — Smart Trip Planner

A responsive and interactive **Smart Trip Planner** built with **HTML, CSS, and Vanilla JavaScript**.

This project was created to practice and demonstrate practical JavaScript concepts, including DOM manipulation, arrays, objects, functions, array methods, LocalStorage, Fetch API, Async/Await, API integration, date logic, filtering, searching, and dynamic UI updates.

## 🚀 Features

- 🗺️ Create trips with destination, trip type, dates, and budget
- 📍 Automatic activity suggestions based on destination
- 🌦️ Real-time weather information using an API
- 💰 Automatic budget and expense calculations
- 📅 Automatic trip duration calculation
- 📝 Add suggested activities to your itinerary
- 🔎 Search activities
- 🏷️ Filter activities by category
- ✅ Mark activities as completed
- 📊 Track trip completion progress
- 💾 Save trip data using LocalStorage
- 🗑️ Delete and reset the current trip
- 📱 Responsive design

## 🛠️ Technologies Used

- **HTML5** — Page structure
- **CSS3** — Styling and responsive design
- **JavaScript (ES6+)** — Application logic and DOM manipulation
- **Fetch API** — Fetching weather data
- **Open-Meteo API** — Weather information
- **LocalStorage** — Saving trip data
- **Async/Await** — Handling asynchronous API requests
- **JSON** — Handling API and stored data

## 🧠 JavaScript Concepts Practiced

This project helped me strengthen:

- `getElementById()`
- `querySelector()`
- `textContent`
- `innerHTML`
- `createElement()`
- `append()`
- `classList`
- `addEventListener()`
- Arrays
- Objects
- Functions
- Conditional statements
- Template literals
- `forEach()`
- `map()`
- `filter()`
- `find()`
- `some()`
- `reduce()`
- `Date`
- `localStorage`
- `JSON.stringify()`
- `JSON.parse()`
- `fetch()`
- `async`
- `await`
- `try...catch`
- Dynamic DOM manipulation

## 🌐 API Integration

TripMate uses the **Open-Meteo API** to fetch current weather information for the selected destination.

The API flow works like this:

```text
User selects destination
        ↓
Find destination coordinates
        ↓
Create API URL
        ↓
fetch()
        ↓
await response
        ↓
Convert response to JSON
        ↓
Extract weather data
        ↓
Update the DOM
