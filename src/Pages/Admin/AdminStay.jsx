import { addHotel, fetchHotelById, updateHotel } from "../../Redux/AdminHotel/action";
import AdminCatalogForm from "./AdminCatalogForm";

const fields = [
  { name: "image", label: "Hotel Image", type: "url" },
  { name: "name", label: "Name" },
  { name: "place", label: "Place" },
  { name: "price", label: "Price (₹)", type: "number" },
  { name: "description", label: "Description" },
  { name: "additional", label: "Additional", optional: true },
];

export const AdminStay = () => (
  <AdminCatalogForm title="Hotel" fields={fields} listPath="/admin/hotels"
    addAction={addHotel} fetchAction={fetchHotelById} updateAction={updateHotel} />
);
