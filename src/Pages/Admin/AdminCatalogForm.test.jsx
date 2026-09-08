import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { applyMiddleware, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import AdminCatalogForm from "./AdminCatalogForm";

const fields = [
  { name: "name", label: "Name" },
  { name: "price", label: "Price", type: "number" },
];

function showForm(actions, route = "/admin/adminstay") {
  const store = legacy_createStore((state = {}) => state, applyMiddleware(thunk));
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <AdminCatalogForm title="Hotel" fields={fields} listPath="/admin/hotels" {...actions} />
      </MemoryRouter>
    </Provider>
  );
}

test("a failed save keeps entered values and shows the error", async () => {
  const addAction = jest.fn(() => async () => { throw new Error("Save failed. Please retry."); });
  showForm({ addAction, fetchAction: jest.fn(), updateAction: jest.fn() });
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Demo hotel" } });
  fireEvent.change(screen.getByLabelText("Price"), { target: { value: "1500" } });
  fireEvent.click(screen.getByRole("button", { name: "Add Hotel" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Save failed");
  expect(screen.getByLabelText("Name")).toHaveValue("Demo hotel");
  expect(screen.getByLabelText("Price")).toHaveValue(1500);
  expect(screen.queryByText(/added successfully/)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Add Hotel" })).toBeEnabled();
});

test("editing loads the record from the query ID and updates rather than adds", async () => {
  const fetchAction = jest.fn(() => async () => ({ id: 42, name: "Original hotel", price: 1500 }));
  const updateAction = jest.fn(() => async () => ({ id: 42 }));
  const addAction = jest.fn();
  showForm({ addAction, fetchAction, updateAction }, "/admin/adminstay?id=42");

  await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue("Original hotel"));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Edited hotel" } });
  fireEvent.click(screen.getByRole("button", { name: "Save Hotel" }));

  expect(await screen.findByRole("status")).toHaveTextContent("Hotel changes saved.");
  expect(fetchAction).toHaveBeenCalledWith("42");
  expect(updateAction).toHaveBeenCalledWith("42", { name: "Edited hotel", price: 1500 });
  expect(addAction).not.toHaveBeenCalled();
});

test("an unavailable edit record cannot be submitted as a blank update", async () => {
  const fetchAction = jest.fn(() => async () => { throw new Error("Record unavailable"); });
  const updateAction = jest.fn();
  showForm({ addAction: jest.fn(), fetchAction, updateAction }, "/admin/adminstay?id=404");
  expect(await screen.findByRole("alert")).toHaveTextContent("Record unavailable");
  expect(screen.getByRole("button", { name: "Save Hotel" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Retry loading hotel" })).toBeEnabled();
  expect(updateAction).not.toHaveBeenCalled();
});
