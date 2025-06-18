// ดึงข้อมูลออเดอร์ล่าสุดจาก localStorage (slips)
const slips = JSON.parse(localStorage.getItem('slips') || '[]');
const slip = slips.length > 0 ? slips[slips.length - 1] : null;

function formatDate(dt) {
  const d = new Date(dt);
  return d.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
}

if (slip) {
  document.getElementById('receipt-date').textContent = 'วันที่: ' + formatDate(slip.createdAt);
  document.getElementById('receipt-orderid').textContent = 'เลขที่ออเดอร์: ' + (slip.createdAt ? slip.createdAt.replace(/[-:TZ.]/g, '').slice(-8) : '-');
  // แยกสินค้า
  const items = [];
  const lines = slip.summary.split('\n');
  lines.forEach(line => {
    const m = line.match(/(.+) x(\d+) = (\d+) บาท/);
    if (m) {
      items.push({ name: m[1], qty: m[2], price: Math.round(m[3]/m[2]), total: m[3] });
    }
  });
  let html = '';
  let total = 0;
  items.forEach(item => {
    html += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.price}</td><td>${item.total}</td></tr>`;
    total += parseInt(item.total);
  });
  document.getElementById('receipt-items').innerHTML = html;
  document.getElementById('receipt-total').textContent = 'รวมทั้งหมด ' + total + ' บาท';

  // เพิ่มปุ่มแจ้งเตือนลูกค้า
  let btn = document.createElement('button');
  btn.textContent = 'แจ้งเตือนลูกค้าใน LINE';
  btn.style = 'margin:18px auto 0 auto;display:block;background:#ff8800;color:#fff;border:none;border-radius:8px;padding:12px 32px;font-size:1.08rem;cursor:pointer;';
  btn.onclick = async function() {
    if (window.liff) {
      try {
        await liff.init({ liffId: '2006986568-yjrOkKqm' });
        if (!liff.isLoggedIn()) { liff.login(); return; }
        await liff.sendMessages([
          { type: 'text', text: 'ร้าน LUCKY KOLOK แจ้งเตือน: ออเดอร์ของคุณกำลังดำเนินการจัดส่ง\nขอบคุณที่ใช้บริการค่ะ' }
        ]);
        alert('ส่งข้อความแจ้งเตือนลูกค้าใน LINE สำเร็จ');
      } catch(e) {
        alert('เกิดข้อผิดพลาดในการส่งข้อความ: ' + e.message);
      }
    } else {
      alert('กรุณาเปิดผ่านแอป LINE OA');
    }
  };
  document.querySelector('.receipt-box').appendChild(btn);
} else {
  document.getElementById('receipt-items').innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">ไม่พบข้อมูลออเดอร์</td></tr>';
  document.getElementById('receipt-total').textContent = '';
}

async function sendOrderMessage(orderMessage) {
  try {
    if (window.liff) {
      await liff.init({ liffId: '2006986568-yjrOkKqm' });
      if (!liff.isLoggedIn()) { liff.login(); return; }
      if (liff.isInClient()) {
        await liff.sendMessages([{ type: 'text', text: orderMessage }]);
        alert('ส่งข้อความแจ้งเตือนลูกค้าใน LINE สำเร็จ');
      } else {
        // Fallback: แสดงข้อความและปุ่ม copy
        showOrderCopyFallback(orderMessage);
      }
    } else {
      alert('กรุณาเปิดผ่านแอป LINE OA');
    }
  } catch(e) {
    alert('เกิดข้อผิดพลาดในการส่งข้อความ: ' + e.message);
  }
}

function showOrderCopyFallback(orderMessage) {
  // ลบ fallback เดิมถ้ามี
  let old = document.getElementById('order-copy-fallback');
  if (old) old.remove();
  // สร้างกล่อง fallback
  let box = document.createElement('div');
  box.id = 'order-copy-fallback';
  box.style = 'margin:18px auto 0 auto;max-width:420px;background:#fffbe7;border:1.5px solid #ffb347;border-radius:10px;padding:18px;text-align:center;';
  box.innerHTML = `
    <div style='color:#ff8800;font-weight:600;margin-bottom:8px;'>ไม่สามารถส่งข้อความผ่าน LINE ได้ในเบราว์เซอร์นี้</div>
    <textarea readonly style='width:98%;height:80px;border-radius:6px;border:1px solid #ccc;padding:8px;font-size:1rem;'>${orderMessage}</textarea><br>
    <button id='copy-order-msg-btn' style='margin-top:10px;background:#ff8800;color:#fff;border:none;border-radius:7px;padding:8px 24px;font-size:1.02rem;cursor:pointer;'>คัดลอกข้อความ</button>
    <div style='color:#888;font-size:0.97rem;margin-top:8px;'>คัดลอกข้อความนี้แล้วส่งในแชท LINE ด้วยตนเอง</div>
  `;
  document.querySelector('.receipt-box').appendChild(box);
  document.getElementById('copy-order-msg-btn').onclick = function() {
    const ta = box.querySelector('textarea');
    ta.select();
    document.execCommand('copy');
    alert('คัดลอกข้อความแล้ว!');
  };
}

// ตัวอย่างการใช้งาน:
// sendOrderMessage('ร้าน LUCKY KOLOK แจ้งเตือน: ออเดอร์ของคุณกำลังดำเนินการจัดส่ง\nขอบคุณที่ใช้บริการค่ะ');
