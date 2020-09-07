import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import ProductList from './containers/ProductList'
import ProductDetail from './containers/ProductDetail'
import OrderSummary from "./containers/OrderSummary";
import Checkout from "./containers/Checkout";
import Profile from "./containers/Profile";
const BaseRouter = () => (
  <Hoc>
    <Route path="/checkout" component={Checkout}/>
    <Route exact path="/productlist" component={ProductList}/>
    <Route exact path="/products/:productslug" component={ProductDetail}/>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route exact path="/" component={HomepageLayout} />
    <Route exact path="/order-summary" component={OrderSummary} />
    <Route exact path="/profile" component={Profile} />
  </Hoc>
);

export default BaseRouter;
