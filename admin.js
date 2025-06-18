// ตัวอย่างสินค้า (ควรโหลดจาก localStorage หรือ backend จริง)
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'แก๊ส', price: 350, category: 'แก๊ส' },
    { id: 2, name: 'น้ำดื่ม', price: 15, category: 'น้ำดื่ม' },
    { id: 3, name: 'น้ำแข็ง', price: 40, category: 'น้ำแข็ง' },
    { id: 4, name: 'น้ำแข็งบด', price: 40, category: 'น้ำแข็ง' },
    { id: 5, name: 'น้ำแข็งเล็ก', price: 40, category: 'น้ำแข็ง' },
    { id: 6, name: 'น้ำแข็งใหญ่', price: 40, category: 'น้ำแข็ง' }
];

function renderProductAdmin() {
    const list = document.getElementById('product-admin-list');
    list.innerHTML = '';
    products.forEach((p, idx) => {
        const div = document.createElement('div');
        div.style = 'margin-bottom:12px;padding:10px 0;border-bottom:1px solid #ffe0b2;display:flex;align-items:center;gap:12px;';
        div.innerHTML = `
            <span style='min-width:80px;display:inline-block;'>${p.name}</span>
            <input type='number' value='${p.price}' min='0' id='price-${p.id}' style='width:80px;padding:4px 8px;border-radius:6px;border:1.5px solid #ffb347;'>
            <button onclick='savePrice(${idx})' style='background:#ff8800;color:#fff;border:none;border-radius:6px;padding:4px 18px;font-weight:500;cursor:pointer;'>บันทึก</button>
        `;
        list.appendChild(div);
    });
}
window.savePrice = function(idx) {
    const input = document.getElementById('price-' + products[idx].id);
    products[idx].price = parseFloat(input.value) || 0;
    localStorage.setItem('products', JSON.stringify(products));
    alert('บันทึกราคาสำเร็จ');
};

// ตัวอย่างสลิป (ควรโหลดจาก backend จริง)
let slips = JSON.parse(localStorage.getItem('slips')) || [];
function renderSlips() {
    const list = document.getElementById('slip-list');
    list.innerHTML = '';
    if (slips.length === 0) {
        list.innerHTML = '<div style="color:#888;">ยังไม่มีสลิปที่ลูกค้าแจ้ง</div>';
        return;
    }
    slips.forEach((s, idx) => {
        const div = document.createElement('div');
        div.style = 'margin-bottom:18px;padding:12px 0;border-bottom:1px solid #ffe0b2;';
        div.innerHTML = `
            <div style='font-weight:500;color:#ff8800;'>${s.summary.replace(/\n/g,'<br>')}</div>
            ${s.slipBase64 ? `<img src='${s.slipBase64}' alt='slip' style='max-width:180px;border-radius:10px;margin:10px 0;'>` : ''}
            <div style='margin:8px 0;'>
                <span style='color:${s.status === 'accepted' ? '#06c755' : '#ff8800'};font-weight:bold;'>${s.status === 'accepted' ? 'รับออเดอร์แล้ว' : 'รอการยืนยัน'}</span>
                ${s.status !== 'accepted' ? `<button onclick='acceptOrder(${idx})' style='margin-left:12px;background:#06c755;color:#fff;border:none;border-radius:6px;padding:4px 18px;font-weight:500;cursor:pointer;'>กดยอมรับออเดอร์</button>` : ''}
            </div>
        `;
        list.appendChild(div);
    });
}
window.acceptOrder = function(idx) {
    slips[idx].status = 'accepted';
    localStorage.setItem('slips', JSON.stringify(slips));
    renderSlips();
    // ส่งข้อความกลับไปยังลูกค้า (ต้องเปิด LIFF OA admin ใน LINE เท่านั้น)
    const userId = slips[idx].userId;
    if (window.liff && userId) {
        liff.init({ liffId: '2006986568-yjrOkKqm' }).then(() => {
            liff.sendMessages([
                { type: 'text', text: 'ร้านได้รับออเดอร์ของคุณแล้ว กำลังดำเนินการจัดส่งค่ะ' }
            ]);
        });
    }
};
renderProductAdmin();
renderSlips();
