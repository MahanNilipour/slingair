"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
// updates a specified reservation
const updateReservation = async (req, res) => {
const client = new MongoClient(MONGO_URI);
try {
    await client.connect();
    const db = client.db("slingair");
    const {flight: flightNumber, seat, _id: reservationId, givenName, surname, email} = req.body
    console.log(req.body)
    const flightData = await db.collection("flights").findOne({ flight: flightNumber });
        if (!flightData) {
            return res.status(404).json({
                status: 404,
                message: "Flight not found."
            });
        }
        const seatIndex = flightData.seats.findIndex(seatObj => seatObj.id === seat);
        if (seatIndex === -1 || !flightData.seats[seatIndex].isAvailable) {
            return res.status(404).json({
                status: 404,
                message: "Seat is either unavailable or does not exist."
            });
        }
        const foundReservation = await db.collection("reservations").findOne({_id: reservationId});
        if (!foundReservation){
            return res.status(404).json({ status: 404, message: "Reservation not Found"});
        }
        const updateReservationNumber = await db.collection("reservations").updateOne({_id: reservationId}, {$set: {flight: flightNumber}});
        const updateReservationSeat = await db.collection("reservations").updateOne({_id: reservationId}, {$set: {seat}});
        if(
        updateReservationSeat.modifiedCount === 0 
        ){
            return res.status(400).json({status:400});
        }
        const query = { _id: foundReservation.flight, "seats.id": foundReservation.seat};
        const updateSeat = { $set: { "seats.$.isAvailable": true } };
        
        const result = await db.collection("flights").updateOne( query, updateSeat)

        const query2 = { _id: flightNumber, "seats.id": seat};
        const updateSeat2 = { $set: { "seats.$.isAvailable": false } };
        
        const result2 = await db.collection("flights").updateOne( query2, updateSeat2)

        return res.status(200).json({
            status: 200,
            message: "Reservation updated successfully!",  
        });
}

catch(error) {
    console.log(error)
    res.status(500).json({
        status: 500, 
        message: "Internal Server Error"
    });

}
finally{
    client.close();
}
};

module.exports = updateReservation;
