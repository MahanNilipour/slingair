"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

// deletes a specified reservation
const deleteReservation = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const reservationId = req.params.reservation;   

    if (!reservationId) {
        return res.status(400).json({status: 400, message: "Please provide a reservation ID."})
    }

    try {
        await client.connect();
        const db = client.db("slingair");
        console.log("connected");

        const foundReservation = await db.collection("reservations").findOne({ _id: reservationId});

        const deletion = await db.collection("reservations").deleteOne( { _id: reservationId} );
        if (deletion.deletedCount === 0) {
            console.log("-- deleted --");
            
            return res.status(404).json({ status: 404, message: "Reservation not Found"});
        }
        
        const query = { _id: foundReservation.flight, "seats.id": foundReservation.seat};
        const updateSeat = { $set: { "seats.$.isAvailable": true } };
        
        const result = await db.collection("flights").updateOne( query, updateSeat)

        if (result.modifiedCount === 0) {
            return res.status(400).json({ status: 400, message: "Reservation deleted, but could not update seat availability"});
        }

        res.status(200).json({ status: 200, message: "Reservation successfully deleted"});

    } catch (err) {
        res.status(500).json({ status: 500, data: req.body, message: err.message })
    } finally {
        client.close();
        console.log("disconnected");
    }
};

module.exports = deleteReservation;
