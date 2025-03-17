"use strict";

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

// returns a single reservation
const getSingleReservation = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const reservationId = req.params.reservation;

    if (!reservationId) {
        return res.status(400).json({status: 400, message: "Please provide a reservation ID."})
    }

    try {
        await client.connect();
        const db = client.db("slingair");
        console.log("connected");

        const result = await db.collection("reservations").findOne({_id: reservationId});
        result
        ? res.status(200).json({ status: 200, data: result })
        : res.status(404).json({ status: 404, data: "Reservation not found." });

    } catch (err) {
        res.status(500).json({ status: 500, data: req.body, message: err.message })
    } finally {
        client.close();
        console.log("disconnected");
    }
};

module.exports = getSingleReservation;
