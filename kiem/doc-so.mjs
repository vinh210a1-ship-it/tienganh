// Bộ đổi số sang lời đọc tiếng Anh, dùng để KIỂM Bài 3B (giờ, ngày, tiền, số điện thoại).
// Nguyên tắc: số viết trên trang → mọi cách đọc chấp nhận được → so với chữ đọc ghi trên trang.
// Trang không gọi file này; chỉ bộ kiểm dùng. Bộ đổi này tự nó được kiểm bằng bảng đáp án gõ tay ở gold-doc-so.mjs.
//
// Hàm chính:
//   bienThe(chuoiSo)          → mảng cách đọc (đã chuẩn hóa) của MỘT chuỗi số, hoặc null nếu không nhận ra
//   khopCau(hienThi, doc)     → true nếu `doc` là cách đọc đúng của `hienThi` (câu có thể chứa nhiều số)
//   chuan(s)                  → chuẩn hóa: chữ thường, bỏ dấu câu, "-" thành khoảng trắng
//
// Giới hạn đã biết (cố ý): chỉ nhận số nguyên ≤ 999.999.999; giờ 1–12 (không đọc kiểu 24 giờ "eighteen thirty");
// không có "double five", "twelve hundred", "half three" (cách nói riêng của Anh, bài không dạy).

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const ORD_NHO = { 1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth', 13: 'thirteenth', 14: 'fourteenth', 15: 'fifteenth', 16: 'sixteenth', 17: 'seventeenth', 18: 'eighteenth', 19: 'nineteenth' };
const ORD_CHUC = { 20: 'twentieth', 30: 'thirtieth', 40: 'fortieth', 50: 'fiftieth', 60: 'sixtieth', 70: 'seventieth', 80: 'eightieth', 90: 'ninetieth' };
const THANG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const chuan = s => String(s).toLowerCase()
  .replace(/[‘’]/g, "'")
  .replace(/[-–—]/g, ' ')
  .replace(/[.,;:!?"“”()$%£€]/g, '')
  .replace(/\s+/g, ' ').trim();
const khongCach = s => chuan(s).replace(/ /g, '');
const duyNhat = a => [...new Set(a)];

// Số đếm 0 … 999.999.999 → các cách đọc (có và không có "and" sau "hundred").
export function dem(n) {
  if (!Number.isInteger(n) || n < 0 || n > 999999999) return null;
  if (n < 20) return [ONES[n]];
  if (n < 100) return [n % 10 ? TENS[Math.floor(n / 10)] + ' ' + ONES[n % 10] : TENS[n / 10]];
  if (n < 1000) {
    const dau = ONES[Math.floor(n / 100)] + ' hundred', du = n % 100;
    if (!du) return [dau];
    return dem(du).flatMap(x => [dau + ' ' + x, dau + ' and ' + x]);
  }
  for (const [moc, ten] of [[1e6, 'million'], [1e3, 'thousand']]) {
    if (n >= moc) {
      const dau = dem(Math.floor(n / moc)).map(x => x + ' ' + ten), du = n % moc;
      if (!du) return dau;
      const kq = [];
      for (const d of dau) for (const r of dem(du)) { kq.push(d + ' ' + r); if (du < 100) kq.push(d + ' and ' + r); }
      return duyNhat(kq);
    }
  }
  return null;
}

// Số thứ tự 1 … 99.
export function thuTu(n) {
  if (!Number.isInteger(n) || n < 1 || n > 99) return null;
  if (n < 20) return [ORD_NHO[n]];
  if (n % 10 === 0) return [ORD_CHUC[n]];
  return [TENS[Math.floor(n / 10)] + ' ' + ORD_NHO[n % 10]];
}

// Năm 1000–2099.
export function nam(n) {
  if (!Number.isInteger(n) || n < 1000 || n > 2099) return null;
  const kq = [];
  if (n >= 2000 && n <= 2009) {
    if (n === 2000) return ['two thousand'];
    kq.push('two thousand ' + ONES[n - 2000], 'two thousand and ' + ONES[n - 2000], 'twenty oh ' + ONES[n - 2000]);
    return kq;
  }
  const dau = Math.floor(n / 100), duoi = n % 100;
  if (duoi === 0) return dem(dau).map(x => x + ' hundred');
  const duoiChu = duoi < 10 ? ['oh ' + ONES[duoi]] : dem(duoi);
  for (const a of dem(dau)) for (const b of duoiChu) kq.push(a + ' ' + b);
  if (n >= 2010) for (const b of dem(n - 2000)) kq.push('two thousand ' + b, 'two thousand and ' + b);
  return duyNhat(kq);
}

// Giờ H:MM với H từ 1 đến 12.
export function gio(h, m) {
  if (!(h >= 1 && h <= 12) || !(m >= 0 && m <= 59)) return null;
  const hc = ONES[h], tiep = ONES[(h % 12) + 1];
  if (m === 0) return [hc + " o'clock", hc];
  const kq = [];
  kq.push(hc + ' ' + (m < 10 ? 'oh ' + ONES[m] : dem(m)[0]));
  if (m === 15) kq.push('a quarter past ' + hc, 'a quarter after ' + hc);
  else if (m === 30) kq.push('half past ' + hc);
  else if (m === 45) kq.push('a quarter to ' + tiep);
  else if (m % 5 === 0 && m < 30) kq.push(dem(m)[0] + ' past ' + hc, dem(m)[0] + ' after ' + hc);
  else if (m % 5 === 0 && m > 30) kq.push(dem(60 - m)[0] + ' to ' + tiep);
  return kq;
}

// Tiền: ký hiệu + số nguyên (có dấu phẩy ngăn nghìn) + tùy chọn phần lẻ hai chữ số (chỉ cho $).
export function tien(ky, phanNguyen, phanLe) {
  const A = parseInt(phanNguyen.replace(/,/g, ''), 10);
  const don = { '$': ['dollar', 'dollars'], '£': ['pound', 'pounds'], '€': ['euro', 'euros'] }[ky];
  if (!don || !Number.isInteger(A)) return null;
  const chu = A === 1 ? [don[0]] : [don[1]];
  const dollars = (dem(A) || []).map(x => x + ' ' + chu[0]);
  if (phanLe === undefined) return dollars;
  if (ky !== '$') return null;
  const C = parseInt(phanLe, 10);
  const cents = C === 1 ? 'one cent' : dem(C)[0] + ' cents';
  const kq = [];
  if (A === 0) return [cents];
  for (const d of dollars) kq.push(d + ' and ' + cents, d + ' ' + cents);
  const ccChu = C < 10 ? 'oh ' + ONES[C] : dem(C)[0];
  for (const a of dem(A)) kq.push(a + ' ' + ccChu);
  return duyNhat(kq);
}

// Chữ số điện thoại: mỗi chữ số một từ; 0 đọc zero hoặc oh; "+" đọc plus. Trả về MẪU (regex) vì có chỗ chọn.
function mauDienThoai(s) {
  const mau = [];
  for (const k of s) {
    if (/\d/.test(k)) mau.push(k === '0' ? '(?:zero|oh)' : ONES[+k]);
    else if (k === '+') mau.push('plus');
  }
  return mau;
}

// Cắt một chuỗi hiển thị thành các đoạn: chữ thường và "token số".
const TOKEN = new RegExp([
  '(?<ngayAnh>\\b\\d{1,2} (?:' + THANG.join('|') + ')\\b)',
  '(?<gio>\\b\\d{1,2}:\\d{2}\\b)',
  '(?<tien>[$£€]\\d[\\d,]*(?:\\.\\d{2})?)',
  '(?<vnd>\\d[\\d,]*\\s?VND)',
  '(?<phanTram>\\d+%)',
  '(?<dt>\\+?\\(?\\d[\\d() \\-]{7,}\\d)',
  '(?<tt>\\b\\d+(?:st|nd|rd|th)\\b)',
  '(?<nam>\\b(?:1\\d{3}|20\\d{2})\\b)',
  '(?<phay>\\b\\d{1,3}(?:,\\d{3})+\\b)',
  '(?<so>\\b\\d+\\b)',
].join('|'), 'g');

function bienTheToken(g, t) {
  if (g.ngayAnh) {
    const [d, ...th] = t.split(' ');
    const o = thuTu(+d); if (!o) return null;
    return [`the ${o[0]} of ${th.join(' ')}`, `${o[0]} of ${th.join(' ')}`];
  }
  if (g.gio) { const [h, m] = t.split(':').map(Number); return gio(h, m); }
  if (g.tien) {
    const mm = t.match(/^([$£€])(\d[\d,]*)(?:\.(\d{2}))?$/);
    return tien(mm[1], mm[2], mm[3]);
  }
  if (g.vnd) { const r = dem(parseInt(t.replace(/[^\d]/g, ''), 10)); return r && r.map(x => x + ' dong'); }
  if (g.phanTram) { const r = dem(parseInt(t, 10)); return r && r.map(x => x + ' percent'); }
  if (g.tt) { const r = thuTu(parseInt(t, 10)); return r; }
  if (g.nam) return nam(parseInt(t, 10));
  if (g.phay || g.so) return dem(parseInt(t.replace(/,/g, ''), 10));
  return null;
}

// Mọi cách đọc của MỘT chuỗi số (không phải số điện thoại). null nếu chuỗi không phải đúng một token.
export function bienThe(chuoiSo) {
  const t = chuoiSo.trim();
  TOKEN.lastIndex = 0;
  const m = TOKEN.exec(t);
  if (!m || m.index !== 0 || m[0] !== t) return null;
  if (m.groups.dt) return null;
  const kq = bienTheToken(m.groups, t);
  return kq && kq.map(chuan);
}

// `hienThi` = chữ như người học thấy (có số); `doc` = chữ đọc. true nếu mọi số trong hienThi đọc đúng ở đúng chỗ.
export function khopCau(hienThi, doc) {
  const mau = [];
  let cuoi = 0;
  TOKEN.lastIndex = 0;
  const bo = s => khongCach(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const m of hienThi.matchAll(TOKEN)) {
    mau.push(bo(hienThi.slice(cuoi, m.index)));
    cuoi = m.index + m[0].length;
    if (m.groups.dt) {
      mau.push(mauDienThoai(m[0]).map(x => x.startsWith('(?:') ? x : bo(x)).join(''));
      continue;
    }
    const bt = bienTheToken(m.groups, m[0]);
    if (!bt) return false;
    mau.push('(?:' + duyNhat(bt.map(khongCach)).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')');
  }
  mau.push(bo(hienThi.slice(cuoi)));
  return new RegExp('^' + mau.join('') + '$').test(khongCach(doc));
}
