import axios from "axios";
import { API_BASE_URL } from "../../baseurl";
import {
  HOTEL_REQUEST, HOTEL_FAILURE, GET_HOTEL_SUCCESS,
  POST_HOTEL_SUCCESS, NEW_GET_HOTELS_SUCCESS, DELETE_HOTEL,
} from "./actionType";

export const getHotelSuccess = (payload) => ({ type: GET_HOTEL_SUCCESS, payload });
export const postHotelSuccess = (payload) => ({ type: POST_HOTEL_SUCCESS, payload });
export const hotelRequest = () => ({ type: HOTEL_REQUEST });
export const hotelFailure = (payload) => ({ type: HOTEL_FAILURE, payload });
export const fetch_hotel = (payload) => ({ type: NEW_GET_HOTELS_SUCCESS, payload });
export const handleDeleteHotel = (payload) => ({ type: DELETE_HOTEL, payload });

const hotelOperation = (request, success, message) => async (dispatch) => {
  dispatch(hotelRequest());
  try {
    const { data } = await request();
    dispatch(success(data));
    return data;
  } catch (error) {
    dispatch(hotelFailure(message));
    throw new Error(message);
  }
};

export const addHotel = (payload) => hotelOperation(
  () => axios.post(`${API_BASE_URL}/hotel`, payload),
  postHotelSuccess,
  "Could not add the hotel. Check the data server and try again."
);

export const updateHotel = (id, payload) => hotelOperation(
  () => axios.patch(`${API_BASE_URL}/hotel/${encodeURIComponent(id)}`, payload),
  postHotelSuccess,
  "Could not save the hotel. Your changes have been kept; try again."
);

export const fetchHotelById = (id) => hotelOperation(
  () => axios.get(`${API_BASE_URL}/hotel/${encodeURIComponent(id)}`),
  getHotelSuccess,
  "Could not load this hotel. It may have been removed, or the data server is unavailable."
);

export const fetchingHotels = () => hotelOperation(
  () => axios.get(`${API_BASE_URL}/hotel`),
  fetch_hotel,
  "Could not load hotels. Check the data server and try again."
);

export const DeleteHotel = (id) => hotelOperation(
  () => axios.delete(`${API_BASE_URL}/hotel/${encodeURIComponent(id)}`),
  () => handleDeleteHotel(id),
  "Could not delete the hotel. The list has not been changed; try again."
);
