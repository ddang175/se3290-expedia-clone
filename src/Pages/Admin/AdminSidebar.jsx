import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="adminSideBr" aria-label="Administration navigation">
      <h1><Link to="/admin">Home</Link></h1>
      <h1><Link to="/admin/adminflight">Add Flight</Link></h1>
      <h1><Link to="/admin/adminstay">Add Stays</Link></h1>
      <h1><Link to="/admin/products">All Flights</Link></h1>
      <h1><Link to="/admin/hotels">All Hotels</Link></h1>
      <h1><Link to="/">Back to site</Link></h1>
    </div>
  );
}
