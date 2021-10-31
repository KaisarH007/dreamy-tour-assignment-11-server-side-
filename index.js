const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7000;

//Middle ware
app.use(cors());
app.use(express.json());

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
    const bookedPackageCollection = database.collection("bookedPackage");
    //Get API from DB
    app.get("/tourPackeges", async (req, res) => {
      const cursor = packegeCollection.find({});
      const packeges = await cursor.toArray();
      res.send(packeges);
    });

    //Post New Package  to DB
    app.post("/tourPackeges", async (req, res) => {
      const packege = req.body;
      const result = await packegeCollection.insertOne(packege);
      res.send(result);
      console.log(packege);
    });

    //Get package details API
    app.get("/packageDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packegeCollection.findOne(query);
      res.send(result);
    });

    //Post orderd Package to DB
    app.post("/bookedPackage", async (req, res) => {
      const bookedPackage = req.body;
      const result = await bookedPackageCollection.insertOne(bookedPackage);
      res.send(result);
    });
    //Get orderd Package from DB
    app.get("/bookedPackages", async (req, res) => {
      const cursor = bookedPackageCollection.find({});
      const bookedPackages = await cursor.toArray();
      // console.log(bookedPackages);
      res.send(bookedPackages);
    });

    //Delete Booked Orders from Bookedpackage
    app.delete("/bookedPackages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookedPackageCollection.deleteOne(query);
      res.send(result);
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
