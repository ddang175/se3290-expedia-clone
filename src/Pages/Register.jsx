import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import firebase_app from "../01_firebase/config_firebase";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, userRigister } from "../Redux/Authantication/auth.action";

const auth = getAuth(firebase_app);

export const Register = () => {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [verify, setVerify] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const verifier = useRef(null);
  const confirmation = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isLoading, usersLoaded, error: accountError } = useSelector((store) => store.LoginReducer);

  useEffect(() => {
    dispatch(fetch_users);
    return () => {
      verifier.current?.clear();
      verifier.current = null;
    };
  }, [dispatch]);

  async function handleVerifyNumber() {
    setError("");
    setSuccess("");
    if (!/^\d{10}$/.test(number)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (user.some((profile) => String(profile.number) === number)) {
      setError("An account already exists for this number. Please sign in.");
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
      const credential = await confirmation.current.confirm(otp);
      setVerifiedUser(credential.user);
      setSuccess("Phone number verified. Enter your name to create your account.");
    } catch (failure) {
      setError(failure.code === "auth/invalid-verification-code" ? "Invalid OTP. Please try again." : failure.message || "Could not verify your OTP. Please try again.");
    } finally {
      setBusy("");
    }
  }

  async function handleRegisterUser() {
    setError("");
    if (!verifiedUser) {
      setError("Verify your phone number first.");
      return;
    }
    if (!name.trim()) {
      setError("Enter your full name.");
      return;
    }
    setBusy("save");
    try {
      await dispatch(userRigister({
        number,
        user_name: name.trim(),
        firebase_uid: verifiedUser.uid,
        email: "",
        dob: "",
        gender: "",
        marital_status: null,
      }));
      navigate("/login", { replace: true, state: { registrationComplete: true, from: location.state?.from } });
    } catch (failure) {
      setError(failure.message || "Could not save your account. Please try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="mainLogin">
      <div id="recaptcha-container"></div>
      <div className="loginBx" style={{ maxWidth: "calc(100vw - 32px)" }}>
        <div className="logoImgdivReg"><img className="imglogoReg" src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg" alt="Expedia" /></div>
        <div className="loginHead"><h1>Create an account</h1></div>
        {!verifiedUser && <div className="loginInputB" id="loginNumber">
          <label htmlFor="register-number">Mobile number (+91)</label>
          <span>
            <input style={{ minWidth: 0 }} id="register-number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} readOnly={verify || Boolean(busy)} name="number" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="10-digit number" />
            {!verify && <button style={{ minWidth: "88px", whiteSpace: "nowrap" }} disabled={Boolean(busy) || isLoading || !usersLoaded} onClick={handleVerifyNumber} id="nextButton">{busy === "send" ? "Please wait..." : "Next"}</button>}
          </span>
        </div>}
        {verify && !verifiedUser && <div className="loginInputB" id="loginOtp">
          <label htmlFor="register-otp">Enter OTP</label>
          <span>
            <input style={{ minWidth: 0 }} id="register-otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} name="otp" value={otp} onChange={(event) => setOtp(event.target.value)} disabled={Boolean(busy)} />
            <button style={{ minWidth: "88px", whiteSpace: "nowrap" }} disabled={Boolean(busy)} onClick={verifyCode}>{busy === "verify" ? "Verifying..." : "Next"}</button>
          </span>
          <button style={{ minWidth: "88px", whiteSpace: "nowrap" }} disabled={Boolean(busy)} onClick={() => { setVerify(false); setOtp(""); setSuccess(""); confirmation.current = null; verifier.current?.clear(); verifier.current = null; }}>Change number</button>
        </div>}
        {verifiedUser && <>
          <div className="loginInputB">
            <label htmlFor="register-name">Your full name</label>
            <span><input style={{ minWidth: 0 }} id="register-name" type="text" autoComplete="name" name="user_name" value={name} onChange={(event) => setName(event.target.value)} disabled={Boolean(busy)} /></span>
          </div>
          <div className="loginInputB"><button style={{ minWidth: "88px", whiteSpace: "nowrap" }} onClick={handleRegisterUser} disabled={Boolean(busy) || isLoading}>{busy === "save" ? "Creating account..." : "Continue"}</button></div>
        </>}
        {accountError && !usersLoaded && <div role="alert"><p>{accountError}</p><button style={{ minWidth: "88px", whiteSpace: "nowrap" }} onClick={() => dispatch(fetch_users)} disabled={isLoading}>Retry loading accounts</button></div>}
        <div className="loginTerms">
          <Link to="/login" state={{ from: location.state?.from }}>Already have an account? Sign in</Link>
          <p>Use your phone number and an OTP to sign in.</p>
          <p>Educational travel booking project. Use a configured Firebase test number for development.</p>
        </div>
        <p id="loginMesageError" role={error ? "alert" : undefined} style={{ position: "static" }}>{error}</p>
        <p id="loginMesageSuccess" role="status" style={{ position: "static" }}>{success}</p>
      </div>
    </div>
  );
};
