import axios from "axios";
import { waitFor } from "@testing-library/react";
import { signOut } from "firebase/auth";
import { fetch_users, login_user, logout_user, userRigister } from "./auth.action";
import { readSession, saveSession } from "./auth.session";
import { GET_USERS, LOGOUT_USER, REGISTER_ERROR, REGISTER_SUCCESSFUL } from "./auth.actionType";

jest.mock("axios", () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock("firebase/auth", () => ({ getAuth: jest.fn(() => ({})), signOut: jest.fn() }));
jest.mock("../../01_firebase/config_firebase", () => ({}));

const profile = { id: 1, number: "1234567890", user_name: "Traveler", password: "legacy-password" };

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  axios.get.mockResolvedValue({ data: [] });
  signOut.mockResolvedValue(undefined);
});

test("registration waits for the server and forces a non-admin password-free profile", async () => {
  let finishSave;
  axios.post.mockReturnValue(new Promise((resolve) => { finishSave = resolve; }));
  const dispatch = jest.fn();
  const pending = userRigister({ ...profile, role: "admin" })(dispatch);
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(axios.post).toHaveBeenCalledWith(expect.stringMatching(/\/users$/), { id: 1, number: "1234567890", user_name: "Traveler", role: "user" });
  expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: REGISTER_SUCCESSFUL }));
  finishSave({ data: { ...profile, role: "user" } });
  await expect(pending).resolves.toMatchObject({ number: "1234567890" });
  expect(dispatch).toHaveBeenCalledWith({ type: REGISTER_SUCCESSFUL, payload: { id: 1, number: "1234567890", user_name: "Traveler", role: "user" } });
});

test("duplicate registration does not POST a second account", async () => {
  axios.get.mockResolvedValue({ data: [profile] });
  const dispatch = jest.fn();
  await expect(userRigister(profile)(dispatch)).rejects.toThrow("already exists");
  expect(axios.post).not.toHaveBeenCalled();
  expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ type: REGISTER_ERROR }));
});

test("failed registration rejects so the page can keep the form open", async () => {
  axios.post.mockRejectedValue(new Error("Save failed"));
  const dispatch = jest.fn();
  await expect(userRigister(profile)(dispatch)).rejects.toThrow("Save failed");
  expect(dispatch).toHaveBeenLastCalledWith({ type: REGISTER_ERROR, payload: "Save failed" });
});

test("loading accounts and signing in never retain legacy passwords in Redux or storage", async () => {
  axios.get.mockResolvedValue({ data: [profile] });
  const dispatch = jest.fn();
  await fetch_users(dispatch);
  expect(dispatch).toHaveBeenLastCalledWith({ type: GET_USERS, payload: [{ id: 1, number: "1234567890", user_name: "Traveler" }] });
  login_user(profile, true)(dispatch);
  expect(readSession().activeUser).not.toHaveProperty("password");
  expect(localStorage.getItem("MkisAuth")).toBe("true");
});

test.each([false, true])("logout clears app sessions even if Firebase sign-out fails: %s", async (fail) => {
  saveSession(profile, true);
  sessionStorage.setItem("MkisAuth", "true");
  if (fail) signOut.mockRejectedValue(new Error("Offline"));
  const dispatch = jest.fn();
  const result = await logout_user(dispatch).catch((error) => error.message);
  expect(result).toBe(fail ? "Offline" : undefined);
  expect(signOut).toHaveBeenCalled();
  expect(readSession().isAuth).toBe(false);
  expect(localStorage.getItem("MkisAuth")).toBeNull();
  expect(sessionStorage.getItem("MkisAuth")).toBeNull();
  expect(dispatch).toHaveBeenLastCalledWith({ type: LOGOUT_USER });
});
