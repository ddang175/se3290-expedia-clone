import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import FlightCard from "./FlightCard";
test("booking hands the actual selection, date, and traveler count to checkout", () => {
  render(<ChakraProvider><MemoryRouter initialEntries={["/flight?date=2027-01-03&guests=3"]}>
    <FlightCard data={{ id: "flight-17", airline: "Vistara", from: "DELHI", to: "MUMBAI", price: "6999" }} />
  </MemoryRouter></ChakraProvider>);
  const url = new URL(screen.getByRole("link", { name: "Book Now" }).getAttribute("href"), "https://example.test");
  expect(url.pathname).toBe("/checkout");
  expect(Object.fromEntries(url.searchParams)).toEqual({ type: "flight", id: "flight-17", date: "2027-01-03", guests: "3" });
});
