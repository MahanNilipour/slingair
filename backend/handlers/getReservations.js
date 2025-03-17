"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;


// returns all reservations
const getReservations = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db("slingair");
        console.log("connected");

        const reservations = await db.collection("reservations").find().toArray();

        res.status(200).json({ status: 200, data: reservations});

    } catch (err) {
        res.status(500).json({ status: 500, data: req.body, message: err.message })
        
    } finally {
        client.close();
        console.log("disconnected");
    }
};

module.exports = getReservations;
