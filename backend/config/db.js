const mongoose = require('mongoose')

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
}

module.exports = dbConnect
