import {
  HOTEL_REQUEST, HOTEL_FAILURE, GET_HOTEL_SUCCESS,
  POST_HOTEL_SUCCESS, NEW_GET_HOTELS_SUCCESS, DELETE_HOTEL,
} from "./actionType";

const initialState = { data: [], hotel: null, isLoading: false, isError: false, error: "" };

export const HotelReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case HOTEL_REQUEST:
      return { ...state, isLoading: true, isError: false, error: "" };
    case HOTEL_FAILURE:
      return { ...state, isLoading: false, isError: true, error: payload };
    case GET_HOTEL_SUCCESS:
    case POST_HOTEL_SUCCESS:
      return { ...state, isLoading: false, isError: false, error: "", hotel: payload };
    case NEW_GET_HOTELS_SUCCESS:
      return { ...state, isLoading: false, isError: false, error: "", data: payload };
    case DELETE_HOTEL:
      return {
        ...state, isLoading: false, isError: false, error: "",
        data: state.data.filter((item) => String(item.id) !== String(payload)),
      };
    default:
      return state;
  }
};
