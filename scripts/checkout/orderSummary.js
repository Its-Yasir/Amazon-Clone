import { cart, removeFromCart, updateDeliveryOption, saveToStorage,} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/delieveryOptions.js";
import { renderPaymentSummary,showCartQuantityPayment } from "./paymentSummary.js";


export function renderOrderSummary(){
  let cartSummaryHTML = '';
  cart.forEach((cartItem) =>{
    const productId = cartItem.productId;
    let matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const dateDays = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = dateDays.format('dddd, MMMM D');

    cartSummaryHTML += `
    <div class="cart-item-container js-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    ${matchingProduct.getPrice()}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <input type="number" class="update-quantity-input js-update-quantity-input-${cartItem.productId}"></input>
                    <span class="link-primary js-save-primary js-save-quantity-${cartItem.productId}" data-save-link-id="${cartItem.productId}">Save</span>
                    <span class="update-quantity-link-${cartItem.productId} link-primary js-link-primary" data-update-link-id="${cartItem.productId}">
                      Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link " data-product-id = "${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                    ${deliveryOptionsHTML(matchingProduct,cartItem)}
                  </div>
                </div>
              </div>
            </div>
    `
  });

  function deliveryOptionsHTML(matchingProduct,cartItem){
    let html = '';
    deliveryOptions.forEach((deliveryOption) =>{
      const today = dayjs();
      const dateDays = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = dateDays.format('dddd, MMMM D');
      const priceString = (deliveryOption.priceCents === 0 )?'FREE':`$${formatCurrency(deliveryOption.priceCents)} -`
      const isChecked = deliveryOption.id == cartItem.deliveryOptionId;
      html += `
          <div class="delivery-option">
            <input type="radio" 
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input js-delivery-option"
              data-product-id = "${matchingProduct.id}" 
              data-delivery-option-id = "${deliveryOption.id}"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
      `
    })
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId)
      const container = document.querySelector(`.js-item-container-${productId}`);
      container.remove();
      renderPaymentSummary();
      showCartQuantityPayment(cart);
      showCartQuantity()
    })
  })

  document.querySelectorAll('.js-delivery-option').
    forEach((element)=>{
      element.addEventListener('click', ()=>{
        const productId = element.dataset.productId;
        const deliveryOptionId = element.dataset.deliveryOptionId; 
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
        showCartQuantity();
      });
    });


showCartQuantity();
    document.querySelectorAll('.js-link-primary').
      forEach((link)=>{
        link.addEventListener('click', ()=>{
          const linkId = link.dataset.updateLinkId;
          console.log(linkId)
          document.querySelector(`.update-quantity-link-${linkId}`).style.display = 'none';
          const input = document.querySelector(`.js-update-quantity-input-${linkId}`);
          input.style.display = 'inline-block';
          const save = document.querySelector(`.js-save-quantity-${linkId}`);
          save.style.display = 'inline-block'
        })
      })
    document.querySelectorAll('.js-save-primary').
      forEach((save)=>{
        save.addEventListener('click',()=>{
          const saveID = save.dataset.saveLinkId;
          const input = document.querySelector(`.js-update-quantity-input-${saveID}`);
          const update = document.querySelector(`.update-quantity-link-${saveID}`)
            const inputValue = input.value;
            if (Number(inputValue) > 0) {
            let matchingItem;
            cart.forEach((cartItem) => {
              if (cartItem.productId === saveID) {
              matchingItem = cartItem;
              }
            });
            matchingItem.quantity = Number(inputValue);
            saveToStorage();
            update.style.display = 'inline-block';
            save.style.display = 'none';
            input.style.display = 'none';
            renderOrderSummary();
            renderPaymentSummary();
            showCartQuantityPayment(cart);
            showCartQuantity()
            }
        })
      })
  };


export function showCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((cartItem)=>{
    cartQuantity += cartItem.quantity;
  })
  document.querySelector('.js-checkout-items').innerHTML = `${cartQuantity} Items`;
}