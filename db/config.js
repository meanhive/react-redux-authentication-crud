module.exports = {
  dbUri: process.env.DB_URI || require("../config.json").db,
};
