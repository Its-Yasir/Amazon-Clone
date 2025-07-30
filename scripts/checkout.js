import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
//import '../data/backend-practice.js'
import { loadProducts, loadProductsFetch } from "../data/products.js";

Promise.all([
  loadProductsFetch()
]).then(()=>{
  renderOrderSummary();
  renderPaymentSummary();
})

/*
loadProducts(()=>{
  renderOrderSummary();
  renderPaymentSummary();
})
  */
