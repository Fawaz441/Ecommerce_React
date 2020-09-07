export const localhost  = 'http://127.0.0.1:8000/'
export const productlistURL = `${localhost}api/productlist`
export const productdetailURL = (slug) => `${localhost}api/products/${slug}`
export const addToCartURL = `${localhost}api/add_to_cart/`
export const endpoint = 'http://127.0.0.1:8000/api';

export const orderSummaryURL = `${endpoint}/order-summary/`;

export const addressListURL = `${endpoint}/addresses`
export const addresscreateURL = `${endpoint}/addresses/create/`
export const countriesURL = `${endpoint}/countries/`