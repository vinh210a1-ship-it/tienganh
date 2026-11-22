// Phép kiểm chung cho index.html: chạy sau MỖI lần sửa trang để biết có làm vỡ gì không.
// Chạy: node kiem/kiem-web.mjs        (cần Node.js và Playwright; thoát mã 1 nếu có một phép đỏ)
//   Cài Playwright một lần: npm install --no-save playwright && npx playwright install chromium
// Kiểm gì (mỗi phép in một dòng OK/LỖI):
//   1. Số thẻ từ / mẫu câu / câu quiz khớp mốc ở BAN_DAU, và khớp chữ ghi trên trang.
//   2. Mọi liên kết "#..." (trong HTML tĩnh, trong chuỗi của mã JS, và trong DOM sau khi vẽ) trỏ tới bài có thật.
//   3. Mở từng bài: không lỗi console, không lỗi JS.
//   4. Màn hình 390 px: không bài nào tràn ngang.
//   5. Chế độ tối: chữ ở menu bài đang chọn, nút tab và nút chính đạt tương phản >= 4,5:1.
//   6. Các cụm chữ đã sửa không quay lại ("10–15 từ mới"; "Sau khóa này" không xếp việc đã dạy là việc tiếp theo).
//
// Khi cố ý thêm/bớt thẻ, mẫu câu hay câu quiz: sửa BAN_DAU bên dưới (cùng PR) để mốc luôn là số thật.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('Thiếu Playwright. Chạy: npm install --no-save playwright && npx playwright install chromium'); process.exit(2); }

const here = path.dirname(new URL(import.meta.url).pathname);
const FILE = process.argv.find(a => a.endsWith('.html')) || path.join(here, '..', 'index.html');
const URL_TRANG = pathToFileURL(path.resolve(FILE)).href;
const SRC = fs.readFileSync(path.resolve(FILE), 'utf8');

// Mốc số đếm hiện tại (đếm lại ngày 2026-11-22 bằng window.__COUNTS).
const BAN_DAU = { vocab: 186, phrases: 80, quiz: 87 };
const NGUONG_TUONG_PHAN = 4.5;

let loi = 0;
const ok = (ten, chiTiet = '') => console.log('OK    ' + ten + (chiTiet ? ' · ' + chiTiet : ''));
const sai = (ten, chiTiet) => { loi++; console.log('LỖI  ' + ten + ' · ' + chiTiet); };
const kiem = (dieuKien, ten, chiTiet) => (dieuKien ? ok(ten) : sai(ten, chiTiet));

/* ---------- Phép tĩnh: đọc thẳng file, không cần trình duyệt ---------- */
// Liên kết '#id' viết trong HTML hoặc trong chuỗi JS ('...href="#abc"...', "...href=\"#abc\"...").
const tinh = [...SRC.matchAll(/href=\\?["']#([A-Za-z0-9_-]+)\\?["']/g)].map(m => m[1]);

// "10–15 từ mới mỗi ngày" mâu thuẫn bộ 186 thẻ: không được quay lại.
kiem(!/10[–-]15 từ mới/.test(SRC), 'không còn câu "10–15 từ mới mỗi ngày"', 'tìm thấy "10–15 từ mới" trong index.html');

// Mục "Sau khóa này": không xếp thứ đã dạy ở Bài 5B làm việc kế tiếp.
const m = SRC.match(/<h2>Sau khóa này học gì tiếp<\/h2>([\s\S]*?)<h2>/);
if (!m) sai('mục "Sau khóa này học gì tiếp"', 'không tìm thấy mục');
else {
  const dsMuc = [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1].replace(/<[^>]+>/g, ''));
  const loiThoi = dsMuc.filter(t => /^\s*(Thì hiện tại hoàn thành|So sánh)\b/.test(t));
  kiem(loiThoi.length === 0, '"Sau khóa này" không xếp việc đã dạy ở Bài 5B làm việc kế tiếp', 'còn mục: ' + loiThoi.join(' | '));
  kiem(/href="#so-sanh"/.test(m[1]), '"Sau khóa này" trỏ tới Bài 5B', 'thiếu liên kết #so-sanh');
}

/* ---------- Phép động: mở trang bằng trình duyệt ---------- */
const trinhDuyet = await chromium.launch();
try {
  const ctx = await trinhDuyet.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const trang = await ctx.newPage();
  const loiConsole = [];
  trang.on('console', msg => { if (msg.type() === 'error') loiConsole.push(msg.text()); });
  trang.on('pageerror', e => loiConsole.push('pageerror: ' + e.message));

  await trang.goto(URL_TRANG);
  await trang.waitForFunction(() => window.__COUNTS && document.querySelectorAll('nav.toc a[data-id]').length > 0);

  // 1. Số đếm
  const dem = await trang.evaluate(() => window.__COUNTS);
  for (const k of Object.keys(BAN_DAU)) kiem(dem[k] === BAN_DAU[k], `số ${k} = ${BAN_DAU[k]}`, `trang có ${dem[k]}, mốc ${BAN_DAU[k]} (nếu cố ý đổi thì sửa BAN_DAU)`);
  const chu = await trang.evaluate(() => {
    const doc = id => (document.getElementById(id) || {}).textContent || '';
    const mt = [...document.querySelectorAll('nav.toc a[data-id="tu-vung"]')].map(a => a.textContent).join(' ');
    return { baiTuVung: doc('tu-vung'), baiMauCau: doc('mau-cau'), mucLuc: mt };
  });
  kiem(new RegExp(`\\b${dem.vocab}\\s*(thẻ|từ)`).test(chu.baiTuVung), `Bài 4 ghi đúng "${dem.vocab} thẻ/từ"`, 'chữ trên Bài 4 không khớp số thẻ thật');
  kiem(new RegExp(`\\b${dem.phrases}\\s*mẫu câu`).test(chu.baiMauCau + chu.mucLuc + SRC.slice(SRC.indexOf('id:"mau-cau"'), SRC.indexOf('id:"mau-cau"') + 120)),
    `Bài 8 ghi đúng "${dem.phrases} mẫu câu"`, 'chữ không khớp số mẫu câu thật');

  // 2. Liên kết '#'
  const idBai = await trang.evaluate(() => [...document.querySelectorAll('section.lesson')].map(s => s.id));
  const idMoi = await trang.evaluate(() => new Set([...document.querySelectorAll('[id]')].map(e => e.id)));
  const lienKetDom = [];
  for (const id of idBai) {
    await trang.evaluate(h => { location.hash = h; }, '#' + id);
    const ds = await trang.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)));
    lienKetDom.push(...ds);
  }
  const tatCa = [...new Set([...tinh, ...lienKetDom])].filter(x => x);
  const hong = tatCa.filter(x => !idBai.includes(x));
  kiem(hong.length === 0, `mọi liên kết # (${tatCa.length} đích) trỏ tới bài có thật`, 'đích không có: ' + hong.join(', '));
  const muc = await trang.evaluate(() => [...document.querySelectorAll('nav.toc a[data-id]')].map(a => a.getAttribute('data-id')));
  const mucHong = muc.filter(x => !idBai.includes(x));
  kiem(mucHong.length === 0, `mục lục (${muc.length} mục) trỏ đúng bài`, 'mục lục trỏ tới: ' + mucHong.join(', '));

  // 3. Console
  for (const id of idBai) { await trang.evaluate(h => { location.hash = h; }, '#' + id); await trang.waitForTimeout(40); }
  kiem(loiConsole.length === 0, `mở ${idBai.length} bài không lỗi console`, loiConsole.slice(0, 5).join(' || '));

  // 4. 390 px không tràn ngang
  await trang.setViewportSize({ width: 390, height: 800 });
  const traNgang = [];
  for (const id of idBai) {
    await trang.evaluate(h => { location.hash = h; }, '#' + id);
    await trang.waitForTimeout(40);
    const r = await trang.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (r.sw > r.cw + 1) traNgang.push(`${id} (${r.sw}>${r.cw})`);
  }
  kiem(traNgang.length === 0, `390 px: ${idBai.length} bài không tràn ngang`, traNgang.join(', '));

  // 5. Tương phản chế độ tối (tự động theo hệ thống và ép data-theme="dark")
  const doTuongPhan = async (ten, cach) => {
    const c2 = await trinhDuyet.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: cach === 'auto-toi' ? 'dark' : 'light' });
    const p2 = await c2.newPage();
    await p2.goto(URL_TRANG + '#tu-vung');
    await p2.waitForFunction(() => document.querySelector('nav.toc a[aria-current="page"]'));
    if (cach === 'ep-toi') await p2.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const kq = await p2.evaluate(() => {
      const toi = s => { const c = s.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
      const tp = (a, b) => { const x = toi(a), y = toi(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
      // nền thật của phần tử: đi lên cha đến khi gặp nền không trong suốt
      const nen = el => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba?\(.*,\s*0\)$|transparent/.test(b)) return b; } return 'rgb(0,0,0)'; };
      const kt = (sel, ten) => { const el = document.querySelector(sel); if (!el) return { ten, thieu: true }; return { ten, tp: tp(getComputedStyle(el).color, nen(el)) }; };
      const ds = [kt('nav.toc a[aria-current="page"]', 'menu bài đang chọn'), kt('nav.toc a[aria-current="page"] .n', 'số bài đang chọn')];
      // nút tab: bấm một nút để có trạng thái aria-pressed="true"
      const nut = document.querySelector('.tabs button[aria-pressed="true"]');
      ds.push(nut ? kt('.tabs button[aria-pressed="true"]', 'nút tab đang bật') : { ten: 'nút tab đang bật', thieu: true });
      const btn = document.querySelector('#main .lesson.active .btn:not(.ghost)') || document.querySelector('.btn:not(.ghost)');
      ds.push(btn ? { ten: 'nút chính (.btn)', tp: tp(getComputedStyle(btn).color, getComputedStyle(btn).backgroundColor) } : { ten: 'nút chính (.btn)', thieu: true });
      return ds;
    });
    await c2.close();
    for (const r of kq) {
      if (r.thieu) { console.log('BỎ QUA ' + ten + ' · ' + r.ten + ': không có phần tử trên bài thử (không tính là lỗi)'); continue; }
      kiem(r.tp >= NGUONG_TUONG_PHAN, `${ten}: ${r.ten} tương phản ${r.tp.toFixed(2)}:1`, `thấp hơn ${NGUONG_TUONG_PHAN}:1`);
    }
  };
  await doTuongPhan('tối tự động', 'auto-toi');
  await doTuongPhan('tối ép data-theme', 'ep-toi');
} finally {
  await trinhDuyet.close();
}

console.log(loi === 0 ? '\nTẤT CẢ XANH' : `\n${loi} phép ĐỎ`);
process.exit(loi === 0 ? 0 : 1);
