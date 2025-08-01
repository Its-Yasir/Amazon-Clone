import { dateString } from "./utils/dateString.js";
import { loadProductsFetch, getProduct } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { addToCart } from "../data/cart.js";

let ordersString = localStorage.getItem('orders');
let orders = JSON.parse(ordersString);

async function generateProductsHTML(products, order) {
  let productsHTML = '';
  
  products.forEach((product) => {
    const matchingProduct = getProduct(product.productId);
    
    productsHTML += `
      <div class="order-details-grid">
        <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-delivery-date">
            Arriving on: ${dateString(product.estimatedDeliveryTime)}
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again-button" data-buy-again-id="${product.productId}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?productId=${product.productId}&orderId=${order.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      </div>
    `;
  });
  document.querySelectorAll('.js-buy-again-button').
    forEach((button)=>{
      button.addEventListener('click',()=>{
        const productId = button.dataset.buyAgainId;
        function fun(){
          return 1;
        }
        addToCart(productId, fun())
      })
    })
  return productsHTML;
}

async function renderOrders() {
  await loadProductsFetch();

  let html = '';

  for (const order of orders) {
    const productsHTML = await generateProductsHTML(order.products, order);

    html += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dateString(order.orderTime)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        ${productsHTML}
      </div>
    `;
  }

  // Output the result on screen (optional)
  // Or log it
  //console.log(html);
  document.querySelector('.orders-grid').innerHTML = html;
}
renderOrders();
