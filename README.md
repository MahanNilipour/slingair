# SlingAir!

<img src='frontend/src/assets/screenshots/header.png' style='width:100%' />

---

## How It Looks

![mvp gif](frontend/src/assets/screenshots/slingair-mvp.gif)

<img src='frontend/src/assets/screenshots/seat-select.png' style='float:left;width:48%;margin-right:4%;' />
<img src='frontend/src/assets/screenshots/confirmed.png' style='width:48%;' />

### Functionality

- When a user navigates to `http://localhost:3000`, they are presented with a dropdown to select the flight number.
- With the flight number, make a request to the server for the seating availability on that flight.
- When a response with seating is received, display the seating input as well as the form requesting user's information.
- User selects a seat, enters information and clicks 'Confirm'.
- Contact the server with the data, and wait for a success response to redirect to the `/confirmation` page.
- The confirmation page displays a confirmation message to the user with the info that they entered on the previous screen.
- The reservation id is saved using `localStorage`. If the user closes and reopens the browser at `/reservation`, the information will still be `fetch`ed.

---
