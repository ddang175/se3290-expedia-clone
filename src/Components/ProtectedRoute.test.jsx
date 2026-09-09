import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function LoginDestination() {
  const location = useLocation();
  return <p>Login destination: {location.state.from.pathname}{location.state.from.search}</p>;
}

function open(state, admin = false) {
  render(<Provider store={createStore(() => ({ LoginReducer: state }))}><MemoryRouter initialEntries={["/checkout?type=hotel&id=4"]}><Routes><Route path="/checkout" element={<ProtectedRoute admin={admin}><p>Protected content</p></ProtectedRoute>} /><Route path="/login" element={<LoginDestination />} /></Routes></MemoryRouter></Provider>);
}

test("retains the selected booking when an anonymous visitor must sign in", () => {
  open({ isAuth: false, activeUser: {} });
  expect(screen.getByText("Login destination: /checkout?type=hotel&id=4")).toBeInTheDocument();
  expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
});

test("denies administrator content to regular signed-in users", () => {
  open({ isAuth: true, activeUser: { role: "user" } }, true);
  expect(screen.getByText("Administrator access required")).toBeInTheDocument();
  expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
});

test("allows an administrator to view administrator content", () => {
  open({ isAuth: true, activeUser: { role: "admin" } }, true);
  expect(screen.getByText("Protected content")).toBeInTheDocument();
});
