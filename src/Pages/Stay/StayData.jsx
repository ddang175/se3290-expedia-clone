import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchingHotels } from "../../Redux/StayReducer/action";
import Sidebar from "./Sidebar";
import Pagination from "./Pagination";
import Stay from "./Stay";
import { filterHotels } from "./catalog";
import "./StayData.css";
export default function StayData() {
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useSelector((store) => store.StayReducer);
  const [params, setParams] = useSearchParams();
  const filters = { destination: params.get("destination") || "", sort: params.get("sort") || "recommended", minPrice: Number(params.get("minPrice") || 0), maxPrice: Number(params.get("maxPrice") || 50000), rating: Number(params.get("rating") || 0) };
  const filtered = filterHotels(data, filters);
  const totalPages = Math.ceil(filtered.length / 12);
  const currentPage = Math.min(Math.max(1, Number(params.get("page")) || 1), totalPages || 1);
  useEffect(() => { dispatch(fetchingHotels()); }, [dispatch]);
  const changeFilters = (changes) => {
    const next = new URLSearchParams(params); Object.entries(changes).forEach(([key, value]) => next.set(key, String(value)));
    next.delete("page"); setParams(next);
  };
  const changePage = (page) => { const next = new URLSearchParams(params); next.set("page", page); setParams(next); };
  const bookingLink = (hotel) => {
    const query = new URLSearchParams({ type: "hotel", id: hotel.id, guests: params.get("guests") || "1" });
    ["checkIn", "checkOut"].forEach((key) => { if (params.get(key)) query.set(key, params.get(key)); }); return `/checkout?${query}`;
  };
  return <section className="stay-results"><Stay /><div className="stay-data">
    <div className="sidebar-container"><Sidebar filters={filters} onChange={changeFilters} /></div>
    <div className="stay-catalog">
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>{filters.destination ? `Stays matching ${filters.destination}` : "Find your next stay"}</h1>
      {isLoading && <p role="status">Loading hotels…</p>}
      {isError && <div role="alert"><p>{error || "Unable to load hotels."}</p><button onClick={() => dispatch(fetchingHotels())}>Try again</button></div>}
      {!isLoading && !isError && <p role="status">{filtered.length} properties found</p>}
      {!isLoading && !isError && filtered.length === 0 && <p>No properties match your search. Try another destination or reset your filters.</p>}
      {!isLoading && filtered.slice((currentPage - 1) * 12, currentPage * 12).map((hotel) => <article className="stay-card" key={hotel.id}>
        <img src={hotel.image} alt={hotel.name || "Hotel"} loading="lazy" />
        <div className="stay-info"><div className="stay-header"><h2 className="stay-name">{hotel.name}</h2></div>
          <p className="stay-location">{[hotel.place || hotel.location, hotel.city].filter(Boolean).join(", ")}</p>
          <p className="stay-description">{hotel.description}</p>
          <div className="stay-details"><div className="stay-price"><span>Per night</span><p>₹{Number(hotel.price).toLocaleString("en-IN")}</p></div>
            <div className="stay-rating"><span>Guest rating</span><p>{hotel.rating || "Unrated"}</p></div>
          </div><Link className="stay-book-btn" to={bookingLink(hotel)}>Book Now</Link>
        </div>
      </article>)}
      <Pagination current={currentPage} onChange={changePage} total={totalPages} />
    </div></div></section>;
}
