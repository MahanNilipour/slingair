"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

// creates a new reservation
const addReservation = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { flight: flightNumber, seat, givenName, surname, email } = req.body;
    const reservationId = uuidv4();
    console.log(req.body)
    try {
        await client.connect();
        const db = client.db("slingair");

        const flightData = await db.collection("flights").findOne({ flight: flightNumber });
        // console.log("Flight Data:", flightData);
        if (!flightData) {
            return res.status(400).json({
                status: 400,
                message: "Flight not found."
            });
        }

        const seatIndex = flightData.seats.findIndex(seatObj => seatObj.id === seat);
        if (seatIndex === -1 || !flightData.seats[seatIndex].isAvailable) {
            return res.status(400).json({
                status: 400,
                message: "Seat is either unavailable or does not exist."
            });
        }

        const newReservation = {
            _id: reservationId,
            flightNumber,
            seat,
            givenName,
            surname,
            email
        };

        flightData.seats[seatIndex].isAvailable = false;

        await db.collection("flights").updateOne(
            { flight: flightNumber },
            { $set: { seats: flightData.seats } }
        );

        const reservationsCollection = db.collection("reservations");
        const reservationResult = await reservationsCollection.insertOne(newReservation);

        console.log( reservationResult);

        if (!reservationResult.insertedId) {
            throw new Error("Failed to create reservation");
        } console.log("did i make it")
        return res.status(201).json({
            status: 201,
            message: "Reservation created successfully!",
            data: reservationResult.insertedId  
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500, 
            message: "Internal Server Error"
        });
    } finally {
        await client.close();
    }
};

module.exports = addReservation;
