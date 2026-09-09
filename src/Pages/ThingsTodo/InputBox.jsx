import { useEffect, useState } from "react";
import { Box, Button, FormLabel, Input, Select } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
export const InputBox = () => {
  const navigate = useNavigate(); const [params] = useSearchParams();
  const [place, setPlace] = useState(""); const [query, setQuery] = useState("");
  useEffect(() => { setPlace(params.get("place") || ""); setQuery(params.get("q") || ""); }, [params]);
  const search = (event) => { event.preventDefault(); const next = new URLSearchParams(); if (place) next.set("place", place); if (query.trim()) next.set("q", query.trim()); navigate(`/ThingsToDo?${next}`); };
  return <Box as="form" onSubmit={search} aria-label="Search activities" display="flex" flexWrap="wrap" alignItems="flex-end" justifyContent="center" gap={4} p={4}>
    <Box><FormLabel htmlFor="activity-place">Destination</FormLabel><Select id="activity-place" value={place} onChange={(event) => setPlace(event.target.value)} minWidth="200px"><option value="">All destinations</option><option value="kolkata">Kolkata</option><option value="delhi">Delhi</option><option value="rajasthan">Rajasthan</option></Select></Box>
    <Box><FormLabel htmlFor="activity-query">Find an activity</FormLabel><Input id="activity-query" placeholder="Tour or attraction" value={query} onChange={(event) => setQuery(event.target.value)} /></Box>
    <Button type="submit" colorScheme="blue">Search</Button>
  </Box>;
};
