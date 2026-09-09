import { Box, Container, Link, SimpleGrid, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
export default function Footer() {
  return <Box as="footer" bg={useColorModeValue("gray.50", "gray.900")} color={useColorModeValue("gray.700", "gray.200")} mt={10}>
    <Container maxW="6xl" py={10}>
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={8} textAlign="left">
        <Stack spacing={4}><Text fontWeight="extrabold" fontSize="xl">Chalo Ghume</Text>
          <Text fontSize="sm">Search stays and flights, explore activities, and keep your bookings together.</Text>
        </Stack>
        <Stack as="nav" aria-label="Explore" align="flex-start" spacing={3}>
          <Text fontWeight="semibold" fontSize="lg">Explore</Text>
          <Link as={RouterLink} to="/">Home</Link><Link as={RouterLink} to="/stay">Stays</Link>
          <Link as={RouterLink} to="/flight">Flights</Link><Link as={RouterLink} to="/ThingsToDo">Things to do</Link>
        </Stack>
        <Stack as="nav" aria-label="Your bookings" align="flex-start" spacing={3}>
          <Text fontWeight="semibold" fontSize="lg">Your bookings</Text><Link as={RouterLink} to="/trips">Trips</Link>
          <Text fontSize="sm">Sign in to review your booking confirmations and cancel a reservation.</Text>
        </Stack>
      </SimpleGrid>
      <Text fontSize="sm" mt={8} pt={5} borderTopWidth="1px">SE3290 student project inspired by Expedia, adapted from the original Chalo Ghume project.</Text>
    </Container>
  </Box>;
}
