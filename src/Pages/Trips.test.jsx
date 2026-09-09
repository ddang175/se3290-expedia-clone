import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Trips from "./Trips";

jest.mock("axios", () => ({ get: jest.fn(), patch: jest.fn() }));

beforeEach(() => jest.resetAllMocks());

test.each(["confirmed", "cancelled"])("the confirmation banner agrees with the saved booking status: %s", async (status) => {
  axios.get.mockResolvedValue({ data: [{
    id: "booking-4", userId: 10, title: "Example Hotel", status, type: "hotel",
    details: { checkIn: "2099-05-10", checkOut: "2099-05-13", guests: "2" },
    traveler: { fullName: "Test traveler" }, price: { total: 8019 },
  }] });
  const store = legacy_createStore(() => ({ LoginReducer: { activeUser: { id: 10 } } }));
  render(<Provider store={store}><MemoryRouter initialEntries={["/trips?confirmed=booking-4"]}><Trips /></MemoryRouter></Provider>);
  expect(await screen.findByText(`Status: ${status}`)).toBeInTheDocument();
  expect(Boolean(screen.queryByText("Booking confirmed. Your reservation is saved below."))).toBe(status === "confirmed");
  expect(axios.patch).not.toHaveBeenCalled();
});
