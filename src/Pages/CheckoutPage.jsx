import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Heading, Image, Input, Select, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../baseurl";
import { formatMoney, newBooking, quoteBooking, today, validateBooking } from "../services/booking";

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const type = params.get("type");
  const id = params.get("id");
  const user = useSelector((store) => store.LoginReducer.activeUser);
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [details, setDetails] = useState({ type, checkIn: params.get("checkIn") || today(), checkOut: params.get("checkOut") || "", date: params.get("date") || today(), guests: params.get("guests") || "1" });
  const [traveler, setTraveler] = useState({ fullName: user.user_name || "", email: user.email || "" });
  useEffect(() => {
    if (!["hotel", "flight"].includes(type) || !id) {
      setError("Choose a hotel or flight before checking out.");
      return;
    }
    let active = true;
    axios.get(`${API_BASE_URL}/${type}/${encodeURIComponent(id)}`)
      .then(({ data }) => { if (active) setItem(data); })
      .catch(() => { if (active) setError("This listing could not be loaded. Return to search and try again."); });
    return () => { active = false; };
  }, [type, id]);
  const validation = validateBooking(details);
  let quote;
  let priceError = "";
  if (item && !validation) {
    try { quote = quoteBooking(item, details); } catch (failure) { priceError = failure.message; }
  }
  const update = (event) => setDetails((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const readForm = (form) => {
    const values = Object.fromEntries(new FormData(form));
    return {
      details: { type, checkIn: values.checkIn ?? "", checkOut: values.checkOut ?? "", date: values.date ?? "", guests: values.guests ?? "" },
      traveler: { fullName: values.fullName ?? "", email: values.email ?? "" },
    };
  };
  const syncForm = (event) => {
    const submitted = readForm(event.currentTarget);
    setDetails(submitted.details);
    setTraveler(submitted.traveler);
  };
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const submitted = readForm(event.currentTarget);
    setDetails(submitted.details);
    setTraveler(submitted.traveler);
    setBusy(true);
    setError("");
    try {
      const booking = newBooking(item, submitted.details, submitted.traveler, user);
      await axios.post(`${API_BASE_URL}/bookings`, booking);
      navigate(`/trips?confirmed=${booking.id}`, { replace: true });
    } catch (failure) {
      setError(failure.response ? "Booking could not be saved. Please try again." : failure.message);
    } finally { setBusy(false); }
  }
  return <Box maxW="1100px" mx="auto" p={{ base: 4, md: 8 }} textAlign="left">
    <Heading mb={6}>Review and book</Heading>
    {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
    {!item ? <>{!error && <Spinner />}<Button as={Link} to="/" mt={4}>Back to search</Button></> :
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        <Box as="form" aria-label="Booking details" onSubmit={submit} onBlur={syncForm} borderWidth="1px" borderRadius="lg" p={6}>
          <Stack spacing={4}>
            <Heading size="md">Traveler details</Heading>
            <FormControl isRequired><FormLabel htmlFor="traveler-name">Full name</FormLabel><Input id="traveler-name" name="fullName" autoComplete="name" value={traveler.fullName} onChange={(event) => setTraveler((previous) => ({ ...previous, fullName: event.target.value }))} /></FormControl>
            <FormControl isRequired><FormLabel htmlFor="traveler-email">Email</FormLabel><Input id="traveler-email" name="email" type="email" autoComplete="email" value={traveler.email} onChange={(event) => setTraveler((previous) => ({ ...previous, email: event.target.value }))} /></FormControl>
            {type === "hotel" ? <>
              <FormControl isRequired><FormLabel htmlFor="checkIn">Check-in</FormLabel><Input id="checkIn" name="checkIn" type="date" min={today()} value={details.checkIn} onChange={update} /></FormControl>
              <FormControl isRequired><FormLabel htmlFor="checkOut">Check-out</FormLabel><Input id="checkOut" name="checkOut" type="date" min={details.checkIn} value={details.checkOut} onChange={update} /></FormControl>
            </> : <FormControl isRequired><FormLabel htmlFor="departure-date">Departure date</FormLabel><Input id="departure-date" name="date" type="date" min={today()} value={details.date} onChange={update} /></FormControl>}
            <FormControl><FormLabel htmlFor="guests">Travelers</FormLabel><Select id="guests" name="guests" value={details.guests} onChange={update}>{Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</Select></FormControl>
            <Text fontSize="sm">This educational project records a reservation. No payment is collected or reservation sent to a travel provider.</Text>
            {(validation || priceError) && <Text color="red.600" role="status">{validation || priceError}</Text>}
            <Button colorScheme="blue" type="submit" isLoading={busy} isDisabled={Boolean(priceError)}>Confirm booking</Button>
          </Stack>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={6}>
          {type === "hotel" && <Image src={item.image} alt={item.name} borderRadius="md" mb={4} maxH="240px" width="100%" objectFit="cover" />}
          <Heading size="md">{type === "hotel" ? item.name : `${item.airline} ${item.number}`}</Heading>
          <Text my={3}>{type === "hotel" ? item.place : `${item.from} → ${item.to} · ${item.departure}–${item.arrival}`}</Text>
          <Text>{formatMoney(Number(item.price))} per {type === "hotel" ? "room per night" : "traveler"}</Text>
          {quote && <Stack mt={6} spacing={3}>
            <Text>{quote.units} {type === "hotel" ? "night(s), one room" : "traveler(s)"}</Text>
            <Text>Subtotal: {formatMoney(quote.subtotal)}</Text>
            <Text>Taxes: {formatMoney(quote.taxes)}</Text>
            <Heading size="md">Total: {formatMoney(quote.total)}</Heading>
          </Stack>}
        </Box>
      </SimpleGrid>}
  </Box>;
}
