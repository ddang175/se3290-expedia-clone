import { newBooking, quoteBooking, validateBooking } from "./booking";

const stay = { type: "hotel", checkIn: "2099-05-10", checkOut: "2099-05-13", guests: "2" };
const hotel = { id: 4, name: "Example Hotel", price: 2300, taxes: 373 };

test("prices a multi-night stay from the selected listing, including nightly tax", () => {
  expect(quoteBooking(hotel, stay)).toEqual({ units: 3, subtotal: 6900, taxes: 1119, total: 8019 });
});

test("prices flights for all travelers using numeric catalog prices", () => {
  expect(quoteBooking({ price: "6999" }, { type: "flight", guests: "2" }).total).toBe(13998);
});

test.each([
  { ...stay, checkOut: stay.checkIn },
  { ...stay, checkOut: "2099-05-09" },
  { ...stay, checkIn: "2020-01-01" },
  { ...stay, checkOut: "2099-02-30" },
  { ...stay, guests: "0" },
  { ...stay, guests: "1.5" },
  { type: "flight", date: "yesterday", guests: "1" },
])("rejects invalid itinerary %j", (details) => {
  expect(validateBooking(details)).not.toBe("");
});

test("rejects listings with missing or invalid pricing", () => {
  expect(() => quoteBooking({ price: "unavailable" }, stay)).toThrow("valid price");
  expect(() => quoteBooking({ price: -1 }, stay)).toThrow("valid price");
});

test("stores selected item, current user and total without payment-card data", () => {
  Object.defineProperty(global, "crypto", { configurable: true, value: { randomUUID: () => "test-reference" } });
  const booking = newBooking(hotel, stay, { fullName: " Test Traveler ", email: "traveler@example.test", cardNumber: "must not be saved" }, { id: 10, password: "must not be saved" });
  expect(booking).toMatchObject({ id: "test-reference", itemId: 4, userId: 10, title: "Example Hotel", status: "confirmed", price: { total: 8019 } });
  expect(booking.traveler).toEqual({ fullName: "Test Traveler", email: "traveler@example.test" });
  expect(JSON.stringify(booking)).not.toContain("must not be saved");
});
