import React, { useCallback, useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Button, Heading, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../baseurl";
import { formatMoney } from "../services/booking";

export default function Trips() {
  const user = useSelector((store) => store.LoginReducer.activeUser);
  const [params] = useSearchParams();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/bookings`, { params: { userId: user.id, _sort: "createdAt", _order: "desc" } });
      setBookings(data);
      setError("");
    } catch { setError("Your trips could not be loaded. Check the API server and retry."); }
  }, [user.id]);
  useEffect(() => { load(); }, [load]);
  async function cancel(booking) {
    setBusy(true);
    try {
      await axios.patch(`${API_BASE_URL}/bookings/${booking.id}`, { status: "cancelled", cancelledAt: new Date().toISOString() });
      setPending(null);
      await load();
    } catch { setError("Cancellation could not be saved. Please try again."); }
    finally { setBusy(false); }
  }
  return <Box maxW="1100px" mx="auto" p={{ base: 4, md: 8 }} textAlign="left">
    <Heading mb={6}>My trips</Heading>
    {bookings?.some((booking) => booking.id === params.get("confirmed") && booking.status === "confirmed") && <Alert status="success" mb={5}><AlertIcon />Booking confirmed. Your reservation is saved below.</Alert>}
    {error && <Alert status="error" mb={5}><AlertIcon />{error}<Button onClick={load} ml={3}>Retry</Button></Alert>}
    {!bookings && !error && <Spinner />}
    {bookings?.length === 0 && <Text mb={4}>You have no bookings yet.</Text>}
    <Stack spacing={5}>{bookings?.map((booking) => <Box key={booking.id} borderWidth="1px" borderRadius="lg" p={5}>
      <Heading size="md">{booking.title}</Heading>
      <Text mt={2}>Reference: {booking.id}</Text>
      <Text fontWeight="bold" color={booking.status === "confirmed" ? "green.600" : "gray.600"}>Status: {booking.status}</Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} my={3} gap={3}>
        <Text>{booking.type === "hotel" ? `${booking.details.checkIn} to ${booking.details.checkOut}` : booking.details.date}</Text>
        <Text>{booking.details.guests} traveler(s) · {booking.traveler.fullName}</Text>
        <Text>Total: {formatMoney(booking.price.total)}</Text>
      </SimpleGrid>
      {booking.status === "confirmed" && (pending === booking.id ? <Box><Text mb={2}>Cancel this reservation?</Text><Button colorScheme="red" onClick={() => cancel(booking)} isLoading={busy}>Confirm cancellation</Button><Button ml={2} isDisabled={busy} onClick={() => setPending(null)}>Keep booking</Button></Box> : <Button variant="outline" onClick={() => setPending(booking.id)}>Cancel booking</Button>)}
    </Box>)}</Stack>
    <Button mt={6} as={Link} to="/" colorScheme="blue">Find another trip</Button>
  </Box>;
}
