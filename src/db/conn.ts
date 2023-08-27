import mongoose from 'mongoose';

console.log(`Connecting to mongoDB...`);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

const conn = mongoose.connection.useDb('todo');;

conn.once('open', () => console.log(`MongoDB Connection successfull...`));

conn.on('error', (err) => {
  console.error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  process.exit();
});
