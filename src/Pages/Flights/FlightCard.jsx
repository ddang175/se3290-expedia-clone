import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";
export default function FlightCard({ data }) {
  const { id, airline, number, from, to, departure, arrival, price, totalTime } = data;
  const [params] = useSearchParams();
  const booking = new URLSearchParams({ type: "flight", id, guests: params.get("guests") || "1" });
  if (params.get("date")) booking.set("date", params.get("date"));
  return <Box as="article" display="flex" flexWrap="wrap" gap="20px" minHeight="120px" width="100%" boxShadow="0 3px 8px rgba(0,0,0,.18)" p={4} justifyContent="space-between" alignItems="center" borderRadius="10px" mb={5} textAlign="center">
    <Box><Text as="h2" fontWeight="bold">{airline}</Text><Text fontSize="sm">{number}</Text></Box>
    <Flex direction="column"><Text fontSize="xs">Departure</Text><b>{departure}</b><Text>{from}</Text></Flex>
    <Flex direction="column"><Text fontSize="xs">Arrival</Text><b>{arrival}</b><Text>{to}</Text></Flex>
    <Flex direction="column"><Text fontSize="xs">Duration</Text><b>{totalTime}</b></Flex>
    <Flex direction="column"><Text fontSize="xs">Per traveler</Text><b>₹{Number(price).toLocaleString("en-IN")}</b></Flex>
    <Button as={Link} to={`/checkout?${booking}`} colorScheme="teal">Book Now</Button>
  </Box>;
}
