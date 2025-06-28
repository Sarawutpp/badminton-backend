// badminton_backend/app.js

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/players'); // <--- เพิ่มบรรทัดนี้
const sessionRoutes = require('./routes/sessions');

const app = express();
const port = process.env.PORT || 3000;

// เชื่อมต่อกับ MongoDB
connectDB();

// Middleware สำหรับ Parse JSON body ของ Request
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Badminton Organizer Backend API is running!');
});

app.use('/api/players', playerRoutes); // <--- เพิ่มบรรทัดนี้
app.use('/api/sessions', sessionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});