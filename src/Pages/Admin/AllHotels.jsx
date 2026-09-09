import { DeleteHotel, fetchingHotels } from "../../Redux/AdminHotel/action";
import AdminCatalogList from "./AdminCatalogList";

const searchFields = ["name", "place", "description"];
const renderFields = (hotel) => <>
  <span><img src={hotel.image} alt={hotel.name || "Hotel"} /></span>
  <span className="adminHotelName" title={hotel.name}>{hotel.name || "Unnamed hotel"}</span>
  <span>{hotel.place}</span>
  <span>Taxes: ₹{Number(hotel.taxes || 0).toLocaleString("en-IN")}</span>
  <span>₹{Number(hotel.price || 0).toLocaleString("en-IN")}</span>
</>;

export const AllHotels = () => (
  <AdminCatalogList title="Hotel" reducerName="HotelReducer" fetchAction={fetchingHotels}
    deleteAction={DeleteHotel} editPath="/admin/adminstay" searchFields={searchFields} renderFields={renderFields} />
);
