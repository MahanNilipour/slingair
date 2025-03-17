import { useState, useEffect } from "react";
import makeFetchRequest from "../utils/make-fetch-request";
import { getReservation } from "../service/api";

const useReservation = () => {
  const reservationId = window.localStorage.getItem("reservationId");
  const [reservation, setReservation] = useState({});

  useEffect(() => {
    (async () => {
      const res = await makeFetchRequest(() => getReservation(reservationId));
			if (!res.data) {
				console.log("Error - key data of response must be a reservation object with keys: _id, flight, seat, givenName, surname and email.")
			} else {
				setReservation(res.data)
			}
    })();
  }, [reservationId])

  return reservation;
};

export default useReservation;