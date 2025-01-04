//Backend/db.js
const mongoose = require('mongoose');

module.exports = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Could not connect to database:', error);
  }
};
