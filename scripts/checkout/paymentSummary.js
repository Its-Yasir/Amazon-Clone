import { cart, saveToStorage } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/delieveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";
export function renderPaymentSummary(){
  let cartQuantity = 0;
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  cart.forEach((cartItem) =>{
    const product = getProduct(cartItem.productId)
    productPriceCents += product.priceCents * cartItem.quantity;
    const delieveryOption = getDeliveryOption(cartItem.deliveryOptionId)
    shippingPriceCents += delieveryOption.priceCents;
  });
  const totalBeforeTaxCents = shippingPriceCents + productPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div class="js-payment-items"></div>
      <div class="payment-summary-money">
      $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
      $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
      $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
      $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
      $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', async ()=>{
      if (cart.length === 0) {
        alert('Your cart is empty. Cannot place order.');
        return;
      } 
      try{
          let response = await fetch('https://supersimplebackend.dev/orders', {
            method : 'POST',        
            headers :{
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              cart : cart                             
            })
        });
      let order = await response.json();
      addOrder(order);
      cart.length=0;
      saveToStorage()
      window.location.href = 'orders.html';
      }catch(error){
      console.log('Unexpected Erro, Please try again later')
    }
    })
} 
export function showCartQuantityPayment(cart){
  let cartQuantity = 0;
  cart.forEach((cartItem)=>{
    cartQuantity += cartItem.quantity;
  })
  document.querySelector('.js-payment-items').innerHTML = `Items(${cartQuantity})`;
}