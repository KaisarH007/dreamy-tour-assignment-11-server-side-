const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7000;

//Middle ware
app.use(cors());
app.use(express.json());

//user name =dreamyTour
//user pass =cSescxiFfoMrMsv2

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gwaa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("dreamyTour");
    const packegeCollection = database.collection("tourPackeges");

    app.get("/tourPackeges", async (req, res) => {
      const cursor = packegeCollection.find({});
      const packeges = await cursor.toArray();
      res.send(packeges);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment-11 server is running");
});

app.listen(port, () => {
  console.log("port is running ", port);
});