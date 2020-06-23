const mongoose = require("mongoose");

// To use promises with mongoose
mongoose.Promise = global.Promise;

// mongodb+srv://greatchinex:<password>@mycluster-wubly.mongodb.net/<dbname>?retryWrites=true&w=majority
const DB_URL =
  "mongodb+srv://greatchinex:12220047@mycluster-wubly.mongodb.net/class?retryWrites=true&w=majority";

try {
  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (err) {
  throw err;
}

mongoose.connection.on("connected", () => {
  console.log(`connected to database ${DB_URL}`);
});
