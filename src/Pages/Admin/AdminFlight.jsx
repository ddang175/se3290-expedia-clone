import { addFlight, fetchFlightById, updateFlight } from "../../Redux/AdminFlights/action";
import AdminCatalogForm from "./AdminCatalogForm";

const fields = [
  { name: "airline", label: "Airline" },
  { name: "number", label: "Flight Number" },
  { name: "from", label: "From" },
  { name: "to", label: "To" },
  { name: "departure", label: "Departure" },
  { name: "arrival", label: "Arrival" },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "totalTime", label: "Total Time" },
];

export const Admin = () => (
  <AdminCatalogForm title="Flight" fields={fields} listPath="/admin/products"
    addAction={addFlight} fetchAction={fetchFlightById} updateAction={updateFlight} />
);
