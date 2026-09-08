import { Box, Button, Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
export default function WebBookingBanner() {
  return <Box width="85%" border="1px solid #BDBDBD" borderRadius="7px" margin="auto" mt={10}>
    <Card direction={{ base: "column", md: "row" }} overflow="hidden" variant="outline">
      <Image objectFit="cover" width={{ base: "100%", md: "35%" }} maxHeight={{ base: "240px", md: "none" }}
        src="https://a.travel-assets.com/mad-service/footer/bnaBanners/BEX_ROME_iStock_72dpi.jpg" alt="Traveler exploring a city" />
      <CardBody p={{ base: 5, md: 7 }} textAlign="left">
        <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold">Your trip, all in one place</Heading>
        <Text py={4}>Compare stays and flights, choose your travel dates, and review the price before booking.</Text>
        <Text pb={5}>Sign in to keep your confirmation details in Trips and cancel a booking when your plans change.</Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
          <Button as={RouterLink} to="/stay" colorScheme="blue">Browse stays</Button>
          <Button as={RouterLink} to="/trips" variant="outline" colorScheme="blue">View my trips</Button>
        </Stack>
      </CardBody>
    </Card>
  </Box>;
}
