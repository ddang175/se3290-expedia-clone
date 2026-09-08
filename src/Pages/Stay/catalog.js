export const normalizePlace = (value = "") => String(value).toLowerCase().trim()
  .replace(/bangalore|bangluru/g, "bengaluru").replace(/new delhi/g, "delhi");
export function filterHotels(hotels, { destination = "", minPrice = 0, maxPrice = Infinity, rating = 0, sort = "recommended" } = {}) {
  const query = normalizePlace(destination);
  const result = hotels.filter((hotel) => {
    const location = normalizePlace([hotel.city, hotel.name, hotel.place, hotel.location, hotel.description].filter(Boolean).join(" "));
    return (!query || location.includes(query)) && Number(hotel.price) >= Number(minPrice)
      && Number(hotel.price) <= Number(maxPrice) && Number(hotel.rating || 0) >= Number(rating);
  });
  if (sort === "price-asc") result.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-desc") result.sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "rating-desc") result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  return result;
}
export function dateInputValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function nextDay(value) {
  const date = new Date(`${value}T12:00:00`); date.setDate(date.getDate() + 1); return dateInputValue(date);
}
