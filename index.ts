import express from 'express';
import bodyParser from 'body-parser';
import cinemaRoutes from './routes/cinemaRoutes';
import { notFound } from './controller/errorController';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017'; // Replace with your MongoDB URI and database name

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

app.use('/cinemas', cinemaRoutes);
app.use(notFound);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
