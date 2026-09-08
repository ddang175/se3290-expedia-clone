import { SELECTED_DATE_AND_CITY, SELECTED_CITY, HOTEL_FAILURE, HOTEL_REQUEST, GET_HOTEL_SUCCESS, POST_HOTEL_SUCCESS, NEW_GET_HOTELS_SUCCESS, DELETE_HOTEL } from "./actionType";
const initialState = { data: [], isLoading: false, isError: false, error: "", checkInDate: null, checkOutDate: null, selectedCity: null };
export const StayReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECTED_DATE_AND_CITY: return { ...state, checkInDate: payload.checkInDate, checkOutDate: payload.checkOutDate };
    case SELECTED_CITY: return { ...state, selectedCity: payload.selectedCity };
    case HOTEL_REQUEST: return { ...state, isLoading: true, isError: false, error: "" };
    case HOTEL_FAILURE: return { ...state, isLoading: false, isError: true, error: payload || "Unable to load hotels." };
    case GET_HOTEL_SUCCESS:
    case NEW_GET_HOTELS_SUCCESS: return { ...state, isLoading: false, isError: false, data: payload };
    case POST_HOTEL_SUCCESS: return { ...state, isLoading: false, data: [...state.data, payload] };
    case DELETE_HOTEL: return { ...state, isLoading: false, data: state.data.filter((hotel) => String(hotel.id) !== String(payload)) };
    default: return state;
  }
};
