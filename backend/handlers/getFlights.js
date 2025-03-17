"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

// returns an array of all flight numbers
const getFlights = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("slingair");
        console.log("connected");

        const flightData = await db.collection("flights").find().toArray();

        let flightsArray = [];
        flightData.forEach ((flight) => {
            flightsArray.push(flight["flight"]);
        })
        
        res.status(200).json({ status: 200, data: flightsArray});
    } catch (err) {
        res.status(500).json({ status: 500, data: req.body, message: err.message })
    } finally {
        client.close();
        console.log("disconnected");
    }
};

module.exports = getFlights;
