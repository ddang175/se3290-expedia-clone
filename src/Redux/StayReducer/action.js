import axios from "axios";
import baseurl from "../../baseurl";
import { SELECTED_DATE_AND_CITY, SELECTED_CITY, HOTEL_FAILURE, HOTEL_REQUEST, GET_HOTEL_SUCCESS, POST_HOTEL_SUCCESS, NEW_GET_HOTELS_SUCCESS, DELETE_HOTEL } from "./actionType";
export const getHotelSuccess = (payload) => ({ type: GET_HOTEL_SUCCESS, payload });
export const postHotelSuccess = (payload) => ({ type: POST_HOTEL_SUCCESS, payload });
export const hotelRequest = () => ({ type: HOTEL_REQUEST });
export const hotelFailure = (payload) => ({ type: HOTEL_FAILURE, payload });
export const fetch_hotel = (payload) => ({ type: NEW_GET_HOTELS_SUCCESS, payload });
export const handleDeleteHotel = (payload) => ({ type: DELETE_HOTEL, payload });
export const selectDateAndCity = (checkInDate, checkOutDate) => ({ type: SELECTED_DATE_AND_CITY, payload: { checkInDate, checkOutDate } });
export const selectCity = (selectedCity) => ({ type: SELECTED_CITY, payload: { selectedCity } });
// Search, sorting, and pagination use the same complete catalog.
export const fetchingHotels = () => async (dispatch) => {
  dispatch(hotelRequest());
  try {
    const { data } = await axios.get(`${baseurl}/hotel`);
    if (!Array.isArray(data)) throw new Error("The hotel service returned an invalid response.");
    dispatch(getHotelSuccess(data)); return data;
  } catch (error) { dispatch(hotelFailure(error.response?.data?.error || error.message)); return null; }
};
export const addHotel = (payload) => async (dispatch) => {
  dispatch(hotelRequest());
  try { const { data } = await axios.post(`${baseurl}/hotel`, payload); dispatch(postHotelSuccess(data)); return data; }
  catch (error) { dispatch(hotelFailure(error.message)); throw error; }
};
export const DeleteHotel = (id) => async (dispatch) => {
  dispatch(hotelRequest());
  try { await axios.delete(`${baseurl}/hotel/${encodeURIComponent(id)}`); dispatch(handleDeleteHotel(id)); }
  catch (error) { dispatch(hotelFailure(error.message)); throw error; }
};
