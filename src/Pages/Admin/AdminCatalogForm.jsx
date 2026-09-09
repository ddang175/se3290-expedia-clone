import "./Admin.Module.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminCatalogForm({ title, fields, listPath, addAction, fetchAction, updateAction }) {
  const initialState = useMemo(() => Object.fromEntries(fields.map(({ name }) => [name, ""])), [fields]);
  const [record, setRecord] = useState(initialState);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(Boolean(id));
  const [loaded, setLoaded] = useState(!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setRecord(initialState);
    setError("");
    setMessage("");
    setLoaded(!id);
    setLoading(Boolean(id));
    if (id) {
      dispatch(fetchAction(id)).then((data) => {
        if (active) {
          setRecord(Object.fromEntries(fields.map(({ name }) => [name, data[name] ?? ""])));
          setLoaded(true);
        }
      }).catch((failure) => {
        if (active) setError(failure.message);
      }).finally(() => {
        if (active) setLoading(false);
      });
    }
    return () => { active = false; };
  }, [dispatch, fetchAction, fields, id, initialState, retry]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || loading || !loaded) return;
    setError("");
    setMessage("");
    const payload = Object.fromEntries(fields.map(({ name }) => [name, String(record[name]).trim()]));
    if (fields.some(({ name, optional }) => !optional && !payload[name]) || !Number.isFinite(Number(payload.price)) || Number(payload.price) <= 0) {
      setError("Complete the required fields and enter a price greater than zero.");
      return;
    }
    if (payload.from && payload.from.toLowerCase() === payload.to.toLowerCase()) {
      setError("Departure and destination must be different.");
      return;
    }
    payload.price = Number(payload.price);
    setSaving(true);
    try {
      await dispatch(id ? updateAction(id, payload) : addAction(payload));
      setMessage(id ? `${title} changes saved.` : `${title} added successfully.`);
      if (!id) setRecord(initialState);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adminFlightMai">
      <AdminSidebar />
      <div className="adminFlightBox">
        <div className="adminHead"><h2>{id ? `Edit ${title}` : `Admin Panel for ${title}s`}</h2></div>
        {loading && <p role="status">Loading {title.toLowerCase()}...</p>}
        {error && <p role="alert" className="adminFeedback">{error}</p>}
        {id && !loading && !loaded && <button onClick={() => setRetry((value) => value + 1)}>Retry loading {title.toLowerCase()}</button>}
        {message && <p role="status" className="adminFeedback">{message} <Link to={listPath}>View all {title.toLowerCase()}s</Link></p>}
        <div className="adminFlightInputs">
          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label, type = "text", optional = false }) => (
              <div className="adminFlightInputBx" key={name}>
                <label htmlFor={`${title}-${name}`}>{label}{optional ? " (optional)" : ""}</label>
                <input
                  id={`${title}-${name}`} name={name} type={type}
                  min={type === "number" ? "0.01" : undefined} step={type === "number" ? "0.01" : undefined}
                  required={!optional} value={record[name]} disabled={loading || saving || !loaded}
                  onChange={(event) => {
                    setMessage("");
                    setRecord((previous) => ({ ...previous, [name]: event.target.value }));
                  }}
                />
              </div>
            ))}
            <div className="adminFlightInputBx">
              <Link to={listPath}>Back to {title.toLowerCase()}s</Link>
              <button type="submit" disabled={loading || saving || !loaded}>{saving ? "Saving..." : `${id ? "Save" : "Add"} ${title}`}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
