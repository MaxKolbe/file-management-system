import mongoose from 'mongoose';

mongoose.connection.on('connected', () => {
  console.log(`Connected to the mongodb database successfully \n`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Database connection error: ${err}`);
});

export const connectToDb = async () => {
  await mongoose.connect(process.env.DATABASEURL as string);
};
