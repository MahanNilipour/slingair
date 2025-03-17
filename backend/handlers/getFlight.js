"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const getFlight = async (req, res) => {
  const { flight } = req.params;
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db("slingair");
    const flightDataFromDb = await db
      .collection("flights")
      .findOne({ "flight": flight });


    if (flightDataFromDb && flightDataFromDb.seats) {
      return res.status(200).json({
        status: 200,
        data: flightDataFromDb.seats,
      });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "Flight or seats not found" });
    }
  } catch (err) {
    console.error("Error occurred while getting flight info:", err.stack);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  } finally {
    await client.close();
  }
};

module.exports = getFlight;
