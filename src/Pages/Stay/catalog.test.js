import { filterHotels, normalizePlace, nextDay } from "./catalog";
import { StayReducer } from "../../Redux/StayReducer/reducer";
import { selectCity, selectDateAndCity, hotelFailure, hotelRequest } from "../../Redux/StayReducer/action";
import { NEW_GET_HOTELS_SUCCESS as ADMIN_HOTELS_LOADED } from "../../Redux/AdminHotel/actionType";
jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));

const hotels = [
  { id: 1, city: "Bengaluru", name: "Garden Hotel", place: "Whitefield", price: 12000, rating: 4.5 },
  { id: 2, city: "Bengaluru", name: "City Inn", place: "Indiranagar", price: 2000, rating: 3.8 },
  { id: 3, city: "New Delhi", name: "Airport Hotel", price: 5000, rating: 4.8 },
];
test("destination aliases and price/rating filters combine before sorting", () => {
  expect(filterHotels(hotels, { destination: "Bangalore", minPrice: 3000, maxPrice: 15000, rating: 4, sort: "price-asc" }).map((hotel) => hotel.id)).toEqual([1]);
  expect(filterHotels(hotels, { destination: "whitefield" }).map((hotel) => hotel.id)).toEqual([1]);
  expect(normalizePlace("BANGLURU")).toBe("bengaluru");
});
test("all prices are considered, sorting does not mutate the source, and no matches is empty", () => {
  expect(filterHotels(hotels, { sort: "price-asc" }).map((hotel) => hotel.id)).toEqual([2, 3, 1]);
  expect(hotels.map((hotel) => hotel.id)).toEqual([1, 2, 3]);
  expect(filterHotels(hotels, { destination: "nonexistent" })).toEqual([]);
});
test("changing dates preserves the selected destination", () => {
  const selected = StayReducer(undefined, selectCity("New Delhi"));
  expect(StayReducer(selected, selectDateAndCity("2027-01-01", "2027-01-03"))).toMatchObject({ selectedCity: "New Delhi", checkInDate: "2027-01-01", checkOutDate: "2027-01-03" });
});
test("loading failures settle and admin collection actions do not replace customer results", () => {
  const pending = StayReducer(undefined, hotelRequest());
  expect(StayReducer(pending, hotelFailure("Offline"))).toMatchObject({ isLoading: false, isError: true, error: "Offline" });
  expect(StayReducer(pending, { type: ADMIN_HOTELS_LOADED, payload: hotels })).toBe(pending);
});
test("checkout minimum date advances across month and year boundaries", () => {
  expect(nextDay("2027-12-31")).toBe("2028-01-01");
  expect(nextDay("2028-02-28")).toBe("2028-02-29");
});
