import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { LoginReducer } from "./auth.reducer";
import { readSession } from "./auth.session";
import { Login } from "../../Pages/Login";
import { Register } from "../../Pages/Register";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signOut: jest.fn(),
  RecaptchaVerifier: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
}));
jest.mock("../../01_firebase/config_firebase", () => ({}));

const confirm = jest.fn();
const clear = jest.fn();
const profile = { id: 1, number: "1234567890", user_name: "Test traveler", role: "user" };

function Destination() {
  const location = useLocation();
  return <p>Destination: {location.pathname}{location.search}{location.hash}</p>;
}

function renderAuth(pathname, state) {
  const store = legacy_createStore(combineReducers({ LoginReducer }), applyMiddleware(thunk));
  render(<Provider store={store}><MemoryRouter initialEntries={[{ pathname, state }]}><Routes>
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/stay" element={<Destination />} />
    <Route path="/" element={<Destination />} />
  </Routes></MemoryRouter></Provider>);
  return store;
}

beforeEach(() => {
  jest.resetAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  axios.get.mockResolvedValue({ data: [] });
  RecaptchaVerifier.mockImplementation(() => ({ clear }));
  signInWithPhoneNumber.mockResolvedValue({ confirm });
  confirm.mockResolvedValue({ user: { uid: "firebase-test-uid" } });
});

async function completeRegistrationOtp() {
  renderAuth("/register");
  await waitFor(() => expect(screen.getByRole("button", { name: "Next" })).toBeEnabled());
  fireEvent.change(screen.getByLabelText("Mobile number (+91)"), { target: { value: "1234567890" } });
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.change(await screen.findByLabelText("Enter OTP"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.change(await screen.findByLabelText("Your full name"), { target: { value: "Test traveler" } });
}

test("registration remains on the form until the account is saved", async () => {
  let finishSave;
  axios.post.mockReturnValue(new Promise((resolve) => { finishSave = resolve; }));
  await completeRegistrationOtp();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(screen.getByRole("button", { name: "Creating account..." })).toBeDisabled();
  expect(screen.getByLabelText("Your full name")).toHaveValue("Test traveler");
  expect(screen.queryByRole("heading", { name: "Sign in" })).not.toBeInTheDocument();
  expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/users$/), expect.objectContaining({ firebase_uid: "firebase-test-uid", role: "user" }));
  await act(async () => { finishSave({ data: profile }); });
  expect(await screen.findByText("Your account is ready. Sign in with your phone number.")).toBeInTheDocument();
  expect(signInWithPhoneNumber).toHaveBeenCalledWith(expect.anything(), "+911234567890", expect.anything());
  expect(clear).toHaveBeenCalled();
});

test("a failed account save preserves the verified form for retry", async () => {
  axios.post.mockRejectedValue(new Error("Save failed"));
  await completeRegistrationOtp();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Save failed");
  expect(screen.getByLabelText("Your full name")).toHaveValue("Test traveler");
  await waitFor(() => expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled());
  expect(screen.queryByRole("heading", { name: "Sign in" })).not.toBeInTheDocument();
});

test("login refreshes the profile, remembers the session, and returns to the requested search", async () => {
  axios.get.mockResolvedValueOnce({ data: [profile] }).mockResolvedValueOnce({ data: [{ ...profile, role: "admin" }] });
  renderAuth("/login", { from: { pathname: "/stay", search: "?city=Chicago", hash: "#rooms" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled());
  fireEvent.change(screen.getByLabelText("Mobile number (+91)"), { target: { value: "1234567890" } });
  fireEvent.click(screen.getByLabelText("Keep me signed in"));
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  fireEvent.change(await screen.findByLabelText("Enter your OTP"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(await screen.findByText("Destination: /stay?city=Chicago#rooms")).toBeInTheDocument();
  expect(readSession()).toEqual({ isAuth: true, activeUser: { ...profile, role: "admin" } });
  expect(localStorage.getItem("MkisAuth")).toBe("true");
  expect(confirm).toHaveBeenCalledWith("123456");
});

test("invalid OTP keeps the login form available and does not establish a session", async () => {
  axios.get.mockResolvedValue({ data: [profile] });
  confirm.mockRejectedValue({ code: "auth/invalid-verification-code", message: "Invalid code" });
  renderAuth("/login");
  await waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled());
  fireEvent.change(screen.getByLabelText("Mobile number (+91)"), { target: { value: "1234567890" } });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  fireEvent.change(await screen.findByLabelText("Enter your OTP"), { target: { value: "000000" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Invalid OTP. Please try again.");
  expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  expect(readSession().isAuth).toBe(false);
});
