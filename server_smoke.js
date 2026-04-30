const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    members: { type: Number, required: true, min: 1 },
    room: { type: String, required: true, trim: true },
    offer: { type: String, default: 'None', trim: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    total: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'hb.html'));
});

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      members,
      room,
      offer,
      checkin,
      checkout,
      total
    } = req.body;

    const parsedTotal = Number(String(total).replace(/[^\d.]/g, ''));

    if (!name || !email || !phone || !members || !room || !checkin || !checkout || Number.isNaN(parsedTotal)) {
      return res.status(400).json({ error: 'Please provide all required booking fields.' });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      members: Number(members),
      room,
      offer: offer || 'None',
      checkin,
      checkout,
      total: parsedTotal
    });

    return res.status(201).json({ message: 'Booking saved', bookingId: booking._id });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
});

async function startServer() {
  if (!MONGODB_URI || MONGODB_URI.includes('PASTE_YOUR_MONGODB_ATLAS_URI_HERE')) {
    console.error('MONGODB_URI is missing or still using placeholder text. Update .env with your real MongoDB Atlas URI.');
    process.exit(1);
  }

  try {
    // await mongoose.connect(MONGODB_URI);
    console.log('Skipping MongoDB Atlas Connection');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
