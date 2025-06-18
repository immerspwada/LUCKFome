// ตัวอย่างสินค้า (ควรโหลดจาก localStorage หรือ backend)
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
// --- Helper: แปลงวันที่ ---
function formatDate(dt) {
    if (!dt) return '-';
    const d = new Date(dt);
    return d.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
}

function renderSlips() {
    const list = document.getElementById('slip-list');
    list.innerHTML = '';
    const statusFilter = document.getElementById('order-status-filter')?.value || 'all';
    let filtered = slips;
    if (statusFilter !== 'all') {
        filtered = slips.filter(s => (s.status || 'pending') === statusFilter);
    }
    if (filtered.length === 0) {
        list.innerHTML = '<div style="color:#888;">ยังไม่มีออเดอร์/สลิปในสถานะนี้</div>';
        return;
    }
    filtered.forEach((s, idx) => {
        const div = document.createElement('div');
        div.style = 'margin-bottom:18px;padding:12px 0;border-bottom:1px solid #ffe0b2;';
        div.innerHTML = `
            <div style='font-weight:500;color:#ff8800;'>${s.summary.replace(/\n/g,'<br>')}</div>
            <div style='font-size:0.98rem;color:#555;margin:4px 0 6px 0;'>
                <b>วันที่:</b> ${formatDate(s.createdAt)}
                <b style='margin-left:18px;'>OrderID:</b> ${(s.createdAt||'').replace(/[-:TZ.]/g, '').slice(-8)}
            </div>
            <div style='font-size:0.98rem;color:#555;margin:4px 0 6px 0;'>
                <b>ลูกค้า:</b> ${s.displayName||'-'} <span style='color:#aaa;font-size:0.92em;'>(${s.userId||'-'})</span>
            </div>
            ${s.slipBase64 ? `<img src='${s.slipBase64}' alt='slip' style='max-width:180px;border-radius:10px;margin:10px 0;'>` : ''}
            <div style='margin:8px 0;'>
                <span style='color:${s.status === 'accepted' ? '#06c755' : s.status==='delivering' ? '#007aff' : s.status==='done' ? '#888' : s.status==='cancelled' ? '#d00' : '#ff8800'};font-weight:bold;'>${s.status==='accepted'?'รับออเดอร์แล้ว':s.status==='delivering'?'กำลังจัดส่ง':s.status==='done'?'สำเร็จ':s.status==='cancelled'?'ยกเลิก':'รอการยืนยัน'}</span>
                ${s.status === 'pending' ? `<button onclick='acceptOrder(${idx})' style='margin-left:12px;background:#06c755;color:#fff;border:none;border-radius:6px;padding:4px 18px;font-weight:500;cursor:pointer;'>กดยอมรับออเดอร์</button>` : ''}
                ${s.status === 'accepted' ? `<button onclick='setDelivering(${idx})' style='margin-left:12px;background:#007aff;color:#fff;border:none;border-radius:6px;padding:4px 18px;font-weight:500;cursor:pointer;'>กำลังจัดส่ง</button>` : ''}
                ${s.status === 'delivering' ? `<button onclick='setDone(${idx})' style='margin-left:12px;background:#888;color:#fff;border:none;border-radius:6px;padding:4px 18px;font-weight:500;cursor:pointer;'>สำเร็จ</button>` : ''}
                ${(s.status !== 'done' && s.status !== 'cancelled') ? `<button onclick='cancelOrder(${idx})' style='margin-left:12px;background:#d00;color:#fff;border:none;border-radius:6px;padding:4px 18px;font-weight:500;cursor:pointer;'>ยกเลิก</button>` : ''}
            </div>
        `;
        list.appendChild(div);
    });
}

window.acceptOrder = function(idx) {
    slips[idx].status = 'accepted';
    localStorage.setItem('slips', JSON.stringify(slips));
    renderSlips();
    const userId = slips[idx].userId;
    if (window.liff && userId) {
        liff.init({ liffId: '2006986568-yjrOkKqm' }).then(() => {
            liff.sendMessages([
                { type: 'text', text: 'ร้านได้รับออเดอร์ของคุณแล้ว กำลังดำเนินการจัดส่งค่ะ' }
            ]);
        });
    }
};
window.setDelivering = function(idx) {
    slips[idx].status = 'delivering';
    localStorage.setItem('slips', JSON.stringify(slips));
    renderSlips();
};
window.setDone = function(idx) {
    slips[idx].status = 'done';
    localStorage.setItem('slips', JSON.stringify(slips));
    renderSlips();
};
window.cancelOrder = function(idx) {
    if (confirm('ยืนยันการยกเลิกออเดอร์นี้?')) {
        slips[idx].status = 'cancelled';
        localStorage.setItem('slips', JSON.stringify(slips));
        renderSlips();
    }
};

document.getElementById('order-status-filter').onchange = renderSlips;
renderProductAdmin();
renderSlips();

// --- ดึงข้อมูลโปรไฟล์ LINE OA ฝั่งแอดมิน ---
function renderAdminProfile() {
    if (window.liff) {
        liff.init({ liffId: '2006986568-yjrOkKqm' }).then(() => {
            if (liff.isLoggedIn()) {
                liff.getProfile().then(profile => {
                    const adminDiv = document.createElement('div');
                    adminDiv.style = 'text-align:center;margin-bottom:12px;';
                    adminDiv.innerHTML = `<img src="${profile.pictureUrl}" alt="admin-profile" style="width:60px;height:60px;border-radius:50%;box-shadow:0 2px 8px #ff880033;vertical-align:middle;"> <span style='font-size:1.08rem;font-weight:500;margin-left:8px;'>${profile.displayName}</span>`;
                    document.body.insertBefore(adminDiv, document.body.firstChild);
                });
            } else {
                liff.login();
            }
        });
    }
}
renderAdminProfile();
