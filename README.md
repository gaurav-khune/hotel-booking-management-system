# Hotel-Booking

## What this project now includes

This project keeps your existing HTML/CSS design and adds two things:

1. A Node.js + Express backend that saves bookings to MongoDB Atlas.
2. A separate 3D room preview page built with Three.js.

## Folder structure

```text
hb.html
hb.css
hb.js
room-3d.html
room-3d.css
room-3d.js
server.js
server_smoke.js
package.json
.env.example
```

## How frontend and backend work together

When a user fills the booking form and clicks Confirm Booking, the browser sends the form data to `POST /api/bookings` using `fetch()`.

The Express server receives that data, validates it, and stores it in MongoDB Atlas with Mongoose.

In simple terms:

1. Frontend collects booking details.
2. JavaScript sends the details to the server.
3. Server saves them in MongoDB Atlas.
4. Server returns a success message.

## Setup steps

1. Install dependencies:

	```bash
	npm install
	```

2. Create a `.env` file in the project root.

3. Copy the value structure from `.env.example` and paste your MongoDB Atlas connection string into `MONGODB_URI`.

4. Start the backend:

	```bash
	npm start
	```

5. Open `http://localhost:3000` in your browser.

## What the new 3D page does

The new `room-3d.html` page shows a modeled bedroom plus a balcony. Use the arrow keys to move and turn smoothly.

## Notes for beginners

The booking modal is still the same UI. The only change in the room cards is a new `View 3D` button under each `Book now` button.