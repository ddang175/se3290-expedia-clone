import { DeleteFlightProducts, fetchFlightProducts } from "../../Redux/AdminFlights/action";
import AdminCatalogList from "./AdminCatalogList";

const searchFields = ["airline", "number", "from", "to"];
const renderFields = (flight) => <>
  <span>{flight.airline}</span>
  <span>{flight.from}</span>
  <span>{flight.to}</span>
  <span>₹{Number(flight.price || 0).toLocaleString("en-IN")}</span>
  <span>{flight.number}</span>
</>;

export const AdminProducts = () => (
  <AdminCatalogList title="Flight" reducerName="FlightReducer" fetchAction={fetchFlightProducts}
    deleteAction={DeleteFlightProducts} editPath="/admin/adminflight" searchFields={searchFields} renderFields={renderFields} />
);
