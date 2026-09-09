import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectCity, selectDateAndCity } from "../../Redux/StayReducer/action";
import { dateInputValue, nextDay } from "./catalog";
import "./StayData.css";
export default function Stay() {
  const navigate = useNavigate(); const dispatch = useDispatch(); const [params] = useSearchParams();
  const [values, setValues] = useState({ destination: "", checkIn: "", checkOut: "", guests: "1" });
  const [error, setError] = useState("");
  useEffect(() => setValues({ destination: params.get("destination") || "", checkIn: params.get("checkIn") || "", checkOut: params.get("checkOut") || "", guests: params.get("guests") || "1" }), [params]);
  const change = (event) => setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const search = (event) => {
    event.preventDefault();
    const submitted = Object.fromEntries(new FormData(event.currentTarget));
    if ((submitted.checkIn && !submitted.checkOut) || (!submitted.checkIn && submitted.checkOut)) { setError("Choose both check-in and check-out dates."); return; }
    if (submitted.checkIn && (submitted.checkIn < dateInputValue() || submitted.checkOut <= submitted.checkIn)) { setError("Check-out must follow check-in, and check-in cannot be in the past."); return; }
    setError(""); dispatch(selectCity(submitted.destination)); dispatch(selectDateAndCity(submitted.checkIn, submitted.checkOut));
    const query = new URLSearchParams(Object.entries(submitted).filter(([, value]) => value)); navigate(`/stay?${query}`);
  };
  return <form onSubmit={search} className="stay-search" aria-label="Search stays">
    <label>Going to<input name="destination" list="stay-destinations" placeholder="City, area, or property" value={values.destination} onChange={change} />
      <datalist id="stay-destinations"><option value="Bengaluru" /><option value="New Delhi" /><option value="Goa" /></datalist>
    </label>
    <label>Check-in Date<input name="checkIn" type="date" min={dateInputValue()} value={values.checkIn} onChange={change} /></label>
    <label>Check-out Date<input name="checkOut" type="date" min={values.checkIn ? nextDay(values.checkIn) : dateInputValue()} value={values.checkOut} onChange={change} /></label>
    <label>Travelers<input name="guests" type="number" min="1" max="8" required value={values.guests} onChange={change} /></label>
    <Button type="submit" colorScheme="blue" size="lg">Search</Button>
    {error && <p role="alert">{error}</p>}
  </form>;
}
