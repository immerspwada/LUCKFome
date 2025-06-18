function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function renderCart() {
    const cart = getCart();
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-controls">
                <button class="cart-item-btn" onclick="changeQty(${idx}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="cart-item-btn" onclick="changeQty(${idx}, 1)">+</button>
                <button class="cart-item-btn" onclick="removeItem(${idx})">ลบ</button>
            </span>
            <span class="cart-item-total">${item.price * item.qty} บาท</span>
        `;
        list.appendChild(li);
    });
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    document.getElementById('cart-summary').textContent = `รวมทั้งหมด ${total} บาท`;
}
function changeQty(idx, delta) {
    const cart = getCart();
    cart[idx].qty += delta;
    if (cart[idx].qty < 1) cart[idx].qty = 1;
    setCart(cart);
    renderCart();
}
function removeItem(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    setCart(cart);
    renderCart();
}
document.getElementById('checkout-btn').onclick = function() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('กรุณาเลือกสินค้า');
        return;
    }
    window.location.href = 'payment.html';
};
document.getElementById('back-btn').onclick = function() {
    window.location.href = 'index.html';
};
renderCart();
