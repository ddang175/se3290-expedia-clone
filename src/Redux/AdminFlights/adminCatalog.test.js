import axios from "axios";
import { API_BASE_URL } from "../../baseurl";
import { addFlight, updateFlight, DeleteFlightProducts } from "./action";
import { FlightReducer } from "./reducer";
import { addHotel, updateHotel, DeleteHotel } from "../AdminHotel/action";
import { HotelReducer } from "../AdminHotel/reducer";

jest.mock("axios", () => ({
  __esModule: true,
  default: { post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe.each([
  ["flight", addFlight, updateFlight, DeleteFlightProducts, FlightReducer],
  ["hotel", addHotel, updateHotel, DeleteHotel, HotelReducer],
])("%s administration", (resource, add, update, remove, reducer) => {
  test("does not report a save until the API finishes", async () => {
    let resolve;
    axios.post.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const dispatch = jest.fn();
    const payload = { name: "Demonstration record", price: 1250 };
    const operation = add(payload)(dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/${resource}`, payload);
    resolve({ data: { ...payload, id: 12 } });

    await expect(operation).resolves.toEqual({ ...payload, id: 12 });
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[1][0].payload.id).toBe(12);
  });

  test("updates one existing record with PATCH", async () => {
    axios.patch.mockResolvedValueOnce({ data: { id: 12, price: 1350 } });
    const dispatch = jest.fn();
    await update(12, { price: 1350 })(dispatch);
    expect(axios.patch).toHaveBeenCalledWith(`${API_BASE_URL}/${resource}/12`, { price: 1350 });
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("only removes the requested item after a successful DELETE", async () => {
    const previous = Object.freeze({
      ...reducer(undefined, {}),
      data: Object.freeze([Object.freeze({ id: 12, name: "Keep full name" }), Object.freeze({ id: 13 })]),
    });
    let state = previous;
    const dispatch = (action) => { state = reducer(state, action); };
    let resolve;
    axios.delete.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    const operation = remove("12")(dispatch);

    expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/${resource}/12`);
    expect(state.data).toEqual(previous.data);
    expect(state.isLoading).toBe(true);
    resolve({ data: {} });
    await operation;

    expect(state.data).toEqual([{ id: 13 }]);
    expect(state.isLoading).toBe(false);
    expect(previous.data[0].name).toBe("Keep full name");
    expect(previous.data).toHaveLength(2);
  });

  test("a failed DELETE retains the record and stops loading", async () => {
    const previous = Object.freeze({ ...reducer(undefined, {}), data: Object.freeze([{ id: 12 }]) });
    let state = previous;
    axios.delete.mockRejectedValueOnce(new Error("API unavailable"));
    await expect(remove(12)((action) => { state = reducer(state, action); })).rejects.toThrow("Could not delete");

    expect(state.data).toEqual([{ id: 12 }]);
    expect(state.isLoading).toBe(false);
    expect(state.isError).toBe(true);
    expect(state.error).toMatch(/try again/);
    expect(previous.isError).toBe(false);
  });
});
