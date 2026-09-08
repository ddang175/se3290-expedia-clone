import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { dateInputValue } from "../Stay/catalog";
import "./homePage.css";
const airports = ["DELHI", "MUMBAI", "BENGALURU", "PUNE", "KANPUR"];
export default function Flights() {
  const navigate = useNavigate(); const [params] = useSearchParams();
  const [values, setValues] = useState({ from: "", to: "", date: "", guests: "1" });
  const [error, setError] = useState("");
  useEffect(() => setValues({ from: params.get("from") || "", to: params.get("to") || "", date: params.get("date") || "", guests: params.get("guests") || "1" }), [params]);
  const change = (event) => setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const search = (event) => {
    event.preventDefault();
    const submitted = Object.fromEntries(new FormData(event.currentTarget));
    if (submitted.from && submitted.from === submitted.to) { setError("Choose different departure and arrival cities."); return; }
    if (submitted.date && submitted.date < dateInputValue()) { setError("Choose today or a future departure date."); return; }
    setError("");
    const query = new URLSearchParams(Object.entries(submitted).filter(([, value]) => value)); navigate(`/flight?${query}`);
  };
  return <form className="flight-search-form" aria-label="Search flights" onSubmit={search}>
    <h2>One-way flights</h2>
    <div className="flight-search-fields">
      <label>From<select name="from" value={values.from} onChange={change}><option value="">All departure cities</option>{airports.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
      <button className="flight-swap" type="button" aria-label="Swap departure and arrival" onClick={() => setValues((previous) => ({ ...previous, from: previous.to, to: previous.from }))}>⇄</button>
      <label>To<select name="to" value={values.to} onChange={change}><option value="">All arrival cities</option>{airports.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
      <label>Departure<input type="date" name="date" min={dateInputValue()} value={values.date} onChange={change} /></label>
      <label>Travelers<input type="number" name="guests" min="1" max="8" required value={values.guests} onChange={change} /></label>
    </div>
    {error && <p role="alert">{error}</p>}
    <Button type="submit" colorScheme="blue" size="lg" mt={5}>Search</Button>
  </form>;
}
