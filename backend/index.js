const connectToDatabase = require('./utils/database');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

// Connect to the MongoDB database
connectToDatabase();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});