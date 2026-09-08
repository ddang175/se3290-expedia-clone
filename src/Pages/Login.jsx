import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import firebase_app from "../01_firebase/config_firebase";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, login_user } from "../Redux/Authantication/auth.action";

const auth = getAuth(firebase_app);

export const Login = () => {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verify, setVerify] = useState(false);
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const verifier = useRef(null);
  const confirmation = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuth, user, isLoading, usersLoaded, error: accountError } = useSelector((store) => store.LoginReducer);
  const from = location.state?.from;
  const requestedPath = typeof from === "string" ? from : `${from?.pathname || "/"}${from?.search || ""}${from?.hash || ""}`;
  const destination = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/";

  useEffect(() => {
    dispatch(fetch_users);
    return () => {
      verifier.current?.clear();
      verifier.current = null;
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuth) navigate(destination, { replace: true });
  }, [isAuth, navigate, destination]);

  async function handleVerifyNumber() {
    setError("");
    setSuccess("");
    if (!/^\d{10}$/.test(number)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!user.some((profile) => String(profile.number) === number)) {
      setError("An account does not exist for this number. Please create an account.");
      return;
    }
    setBusy("send");
    try {
      if (!verifier.current) {
        verifier.current = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
      }
      confirmation.current = await signInWithPhoneNumber(auth, `+91${number}`, verifier.current);
      setVerify(true);
      setSuccess(`OTP sent to +91 ${number}.`);
    } catch (failure) {
      setError(failure.message || "Could not send an OTP. Please try again.");
      verifier.current?.clear();
      verifier.current = null;
    } finally {
      setBusy("");
    }
  }

  async function verifyCode() {
    setError("");
    setSuccess("");
    if (!/^\d{6}$/.test(otp) || !confirmation.current) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setBusy("verify");
    try {
      const accounts = await dispatch(fetch_users);
      if (!accounts) throw new Error("Could not load your account. Please try again.");
      const profile = accounts.find((entry) => String(entry.number) === number);
      if (!profile) throw new Error("This account no longer exists. Please create an account.");
      const credential = await confirmation.current.confirm(otp);
      if (profile.firebase_uid && profile.firebase_uid !== credential.user.uid) {
        throw new Error("This phone sign-in does not match the registered account.");
      }
      dispatch(login_user(profile, remember));
    } catch (failure) {
      setError(failure.code === "auth/invalid-verification-code" ? "Invalid OTP. Please try again." : failure.message || "Could not sign in. Please try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mainLogin">
      <div id="recaptcha-container"></div>
      <div className="loginBx" style={{ maxWidth: "calc(100vw - 32px)" }}>
        <div className="logoImgdiv"><img className="imglogo" src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg" alt="Expedia" /></div>
        <div className="loginHead"><h1>Sign in</h1></div>
        {location.state?.registrationComplete && <p>Your account is ready. Sign in with your phone number.</p>}
        <div className="loginInputB">
          <label htmlFor="login-number">Mobile number (+91)</label>
          <span>
            <input style={{ minWidth: 0 }} id="login-number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} readOnly={verify || Boolean(busy)} name="number" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="10-digit number" />
            {!verify && <button style={{ minWidth: "88px", whiteSpace: "nowrap" }} disabled={Boolean(busy) || isLoading || !usersLoaded} onClick={handleVerifyNumber} id="nextText">{busy === "send" ? "Please wait..." : "Sign in"}</button>}
          </span>
        </div>
        {verify && (
          <div className="loginInputB">
            <label htmlFor="login-otp">Enter your OTP</label>
            <span>
              <input style={{ minWidth: 0 }} id="login-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} name="otp" value={otp} onChange={(event) => setOtp(event.target.value)} disabled={Boolean(busy)} />
              <button style={{ minWidth: "88px", whiteSpace: "nowrap" }} disabled={Boolean(busy)} onClick={verifyCode}>{busy === "verify" ? "Signing in..." : "Continue"}</button>
            </span>
            <button style={{ minWidth: "88px", whiteSpace: "nowrap" }} disabled={Boolean(busy)} onClick={() => { setVerify(false); setOtp(""); setSuccess(""); confirmation.current = null; verifier.current?.clear(); verifier.current = null; }}>Change number</button>
          </div>
        )}
        {accountError && <div role="alert"><p>{accountError}</p><button style={{ minWidth: "88px", whiteSpace: "nowrap" }} onClick={() => dispatch(fetch_users)} disabled={isLoading}>Retry loading accounts</button></div>}
        <div className="loginTerms">
          <Link to="/register" state={{ from }}>Create an account</Link>
          <label className="inpChecbx"><input className="inp" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> <span>Keep me signed in</span></label>
          <p>Select this to stay signed in on this device until you sign out. Leave it unchecked on shared devices.</p>
          <p>Educational travel booking project. Use a configured Firebase test number for development.</p>
        </div>
        <p id="loginMesageError" role={error ? "alert" : undefined} style={{ position: "static" }}>{error}</p>
        <p id="loginMesageSuccess" role="status" style={{ position: "static" }}>{success}</p>
      </div>
    </div>
  );
};
