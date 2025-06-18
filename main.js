// ใส่ LIFF ID ของคุณที่นี่
const liffId = '2006986568-yjrOkKqm';

const products = [
    { id: 1, name: 'ข้าวผัด', price: 50 },
    { id: 2, name: 'ก๋วยเตี๋ยว', price: 45 },
    { id: 3, name: 'ชาเย็น', price: 25 }
];

let cart = [];

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = `${product.name} - ${product.price} บาท <button onclick="addToCart(${product.id})">เพิ่ม</button>`;
        list.appendChild(div);
    });
}

function renderCart() {
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.qty}`;
        list.appendChild(li);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const found = cart.find(item => item.id === productId);
    if (found) {
        found.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}

document.getElementById('checkout-btn').onclick = async function() {
    if (cart.length === 0) {
        alert('กรุณาเลือกสินค้า');
        return;
    }
    let summary = 'สรุปออเดอร์\n';
    cart.forEach(item => {
        summary += `${item.name} x${item.qty} = ${item.price * item.qty} บาท\n`;
    });
    summary += `รวมทั้งหมด ${cart.reduce((sum, item) => sum + item.price * item.qty, 0)} บาท`;
    
    await liff.sendMessages([
        {
            type: 'text',
            text: summary
        }
    ]);
    alert('ส่งออเดอร์เรียบร้อย!');
    liff.closeWindow();
};

async function main() {
    await liff.init({ liffId });
    renderProducts();
    renderCart();
}

main();
