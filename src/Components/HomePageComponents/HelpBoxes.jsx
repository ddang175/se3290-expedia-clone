import { Box, Heading, HStack, SimpleGrid, Text, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BsPencilFill, BsBuilding } from "react-icons/bs";
import { RiMapPinLine } from "react-icons/ri";
const cards = [
  { title: "Find your next stay", text: "Search by property or area, then compare prices and guest ratings.", to: "/stay", icon: BsBuilding },
  { title: "View or cancel a booking", text: "Open Trips to see confirmation details and cancel a reservation.", to: "/trips", icon: BsPencilFill },
  { title: "Explore things to do", text: "Find tours and attractions by destination or activity name.", to: "/ThingsToDo", icon: RiMapPinLine },
];
export default function HelpBoxes() {
  return <Box width="85%" margin="auto" mt={10}>
    <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="semibold" textAlign="left">Here to help keep you on the move</Heading>
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={4}>
      {cards.map(({ title, text, to, icon }) => <LinkBox key={to} border="1px solid #E0E0E0" rounded="7px" p={4} _hover={{ boxShadow: "md" }}>
        <HStack justifyContent="space-between" alignItems="start" gap={3}><Heading textAlign="left" fontSize="20px"><LinkOverlay as={RouterLink} to={to}>{title}</LinkOverlay></Heading><Icon as={icon} flexShrink={0} mt={1} /></HStack>
        <Text mt={3} textAlign="left" color="gray.500" fontSize="sm">{text}</Text>
      </LinkBox>)}
    </SimpleGrid>
  </Box>;
}
