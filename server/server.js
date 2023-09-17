const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./app");

const port = 3001;

if (process.env.NODE_ENV === "production") {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-tdenb.mongodb.net/mts?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log(err));
} else {
  mongoose
    .connect("mongodb://localhost:27017/starwars2", {
      useNewUrlParser: true,
      autoIndex: true,
    })
    .then(() => console.log("Connected to db"));
}

const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
