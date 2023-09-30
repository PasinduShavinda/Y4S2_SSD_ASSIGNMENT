const mongoose = require("mongoose");
const config = require("../configs/index");
const logger = require("../utils/logger");

let database;

const dbconnect = async () => {
  const MONGODB_URL = config.DB_CONNECTION_STRING;

  if (database) return;
  
  mongoose.set('strictQuery', false);
  mongoose
    .connect(MONGODB_URL)
    .then((connection) => {
      database = connection;
      logger.info("🔄 Database Synced");
    })
    .catch((err) => {
      logger.error(`⚠️ ${err.message}`);
    });
};

module.exports = { dbconnect };
