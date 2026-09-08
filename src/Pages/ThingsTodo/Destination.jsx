import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";
import baseurl from "../../baseurl";
import DestinationCard from "./DestinationCard";
import { InputBox } from "./InputBox";
export const Destination = () => {
  const [activities, setActivities] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [retry, setRetry] = useState(0);
  const [params] = useSearchParams(); const place = params.get("place") || ""; const query = (params.get("q") || "").trim().toLowerCase();
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    axios.get(`${baseurl}/Things_todo`).then(({ data }) => {
      if (!Array.isArray(data)) throw new Error("Invalid activity response");
      if (active) setActivities(data);
    }).catch(() => { if (active) setError("Unable to load activities. Please try again."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const filtered = activities.filter((activity) => (!place || String(activity.place).toLowerCase() === place.toLowerCase()) && (!query || [activity.title, activity.adress, activity.place].join(" ").toLowerCase().includes(query)));
  return <Box width="90%" maxWidth="1200px" margin="24px auto 40px"><Heading size="lg">Things to do</Heading><InputBox />
    {loading && <Text role="status">Loading activities…</Text>}
    {error && <Box role="alert"><Text>{error}</Text><Button onClick={() => setRetry((value) => value + 1)}>Try again</Button></Box>}
    {!loading && !error && <><Text role="status" my={4}>{filtered.length} activities found</Text>
      {filtered.length === 0 && <Text>No activities match your search. Try another destination or attraction.</Text>}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>{filtered.map((activity) => <DestinationCard key={activity.id} {...activity} />)}</Grid></>}
  </Box>;
};
