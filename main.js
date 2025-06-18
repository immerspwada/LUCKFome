// LIFF ID ของคุณ
const liffId = '2006986568-yjrOkKqm';

const products = [
    { id: 1, name: 'แก๊ส', price: 350, category: 'แก๊ส' },
    { id: 2, name: 'น้ำดื่ม', price: 15, category: 'น้ำดื่ม' },
    { id: 3, name: 'น้ำแข็ง', price: 40, category: 'น้ำแข็ง' },
    { id: 4, name: 'น้ำแข็งบด', price: 40, category: 'น้ำแข็ง' },
    { id: 5, name: 'น้ำแข็งเล็ก', price: 40, category: 'น้ำแข็ง' },
    { id: 6, name: 'น้ำแข็งใหญ่', price: 40, category: 'น้ำแข็ง' }
];

const categories = ['สินค้าทั้งหมด', 'แก๊ส', 'น้ำดื่ม', 'น้ำแข็ง'];
let selectedCategory = 'สินค้าทั้งหมด';

const waterRates = {
    '820ML': [
        { min: 10, max: 49, price: 36 },
        { min: 50, max: 99, price: 34 },
        { min: 100, max: Infinity, price: 32 }
    ],
    '600ML': [
        { min: 1, max: 9, price: 42 },
        { min: 100, max: Infinity, price: 40 }
    ],
    '350ML': [
        { min: 10, max: 49, price: 35 },
        { min: 50, max: 99, price: 33 },
        { min: 100, max: Infinity, price: 32 }
    ]
};

const gasSizes = [
    { size: '4 กก', price: 185 },
    { size: '7 กก', price: 285 },
    { size: '15 กก', price: 490 },
    { size: '48 กก', price: 1490 }
];

function getWaterPrice(size, qty) {
    const rates = waterRates[size];
    if (!rates) return 0;
    for (const rate of rates) {
        if (qty >= rate.min && qty <= rate.max) return rate.price;
    }
    return rates[rates.length - 1].price;
}

function renderCategories() {
    const catDiv = document.getElementById('category-list');
    catDiv.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = (cat === selectedCategory) ? 'active-category' : '';
        btn.onclick = () => {
            selectedCategory = cat;
            renderProducts();
            renderCategories();
        };
        catDiv.appendChild(btn);
    });
}

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    let filtered = products;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (selectedCategory !== 'สินค้าทั้งหมด') {
        filtered = products.filter(p => p.category === selectedCategory);
    } else {
        const ice = products.filter(p => p.category === 'น้ำแข็ง');
        const others = products.filter(p => p.category !== 'น้ำแข็ง');
        filtered = [...ice, ...others];
    }
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        let icon = '';
        if (product.category === 'น้ำดื่ม') icon = '💧';
        else if (product.category === 'แก๊ส') icon = '🛢️';
        else if (product.category === 'น้ำแข็ง') icon = '🧊';
        // หาจำนวนในตะกร้า
        let badge = '';
        if (product.category === 'น้ำดื่ม') {
            // หาจำนวนรวมของน้ำดื่มทุกขนาด/โหล
            let waterCount = cart.filter(item => item.name && item.name.startsWith('น้ำดื่ม')).reduce((sum, item) => sum + item.qty, 0);
            if (waterCount > 0) badge = `<span class='product-badge'>${waterCount}</span>`;
        } else if (product.category === 'แก๊ส') {
            // หาจำนวนรวมของแก๊สทุกขนาด
            let gasCount = cart.filter(item => item.name && item.name.startsWith('แก๊ส')).reduce((sum, item) => sum + item.qty, 0);
            if (gasCount > 0) badge = `<span class='product-badge'>${gasCount}</span>`;
        } else {
            // สินค้าทั่วไป
            let found = cart.find(item => item.id === product.id);
            if (found && found.qty > 0) badge = `<span class='product-badge'>${found.qty}</span>`;
        }
        if (product.category === 'น้ำดื่ม') {
            card.innerHTML = `
                <div class="product-header">${icon} <b style='font-size:1.15rem;color:#ff8800;'>${product.name}</b> ${badge}</div>
                <div class="product-options">
                  <label>ขนาด
                    <select id="water-size" class="product-select">
                      <option value="820ML">820ML</option>
                      <option value="600ML">600ML</option>
                      <option value="350ML">350ML</option>
                    </select>
                  </label>
                  <label>จำนวนโหล
                    <input id="water-qty" type="number" min="1" value="10" class="product-input">
                  </label>
                  <span id="water-price" class="product-price"></span>
                </div>
                <button id="add-water-btn" class="product-btn">เพิ่มลงตะกร้า</button>
            `;
            setTimeout(() => {
                const sizeSel = card.querySelector('#water-size');
                const qtyInput = card.querySelector('#water-qty');
                const priceSpan = card.querySelector('#water-price');
                function updatePrice() {
                    const size = sizeSel.value;
                    const qty = parseInt(qtyInput.value) || 1;
                    const price = getWaterPrice(size, qty);
                    priceSpan.textContent = `ราคา ${price} บาท/โหล`;
                }
                sizeSel.onchange = qtyInput.oninput = updatePrice;
                updatePrice();
                card.querySelector('#add-water-btn').onclick = function() {
                    const size = sizeSel.value;
                    const qty = parseInt(qtyInput.value) || 1;
                    const price = getWaterPrice(size, qty);
                    addCustomWaterToCart(size, qty, price);
                    renderProducts(); // refresh badge
                };
            }, 0);
        } else if (product.category === 'แก๊ส') {
            card.innerHTML = `
                <div class="product-header">${icon} <b style='font-size:1.15rem;color:#ff8800;'>${product.name}</b> ${badge}</div>
                <div class="product-options">
                  <label>ขนาด
                    <select id="gas-size" class="product-select">
                      ${gasSizes.map(g => `<option value="${g.size}">${g.size}</option>`).join('')}
                    </select>
                  </label>
                  <span id="gas-price" class="product-price"></span>
                </div>
                <button id="add-gas-btn" class="product-btn">เพิ่มลงตะกร้า</button>
            `;
            setTimeout(() => {
                const sizeSel = card.querySelector('#gas-size');
                const priceSpan = card.querySelector('#gas-price');
                function updatePrice() {
                    const size = sizeSel.value;
                    const found = gasSizes.find(g => g.size === size);
                    priceSpan.textContent = found ? `ราคา ${found.price} บาท` : '';
                }
                sizeSel.onchange = updatePrice;
                updatePrice();
                card.querySelector('#add-gas-btn').onclick = function() {
                    const size = sizeSel.value;
                    const found = gasSizes.find(g => g.size === size);
                    if (found) addCustomGasToCart(size, found.price);
                    renderProducts(); // refresh badge
                };
            }, 0);
        } else {
            card.innerHTML = `<div class="product-header">${icon} <span style='font-weight:500;'>${product.name}</span> ${badge}</div><span class='product-price'>${product.price} บาท</span> <button onclick="addToCart(${product.id})" class="product-btn">เพิ่ม</button>`;
        }
        list.appendChild(card);
    });
}

function addCustomWaterToCart(size, qty, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const key = `น้ำดื่ม ${size} ${qty} โหล`;
    const found = cart.find(item => item.key === key);
    if (found) {
        found.qty++;
    } else {
        cart.push({ key, name: `น้ำดื่ม ${size} (${qty} โหล)`, price, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function addCustomGasToCart(size, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const key = `แก๊ส ${size}`;
    const found = cart.find(item => item.key === key);
    if (found) {
        found.qty++;
    } else {
        cart.push({ key, name: `แก๊ส (${size})`, price, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    let badge = document.getElementById('cart-badge');
    badge.textContent = count > 0 ? count : '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(item => item.id === productId);
    if (found) {
        found.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    renderProducts(); // refresh badge
}

document.getElementById('goto-cart-btn').onclick = function() {
    window.location.href = 'cart.html';
};

async function main() {
    await liff.init({ liffId });
    renderCategories();
    renderProducts();
    updateCartBadge();
}

main();
