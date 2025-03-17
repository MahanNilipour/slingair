const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const {flights, reservations} = require("./data.js");
console.log(flights)
const batchImport = async () => {
const client = new MongoClient(MONGO_URI);

try {
    await client.connect();

    const db = client.db("slingair");

    const result = await db.collection("flights").insertMany([{_id: "SA231", flight: "SA231", seats: flights.SA231 }, {_id: "FD489", flight:"FD489", seats: flights.FD489 }] );
    const result2 = await db.collection("reservations").insertMany(reservations);
console.log("im working")
  } finally {
    await client.close();
  }
};

batchImport();
