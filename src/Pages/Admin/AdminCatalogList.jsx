import "./adminProduct.css";
import "font-awesome/css/font-awesome.min.css";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminCatalogList({ title, reducerName, fetchAction, deleteAction, editPath, searchFields, renderFields }) {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((store) => store[reducerName]);
  const [limit, setLimit] = useState(5);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    setMessage("");
    // The reducer exposes the failure so the user can retry without an unhandled promise.
    return dispatch(fetchAction()).catch(() => {});
  }, [dispatch, fetchAction]);

  useEffect(() => { load(); }, [load]);

  const deleteRecord = async (id) => {
    if (isLoading) return;
    setMessage("");
    setDeletingId(id);
    try {
      await dispatch(deleteAction(id));
      setMessage(`${title} removed successfully.`);
    } catch {
      // Failed deletions leave the record in the reducer and show its error below.
    } finally {
      setDeletingId(null);
    }
  };

  const matching = data.filter((item) => searchFields.some((field) => String(item[field] ?? "").toLowerCase().includes(query)));

  return (
    <div className="adminProductMain">
      <AdminSidebar />
      <div className="adminProductbox">
        <form className="filterProdcut" onSubmit={(event) => {
          event.preventDefault();
          setQuery(input.trim().toLowerCase());
          setLimit(5);
          setMessage("");
        }}>
          <input aria-label={`Search ${title.toLowerCase()}s`} placeholder={`Search ${title}s`} value={input} onChange={(event) => setInput(event.target.value)} />
          <button type="submit">Search</button>
          <button type="button" onClick={load} disabled={isLoading}>Refresh</button>
          {matching.length > limit && <button type="button" onClick={() => setLimit((value) => value + 5)}>Load More</button>}
        </form>
        <div className="head"><h1>All {title}s</h1></div>
        {isLoading && <p role="status">{deletingId === null ? `Loading ${title.toLowerCase()}s...` : `Deleting ${title.toLowerCase()}...`}</p>}
        {error && <div role="alert" className="adminListFeedback">{error} <button onClick={load} disabled={isLoading}>Retry loading</button></div>}
        {message && <p role="status" className="adminListFeedback">{message}</p>}
        {!isLoading && !error && matching.length === 0 && <p>No {title.toLowerCase()}s match this search.</p>}
        {matching.slice(0, limit).map((item) => (
          <div className="adminProductlist" key={item.id}>
            {renderFields(item)}
            <span>
              <button disabled={isLoading} onClick={() => deleteRecord(item.id)} aria-label={`Delete ${title.toLowerCase()} ${item.name || item.number || item.id}`}>
                Delete <i className="fa fa-trash" aria-hidden="true" />
              </button>
              <Link className="adminEditLink" to={`${editPath}?id=${encodeURIComponent(item.id)}`} aria-label={`Edit ${title.toLowerCase()} ${item.name || item.number || item.id}`}>
                Edit <i className="fa fa-pencil" aria-hidden="true" />
              </Link>
            </span>
          </div>
        ))}
        {!error && <p className="adminListFeedback">Showing {Math.min(limit, matching.length)} of {matching.length} {title.toLowerCase()}s</p>}
      </div>
    </div>
  );
}
