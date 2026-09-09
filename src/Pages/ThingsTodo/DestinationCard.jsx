import { Box, Image, Heading, Text } from "@chakra-ui/react";
export default function DestinationCard({ image, title, price, rating, place, adress }) {
  const amount = String(price || "").trim();
  return <Box as="article" borderWidth="1px" borderRadius="lg" overflow="hidden" textAlign="left">
    <Image src={image} alt={title} width="100%" height="200px" objectFit="cover" loading="lazy" />
    <Box p={5}><Text textTransform="capitalize" fontSize="sm" color="gray.500">{place}</Text><Heading size="md" my={2}>{title}</Heading>
      <Text fontWeight="bold">{amount.startsWith("₹") ? amount : `₹${amount}`}</Text>
      {adress && <Text mt={2} fontSize="sm">{adress}</Text>}
      <Text mt={3} fontSize="sm">{Number(rating) || 0} reviews</Text>
    </Box>
  </Box>;
}
