import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary, showCartQuantityPayment } from "./checkout/paymentSummary.js";
//import '../data/backend-practice.js'
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart.js";

async function loadPage(){
  await loadProductsFetch();
  renderOrderSummary();
  renderPaymentSummary();
  showCartQuantityPayment(cart)
}
loadPage();

/*
loadProducts(()=>{
  renderOrderSummary();
  renderPaymentSummary();
})
  */
