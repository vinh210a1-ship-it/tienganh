// Phép kiểm chung cho index.html: chạy sau MỖI lần sửa trang để biết có làm vỡ gì không.
// Chạy: node kiem/kiem-web.mjs        (cần Node.js và Playwright; thoát mã 1 nếu có một phép đỏ)
//   Cài Playwright một lần: npm install --no-save playwright && npx playwright install chromium
// Kiểm gì (mỗi phép in một dòng OK/LỖI):
//   1. Số thẻ từ / mẫu câu / câu quiz khớp mốc ở BAN_DAU, và khớp chữ ghi trên trang.
//   2. Mọi liên kết "#..." (trong HTML tĩnh, trong chuỗi của mã JS, và trong DOM sau khi vẽ) trỏ tới bài có thật.
//   3. Mở từng bài: không lỗi console, không lỗi JS.
//   4. Màn hình 390 px: không bài nào tràn ngang.
//   5. Chế độ tối: chữ ở menu bài đang chọn, nút tab, nút chính và nút ghost (3 trang) đạt tương phản >= 4,5:1.
//   7. Bộ từ theo buổi dạy (gói B): hai bộ 20 từ khớp hai file kiem/bo-tu-vung/*.md; hai kịch bản (học viên mới, học viên có tiến độ sẵn).
//   8. Gói C: trang "Bảng tổng hợp ngữ pháp" và Bài 2B: mọi ví dụ tiếng Anh, bài tập, bài đọc đều có trong file gốc (kiem/nguon-ngu-phap/*.md); mỗi mục (h2) có nhãn "Tự soạn"; đáp án ẩn trong <details> đóng; bảng cuộn trong khung ở 390 px; số "bài nền tảng" ở trang chủ khớp mục lục.
//   9. Gói D: Bài 3B (giờ, thứ–ngày–tháng, tiền, số điện thoại): mọi số trên trang có chữ đọc kèm, chữ đọc khớp số theo bộ đổi số độc lập (kiem/doc-so.mjs, tự kiểm bằng kiem/gold-doc-so.mjs); nút loa đọc đúng chữ đã ghi; mỗi mục có nhãn "Tự soạn"; đáp án đóng; vị trí trong mục lục; câu quiz; lộ trình nối vào cuối tuần.
//  10. Gói E: 12 tình huống Thực hành: sáu khóa lưu cũ còn nguyên, khóa mới không trùng; mỗi tình huống mới có nhãn Tự soạn, mục Học trước, 8–10 lượt, câu then chốt, danh sách kiểm; số/giờ/giá có chữ đọc ghi sẵn; chỉ dùng cấu trúc đã khai (bộ dò cấu trúc, tự thử đỏ); nối đúng tuần ở Lộ trình; trang, mục lục, trang chủ ghi "12"; Bài 3B trỏ Bài 2B.
//   6. Các cụm chữ đã sửa không quay lại ("10–15 từ mới"; "Sau khóa này" không xếp việc đã dạy là việc tiếp theo).
//
// Khi cố ý thêm/bớt thẻ, mẫu câu hay câu quiz: sửa BAN_DAU bên dưới (cùng PR) để mốc luôn là số thật.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { khopCau, bienThe } from './doc-so.mjs';
import { DUNG, SAI } from './gold-doc-so.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('Thiếu Playwright. Chạy: npm install --no-save playwright && npx playwright install chromium'); process.exit(2); }

const here = path.dirname(new URL(import.meta.url).pathname);
const FILE = process.argv.find(a => a.endsWith('.html')) || path.join(here, '..', 'index.html');
const URL_TRANG = pathToFileURL(path.resolve(FILE)).href;
const SRC = fs.readFileSync(path.resolve(FILE), 'utf8');

// Mốc số đếm hiện tại (đếm lại ngày 2026-11-22 bằng window.__COUNTS; quiz 87 → 99 khi thêm 12 câu của Bài 2B ở gói C; 99 → 111 khi thêm 12 câu của Bài 3B ở gói D).
const BAN_DAU = { vocab: 186, phrases: 80, quiz: 111 };
const NGUONG_TUONG_PHAN = 4.5;

// Gói E: bộ dò "cấu trúc chưa dạy" cho các tình huống mới. Mỗi tình huống khai data-cho-phep = các nhóm cấu trúc ĐÃ học; nhóm nào không được khai mà xuất hiện trong hội thoại là lỗi.
// Cố ý thô: chỉ để bắt lỗi dùng sớm cấu trúc, không thay người đọc ngữ pháp. Cụm học như một khối khai ở data-cum (được bỏ qua).
const CAU_TRUC = {
  'modal': /\b(can|can't|cannot|could|should|shouldn't|must|mustn't|may|might|would|have to|has to|had to)\b|'d like/i,
  'tuong-lai': /\bwill\b|\bwon't\b|'ll\b|\bgoing to\b/i,
  'dang-lam': /\b(am|is|are|was|were|i'm|you're|he's|she's|it's|we're|they're)\s+(?!going to\b)\w{3,}ing\b/i,
  'so-sanh': /\b\w+er than\b|\bmore \w+ than\b|\b(smaller|cheaper|bigger|larger|better|worse|older|younger)\b|\bthe (most|\w+est)\b/i,
  'hoan-thanh': /\b(have|has|haven't|hasn't|i've|you've|we've|they've)\s+(already|just|ever|never|yet|been|gone|done|seen|taken|eaten|made|had|\w+ed)\b/i,
  'there-is': /\bthere (is|are|isn't|aren't|was|were)\b|\b(is|are) there\b/i,
  'noi-cau': /\b(because|when|if|so|but|or)\b/i,
  'bi-dong': /\b(is|are|was|were)\s+(\w+\s+)?\w+ed\b/i,
};
export const timCauTruc = chu => Object.entries(CAU_TRUC).filter(([, re]) => re.test(chu)).map(([k]) => k);


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


// Gói D: chính bộ đổi số phải đúng trước khi dùng nó để kiểm trang (bảng đáp án gõ tay ở gold-doc-so.mjs).
{
  const hongDung = DUNG.filter(([a, b]) => !khopCau(a, b)).map(([a, b]) => `${a} ≠ «${b}»`);
  const lotSai = SAI.filter(([a, b]) => khopCau(a, b)).map(([a, b]) => `${a} = «${b}»`);
  kiem(hongDung.length === 0, `bộ đổi số: ${DUNG.length} cách đọc đúng đều được nhận`, 'không nhận: ' + hongDung.slice(0, 5).join(' ; '));
  kiem(lotSai.length === 0, `bộ đổi số: ${SAI.length} cách đọc sai đều bị từ chối`, 'lọt: ' + lotSai.slice(0, 5).join(' ; '));
  kiem(bienThe('3:15').includes('a quarter past three') && bienThe('abc') === null, 'bộ đổi số: bienThe trả đúng và từ chối chuỗi không phải số', '');
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
    const ds = await trang.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1).split('?')[0]));
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
    // Nút ghost (nền trong suốt, chữ màu nhấn): từng bị chữ gần đen trên nền tối. Đo ở ba trang có nút ghost thật.
    const khoGhost = [['#tu-vung', '#main .lesson.active .fc-lb', 'nút ghost "Xem danh sách nhóm này" (Bài 4)'],
      ['#phan-tich', '#main .lesson.active #pcPick', 'nút ghost "Tải tệp" (Phân tích câu)'],
      ['#to-be', '#main .lesson.active .quiz .btn.ghost', 'nút ghost "Làm lại" (bài tập nhanh)']];
    for (const [hash, sel, ten] of khoGhost) {
      await p2.evaluate(h => { location.hash = h; }, hash);
      await p2.waitForSelector(sel, { state: 'visible', timeout: 5000 }).catch(() => {});
      kq.push(await p2.evaluate(([s2, t]) => {
        const toi = s => { const c = s.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
        const nen = el => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba?\(.*,\s*0\)$|transparent/.test(b)) return b; } return 'rgb(0,0,0)'; };
        const el = document.querySelector(s2);
        if (!el) return { ten: t, thieu: true };
        const x = toi(getComputedStyle(el).color), y = toi(nen(el));
        return { ten: t, tp: (Math.max(x, y) + .05) / (Math.min(x, y) + .05) };
      }, [sel, ten]));
    }
    await c2.close();
    for (const r of kq) {
      if (r.thieu) { console.log('BỎ QUA ' + ten + ' · ' + r.ten + ': không có phần tử trên bài thử (không tính là lỗi)'); continue; }
      kiem(r.tp >= NGUONG_TUONG_PHAN, `${ten}: ${r.ten} tương phản ${r.tp.toFixed(2)}:1`, `thấp hơn ${NGUONG_TUONG_PHAN}:1`);
    }
  };
  await doTuongPhan('tối tự động', 'auto-toi');
  await doTuongPhan('tối ép data-theme', 'ep-toi');

  /* ---------- 7. Bộ từ theo buổi dạy ---------- */
  // 7a. Dữ liệu: đọc hai file nguồn của buổi dạy, so với BO_TU và VOCAB trong trang (không đếm tay).
  const docBo = f => [...fs.readFileSync(path.join(here, 'bo-tu-vung', f), 'utf8').matchAll(/^\| \d+ \| \*\*([^*|]+)\*\* \|/gm)].map(x => x[1].trim());
  const tuNguon = { '1': docBo('bo-1.md'), '2': docBo('bo-2.md') };
  const trongTrang = await trang.evaluate(() => ({ vocab: window.__BO.vocab, bo: window.__BO.bo.map(b => ({ id: b.id, tu: b.tu })) }));
  const tachTu = k => k.split(/[\/()]/).map(x => x.trim()).filter(Boolean);
  for (const id of ['1', '2']) {
    kiem(tuNguon[id].length === 20 && new Set(tuNguon[id]).size === 20, `file nguồn Bộ ${id} có đúng 20 từ khác nhau`, `đọc được ${tuNguon[id].length} từ`);
    const bo = trongTrang.bo.find(b => b.id === id);
    kiem(!!bo, `trang có Bộ ${id}`, 'thiếu BO_TU id ' + id);
    if (!bo) continue;
    const loiBo = [];
    // mỗi từ nguồn phải nằm đúng một thẻ VOCAB, và thẻ đó phải ở bộ này
    const theCanCo = new Set();
    for (const w of tuNguon[id]) {
      const the = trongTrang.vocab.filter(k => tachTu(k).includes(w));
      if (the.length !== 1) { loiBo.push(`"${w}" khớp ${the.length} thẻ trong VOCAB`); continue; }
      theCanCo.add(the[0]);
      if (!bo.tu.includes(the[0])) loiBo.push(`thẻ "${the[0]}" (từ "${w}") không có trong Bộ ${id}`);
    }
    for (const k of bo.tu) {
      if (!trongTrang.vocab.includes(k)) loiBo.push(`BO_TU có khóa "${k}" không phải thẻ nào trong VOCAB`);
      else if (!theCanCo.has(k)) loiBo.push(`thẻ "${k}" nằm trong Bộ ${id} nhưng không có từ nào của file nguồn`);
    }
    kiem(loiBo.length === 0, `Bộ ${id}: mọi từ của file nguồn có mặt trong VOCAB và đúng bộ, không thừa thẻ`, loiBo.join(' | '));
  }
  const giao = (trongTrang.bo[0] ? trongTrang.bo[0].tu : []).filter(k => (trongTrang.bo[1] ? trongTrang.bo[1].tu : []).includes(k));
  kiem(giao.length === 0, 'hai bộ không trùng thẻ nào', 'trùng: ' + giao.join(', '));

  // 7b. Kịch bản: học viên MỚI (kho trống). Mặc định "Tất cả"; mở bằng link #tu-vung?bo=N thì chỉ ra thẻ của bộ N.
  const moi = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 } });
  const pm = await moi.newPage();
  const loiMoi = [];
  pm.on('pageerror', e => loiMoi.push(e.message));
  pm.on('console', m => { if (m.type() === 'error') loiMoi.push(m.text()); });
  const docThongKe = () => pm.evaluate(() => document.querySelector('#fc-core .fc-stats').textContent);
  await pm.goto(URL_TRANG + '#tu-vung');
  await pm.waitForSelector('#fc-core-b');
  kiem((await pm.inputValue('#fc-core-b')) === 'all' && /\/186/.test(await docThongKe()), 'học viên mới: mặc định là "Tất cả" (186 thẻ)', await docThongKe());
  kiem(await pm.evaluate(() => document.querySelector('#fc-core .fc-cp').hidden), 'ở "Tất cả" không hiện nút sao chép link', 'nút hiện');
  const baiHien = () => pm.evaluate(() => (document.querySelector('section.lesson.active') || {}).id);
  for (const id of ['1', '2']) {
    await pm.goto(URL_TRANG + '#tu-vung?bo=' + id);
    await pm.reload();
    await pm.waitForSelector('#fc-core-b');
    kiem((await baiHien()) === 'tu-vung', `link #tu-vung?bo=${id} mở đúng Bài 4 (không rơi về trang chủ)`, 'bài đang mở: ' + (await baiHien()));
    kiem((await pm.inputValue('#fc-core-b')) === id && /Thẻ mới: 20 · Đã thuộc: 0\/20/.test(await docThongKe()), `link bộ ${id}: ô chọn đúng bộ, 20 thẻ mới`, await docThongKe());
    // học hết bộ: bấm "Thuộc rồi" 20 lần, mọi thẻ hiện ra phải thuộc bộ này và không lặp
    const bo = trongTrang.bo.find(b => b.id === id);
    const thay = [];
    for (let i = 0; i < 20; i++) {
      const w = await pm.evaluate(() => document.querySelector('#fc-core .fc-word').textContent);
      thay.push(w);
      try { await pm.click('#fc-core .btn.yes', { timeout: 3000 }); } catch { break; } // bộ có ít hơn 20 thẻ: dừng, phép kiểm bên dưới báo lỗi
    }
    const ngoai = thay.filter(w => !bo.tu.includes(w));
    kiem(ngoai.length === 0 && new Set(thay).size === 20, `bộ ${id}: 20 thẻ hiện ra đều thuộc bộ và không lặp`, 'ngoài bộ/lặp: ' + ngoai.join(', ') + ' · ' + thay.join(', '));
    const sau = await pm.evaluate(() => document.querySelector('#fc-core .fc-word').textContent);
    kiem(/Hết thẻ đến hạn/.test(sau), `bộ ${id}: học xong 20 thẻ thì dừng, không đẩy sang 186 thẻ`, 'hiện: ' + sau);
  }
  // đổi bộ bằng link khi đang ở trang: ô chọn đổi theo, và quay về "Tất cả" khi bỏ ?bo=
  await pm.evaluate(() => { location.hash = '#tu-vung?bo=1'; });
  await pm.waitForTimeout(80);
  kiem((await pm.inputValue('#fc-core-b')) === '1' && (await baiHien()) === 'tu-vung', 'đổi link sang ?bo=1 khi đang mở trang thì ô chọn đổi theo', 'ô = ' + (await pm.inputValue('#fc-core-b')));
  await pm.evaluate(() => { location.hash = '#tu-vung?bo=khong-co'; });
  await pm.waitForTimeout(80);
  kiem((await pm.inputValue('#fc-core-b')) === 'all', 'bộ không có trong link thì quay về "Tất cả"', 'ô = ' + (await pm.inputValue('#fc-core-b')));
  kiem(loiMoi.length === 0, 'kịch bản học viên mới: không lỗi console', loiMoi.slice(0, 3).join(' || '));
  await moi.close();

  // 7c. Kịch bản: học viên CÓ TIẾN ĐỘ SẴN (kho đã có hộp/ngày hẹn). Mở bộ rồi học: kho cũ không mất, không đổi hộp của thẻ khác.
  const sanBoxes = { want: 4, need: 2, understand: 3, the: 5, 'a / an': 1, because: 0, 'easy / difficult': 2 };
  const sanDue = { want: 9999, need: 0, understand: 9999, the: 9999, 'a / an': 0, because: 0, 'easy / difficult': 9999 };
  const cu = await trinhDuyet.newContext({ viewport: { width: 1280, height: 900 } });
  await cu.addInitScript(([b, d]) => {
    try {
      if (localStorage.getItem('kiem:gieo')) return;
      const hom = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
      const due = {}; for (const k of Object.keys(d)) due[k] = d[k] === 9999 ? hom + 20 : hom - 1;
      localStorage.setItem('en8020.boxes', JSON.stringify(b));
      localStorage.setItem('en8020.due', JSON.stringify(due));
      localStorage.setItem('kiem:gieo', '1');
    } catch (e) {}
  }, [sanBoxes, sanDue]);
  const pc = await cu.newPage();
  const loiCu = [];
  pc.on('pageerror', e => loiCu.push(e.message));
  pc.on('console', m => { if (m.type() === 'error') loiCu.push(m.text()); });
  await pc.goto(URL_TRANG + '#tu-vung?bo=1');
  await pc.waitForSelector('#fc-core-b');
  const tk = () => pc.evaluate(() => document.querySelector('#fc-core .fc-stats').textContent);
  // Bộ 1 có want (hộp 4, thuộc) và need (hộp 2, đến hạn): 1 đã thuộc, 1 đến hạn, 18 mới
  kiem(/Đến hạn hôm nay: 1 · Thẻ mới: 18 · Đã thuộc: 1\/20/.test(await tk()), 'có tiến độ sẵn: Bộ 1 đọc đúng hộp cũ (want thuộc, need đến hạn, 18 mới)', await tk());
  // thẻ đến hạn hiện trước thẻ mới
  kiem((await pc.evaluate(() => document.querySelector('#fc-core .fc-word').textContent)) === 'need', 'có tiến độ sẵn: thẻ đến hạn của bộ hiện trước thẻ mới', 'hiện: ' + (await pc.evaluate(() => document.querySelector('#fc-core .fc-word').textContent)));
  await pc.selectOption('#fc-core-b', '2');
  kiem(/Đến hạn hôm nay: 0 · Thẻ mới: 18 · Đã thuộc: 1\/20/.test(await tk()), 'có tiến độ sẵn: Bộ 2 đọc đúng hộp cũ (understand thuộc, "easy / difficult" chưa đến hạn, 18 mới)', await tk());
  await pc.selectOption('#fc-core-b', 'all');
  kiem(/\/186/.test(await tk()), 'chọn lại "Tất cả" thì đủ 186 thẻ', await tk());
  // học một thẻ ở Bộ 1 rồi kiểm kho: các khóa cũ còn nguyên, chỉ thẻ vừa học đổi
  await pc.selectOption('#fc-core-b', '1');
  await pc.click('#fc-core .btn.yes');
  const kho = await pc.evaluate(() => JSON.parse(localStorage.getItem('en8020.boxes')));
  const doi = Object.keys(sanBoxes).filter(k => kho[k] !== sanBoxes[k]);
  kiem(Object.keys(sanBoxes).every(k => k in kho) && doi.length === 1 && doi[0] === 'need' && kho.need === 3, 'có tiến độ sẵn: học một thẻ chỉ đổi hộp thẻ đó, các thẻ cũ giữ nguyên hộp', 'khác: ' + doi.join(',') + ' · need=' + kho.need);
  // nạp lại trang không mất tiến độ
  await pc.reload();
  await pc.waitForSelector('#fc-core-b');
  await pc.selectOption('#fc-core-b', 'all');
  const kho2 = await pc.evaluate(() => JSON.parse(localStorage.getItem('en8020.boxes')));
  kiem(Object.keys(sanBoxes).every(k => k in kho2), 'nạp lại trang: không mất thẻ nào đã có tiến độ', 'mất: ' + Object.keys(sanBoxes).filter(k => !(k in kho2)).join(','));
  kiem(loiCu.length === 0, 'kịch bản có tiến độ sẵn: không lỗi console', loiCu.slice(0, 3).join(' || '));
  await cu.close();

  /* ---------- 8. Gói C: bảng tổng hợp ngữ pháp + Bài 2B ---------- */
  const chuanHoa = t => t.replace(/\*/g, '').replace(/ ?\((S|V|O|C)\)/g, '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  const NGUON_C = [
    ['bang-ngu-phap', 'bang-tong-hop.md'],
    ['cau-co-ban', 'bai-cau-co-ban-to-be.md'],
  ];
  const goc = Object.fromEntries(NGUON_C.map(([, f]) => [f, chuanHoa(fs.readFileSync(path.join(here, 'nguon-ngu-phap', f), 'utf8'))]));
  await trang.setViewportSize({ width: 390, height: 800 });
  for (const [id, f] of NGUON_C) {
    await trang.evaluate(h => { location.hash = h; }, '#' + id);
    await trang.waitForTimeout(60);
    const r = await trang.evaluate(id2 => {
      const sec = document.getElementById(id2);
      const lay = el => el.textContent.replace(/\s+/g, ' ').trim();
      // ví dụ cần đối chiếu: mọi .say, mục trong bài tập/bài đọc (li, đáp án, nhiệm vụ)
      const mau = [...sec.querySelectorAll('.say, .bt li, .bt details p, .doc li, .doc details p')].map(lay).filter(x => x);
      const h2 = [...sec.querySelectorAll('h2')].filter(h => !h.closest('.quiz')).map(h => ({ ten: lay(h), co: !!h.querySelector('.tag') && /Tự soạn/.test(lay(h)) }));
      const details = [...sec.querySelectorAll('details')];
      const dapAnLo = [...sec.querySelectorAll('.bt details > p, .bt details > ol, .doc details > ol')].filter(e => e.checkVisibility && e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })).length;
      const bang = [...sec.querySelectorAll('.tbl')].map(t => getComputedStyle(t).overflowX);
      return { mau, h2, nDetails: details.length, moSan: details.filter(d => d.open).length, dapAnLo, bang, banTieuDe: !!sec.querySelector('h1') };
    }, id);
    const khongCo = [...new Set(r.mau)].filter(x => !goc[f].includes(chuanHoa(x)));
    kiem(r.mau.length > 20 && khongCo.length === 0, `gói C · #${id}: ${r.mau.length} ví dụ/bài tập khớp file gốc ${f}`, 'không thấy trong file gốc: ' + khongCo.slice(0, 6).map(x => '«' + x + '»').join(' ; '));
    const thieuNhan = r.h2.filter(x => !x.co).map(x => x.ten);
    kiem(r.h2.length >= 5 && thieuNhan.length === 0, `gói C · #${id}: ${r.h2.length} mục h2 đều có nhãn "Tự soạn"`, 'thiếu nhãn: ' + thieuNhan.join(' | '));
    kiem(r.bang.length > 0 && r.bang.every(v => v === 'auto' || v === 'scroll'), `gói C · #${id}: ${r.bang.length} bảng cuộn ngang trong khung`, 'overflow-x: ' + [...new Set(r.bang)].join(','));
    if (id === 'cau-co-ban') {
      kiem(r.nDetails >= 12 && r.moSan === 0 && r.dapAnLo === 0, `gói C · #${id}: ${r.nDetails} khối đáp án đều đóng, đáp án không hiện`, `details=${r.nDetails}, mở sẵn=${r.moSan}, đáp án đang hiện=${r.dapAnLo}`);
    }
  }
  // Trang chủ ghi đúng số bài nền tảng của Khu 1 (so với mẫu số trên thanh tiến độ).
  await trang.evaluate(() => { location.hash = '#home'; });
  const homeBai = await trang.evaluate(() => ({ chu: (document.querySelector('#home .zone ul li') || {}).textContent || '', tiendo: document.getElementById('progText').textContent }));
  const nBai = (homeBai.chu.match(/(\d+) bài nền tảng/) || [])[1], mauSo = (homeBai.tiendo.match(/Khu 1: \d+\/(\d+)/) || [])[1];
  kiem(nBai && nBai === mauSo, `trang chủ ghi "${nBai} bài nền tảng", khớp mục lục Khu 1 (${mauSo})`, `${homeBai.chu} | ${homeBai.tiendo}`);
  // Bài mới nằm đúng chỗ trong mục lục: Bài 2 → Bài 2B → Bài 3; "Bảng tổng hợp ngữ pháp" nằm trong nhóm Công cụ.
  const thuTu = await trang.evaluate(() => [...document.querySelectorAll('nav.toc a[data-id]')].map(a => a.getAttribute('data-id')));
  const i2 = thuTu.indexOf('to-be');
  kiem(thuTu[i2 + 1] === 'cau-co-ban' && thuTu[i2 + 2] === 'hien-tai-don', 'mục lục: Bài 2 → Bài 2B → Bài 3', thuTu.slice(i2, i2 + 3).join(' > '));
  kiem(thuTu.indexOf('bang-ngu-phap') > thuTu.indexOf('lo-trinh') && thuTu.indexOf('phan-tich') === thuTu.indexOf('bang-ngu-phap') + 1, 'mục lục: "Bảng tổng hợp ngữ pháp" nằm ở nhóm Công cụ, ngay trước Phân tích câu', thuTu.join(','));

  /* ---------- 9. Gói D: Bài 3B giờ, ngày, tiền, số điện thoại ---------- */
  await trang.setViewportSize({ width: 1280, height: 900 });
  await trang.evaluate(() => { location.hash = '#gio-ngay-tien'; });
  await trang.waitForTimeout(80);
  const d = await trang.evaluate(() => {
    const sec = document.getElementById('gio-ngay-tien');
    const lay = el => el.textContent.replace(/\s+/g, ' ').trim();
    // cặp "số → chữ đọc": mỗi [data-n] đi với mọi .say nằm ở các phần tử đứng sau nó cho tới [data-n] kế tiếp
    const phu = new Set(), cap = [];
    for (const n of sec.querySelectorAll('[data-n]')) {
      const says = [];
      for (let e = n.nextElementSibling; e && !e.hasAttribute('data-n') && !e.querySelector('[data-n]'); e = e.nextElementSibling) {
        if (e.classList.contains('say')) says.push(e); else says.push(...e.querySelectorAll('.say'));
      }
      says.forEach(x => phu.add(x));
      cap.push({ so: lay(n), doc: says.map(x => ({ chu: lay(x), dataSay: x.getAttribute('data-say') })) });
    }
    const khac = [...sec.querySelectorAll('.say')].filter(x => !phu.has(x)).map(x => ({ chu: lay(x), dataSay: x.getAttribute('data-say') }));
    const h2 = [...sec.querySelectorAll('h2')].filter(h => !h.closest('.quiz')).map(h => ({ ten: lay(h), co: !!h.querySelector('.tag') && /Tự soạn/.test(lay(h)) }));
    const details = [...sec.querySelectorAll('details')];
    return {
      cap, khac, h2,
      nDetails: details.length, moSan: details.filter(x => x.open).length,
      dapAnLo: [...sec.querySelectorAll('details > ol, details > p')].filter(e => e.checkVisibility && e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })).length,
      bang: [...sec.querySelectorAll('.tbl')].map(t => getComputedStyle(t).overflowX),
      ghiChuTuSoan: !!sec.querySelector('.note .tag'),
    };
  });
  // (a) cặp số → chữ đọc
  const capSai = [], capThieu = [];
  for (const c of d.cap) {
    if (c.doc.length === 0) capThieu.push(c.so);
    for (const x of c.doc) if (/\d/.test(x.chu) || !khopCau(c.so, x.chu)) capSai.push(`${c.so} ≠ «${x.chu}»`);
  }
  kiem(d.cap.length >= 50 && capThieu.length === 0, `gói D · #gio-ngay-tien: ${d.cap.length} số đều có chữ đọc kèm`, 'số không có chữ đọc: ' + capThieu.join(', '));
  kiem(capSai.length === 0, `gói D · chữ đọc khớp số (${d.cap.reduce((t, c) => t + c.doc.length, 0)} cách đọc, kiểm bằng bộ đổi số)`, capSai.slice(0, 8).join(' ; '));
  // (b) câu có số: nút loa phải mang chữ đọc đã ghi sẵn, và chữ đọc khớp số trong câu
  const khacCoSo = d.khac.filter(x => /\d/.test(x.chu));
  const khacSai = [];
  for (const x of khacCoSo) {
    if (!x.dataSay) khacSai.push(`«${x.chu}» thiếu data-say`);
    else if (/\d/.test(x.dataSay)) khacSai.push(`«${x.dataSay}» còn chữ số`);
    else if (!khopCau(x.chu, x.dataSay)) khacSai.push(`«${x.chu}» ≠ «${x.dataSay}»`);
  }
  const dataSaySo = d.khac.filter(x => x.dataSay && /\d/.test(x.dataSay));
  kiem(khacCoSo.length >= 15 && khacSai.length === 0 && dataSaySo.length === 0, `gói D · ${khacCoSo.length} câu có số đều có chữ đọc ghi sẵn và khớp số`, khacSai.concat(dataSaySo.map(x => 'data-say còn số: ' + x.dataSay)).slice(0, 8).join(' ; '));
  // (c) bấm nút loa thật: máy đọc đúng chữ đã ghi (giả lập speechSynthesis để bắt chữ gửi đi)
  const noi = await trang.evaluate(() => {
    const ss = window.speechSynthesis, bat = [];
    if (!ss) return { loi: 'trình duyệt không có speechSynthesis' };
    ss.cancel = () => {}; ss.speak = u => { bat.push(u.text); };
    const sec = document.getElementById('gio-ngay-tien');
    const kq = [];
    for (const el of sec.querySelectorAll('.say[data-say]')) {
      const b = el.querySelector('button.spk'); if (!b) { kq.push({ thieuNut: el.textContent.trim() }); continue; }
      bat.length = 0; b.click();
      kq.push({ mong: el.getAttribute('data-say').replace(/\s*\/\s*/g, '. '), nhan: bat[0] });
    }
    return { kq };
  });
  const noiSai = noi.loi ? [noi.loi] : noi.kq.filter(x => x.thieuNut || x.mong !== x.nhan).map(x => x.thieuNut ? 'thiếu nút: ' + x.thieuNut : `mong «${x.mong}», máy nhận «${x.nhan}»`);
  kiem(!noi.loi && noi.kq.length >= 15 && noiSai.length === 0, `gói D · bấm loa ${noi.kq ? noi.kq.length : 0} câu có số: máy nhận đúng chữ đã ghi (không đọc chữ số)`, noiSai.slice(0, 4).join(' ; '));
  // (d) nhãn, đáp án, bảng
  const thieuNhanD = d.h2.filter(x => !x.co).map(x => x.ten);
  kiem(d.h2.length >= 7 && thieuNhanD.length === 0 && d.ghiChuTuSoan, `gói D · ${d.h2.length} mục h2 đều có nhãn "Tự soạn", đầu bài có ghi chú tự soạn`, 'thiếu nhãn: ' + thieuNhanD.join(' | '));
  kiem(d.nDetails >= 5 && d.moSan === 0 && d.dapAnLo === 0, `gói D · ${d.nDetails} khối đáp án đều đóng, đáp án không hiện`, `details=${d.nDetails}, mở sẵn=${d.moSan}, đang hiện=${d.dapAnLo}`);
  kiem(d.bang.length >= 8 && d.bang.every(v => v === 'auto' || v === 'scroll'), `gói D · ${d.bang.length} bảng cuộn ngang trong khung`, 'overflow-x: ' + [...new Set(d.bang)].join(','));
  // (e) câu quiz: đọc thẳng từ mã nguồn, ít nhất 8 câu, đáp án nằm trong lựa chọn, lựa chọn không trùng
  const khoiQuiz = (SRC.match(/\n"gio-ngay-tien":\[\n([\s\S]*?)\}\],\n"tu-vung"/) || [])[1];
  let quizD = [];
  try { quizD = new Function('return [' + khoiQuiz + '}]')(); } catch { quizD = []; }
  const quizLoi = quizD.filter(q => !(q.a >= 0 && q.a < q.o.length) || new Set(q.o).size !== q.o.length || !q.w).map(q => q.q);
  kiem(quizD.length >= 8 && quizLoi.length === 0, `gói D · ${quizD.length} câu quiz, đáp án nằm trong lựa chọn, có lời giải`, 'lỗi: ' + quizLoi.join(' | '));
  // (f) mục lục, trang chủ, lộ trình
  const thuTuD = await trang.evaluate(() => [...document.querySelectorAll('nav.toc a[data-id]')].map(a => a.getAttribute('data-id')));
  const iD = thuTuD.indexOf('hien-tai-don');
  kiem(thuTuD[iD + 1] === 'gio-ngay-tien' && thuTuD[iD + 2] === 'tu-vung', 'gói D · mục lục: Bài 3 → Bài 3B → Bài 4', thuTuD.slice(iD, iD + 3).join(' > '));
  const tuanCuoi = [...SRC.matchAll(/\{t:"(Tuần \d+[^"]*)", k:\[((?:"[^"]*",?)+)\]\}/g)].map(m => ({ t: m[1], k: [...m[2].matchAll(/"([^"]*)"/g)].map(x => x[1]) }));
  const tuanCo3B = tuanCuoi.filter(w => w.k.some(x => /Bài 3B/.test(x)));
  // Vị trí cố định (không làm lệch khóa w{tuần}t{số} đã lưu): tuần 3 mục thứ 4, tuần 7 mục thứ 5. Gói E nối thêm tình huống vào CUỐI tuần, nên Bài 3B không còn là mục cuối ở tuần 7.
  const viTri3B = tuanCo3B.map(w => w.t.split(':')[0] + '#' + (w.k.findIndex(x => /Bài 3B/.test(x)) + 1));
  kiem(tuanCo3B.length === 2 && tuanCo3B.every(w => w.k.filter(x => /Bài 3B/.test(x)).length === 1) && viTri3B.join(' ') === 'Tuần 3#4 Tuần 7#5',
    'gói D · Lộ trình: Bài 3B có ở 2 tuần, đúng vị trí cũ (tuần 3 mục 4, tuần 7 mục 5; không làm lệch khóa tiến độ w…t… đã lưu)', viTri3B.join(' | '));
  const homeD = await trang.evaluate(() => { location.hash = '#home'; return { chu: (document.querySelector('#home .zone ul li') || {}).textContent || '', tiendo: document.getElementById('progText').textContent }; });
  kiem(/14 bài nền tảng/.test(homeD.chu) && /Khu 1: \d+\/14/.test(homeD.tiendo), 'gói D · trang chủ ghi "14 bài nền tảng", khớp mục lục Khu 1', `${homeD.chu} | ${homeD.tiendo}`);

  /* ---------- 10. Gói E: 12 tình huống Thực hành ---------- */
  // (0) chính bộ dò cấu trúc phải đúng trước khi dùng nó (thử đỏ: câu sai phải bị bắt, câu đúng không bị bắt nhầm)
  {
    const phaiBat = [['I can swim.', 'modal'], ['I will call you.', 'tuong-lai'], ["She is reading a book.", 'dang-lam'], ['It is cheaper than that one.', 'so-sanh'], ["I've just finished.", 'hoan-thanh'], ['There is a park here.', 'there-is'], ['Call me when you arrive.', 'noi-cau'], ['The door is closed.', 'bi-dong']];
    const khongBat = ['Do you live with your family?', 'I have two sisters.', 'My mother works at a school.', 'We moved here in 2015.', 'Hello, this is Linh.', "It's next to a park.", 'Good morning.'];
    const thieu = phaiBat.filter(([c, k]) => !timCauTruc(c).includes(k)).map(([c]) => c);
    const nham = khongBat.filter(c => timCauTruc(c).length).map(c => c + ' → ' + timCauTruc(c).join(','));
    kiem(thieu.length === 0 && nham.length === 0, `gói E · bộ dò cấu trúc: bắt đủ ${phaiBat.length} câu sai, không bắt nhầm ${khongBat.length} câu đúng`, 'không bắt: ' + thieu.join(' | ') + ' · bắt nhầm: ' + nham.join(' | '));
  }
  await trang.setViewportSize({ width: 1280, height: 900 });
  await trang.evaluate(() => { location.hash = '#thuc-hanh'; });
  await trang.waitForTimeout(80);
  const eE = await trang.evaluate(() => {
    const sec = document.getElementById('thuc-hanh');
    const lay = el => el.textContent.replace(/\s+/g, ' ').trim();
    const sits = [...sec.querySelectorAll('.sit')].map(s => ({
      n: Number(s.getAttribute('data-sit')) || null,
      tieuDe: lay(s.querySelector('h2')),
      tuSoan: !!s.querySelector('h2 .tag') && /Tự soạn/.test(lay(s.querySelector('h2'))),
      tuan: Number(s.getAttribute('data-tuan')) || null,
      cho: (s.getAttribute('data-cho-phep') || '').split(/\s+/).filter(Boolean),
      cum: (s.getAttribute('data-cum') || '').split('|').filter(Boolean),
      hocLienKet: s.querySelectorAll('.note a[href^="#"]').length,
      coHocTruoc: /Học trước/.test(lay(s)),
      dlg: [...s.querySelectorAll('ul.dlg li')].map(li => { const sp = li.querySelector('.say'); return { vai: lay(li.querySelector('b')), chu: lay(sp), dataSay: sp.getAttribute('data-say'), nut: !!sp.querySelector('button.spk') }; }),
      then: s.querySelectorAll('ul.phr li').length,
      luot: [...s.querySelectorAll('p.luot')].length,
      luotI: [...s.querySelectorAll('p.luot i')].map(lay),
      khoa: [...s.querySelectorAll('.chk-row input[data-k]')].map(i => i.getAttribute('data-k')),
    }));
    return { sits, h1: lay(sec.querySelector('h1')), tieuDeTrang: sec.getAttribute('data-title'), bang: [...sec.querySelectorAll('.tbl tr')].map(r => [...r.children].map(lay)) };
  });
  // (a) số tình huống, khóa lưu
  const khoaCu = ['s1a', 's1b', 's1c', 's2a', 's2b', 's2c', 's3a', 's3b', 's3c', 's4a', 's4b', 's4c', 's5a', 's5b', 's5c', 's6a', 's6b', 's6c', 's6d'];
  const sitMoi = eE.sits.filter(s => s.n);
  const tatCaKhoa = eE.sits.flatMap(s => s.khoa);
  const trung = tatCaKhoa.filter((k, i) => tatCaKhoa.indexOf(k) !== i);
  kiem(eE.sits.length === 12 && sitMoi.length === 6 && sitMoi.map(s => s.n).join() === '7,8,9,10,11,12', 'gói E · trang Thực hành có đúng 12 tình huống (6 cũ + 6 mới đánh số 7–12)', `tổng ${eE.sits.length}, mới ${sitMoi.map(s => s.n).join()}`);
  kiem(khoaCu.every(k => tatCaKhoa.includes(k)) && trung.length === 0, 'gói E · 19 khóa lưu cũ (s1a…s6d) còn nguyên, khóa mới không trùng khóa nào', 'thiếu: ' + khoaCu.filter(k => !tatCaKhoa.includes(k)).join(',') + ' · trùng: ' + [...new Set(trung)].join(','));
  const khoaMoiSai = sitMoi.filter(s => s.khoa.length < 4 || !['a', 'b', 'c'].every(c => s.khoa.includes('s' + s.n + c))).map(s => s.n);
  kiem(khoaMoiSai.length === 0, 'gói E · mỗi tình huống mới có ≥ 4 ô danh sách kiểm, khóa dạng s<số><chữ>', 'sai: ' + khoaMoiSai.join(','));
  // (b) cấu trúc từng tình huống mới
  const loiCauTruc = [], loiKhung = [];
  for (const s of sitMoi) {
    if (!s.tuSoan) loiKhung.push(`${s.n}: thiếu nhãn Tự soạn`);
    if (!s.coHocTruoc || s.hocLienKet < 3) loiKhung.push(`${s.n}: mục "Học trước" thiếu hoặc < 3 liên kết`);
    if (s.dlg.length < 8 || s.dlg.length > 10) loiKhung.push(`${s.n}: ${s.dlg.length} lượt (cần 8–10)`);
    if (s.then < 4) loiKhung.push(`${s.n}: ${s.then} câu then chốt (cần ≥ 4)`);
    if (s.luot !== 1) loiKhung.push(`${s.n}: thiếu "Lượt của bạn"`);
    const dongTien = s.dlg.filter(d => d.vai === 'You').length;
    if (dongTien < 3) loiKhung.push(`${s.n}: vai You chỉ có ${dongTien} lượt`);
    const cum = s.cum.map(x => x.toLowerCase());
    const quet = [...s.dlg.map(d => d.chu), ...s.luotI];
    for (const chu of quet) {
      let t = chu.toLowerCase();
      for (const c of cum) t = t.split(c).join(' ');
      const bat = timCauTruc(t).filter(k => !s.cho.includes(k));
      if (bat.length) loiCauTruc.push(`${s.n}: «${chu}» dùng ${bat.join(',')} (chưa khai)`);
    }
    for (const k of s.cho) if (!(k in CAU_TRUC)) loiCauTruc.push(`${s.n}: nhóm cấu trúc lạ «${k}»`);
    // khai đúng, không khai thừa: nhóm đã khai mà hội thoại không dùng là khai sai (bảng "Học trước" sẽ nói dối)
    const daDung = new Set(quet.flatMap(chu => { let t = chu.toLowerCase(); for (const c of cum) t = t.split(c).join(' '); return timCauTruc(t); }));
    for (const k of s.cho) if (k in CAU_TRUC && !daDung.has(k)) loiCauTruc.push(`${s.n}: khai «${k}» nhưng hội thoại không dùng`);
  }
  kiem(loiKhung.length === 0, 'gói E · mỗi tình huống mới: nhãn Tự soạn, mục Học trước (≥ 3 liên kết), 8–10 lượt, ≥ 4 câu then chốt, Lượt của bạn', loiKhung.slice(0, 6).join(' ; '));
  kiem(loiCauTruc.length === 0, `gói E · cấu trúc: ${sitMoi.reduce((t, s) => t + s.dlg.length, 0)} lượt hội thoại chỉ dùng nhóm cấu trúc đã khai (tình huống 7 và 8 không có there is, so sánh, từ nối; v.v.)`, loiCauTruc.slice(0, 5).join(' ; '));
  // (c) số, giờ, giá
  const loiSo = [];
  for (const s of sitMoi) for (const d of s.dlg) {
    if (/\d/.test(d.chu)) {
      if (!d.dataSay) loiSo.push(`${s.n}: «${d.chu}» thiếu data-say`);
      else if (/\d/.test(d.dataSay)) loiSo.push(`${s.n}: data-say còn chữ số «${d.dataSay}»`);
      else if (!khopCau(d.chu, d.dataSay)) loiSo.push(`${s.n}: «${d.chu}» ≠ «${d.dataSay}»`);
    }
  }
  const soCauCoSo = sitMoi.reduce((t, s) => t + s.dlg.filter(d => /\d/.test(d.chu)).length, 0);
  kiem(soCauCoSo >= 10 && loiSo.length === 0, `gói E · ${soCauCoSo} lượt có số/giờ/giá đều có chữ đọc ghi sẵn và khớp số (bộ đổi số)`, loiSo.slice(0, 5).join(' ; '));
  const noiE = await trang.evaluate(() => {
    const ss = window.speechSynthesis, bat = [];
    if (!ss) return { loi: 'trình duyệt không có speechSynthesis' };
    ss.cancel = () => {}; ss.speak = u => { bat.push(u.text); };
    const kq = [];
    for (const s of document.querySelectorAll('#thuc-hanh .sit[data-sit]')) for (const el of s.querySelectorAll('ul.dlg .say, ul.phr .say')) {
      const b = el.querySelector('button.spk'); if (!b) { kq.push({ thieuNut: el.textContent.trim() }); continue; }
      bat.length = 0; b.click();
      kq.push({ mong: (el.getAttribute('data-say') || el.textContent.replace(/\s+/g, ' ').trim()).replace(/\s*\/\s*/g, '. '), nhan: bat[0], coSo: /\d/.test(bat[0] || '') });
    }
    return { kq };
  });
  const noiSaiE = noiE.loi ? [noiE.loi] : noiE.kq.filter(x => x.thieuNut || x.mong !== x.nhan || x.coSo).map(x => x.thieuNut ? 'thiếu nút: ' + x.thieuNut : `mong «${x.mong}», máy nhận «${x.nhan}»`);
  kiem(!noiE.loi && noiE.kq.length >= 60 && noiSaiE.length === 0, `gói E · bấm loa ${noiE.kq ? noiE.kq.length : 0} câu của 6 tình huống mới: máy nhận đúng chữ đã ghi, không có chữ số`, noiSaiE.slice(0, 4).join(' ; '));
  // (d) Lộ trình: tuần của từng tình huống, khóa tiến độ cũ không lệch
  const tuanE = [...SRC.matchAll(/\{t:"(Tuần (\d+)[^"]*)", k:\[((?:"[^"]*",?)+)\]\}/g)].map(m => ({ so: Number(m[2]), k: [...m[3].matchAll(/"([^"]*)"/g)].map(x => x[1]) }));
  const sauCu = { 5: 4, 6: 4, 7: 5, 8: 5 }; // số mục đã có trước gói E: mục mới chỉ được NỐI vào cuối
  const loiLoTrinh = [];
  for (const [tuan, soCu] of Object.entries(sauCu)) {
    const w = tuanE.find(x => x.so === Number(tuan));
    if (!w) { loiLoTrinh.push('thiếu tuần ' + tuan); continue; }
    if (w.k.length !== soCu + 1) loiLoTrinh.push(`tuần ${tuan} có ${w.k.length} mục (mong ${soCu + 1})`);
    if (!/^Thực hành: tình huống/.test(w.k[soCu] || '')) loiLoTrinh.push(`tuần ${tuan}: mục ${soCu + 1} không phải tình huống mới`);
  }
  for (const s of sitMoi) {
    const w = tuanE.find(x => x.so === s.tuan);
    const nhac = w && w.k.slice(sauCu[s.tuan]).some(x => new RegExp('tình huống (?:\\d+–)?' + s.n + '\\b|tình huống ' + (s.n - 1) + '–' + s.n + '\\b').test(x));
    if (!nhac) loiLoTrinh.push(`tình huống ${s.n} không có ở cuối tuần ${s.tuan}`);
    const dong = eE.bang.find(r => r[0] === String(s.tuan));
    if (!dong || !new RegExp('(^|[^0-9])' + s.n + '\\. ').test(dong[1])) loiLoTrinh.push(`bảng tuần: thiếu tình huống ${s.n} ở tuần ${s.tuan}`);
  }
  kiem(loiLoTrinh.length === 0, 'gói E · Lộ trình: tình huống 7–12 nối vào CUỐI tuần 5, 6, 7, 8 (khóa w…t… cũ không lệch) và khớp bảng "Làm tình huống nào vào tuần nào"', loiLoTrinh.slice(0, 5).join(' ; '));
  // (e) tên "12" ở mọi chỗ, Bài 3B trỏ Bài 2B
  const dsLoc = await trang.evaluate(() => { location.hash = '#home'; return { home: [...document.querySelectorAll('#home .zone ul li')].map(x => x.textContent).join(' | '), toc: (document.querySelector('nav.toc a[data-id="thuc-hanh"]') || {}).textContent || '' }; });
  kiem(/12 tình huống/.test(eE.h1) && /12 tình huống/.test(eE.tieuDeTrang) && /12 tình huống/.test(dsLoc.toc) && /12 tình huống/.test(dsLoc.home) && !/\b6 tình huống/.test(SRC.replace(/sáu tình huống|Sáu tình huống/g, '')), 'gói E · tiêu đề, mục lục, trang chủ đều ghi "12 tình huống" (không còn "6 tình huống")', `${eE.h1} | ${eE.tieuDeTrang} | ${dsLoc.toc}`);
  const dongGio = (SRC.match(/<p>Hỏi bằng <b>What time<\/b>[\s\S]*?<\/p>/) || [''])[0];
  kiem(/href="#cau-co-ban">Bài 2B</.test(dongGio) && !/href="#to-be">Bài 2</.test(dongGio), 'gói E · Bài 3B: "cách dùng thứ 8 của to be" trỏ Bài 2B (#cau-co-ban), không còn trỏ Bài 2', dongGio.slice(0, 160));
  const cach8 = await trang.evaluate(() => { const r = [...document.querySelectorAll('#cau-co-ban table tr')].find(t => t.children[0] && t.children[0].textContent.trim() === '8'); return r ? r.textContent.replace(/\s+/g, ' ') : ''; });
  kiem(/giờ/.test(cach8) && /chủ ngữ giả/i.test(cach8), 'gói E · Bài 2B có đúng dòng "cách dùng thứ 8 của to be" (giờ, chủ ngữ giả it) mà Bài 3B trỏ tới', cach8);
} finally {
  await trinhDuyet.close();
}

console.log(loi === 0 ? '\nTẤT CẢ XANH' : `\n${loi} phép ĐỎ`);
process.exit(loi === 0 ? 0 : 1);
