import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../baseurl";
import AdminSidebar from "./AdminSidebar";
import "./AdminDashboard.Module.css";

const cards = [
  { resource: "hotel", title: "Total Hotels", path: "/admin/hotels" },
  { resource: "flight", title: "Total Flights", path: "/admin/products" },
  { resource: "users", title: "Total Users", detail: "Registered accounts" },
  { resource: "giftcards", title: "Gift Cards", detail: "Catalog records" },
  { resource: "Things_todo", title: "Activities Available", path: "/ThingsToDo" },
];

export const AdminDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all(cards.map(async ({ resource }) => {
      const { data } = await axios.get(`${API_BASE_URL}/${resource}`);
      return [resource, data.length];
    })).then((entries) => {
      if (active) setCounts(Object.fromEntries(entries));
    }).catch(() => {
      if (active) {
        setCounts(null);
        setError("Could not load dashboard counts. Check the data server and try again.");
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [refresh]);

  return (
    <div className="mainAdminLandingpage">
      <AdminSidebar />
      <div className="mainBox">
        <div className="mainBoxHead"><h1>Admin Dashboard</h1><hr /></div>
        <div className="adminDashboardFeedback">
          {loading && <p role="status">Loading dashboard...</p>}
          {error && <p role="alert">{error}</p>}
          <button onClick={() => setRefresh((value) => value + 1)} disabled={loading}>{error ? "Retry" : "Refresh counts"}</button>
        </div>
        <div className="DataBoxes">
          {cards.map(({ resource, title, path, detail }) => (
            <div className="dataBx" key={resource}>
              <h1>{title}</h1>
              <h1>{counts?.[resource] ?? "—"}</h1>
              {path ? <Link to={path}>View</Link> : <p>{detail}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
