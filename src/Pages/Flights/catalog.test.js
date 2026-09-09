import { filterFlights } from "./catalog";
const flights = [
  { id: 1, airline: "One", from: "DELHI", to: "BANGLURU", price: "6999", departure: "08:30" },
  { id: 2, airline: "Two", from: "Delhi", to: "MUMBAI", price: 4999, departure: "06:30" },
  { id: 3, airline: "One", from: "MUMBAI", to: "BANGLURU", price: "7499", departure: "09:30" },
  { id: 4, airline: "One", from: "DELHI", to: "BANGLURU", price: "6500", departure: "06:00", date: "2027-01-01" },
];
test("route search tolerates city capitalization and Bengaluru spellings", () => {
  expect(filterFlights(flights, { from: "Delhi", to: "Bengaluru" }).map((flight) => flight.id)).toEqual([4, 1]);
});
test("price bands use thousands of rupees and sorting is numeric", () => {
  expect(filterFlights(flights, { price: "7" }).map((flight) => flight.id)).toEqual([4, 1]);
  expect(filterFlights(flights, { sort: "price-desc" }).map((flight) => flight.id)).toEqual([3, 1, 4, 2]);
  expect(flights.map((flight) => flight.id)).toEqual([1, 2, 3, 4]);
});
test("airline, route, price, and explicit travel dates combine", () => {
  expect(filterFlights(flights, { from: "DELHI", airline: "One", price: "7", date: "2027-01-02" }).map((flight) => flight.id)).toEqual([1]);
  expect(filterFlights(flights, { from: "PUNE" })).toEqual([]);
});
