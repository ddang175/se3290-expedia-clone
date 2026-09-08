const USER_KEY = "MkuserData";
const AUTH_KEY = "MkisAuth";

export const publicUser = ({ password, ...user }) => user;
export const isAdmin = (user) => user?.role === "admin";

export const readSession = () => {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      const user = JSON.parse(storage.getItem(USER_KEY));
      if (JSON.parse(storage.getItem(AUTH_KEY)) === true && user && typeof user === "object" && user.number) {
        const profile = publicUser(user);
        if (Object.prototype.hasOwnProperty.call(user, "password")) {
          storage.setItem(USER_KEY, JSON.stringify(profile));
        }
        return { activeUser: profile, isAuth: true };
      }
    } catch {
      // A malformed saved session must not prevent the app from loading.
    }
  }
  return { activeUser: {}, isAuth: false };
};

export const clearSession = () => {
  for (const storage of [sessionStorage, localStorage]) {
    storage.removeItem(USER_KEY);
    storage.removeItem(AUTH_KEY);
  }
};

export const saveSession = (user, remember = false) => {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  const profile = publicUser(user);
  storage.setItem(USER_KEY, JSON.stringify(profile));
  storage.setItem(AUTH_KEY, JSON.stringify(true));
  return profile;
};
