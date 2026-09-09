import { Admin } from "./Admin/AdminFlight";
import { AdminStay } from "./Admin/AdminStay";
import React from 'react'
import { Route, Routes } from "react-router-dom";
// import { HomePage } from "./HomePage";
import { AdminDashboard } from "./Admin/AdminDashboard";
import { AdminProducts } from "./Admin/AdminProducts";
import { AllHotels } from "./Admin/AllHotels";
import { Destination } from "./ThingsTodo/Destination";
import HomePage from "./HomePage";
import { Login } from "./Login";
import { Register } from "./Register";
import StayData from "./Stay/StayData";
import CheckoutPage from "./CheckoutPage";
import FlightData from "./Flights/FlightData";
import Trips from "./Trips";
import ProtectedRoute from "../Components/ProtectedRoute";

export const AllRoutes = () => {
    return (
        <>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/adminflight" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
            <Route path="/admin/adminstay" element={<ProtectedRoute admin><AdminStay /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute admin><AdminProducts /></ProtectedRoute>} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/admin/hotels" element={<ProtectedRoute admin><AllHotels /></ProtectedRoute>} />
            <Route path="/ThingsToDo" element={<Destination/>}/>
            <Route path="/stay" element={<StayData />} />
            <Route path="/flight" element={<FlightData />} />

            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} ></Route>
            <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </>
      );
}

// add
