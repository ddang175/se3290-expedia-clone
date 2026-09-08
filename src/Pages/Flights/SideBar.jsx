import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import baseurl from "../../baseurl";
import { filterFlights } from "./catalog";
import FlightList from "./FlightList";
import Pagination from "../Stay/Pagination";
export default function SideBar() {
  const [params, setParams] = useSearchParams();
  const [flights, setFlights] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    axios.get(`${baseurl}/flight`).then(({ data }) => {
      if (!Array.isArray(data)) throw new Error("The flight service returned an invalid response.");
      if (active) setFlights(data);
    }).catch((failure) => { if (active) setError(failure.response?.data?.error || "Unable to load flights. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const filters = { from: params.get("from") || "", to: params.get("to") || "", date: params.get("date") || "", airline: params.get("airline") || "", price: params.get("price") || "", sort: params.get("sort") || "price-asc" };
  const filtered = filterFlights(flights, filters); const pages = Math.ceil(filtered.length / 5);
  const page = Math.min(Math.max(1, Number(params.get("page")) || 1), pages || 1);
  const update = (changes) => { const next = new URLSearchParams(params); Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key)); next.delete("page"); setParams(next); };
  const changePage = (value) => { const next = new URLSearchParams(params); next.set("page", value); setParams(next); };
  const airlines = [...new Set(flights.map((flight) => flight.airline))].sort();
  return <section className="flight-results">
    <aside className="flight-filters" aria-label="Flight filters"><h2>Sort & Filter</h2>
      <fieldset><legend>Price per traveler</legend>{[["", "All prices"], ["5", "₹4,000 – ₹5,000"], ["6", "₹5,000 – ₹6,000"], ["7", "₹6,000 – ₹7,000"], ["8", "₹7,000 – ₹8,000"]].map(([value, label]) =>
        <label key={value}><input type="radio" name="flight-price" value={value} checked={filters.price === value} onChange={() => update({ price: value })} /> {label}</label>)}</fieldset>
      <label>Airline<select value={filters.airline} onChange={(event) => update({ airline: event.target.value })}><option value="">All airlines</option>{airlines.map((airline) => <option key={airline}>{airline}</option>)}</select></label>
      <label>Sort flights<select value={filters.sort} onChange={(event) => update({ sort: event.target.value })}><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="departure">Departure time</option></select></label>
      <button type="button" onClick={() => update({ price: "", airline: "", sort: "price-asc" })}>Reset filters</button>
    </aside>
    <div className="flight-catalog"><h1>Available flights</h1>
      {loading && <p role="status">Loading flights…</p>}
      {error && <div role="alert"><p>{error}</p><button onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}
      {!loading && !error && <><p role="status" style={{ margin: "12px 0 20px" }}>{filtered.length} flights found</p>
        {filtered.length === 0 && <p>No flights match your search. Try another route or reset your filters.</p>}
        <FlightList flights={filtered.slice((page - 1) * 5, page * 5)} /><Pagination current={page} onChange={changePage} total={pages} /></>}
    </div>
  </section>;
}
