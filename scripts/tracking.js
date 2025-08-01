import { dateStringTracking } from "./utils/dateString.js";
import { loadProductsFetch, getProduct } from "../data/products.js";

const urlParams = new URLSearchParams(window.location.search);
const urlProductId = urlParams.get('productId');
const urlOrderId = urlParams.get('orderId');
const orders = JSON.parse(localStorage.getItem('orders'));

async function renderProduct(){
  let matchingOrder;
  let matchingOrderProduct;
  orders.forEach((order)=>{
    if(order.id===urlOrderId){
      matchingOrder = order
    }
  })
  console.log(matchingOrder);
  matchingOrder.products.forEach((product)=>{
    if(urlProductId === product.productId){
      matchingOrderProduct = product
    }
  })
  console.log(matchingOrderProduct);
  const dateString = dateStringTracking(matchingOrderProduct.estimatedDeliveryTime);
  await loadProductsFetch();
  const matchingProduct = getProduct(urlProductId)
  console.log(matchingProduct)

  const html = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${dateString}
    </div>

    <div class="product-info">
      ${matchingProduct.name}
    </div>

    <div class="product-info">
      Quantity: ${matchingOrderProduct.quantity}
    </div>

    <img class="product-image" src="${matchingProduct.image}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `

  document.querySelector('.order-tracking').innerHTML = html;
}
renderProduct()