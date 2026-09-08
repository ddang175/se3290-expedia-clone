import FlightCard from "./FlightCard";
export default function FlightList({ flights = [] }) {
  return <div>{flights.map((flight) => <FlightCard key={flight.id} data={flight} />)}</div>;
}
