import { clearSession, isAdmin, readSession, saveSession } from "./auth.session";
import { LoginReducer } from "./auth.reducer";
import { LOGIN_SUCCESSFUL, LOGOUT_USER, REGISTER_SUCCESSFUL } from "./auth.actionType";

const profile = { id: 1, number: "1234567890", user_name: "Test traveler", password: "legacy-password", role: "user" };

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

test("an ordinary login survives refresh without saving a legacy password", () => {
  saveSession(profile);
  expect(readSession()).toEqual({ isAuth: true, activeUser: { id: 1, number: "1234567890", user_name: "Test traveler", role: "user" } });
  expect(sessionStorage.getItem("MkuserData")).not.toContain("password");
  expect(localStorage.getItem("MkisAuth")).toBeNull();
  expect(LoginReducer(undefined, { type: "initial" }).isAuth).toBe(true);
});

test("remembered login persists locally and a later temporary login replaces it", () => {
  saveSession(profile, true);
  expect(localStorage.getItem("MkisAuth")).toBe("true");
  expect(sessionStorage.getItem("MkisAuth")).toBeNull();
  saveSession({ ...profile, number: "9876543210" });
  expect(localStorage.getItem("MkisAuth")).toBeNull();
  expect(readSession().activeUser.number).toBe("9876543210");
  clearSession();
  expect(readSession().isAuth).toBe(false);
});

test("malformed or incomplete saved sessions do not crash or authenticate", () => {
  localStorage.setItem("MkuserData", "invalid-json");
  localStorage.setItem("MkisAuth", "true");
  expect(readSession()).toEqual({ activeUser: {}, isAuth: false });
  localStorage.setItem("MkuserData", "{}");
  expect(readSession().isAuth).toBe(false);
});

test("restoring an older session removes its stored password", () => {
  localStorage.setItem("MkuserData", JSON.stringify(profile));
  localStorage.setItem("MkisAuth", "true");
  expect(readSession().isAuth).toBe(true);
  expect(JSON.parse(localStorage.getItem("MkuserData"))).not.toHaveProperty("password");
});

test("admin access requires an explicit admin role", () => {
  expect(isAdmin(profile)).toBe(false);
  expect(isAdmin(undefined)).toBe(false);
  expect(isAdmin({ ...profile, role: "admin" })).toBe(true);
});

test("auth transitions leave prior state intact and registration does not sign in", () => {
  const previous = Object.freeze({ ...LoginReducer(undefined, { type: "initial" }), isError: true, error: "old error" });
  const registered = LoginReducer(previous, { type: REGISTER_SUCCESSFUL, payload: profile });
  expect(registered.isAuth).toBe(false);
  expect(registered.user).toEqual([profile]);
  expect(previous.user).toEqual([]);
  const signedIn = LoginReducer(previous, { type: LOGIN_SUCCESSFUL, payload: profile });
  expect(signedIn).toMatchObject({ isAuth: true, isError: false, error: "", activeUser: profile });
  expect(previous.isAuth).toBe(false);
  expect(LoginReducer(signedIn, { type: LOGOUT_USER })).toMatchObject({ isAuth: false, activeUser: {} });
});
