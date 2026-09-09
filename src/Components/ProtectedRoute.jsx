import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { isAdmin } from "../Redux/Authantication/auth.session";

export default function ProtectedRoute({ children, admin = false }) {
  const { isAuth, activeUser } = useSelector((store) => store.LoginReducer);
  const location = useLocation();
  if (!isAuth) return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && !isAdmin(activeUser)) return <Box p={10}><Heading size="lg">Administrator access required</Heading><Text my={4}>Your account does not have access to the admin panel.</Text><Button as={Link} to="/">Back to home</Button></Box>;
  return children;
}
