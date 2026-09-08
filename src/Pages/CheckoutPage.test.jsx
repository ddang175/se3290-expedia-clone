import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import CheckoutPage from "./CheckoutPage";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));

const hotel = { id: 4, name: "Example Hotel", price: 2300, taxes: 373 };
const user = { id: 10, user_name: "Stored traveler", email: "" };

function Destination() {
  const location = useLocation();
  return <p>Saved trip: {location.search}</p>;
}

function open(url) {
  const store = legacy_createStore(() => ({ LoginReducer: { activeUser: user } }));
  render(<Provider store={store}><MemoryRouter initialEntries={[url]}><Routes>
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/trips" element={<Destination />} />
  </Routes></MemoryRouter></Provider>);
}

function autofill(label, value) {
  // Browser autofill can update the DOM without firing React's change event.
  screen.getByLabelText(label).value = value;
}

beforeEach(() => {
  jest.resetAllMocks();
  axios.get.mockResolvedValue({ data: hotel });
  axios.post.mockResolvedValue({ data: {} });
  Object.defineProperty(global, "crypto", { configurable: true, value: { randomUUID: () => "saved-booking-id" } });
});

test("submits autofilled hotel dates and traveler fields with the matching total", async () => {
  open("/checkout?type=hotel&id=4&checkIn=2099-05-10");
  await screen.findByRole("heading", { name: "Example Hotel" });
  expect(screen.getByRole("button", { name: "Confirm booking" })).toBeEnabled();
  autofill(/Full name/, "Autofilled traveler");
  autofill(/Email/, "traveler@example.test");
  autofill(/Check-out/, "2099-05-13");
  autofill(/Travelers/, "3");
  fireEvent.submit(screen.getByRole("form", { name: "Booking details" }));
  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/bookings$/), expect.objectContaining({
    userId: 10, itemId: 4, type: "hotel",
    traveler: { fullName: "Autofilled traveler", email: "traveler@example.test" },
    details: expect.objectContaining({ checkIn: "2099-05-10", checkOut: "2099-05-13", guests: "3" }),
    price: { units: 3, subtotal: 6900, taxes: 1119, total: 8019 },
  })));
  expect(await screen.findByText("Saved trip: ?confirmed=saved-booking-id")).toBeInTheDocument();
});

test("flight submission reads the autofilled departure date and traveler count", async () => {
  axios.get.mockResolvedValue({ data: { id: "flight-17", airline: "Example Air", number: "EX17", from: "DELHI", to: "MUMBAI", price: 6999 } });
  open("/checkout?type=flight&id=flight-17&date=2099-05-10&guests=1");
  await screen.findByRole("heading", { name: "Example Air EX17" });
  autofill(/Email/, "traveler@example.test");
  autofill(/Departure date/, "2099-05-12");
  autofill(/Travelers/, "4");
  fireEvent.submit(screen.getByRole("form", { name: "Booking details" }));
  await waitFor(() => expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/bookings$/), expect.objectContaining({
    itemId: "flight-17", type: "flight",
    details: expect.objectContaining({ date: "2099-05-12", guests: "4" }),
    price: { units: 4, subtotal: 27996, taxes: 0, total: 27996 },
  })));
  expect(await screen.findByText("Saved trip: ?confirmed=saved-booking-id")).toBeInTheDocument();
});

test("blurring autofilled fields updates the quote without restoring deliberately cleared dates", async () => {
  open("/checkout?type=hotel&id=4&checkIn=2099-05-10");
  await screen.findByRole("heading", { name: "Example Hotel" });
  autofill(/Check-out/, "2099-05-13");
  fireEvent.blur(screen.getByLabelText(/Check-out/));
  expect(screen.getByText("3 night(s), one room")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Total:.*8,019/ })).toBeInTheDocument();
  autofill(/Check-in/, "");
  fireEvent.blur(screen.getByLabelText(/Check-in/));
  expect(screen.getByLabelText(/Check-in/)).toHaveValue("");
  expect(screen.queryByRole("heading", { name: /Total:/ })).not.toBeInTheDocument();
});

test("invalid autofilled dates are validated again at submission", async () => {
  open("/checkout?type=hotel&id=4&checkIn=2099-05-10&checkOut=2099-05-13");
  await screen.findByRole("heading", { name: "Example Hotel" });
  autofill(/Email/, "traveler@example.test");
  autofill(/Check-out/, "2099-05-10");
  fireEvent.submit(screen.getByRole("form", { name: "Booking details" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Check-out must be after check-in.");
  expect(axios.post).not.toHaveBeenCalled();
});
