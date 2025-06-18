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
} else {
  document.getElementById('receipt-items').innerHTML = '<tr><td colspan="4" style="text-align:center;color:#888;">ไม่พบข้อมูลออเดอร์</td></tr>';
  document.getElementById('receipt-total').textContent = '';
}
