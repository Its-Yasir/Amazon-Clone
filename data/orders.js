let orders = JSON.parse(localStorage.getItem('orders')) || [];


export function addOrder(order){
  orders.unshift(order);
  console.log(orders);
  saveToStorage();
}
function saveToStorage(){
  localStorage.setItem('orders', JSON.stringify(orders));
}