import express from 'express';
import 'dotenv/config';
import imageRoutes from './routes/imageRoute.js';
import connectDB from './config/db_connect.js';
import connectCloudinary from './config/cloudinary_connect.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json());
app.use('/api/image', imageRoutes);

app.get('/', function(req, res) {
  res.send("Backend Working very well!");
});

app.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});