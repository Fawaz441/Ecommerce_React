export const localhost  = 'http://127.0.0.1:8000/'
export const productlistURL = `${localhost}api/productlist`
export const productdetailURL = (slug) => `${localhost}api/products/${slug}`
export const addToCartURL = `${localhost}api/add_to_cart/`
export const endpoint = 'http://127.0.0.1:8000/api';

export const orderSummaryURL = `${endpoint}/order-summary/`;

export const addressListURL = addressType =>`${endpoint}/addresses/?address_type=${addressType}`
export const addressUpdateURL = id =>`${endpoint}/addresses/${id}/update/`
export const addressDeleteURL = id =>`${endpoint}/addresses/${id}/delete/`
export const addresscreateURL = `${endpoint}/addresses/create/`
export const itemDeleteURL = id => `${endpoint}/items/${id}/delete/`
export const countriesURL = `${endpoint}/countries/`
export const useridURL = `${endpoint}/userID/`
export const itemDecreaseURL = `${endpoint}/item_decrease/`