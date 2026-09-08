import { fireEvent, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import Stay from "./Stay";
import Flights from "../Flights/Flight";
import { StayReducer } from "../../Redux/StayReducer/reducer";
jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn(), delete: jest.fn() }));
function Location() { const location = useLocation(); return <output aria-label="Current route">{location.pathname}{location.search}</output>; }
function show(form) {
  render(<ChakraProvider><Provider store={createStore(StayReducer)}><MemoryRouter>{form}<Location /></MemoryRouter></Provider></ChakraProvider>);
}
function route() { return new URL(screen.getByLabelText("Current route").textContent, "https://example.test"); }
test("stay search includes both entered dates and travelers in the results URL", () => {
  show(<Stay />);
  fireEvent.change(screen.getByLabelText("Going to"), { target: { value: "Goa" } });
  fireEvent.change(screen.getByLabelText("Check-in Date"), { target: { value: "2099-10-10" } });
  fireEvent.change(screen.getByLabelText("Check-out Date"), { target: { value: "2099-10-12" } });
  fireEvent.change(screen.getByLabelText("Travelers"), { target: { value: "3" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(route().pathname).toBe("/stay");
  expect(Object.fromEntries(route().searchParams)).toEqual({ destination: "Goa", checkIn: "2099-10-10", checkOut: "2099-10-12", guests: "3" });
});
test("stay date autofill is submitted even without a React change event", () => {
  show(<Stay />);
  screen.getByLabelText("Check-in Date").value = "2099-10-10";
  screen.getByLabelText("Check-out Date").value = "2099-10-12";
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(route().searchParams.get("checkIn")).toBe("2099-10-10");
  expect(route().searchParams.get("checkOut")).toBe("2099-10-12");
});
test("flight search submits routes, departure, and traveler count", () => {
  show(<Flights />);
  fireEvent.change(screen.getByLabelText("From"), { target: { value: "DELHI" } });
  fireEvent.change(screen.getByLabelText("To"), { target: { value: "MUMBAI" } });
  fireEvent.change(screen.getByLabelText("Departure"), { target: { value: "2099-10-10" } });
  fireEvent.change(screen.getByLabelText("Travelers"), { target: { value: "8" } });
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(route().pathname).toBe("/flight");
  expect(Object.fromEntries(route().searchParams)).toEqual({ from: "DELHI", to: "MUMBAI", date: "2099-10-10", guests: "8" });
});
test("flight departure autofill is submitted without a React change event", () => {
  show(<Flights />);
  screen.getByLabelText("Departure").value = "2099-10-10";
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  expect(route().searchParams.get("date")).toBe("2099-10-10");
});
