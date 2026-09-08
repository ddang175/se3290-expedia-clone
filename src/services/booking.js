export const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export function validateBooking({ type, checkIn, checkOut, date, guests }) {
  if (!Number.isInteger(Number(guests)) || Number(guests) < 1 || Number(guests) > 8) {
    return "Choose between 1 and 8 travelers.";
  }
  const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "") &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (type === "hotel") {
    if (!validDate(checkIn) || !validDate(checkOut)) return "Choose valid check-in and check-out dates.";
    if (checkIn < today()) return "Check-in cannot be in the past.";
    if (checkOut <= checkIn) return "Check-out must be after check-in.";
  } else if (type === "flight") {
    if (!validDate(date) || date < today()) return "Choose a departure date today or later.";
  } else {
    return "Choose a hotel or flight first.";
  }
  return "";
}

export function quoteBooking(item, details) {
  const price = Number(item.price);
  const tax = details.type === "hotel" ? Number(item.taxes || 0) : 0;
  if (!Number.isFinite(price) || price < 0 || !Number.isFinite(tax) || tax < 0) {
    throw new Error("This listing does not have a valid price.");
  }
  const units = details.type === "hotel"
    ? Math.max(1, Math.round((Date.parse(details.checkOut) - Date.parse(details.checkIn)) / 86400000))
    : Number(details.guests);
  return { units, subtotal: price * units, taxes: tax * units, total: (price + tax) * units };
}

export const formatMoney = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(value);

export function newBooking(item, details, traveler, user) {
  const validation = validateBooking(details);
  if (validation) throw new Error(validation);
  if (!traveler.fullName.trim() || !traveler.email.trim()) throw new Error("Enter the traveler's name and email.");
  return {
    id: crypto.randomUUID(),
    userId: user.id,
    type: details.type,
    itemId: item.id,
    title: details.type === "hotel" ? item.name : `${item.airline} ${item.number}: ${item.from} to ${item.to}`,
    image: details.type === "hotel" ? item.image : null,
    details,
    traveler: { fullName: traveler.fullName.trim(), email: traveler.email.trim() },
    price: quoteBooking(item, details),
    currency: "INR",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}
