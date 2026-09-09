import { normalizePlace } from "../Stay/catalog";
export function filterFlights(flights, { from = "", to = "", date = "", airline = "", price = "", sort = "price-asc" } = {}) {
  const maximum = Number(price) * 1000;
  const result = flights.filter((flight) => (!from || normalizePlace(flight.from) === normalizePlace(from))
    && (!to || normalizePlace(flight.to) === normalizePlace(to))
    && (!date || !flight.date || flight.date === date)
    && (!airline || flight.airline === airline)
    && (!price || (Number(flight.price) >= maximum - 1000 && Number(flight.price) <= maximum)));
  if (sort === "price-asc") result.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-desc") result.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "departure") result.sort((a, b) => String(a.departure).localeCompare(String(b.departure)));
  return result;
}
