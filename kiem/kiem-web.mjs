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
//  11. Gói F: bài kiểm tra trình độ ngắn A1–A2: đúng 15 câu mỗi lần (300 lần rút), không câu nào vượt A2, mọi câu A1/A2 của ngân hàng đều có thể xuất hiện; bảng kết quả (Dưới A1/A1/A2/nên làm bản đầy đủ) khớp bảng gõ tay cho mọi cặp điểm; 7 kịch bản làm bài thật; bản đầy đủ vẫn 53 câu, vẫn mở bằng phần vốn từ; kết quả bản ngắn không ghi đè kết quả bản đầy đủ; khung giới thiệu không ghi thời gian chưa đo; 390 px không tràn; tương phản chế độ tối.
//  13. Gói H: Lộ trình 12 tuần: 186 thẻ chia đúng vào tuần 1–10 (bảng gõ tay), mỗi thẻ đúng một tuần; liên kết trong trang; tình huống 7–12 chỉ dùng cấu trúc đã dạy tới tuần được xếp; chế độ "theo lộ trình" của thẻ từ (bật, đổi tuần, tắt, nhớ sau tải lại, tiến độ ôn không đổi); tệp sao lưu có khóa mới, tệp cũ vẫn nạp được, giá trị lưu hỏng không làm vỡ trang; 390 px và tương phản ba chế độ.
//  12. Gói G: trang Phân tích câu chạy thật với bộ phân tích đã sửa (4 câu lỗi cũ hiện đúng nhãn, 390 px không tràn, không lỗi console). Độ chính xác do kiem/kiem-phan-tich.mjs đo.
//  13. Gói I: nạp gộp tiến độ (hàm gộp theo bảng đáp án gõ tay: máy trống, hai bản giống, xung đột thẻ, bài/lộ trình/ô kiểm, ngày kiểm tra, en8020.ltr12, khóa lạ, file hỏng, __proto__) và làm thật bằng trình duyệt (xem trước, Nạp gộp, Hủy, Thay hẳn, vòng xuất–nạp, tệp cũ); báo cáo tuần (số đếm gõ tay, không chép chữ lạ, chép vào clipboard, 390 px, tương phản).
//  14. Gói J: giọng thầy. Công cụ kiem/tao-danh-sach-am-thanh.mjs (danh sách trong repo khớp; tệp đúng tên được nhận, sai tên bị báo, chạy lại không ghi thêm, cảnh báo tệp nặng); trên trang: câu có tệp mp3 thì phát tệp (phát được thật), câu không có, tệp hỏng, đường dẫn lạ, bị chặn phát, thiếu danh sách thì giọng máy; đọc chậm; dừng tệp cũ khi bấm câu khác.
//  16. Gói L: số liệu Khu 2 khớp nguồn đã đọc ngày 2026-11-22 (Coxhead 2000 Table 4-5, độ phủ sublist, 118 thẻ AWL đúng sublist theo kiem/nguon-awl-sublist.json, số IELTS của British Council/ielts.org, công thức kiểm vốn từ 9.000 họ từ); nhãn nguồn thứ cấp / suy luận / tự soạn ở chỗ chưa kiểm được.
//   6. Các cụm chữ đã sửa không quay lại ("10–15 từ mới"; "Sau khóa này" không xếp việc đã dạy là việc tiếp theo).
//
// Khi cố ý thêm/bớt thẻ, mẫu câu hay câu quiz: sửa BAN_DAU bên dưới (cùng PR) để mốc luôn là số thật.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import os from 'node:os';
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
// Gói F: bản đầy đủ của bài kiểm tra trình độ luôn rút 53 câu (A1 9, A2 9, B1 11, B2 12, C1 12 từ ngân hàng hiện có). Cố ý đổi ngân hàng thì sửa số này cùng PR.
const PT_DAY_DU = 53;

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
  /* ---------- 11. Gói F: bài kiểm tra trình độ ngắn A1–A2 ---------- */
  {
    // Kế hoạch gõ tay (không đọc từ SHORT_PLAN của trang): số CÂU mỗi kỹ năng ở mỗi bậc. Đọc = 1 đoạn x 2 câu.
    const KH = { A1: { g: 3, r: 2, l: 2 }, A2: { g: 4, r: 2, l: 2 } };
    const TONG = 15, N1 = 7, N2 = 8;
    await trang.setViewportSize({ width: 1280, height: 900 });
    await trang.evaluate(() => { location.hash = '#kiem-tra'; });
    const bank = await trang.evaluate(() => window.__PT.PTB.map((q, i) => ({ i, lv: q.lv, sk: q.sk, t: q.t, p: q.p || null })));
    const ls = await trang.evaluate(() => { const r = []; for (let n = 0; n < 300; n++) r.push(window.__PT.buildShort().map(x => window.__PT.PTB.indexOf(x.it))); return r; });

    // (a) mỗi lần rút đúng 15 câu, không câu nào vượt A2, đúng cơ cấu, không trùng
    const loiRut = [], thay = new Set();
    for (const [n, ds] of ls.entries()) {
      const xs = ds.map(i => bank[i]);
      ds.forEach(i => thay.add(i));
      const dem = {};
      for (const x of xs) dem[x.lv + '/' + x.sk] = (dem[x.lv + '/' + x.sk] || 0) + 1;
      const mong = {}; for (const [lv, k] of Object.entries(KH)) for (const [sk, c] of Object.entries(k)) mong[lv + '/' + sk] = c;
      const sai1 = [];
      if (ds.length !== TONG) sai1.push('có ' + ds.length + ' câu');
      if (new Set(ds).size !== ds.length) sai1.push('trùng câu');
      if (xs.some(x => x.lv !== 'A1' && x.lv !== 'A2')) sai1.push('có câu ' + xs.find(x => x.lv !== 'A1' && x.lv !== 'A2').lv);
      if (xs.some(x => x.t !== 'mc')) sai1.push('có câu không phải trắc nghiệm');
      if (JSON.stringify(Object.entries(dem).sort()) !== JSON.stringify(Object.entries(mong).sort())) sai1.push('cơ cấu ' + JSON.stringify(dem));
      const a1 = xs.filter(x => x.lv === 'A1').length, a2 = xs.filter(x => x.lv === 'A2').length;
      if (a1 !== N1 || a2 !== N2) sai1.push(`A1 ${a1} / A2 ${a2}`);
      if (xs.findIndex(x => x.lv === 'A2') !== N1) sai1.push('A1 không đứng trước A2');
      for (const lv of ['A1', 'A2']) { const doc = xs.filter(x => x.lv === lv && x.sk === 'r'); if (new Set(doc.map(x => x.p)).size !== 1) sai1.push('đọc ' + lv + ' không cùng một đoạn'); }
      if (sai1.length) loiRut.push('lần ' + n + ': ' + sai1.join(', '));
    }
    kiem(loiRut.length === 0, `gói F · bản ngắn: 300 lần rút đều đúng ${TONG} câu (A1 ${N1} + A2 ${N2}), không câu nào vượt A2, đúng cơ cấu ngữ pháp/đọc/nghe, không trùng`, loiRut.slice(0, 3).join(' ; '));
    const chuaTung = bank.filter(x => (x.lv === 'A1' || x.lv === 'A2') && !thay.has(x.i)).length;
    kiem(chuaTung === 0, 'gói F · bản ngắn: mọi câu A1/A2 của ngân hàng đều có thể xuất hiện (không câu nào "chết")', chuaTung + ' câu không bao giờ được rút');

    // (b) bảng kết quả: bảng gõ tay, không tính lại từ 70%. A1 có 7 câu: đạt khi đúng 5, 6, 7. A2 có 8 câu: đạt khi đúng 6, 7, 8; vững (nên làm bản đầy đủ) khi đúng 7, 8.
    const bangThat = await trang.evaluate(() => { const r = {}; for (let a = 0; a <= 7; a++) for (let b = 0; b <= 8; b++) r[a + ',' + b] = window.__PT.shortOutcome({ ok: a, total: 7 }, { ok: b, total: 8 }); return r; });
    const loiBang = [];
    for (let a = 0; a <= 7; a++) for (let b = 0; b <= 8; b++) {
      const mong = ![5, 6, 7].includes(a) ? 'Dưới A1' : ![6, 7, 8].includes(b) ? 'A1' : [7, 8].includes(b) ? 'full' : 'A2';
      if (bangThat[a + ',' + b] !== mong) loiBang.push(`A1 ${a}/7, A2 ${b}/8: trang ra «${bangThat[a + ',' + b]}», bảng gõ tay «${mong}»`);
    }
    kiem(loiBang.length === 0, 'gói F · bản ngắn: 72 cặp điểm (A1 0–7, A2 0–8) cho đúng Dưới A1 / A1 / A2 / nên làm bản đầy đủ theo bảng gõ tay', loiBang.slice(0, 3).join(' ; '));

    // (c) làm bài thật bằng trình duyệt, 390 px, không có kết quả cũ
    const cF = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 }, colorScheme: 'light' });
    const pg = await cF.newPage();
    const loiF = [];
    pg.on('pageerror', e => loiF.push('pageerror: ' + e.message));
    pg.on('console', msg => { if (msg.type() === 'error') loiF.push(msg.text()); });
    await pg.goto(URL_TRANG + '#kiem-tra');
    await pg.waitForSelector('#ptStartShort');
    const tran = async () => pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const tranMax = [await tran()];
    const gt = await pg.evaluate(() => { const k = document.querySelector('.pt-fast'); return { chu: k ? k.textContent : '', nutDay: !!document.getElementById('ptStart'), nutNgan: document.getElementById('ptStartShort').textContent }; });
    kiem(gt.nutDay && /15 câu/.test(gt.nutNgan), 'gói F · trang có cả nút bản đầy đủ (#ptStart, như cũ) và nút "Làm bản ngắn A1–A2 (15 câu)"', JSON.stringify(gt));
    kiem(/15 câu/.test(gt.chu) && /không đo/.test(gt.chu) && !/phút|giây|giờ/.test(gt.chu), 'gói F · khung giới thiệu bản ngắn nói rõ 15 câu, không đo từ B1 trở lên, và KHÔNG ghi thời gian chưa đo', gt.chu);

    // trả lời câu đang hiện theo lệnh quyet(lv, thuTu) -> 'dung' | 'sai' | 'khong-biet'; hoiDung = có bấm "Dừng" khi hỏi dừng
    const lam = async (quyet, hoiDung = false) => {
      const nhat = []; let thuTu = 0, daHoi = false, tieuDe = null;
      for (let guard = 0; guard < 40; guard++) {
        if (await pg.$('#ptStop')) { daHoi = true; await pg.click(hoiDung ? '#ptStop' : '#ptGo'); if (hoiDung) break; continue; }
        if (!await pg.$('#ptDK')) break;
        const c = await pg.evaluate(() => {
          const txt = document.querySelector('.pt-q').textContent;
          const opts = [...document.querySelectorAll('#ptOpts .opt')].map(x => x.textContent);
          const ds = window.__PT.PTB.filter(x => x.q === txt && x.t === 'mc' && x.o.length === opts.length && x.o.every(o => opts.includes(o)));
          return { n: ds.length, lv: ds[0] && ds[0].lv, dung: ds[0] && ds[0].o[ds[0].a], opts, dau: document.querySelector('.pt-head span').textContent, vocab: !!document.getElementById('ynGrid') };
        });
        if (thuTu === 0) tieuDe = c.dau;
        if (c.n !== 1) { loiF.push('không nhận ra câu «' + c.dau + '» (' + c.n + ' khớp)'); break; }
        const y = quyet(c.lv, thuTu);
        nhat.push(c.lv + ':' + y[0]);
        if (y === 'khong-biet') await pg.click('#ptDK');
        else {
          const nhan = y === 'dung' ? c.dung : c.opts.find(o => o !== c.dung);
          await pg.evaluate(l => [...document.querySelectorAll('#ptOpts .opt')].find(b => b.textContent === l).click(), nhan);
        }
        thuTu++;
        tranMax.push(await tran());
      }
      const coNut = await pg.waitForSelector('#ptAgainShort', { timeout: 4000 }).then(() => true, () => false);
      if (!coNut) { loiF.push('màn kết quả không có nút "Làm lại bản ngắn" (#ptAgainShort)'); return { thuTu, tieuDe, daHoi, nhat, hong: true, badge: '', chu: await pg.evaluate(() => document.getElementById('pt').textContent.replace(/\s+/g, ' ')), fullGhost: false, luu: { ngan: null, day: null }, sai: -1 }; }
      return { thuTu, tieuDe, daHoi, nhat, tieuDe, daHoi, nhat,
        badge: await pg.evaluate(() => document.querySelector('.pt-badge').textContent),
        chu: await pg.evaluate(() => document.getElementById('pt').textContent.replace(/\s+/g, ' ')),
        fullGhost: await pg.evaluate(() => document.getElementById('ptFull').classList.contains('ghost')),
        luu: await pg.evaluate(() => ({ ngan: JSON.parse(localStorage.getItem('en8020.ptLastShort') || 'null'), day: localStorage.getItem('en8020.ptLast') })),
        sai: await pg.evaluate(() => (document.querySelector('.wrong-list') || { children: [] }).children.length) };
    };
    const demSai = (lv, soSai) => { let n = 0; return (l, i) => (l === lv && n++ < soSai ? 'sai' : 'dung'); };
    const vao = async () => { await pg.click('#ptStartShort'); await pg.waitForSelector('#ptDK'); };
    const kich = [
      // [tên, quyết định từng câu, hỏi-dừng, mong: huy hiệu, mã lưu, số câu đúng, số câu sai trong danh sách xem lại]
      ['đúng cả 15 câu', () => 'dung', false, '≥ A2', 'full', 15, 0],
      ['A1 đúng 7/7, A2 đúng 6/8 (đúng ngưỡng đạt)', demSai('A2', 2), false, 'A2', 'A2', 13, 2],
      ['A1 đúng 7/7, A2 đúng 5/8 (sát dưới ngưỡng)', demSai('A2', 3), false, 'A1', 'A1', 12, 3],
      ['A1 đúng 5/7 (đúng ngưỡng), A2 đúng 8/8', demSai('A1', 2), false, '≥ A2', 'full', 13, 2],
      ['A1 đúng 4/7 (sát dưới ngưỡng), A2 đúng 8/8: vẫn Dưới A1', demSai('A1', 3), false, 'Dưới A1', 'Dưới A1', 12, 3],
      ['A1 đúng 3/7 (<50%): hỏi dừng, chọn làm tiếp, A2 đúng cả', demSai('A1', 4), false, 'Dưới A1', 'Dưới A1', 11, 4],
      ['toàn "Tôi không biết": hỏi dừng, chọn dừng', () => 'khong-biet', true, 'Dưới A1', 'Dưới A1', 0, 15],
    ];
    for (const [i, [ten, quyet, dung, badge, ma, soDung, soSai]] of kich.entries()) {
      if (i > 0) { const bam = await pg.click('#ptAgainShort', { timeout: 3000 }).then(() => true, () => false); if (!bam) { await pg.goto(URL_TRANG + '#kiem-tra'); await pg.reload(); await pg.waitForSelector('#ptStartShort'); await pg.click('#ptStartShort'); } await pg.waitForSelector('#ptDK'); } else await vao();
      const r = await lam(quyet, dung);
      const mongHoi = /<50%/.test(ten);
      const loiK = [];
      if (r.hong) loiK.push('thiếu nút làm lại ở màn kết quả');
      if (i === 0 && !r.tieuDe.startsWith('Bản ngắn A1–A2 · Câu 1/15 · ')) loiK.push('tiêu đề câu đầu «' + r.tieuDe + '»');
      if (!dung && r.thuTu !== TONG) loiK.push('làm ' + r.thuTu + ' câu, không phải ' + TONG);
      if (dung && !r.daHoi) loiK.push('không hỏi dừng');
      if (mongHoi && !r.daHoi) loiK.push('không hỏi dừng dù A1 dưới 50%');
      if (!mongHoi && !dung && r.daHoi) loiK.push('hỏi dừng khi chưa cần');
      if (r.badge !== badge) loiK.push(`huy hiệu «${r.badge}», mong «${badge}»`);
      if (!r.luu.ngan || r.luu.ngan.level !== ma) loiK.push('lưu ptLastShort ' + JSON.stringify(r.luu.ngan));
      if (r.luu.day !== null) loiK.push('bản ngắn đã ghi đè kết quả bản đầy đủ (ptLast)');
      if (!new RegExp('Đúng ' + soDung + '/15 câu').test(r.chu)) loiK.push('không thấy «Đúng ' + soDung + '/15 câu»');
      if (r.sai !== soSai) loiK.push(`danh sách xem lại có ${r.sai} câu, mong ${soSai}`);
      if (i === 0 && r.fullGhost) loiK.push('kết quả "nên làm bản đầy đủ" mà nút bản đầy đủ lại là nút phụ');
      if (i === 2 && !r.fullGhost) loiK.push('nút bản đầy đủ phải là nút phụ khi chưa cần');
      if (!/Ước lượng/.test(r.chu) || !/người soạn đặt/.test(r.chu)) loiK.push('thiếu nhãn Ước lượng / "người soạn đặt" (ngưỡng là số tự đặt)');
      if (/phần 1|vốn từ ước lượng/i.test(r.chu.replace(/không đo vốn từ/g, ''))) loiK.push('kết quả bản ngắn nhắc phần vốn từ');
      kiem(loiK.length === 0, `gói F · kịch bản bản ngắn: ${ten} → ${badge}`, loiK.join(' ; '));
      tranMax.push(await tran());
    }
    // trang chủ đọc được dòng "lần gần nhất" của bản ngắn
    await pg.evaluate(() => { location.hash = '#home'; });
    const homeDong = await pg.evaluate(() => (document.getElementById('ptLastHome') || {}).textContent || '');
    kiem(/bản ngắn/.test(homeDong), 'gói F · trang chủ hiện dòng "Lần làm bản ngắn gần nhất"', homeDong);
    const linkHome = await pg.evaluate(() => [...document.querySelectorAll('#home a[href="#kiem-tra"]')].map(a => a.textContent).join(' | '));
    kiem(/bản ngắn/.test(linkHome), 'gói F · trang chủ có lối vào bản ngắn', linkHome);
    kiem(Math.max(...tranMax) <= 1, '390 px: giới thiệu, từng câu và kết quả của bản ngắn không tràn ngang', 'tràn ' + Math.max(...tranMax) + ' px');

    // (d) bản đầy đủ vẫn chạy như cũ: phần vốn từ trước, rồi 53 câu
    await pg.evaluate(() => { localStorage.clear(); });
    await pg.goto(URL_TRANG + '#kiem-tra'); await pg.reload();
    await pg.waitForSelector('#ptStart');
    await pg.click('#ptStart');
    const v1 = await pg.evaluate(() => ({ dau: document.querySelector('.pt-head span').textContent, o: document.querySelectorAll('#ynGrid input').length }));
    await pg.click('#ynSkip');
    const v2 = await pg.evaluate(() => document.querySelector('.pt-head span').textContent);
    kiem(/^Phần 1/.test(v1.dau) && v1.o > 40 && v2.startsWith('Phần 2 · Câu 1/' + PT_DAY_DU + ' · '), `gói F · bản đầy đủ vẫn mở bằng phần vốn từ (${v1.o} từ) rồi Phần 2 · Câu 1/${PT_DAY_DU}`, JSON.stringify({ v1, v2 }));
    const day = await trang.evaluate(() => { const r = []; for (let n = 0; n < 100; n++) r.push(window.__PT.build().map(x => x.it.lv + '/' + x.it.sk)); return r; });
    const ghep = day.map(d => d.length);
    kiem(ghep.every(n => n === PT_DAY_DU) && day.every(d => ['A1', 'A2', 'B1', 'B2', 'C1'].every(lv => d.some(x => x.startsWith(lv + '/'))) && d.some(x => x.endsWith('/w'))), `gói F · bản đầy đủ: 100 lần rút đều ${PT_DAY_DU} câu, đủ A1–C1, vẫn có câu tự gõ`, 'độ dài ' + [...new Set(ghep)].join(','));
    kiem(loiF.length === 0, 'gói F · làm bản ngắn và bản đầy đủ không lỗi console', loiF.slice(0, 3).join(' || '));
    await cF.close();

    // (e) chế độ sáng và tối: khung bản ngắn đủ tương phản
    for (const cach of ['sang', 'auto-toi', 'ep-toi']) {
      const c3 = await trinhDuyet.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: cach === 'auto-toi' ? 'dark' : 'light' });
      const p3 = await c3.newPage();
      await p3.goto(URL_TRANG + '#kiem-tra'); await p3.waitForSelector('#ptStartShort');
      if (cach === 'ep-toi') await p3.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      const tp3 = await p3.evaluate(() => {
        const toi = s => { const c = s.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
        const nen = el => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba?\(.*,\s*0\)$|transparent/.test(b)) return b; } return 'rgb(0,0,0)'; };
        const tp = el => { const x = toi(getComputedStyle(el).color), y = toi(nen(el)); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
        return [['chữ trong khung bản ngắn', '.pt-fast p'], ['tiêu đề khung bản ngắn', '.pt-fast h2'], ['nút bản ngắn', '#ptStartShort'], ['nút bản đầy đủ', '#ptStart']].map(([ten, s]) => { const el = document.querySelector(s); return { ten, tp: el ? tp(el) : 0 }; });
      });
      for (const r of tp3) kiem(r.tp >= NGUONG_TUONG_PHAN, `gói F · ${cach === 'sang' ? 'chế độ sáng' : cach === 'auto-toi' ? 'tối tự động' : 'tối ép data-theme'}: ${r.ten} tương phản ${r.tp.toFixed(2)}:1`, `thấp hơn ${NGUONG_TUONG_PHAN}:1`);
      await c3.close();
    }
  }

  // 13. Gói H: Lộ trình 12 tuần. Dữ liệu (thẻ theo tuần, liên kết, tình huống đúng tuần), chế độ "theo lộ trình" của thẻ từ, tương thích tệp sao lưu cũ.
  {
    // Bảng GÕ TAY từ giáo trình 12 tuần (mục 5, 7), không tính lại từ mã: số thẻ mỗi tuần, nhóm thẻ, bài bắt buộc phải có liên kết.
    const THE_TUAN = [15, 14, 20, 20, 21, 20, 20, 24, 20, 12];
    const NHOM_TUAN = ['f', 'f', 'v', 'v', 'v', 'n', 'n', 'a', 't', 'q'];
    const BAI_TUAN = { 1: ['phuong-phap', 'phat-am', 'mau-cau', 'kiem-tra'], 2: ['to-be', 'cau-co-ban'], 3: ['hien-tai-don', 'gio-ngay-tien'], 4: ['tu-vung'], 5: ['qua-khu-tuong-lai'], 6: ['qua-khu-tuong-lai', 'mau-cau', 'gio-ngay-tien'], 7: ['modal', 'gio-ngay-tien'], 8: ['ghep-cau'], 9: ['so-sanh'], 10: ['cong-viec', 'gio-ngay-tien'], 11: ['thuc-hanh'], 12: ['kiem-tra', 'lo-trinh'] };
    // Tuần đầu tiên mà mỗi nhóm cấu trúc được dạy (theo giáo trình 12 tuần): will 6, tiếp diễn 6, Bài 6 modal 7, Bài 7 there is + từ nối 8, Bài 5B so sánh và hoàn thành 9.
    const TUAN_DAY = { 'tuong-lai': 6, 'dang-lam': 6, 'modal': 7, 'there-is': 8, 'noi-cau': 8, 'so-sanh': 9, 'hoan-thanh': 9 };
    const hamTuanSit = w12 => { const kq = {}; for (const w of w12) { const ds = [...(w.th || []), ...((w.nhanh || []).flatMap(nh => nh.th))]; for (const [, chu] of ds) { const m = /^Tình huống (\d+)/.exec(chu); if (m) (kq[m[1]] = kq[m[1]] || []).push(w.w); } } return kq; };

    const d = await trang.evaluate(() => ({ tuan: window.__BO.tuan.map(b => ({ id: b.id, tuan: b.tuan, tu: b.tu })), w12: window.__BO.w12, vocab: window.__BO.vocab, nhom: window.__BO.nhom, bo: window.__BO.bo.map(b => b.id),
      lessons: [...document.querySelectorAll('section.lesson')].map(s => s.id) }));
    const tong = d.tuan.reduce((a, b) => a + b.tu.length, 0);
    kiem(tong === BAN_DAU.vocab && tong === 186, `gói H · bộ thẻ theo tuần: cộng lại đúng ${BAN_DAU.vocab} thẻ`, 'cộng được ' + tong);
    // Thẻ nhận diện bằng "chữ|nhóm" vì VOCAB có hai thẻ cùng chữ (work: động từ và danh từ).
    const khoaThe = d.vocab.map((w, i) => w + '|' + d.nhom[i]);
    kiem(new Set(khoaThe).size === khoaThe.length, 'gói H · mỗi thẻ có khóa "chữ|nhóm" duy nhất trong VOCAB', 'trùng: ' + khoaThe.filter((k, i) => khoaThe.indexOf(k) !== i).join(','));
    const dem = {}; for (const b of d.tuan) for (const w of b.tu) dem[w] = (dem[w] || 0) + 1;
    const thieu = khoaThe.filter(w => !dem[w]), lap = Object.keys(dem).filter(w => dem[w] > 1), la = Object.keys(dem).filter(w => !khoaThe.includes(w));
    kiem(thieu.length === 0 && lap.length === 0 && la.length === 0, 'gói H · mỗi thẻ trong VOCAB nằm đúng một tuần, không thẻ lạ', `thiếu ${thieu.slice(0, 4)} · lặp ${lap.slice(0, 4)} · lạ ${la.slice(0, 4)}`);
    kiem(JSON.stringify(d.tuan.map(b => b.tu.length)) === JSON.stringify(THE_TUAN), 'gói H · số thẻ mỗi tuần khớp bảng giáo trình (gõ tay)', d.tuan.map(b => b.tu.length).join(','));
    const loiNhom = [];
    d.tuan.forEach((b, i) => { for (const w of b.tu) { const k = w.split('|')[1]; if (k !== NHOM_TUAN[i]) loiNhom.push(`tuần ${b.tuan}: «${w}» thuộc nhóm ${k}, mong ${NHOM_TUAN[i]}`); } });
    kiem(loiNhom.length === 0, 'gói H · thẻ của mỗi tuần đúng nhóm theo giáo trình (chức năng → động từ → danh từ → tính từ → thời gian → số lượng)', loiNhom.slice(0, 3).join(' ; '));
    kiem(d.tuan.every((b, i) => b.id === 't' + (i + 1) && !d.bo.includes(b.id)) && d.tuan.length === 10, 'gói H · mã bộ t1..t10 không trùng bộ buổi dạy (1, 2)', d.tuan.map(b => b.id).join(','));
    kiem(d.w12.length === 12 && d.w12.every((x, i) => x.w === i + 1 && x.ten && x.noi && x.kiem), 'gói H · đủ 12 tuần, mỗi tuần có tên, "nói được gì", phép kiểm cuối tuần', 'số tuần ' + d.w12.length);

    // liên kết trong dữ liệu: mọi mã bài có thật; mỗi tuần có đủ bài bắt buộc
    const lkTuan = w => [...(w.bai || []), ...(w.th || []), ...((w.nhanh || []).flatMap(nh => [...nh.bai, ...nh.th]))].map(a => a[0]);
    const loiLk = [];
    for (const w of d.w12) {
      for (const id of lkTuan(w)) if (!d.lessons.includes(id)) loiLk.push(`tuần ${w.w}: bài «${id}» không có trong trang`);
      for (const id of BAI_TUAN[w.w]) if (!lkTuan(w).includes(id)) loiLk.push(`tuần ${w.w}: thiếu liên kết tới «${id}»`);
    }
    kiem(loiLk.length === 0, 'gói H · mọi liên kết trong dữ liệu trỏ tới bài có thật, mỗi tuần đủ bài chính theo giáo trình', loiLk.slice(0, 4).join(' ; '));

    // tình huống: 12 tình huống đều có chỗ; tình huống 7–12 chỉ dùng cấu trúc đã dạy tới tuần được xếp
    const tuanSit = hamTuanSit(d.w12);
    const thieuSit = []; for (let n = 1; n <= 12; n++) if (!tuanSit[n]) thieuSit.push(n);
    kiem(thieuSit.length === 0, 'gói H · cả 12 tình huống đều được xếp vào một tuần', 'chưa xếp: ' + thieuSit.join(','));
    const cho = await trang.evaluate(() => [...document.querySelectorAll('#thuc-hanh .sit[data-sit]')].map(s => ({ n: Number(s.getAttribute('data-sit')), cho: (s.getAttribute('data-cho-phep') || '').split(/\s+/).filter(Boolean) })));
    const loiSit = [];
    for (const s of cho) {
      const tuans = tuanSit[s.n] || [];
      for (const k of s.cho) {
        if (!(k in TUAN_DAY)) { if (!(k in CAU_TRUC)) loiSit.push(`tình huống ${s.n}: nhóm lạ «${k}»`); continue; }
        for (const w of tuans) if (TUAN_DAY[k] > w) loiSit.push(`tình huống ${s.n} xếp ở tuần ${w} nhưng dùng «${k}» (dạy ở tuần ${TUAN_DAY[k]})`);
      }
    }
    kiem(loiSit.length === 0 && cho.length === 6, 'gói H · tình huống 7–12 chỉ dùng cấu trúc đã dạy tới tuần được xếp trong lộ trình 12 tuần', loiSit.join(' ; ') || 'số tình huống mới ' + cho.length);

    // DOM sau khi vẽ
    const g = await trang.evaluate(() => {
      const tuans = [...document.querySelectorAll('#plan12 .week')];
      const bang = document.querySelectorAll('#lo-trinh-12 table');
      return {
        so: tuans.length,
        bo: tuans.map(w => { const a = w.querySelector('a[href^="#tu-vung?bo="]'); return { w: Number(w.getAttribute('data-w')), href: a ? a.getAttribute('href') : null, tag: !!w.querySelector('.tag.hyp') }; }),
        tongO: (document.getElementById('ov12Tong') || {}).textContent,
        hang: document.querySelectorAll('#ov12 tr').length,
        lk: [...document.querySelectorAll('#lo-trinh-12 a[href^="#"]')].map(a => a.getAttribute('href').slice(1).split('?')[0]),
        tuan8: document.querySelectorAll('#plan .week').length,
        mocBang: bang[1] ? bang[1].querySelectorAll('tr').length : 0,
        ghiChu: document.querySelector('#lo-trinh-12 .note') ? document.querySelector('#lo-trinh-12 .note').textContent : ''
      };
    });
    kiem(g.so === 12 && g.tongO === '186' && g.hang === 14, 'gói H · trang vẽ 12 tuần, bảng tổng quan cộng đúng 186', JSON.stringify({ so: g.so, tong: g.tongO, hang: g.hang }));
    kiem(g.bo.slice(0, 10).every((x, i) => x.href === '#tu-vung?bo=t' + (i + 1)) && g.bo.slice(10).every(x => x.href === null), 'gói H · tuần 1–10 có liên kết tới đúng bộ thẻ của tuần, tuần 11–12 không có', JSON.stringify(g.bo.map(x => x.href)));
    kiem(g.bo.every(x => x.tag), 'gói H · mọi tuần ghi nhãn "Số tự đặt" cho ngưỡng đạt', 'có tuần thiếu nhãn');
    kiem(g.lk.length > 60 && g.lk.every(id => d.lessons.includes(id)), `gói H · ${g.lk.length} liên kết nội bộ trên trang đều trỏ tới bài có thật`, 'liên kết hỏng: ' + g.lk.filter(id => !d.lessons.includes(id)).join(','));
    kiem(/chưa thử với học viên thật/.test(g.ghiChu) && /số tự đặt/.test(g.ghiChu), 'gói H · ghi chú đầu trang nói rõ chưa thử với học viên thật và ngưỡng là số tự đặt', g.ghiChu.slice(0, 80));
    kiem(g.tuan8 === 8 && g.mocBang === 5, 'gói H · Lộ trình 8 tuần vẫn đủ 8 tuần; bảng ba mốc có 4 mốc', `8 tuần: ${g.tuan8} · dòng bảng mốc ${g.mocBang}`);

    // Kịch bản: danh sách bộ khi TẮT chế độ, và từng bộ tuần mở bằng link (kho trống)
    const ctxH = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 } });
    const ph = await ctxH.newPage();
    const loiH = [];
    ph.on('pageerror', e => loiH.push(e.message));
    ph.on('console', m => { if (m.type() === 'error') loiH.push(m.text()); });
    const thongKe = () => ph.evaluate(() => document.querySelector('#fc-core .fc-stats').textContent);
    const opt = () => ph.evaluate(() => [...document.querySelectorAll('#fc-core-b option')].map(o => o.value));
    const luu = () => ph.evaluate(() => localStorage.getItem('en8020.ltr12'));
    await ph.goto(URL_TRANG + '#tu-vung'); await ph.waitForSelector('#fc-core-b');
    kiem(JSON.stringify(await opt()) === JSON.stringify(['all', '1', '2', ...THE_TUAN.map((_, i) => 't' + (i + 1))]), 'gói H · chế độ tắt: ô "Bộ thẻ" có Tất cả, Bộ 1, Bộ 2, Tuần 1–10; mặc định vẫn "Tất cả"', (await opt()).join(','));
    kiem((await ph.inputValue('#fc-core-b')) === 'all' && /\/186/.test(await thongKe()) && (await luu()) === null, 'gói H · học viên mới: mặc định "Tất cả" 186 thẻ, chưa ghi gì vào kho lộ trình', await thongKe());
    for (let i = 0; i < 10; i++) {
      await ph.goto(URL_TRANG + '#tu-vung?bo=t' + (i + 1)); await ph.reload(); await ph.waitForSelector('#fc-core-b');
      const st = await thongKe();
      kiem((await ph.inputValue('#fc-core-b')) === 't' + (i + 1) && new RegExp('Thẻ mới: ' + THE_TUAN[i] + ' · Đã thuộc: 0/' + THE_TUAN[i]).test(st), `gói H · link #tu-vung?bo=t${i + 1}: đúng bộ, ${THE_TUAN[i]} thẻ mới`, st);
    }
    // học hết bộ tuần 5 (21 thẻ): chỉ thẻ của bộ, không lặp, rồi dừng
    await ph.goto(URL_TRANG + '#tu-vung?bo=t5'); await ph.reload(); await ph.waitForSelector('#fc-core-b');
    const bo5 = d.tuan[4].tu.map(k => k.split('|')[0]), thay = [];
    for (let i = 0; i < 21; i++) { thay.push(await ph.evaluate(() => document.querySelector('#fc-core .fc-word').textContent)); try { await ph.click('#fc-core .btn.yes', { timeout: 3000 }); } catch { break; } }
    const sau5 = await ph.evaluate(() => document.querySelector('#fc-core .fc-word').textContent);
    kiem(thay.every(w => bo5.includes(w)) && new Set(thay).size === 21 && /Hết thẻ đến hạn/.test(sau5), 'gói H · học hết bộ tuần 5: 21 thẻ đều của bộ, không lặp, rồi dừng (không đẩy sang 186 thẻ)', `ngoài bộ: ${thay.filter(w => !bo5.includes(w)).join(',')} · sau: ${sau5}`);

    // Chế độ theo lộ trình: bật, đổi tuần, tắt, ghi nhớ sau tải lại
    await ph.evaluate(() => localStorage.clear());
    await ph.goto(URL_TRANG + '#lo-trinh-12'); await ph.reload(); await ph.waitForSelector('#ltrOn');
    await ph.check('#ltrOn'); await ph.selectOption('#ltrW', '3');
    kiem((await luu()) === JSON.stringify({ on: true, w: 3 }), 'gói H · bật theo lộ trình, tuần 3: kho ghi {on:true, w:3}', String(await luu()));
    kiem(await ph.evaluate(() => !!document.querySelector('#plan12 .week.cur') && document.querySelector('#plan12 .week.cur').getAttribute('data-w') === '3' && document.querySelectorAll('#plan12 .week.cur').length === 1), 'gói H · tuần đang học được tô khung', '');
    await ph.evaluate(() => { location.hash = '#tu-vung'; }); await ph.waitForSelector('#fc-core-b');
    const o3 = await opt();
    kiem(JSON.stringify(o3) === JSON.stringify(['ltr', '1', '2', 't1', 't2', 't3']) && (await ph.inputValue('#fc-core-b')) === 'ltr', 'gói H · theo lộ trình tuần 3: chỉ còn "thẻ đến hết tuần 3", Bộ 1, Bộ 2, Tuần 1–3; không còn "Tất cả" và tuần 4 trở đi', o3.join(','));
    kiem(/\/49\b/.test(await thongKe()), 'gói H · theo lộ trình tuần 3: 49 thẻ (15 + 14 + 20)', await thongKe());
    // đổi tuần rồi quay lại Bài 4 (không tải lại): danh sách và số thẻ đổi theo
    await ph.evaluate(() => { location.hash = '#lo-trinh-12'; }); await ph.selectOption('#ltrW', '5');
    await ph.evaluate(() => { location.hash = '#tu-vung'; });
    kiem((await ph.inputValue('#fc-core-b')) === 'ltr' && /\/90\b/.test(await thongKe()) && (await opt()).includes('t5') && !(await opt()).includes('t6'), 'gói H · đổi sang tuần 5 không cần tải lại: 90 thẻ (15 + 14 + 20 + 20 + 21), có Tuần 5, không có Tuần 6', await thongKe());
    // link tới bộ của tuần chưa tới: rơi về "thẻ đến hết tuần"
    await ph.evaluate(() => { location.hash = '#tu-vung?bo=t8'; }); await ph.waitForTimeout(80);
    kiem((await ph.inputValue('#fc-core-b')) === 'ltr', 'gói H · đang theo lộ trình tuần 5, link tới bộ tuần 8 (chưa tới) thì về "thẻ đến hết tuần 5"', 'ô = ' + (await ph.inputValue('#fc-core-b')));
    // nhớ sau khi tải lại
    await ph.goto(URL_TRANG + '#tu-vung'); await ph.reload(); await ph.waitForSelector('#fc-core-b');
    kiem((await ph.inputValue('#fc-core-b')) === 'ltr' && /\/90\b/.test(await thongKe()), 'gói H · tải lại trang: chế độ theo lộ trình vẫn bật, vẫn tuần 5', await thongKe());
    // tuần 12 = đủ 186
    await ph.evaluate(() => { location.hash = '#lo-trinh-12'; }); await ph.selectOption('#ltrW', '12'); await ph.evaluate(() => { location.hash = '#tu-vung'; });
    kiem(/\/186\b/.test(await thongKe()) && JSON.stringify(await opt()) === JSON.stringify(['ltr', '1', '2', ...THE_TUAN.map((_, i) => 't' + (i + 1))]), 'gói H · theo lộ trình tuần 12: đủ 186 thẻ, đủ mọi bộ tuần', await thongKe());
    // tiến độ ôn không đổi khi bật/tắt: ôn 3 thẻ ở tuần 3 rồi tắt chế độ
    await ph.evaluate(() => { location.hash = '#lo-trinh-12'; }); await ph.selectOption('#ltrW', '3'); await ph.evaluate(() => { location.hash = '#tu-vung'; });
    for (let i = 0; i < 3; i++) await ph.click('#fc-core .btn.yes');
    const khoTruoc = await ph.evaluate(() => ({ b: localStorage.getItem('en8020.boxes'), d: localStorage.getItem('en8020.due') }));
    await ph.evaluate(() => { location.hash = '#lo-trinh-12'; }); await ph.uncheck('#ltrOn'); await ph.evaluate(() => { location.hash = '#tu-vung'; });
    const khoSau = await ph.evaluate(() => ({ b: localStorage.getItem('en8020.boxes'), d: localStorage.getItem('en8020.due') }));
    kiem(JSON.stringify(khoTruoc) === JSON.stringify(khoSau) && Object.keys(JSON.parse(khoSau.b)).length === 3, 'gói H · tắt chế độ không đổi hộp và ngày hẹn của thẻ (3 thẻ vừa ôn còn nguyên)', JSON.stringify(khoSau));
    kiem((await ph.inputValue('#fc-core-b')) === 'all' && /\/186\b/.test(await thongKe()) && !(await opt()).includes('ltr'), 'gói H · tắt chế độ: ô về "Tất cả" 186 thẻ, hết "ltr"', await thongKe());

    // Sao lưu: tệp sao lưu có khóa mới; tệp sao lưu cũ (không có khóa này) vẫn nạp được; giá trị hỏng không làm vỡ trang
    await ph.evaluate(() => { location.hash = '#lo-trinh-12'; }); await ph.check('#ltrOn'); await ph.selectOption('#ltrW', '4');
    await ph.evaluate(() => { location.hash = '#lo-trinh'; }); await ph.waitForSelector('#bkExport');
    const [dl] = await Promise.all([ph.waitForEvent('download'), ph.click('#bkExport')]);
    const fileTam = path.join(os.tmpdir(), 'sao-luu-' + process.pid + '.json');
    await dl.saveAs(fileTam);
    const sl = JSON.parse(fs.readFileSync(fileTam, 'utf8'));
    kiem(sl.keys && sl.keys['en8020.ltr12'] === JSON.stringify({ on: true, w: 4 }), 'gói H · tệp sao lưu có khóa en8020.ltr12 của chế độ theo lộ trình', JSON.stringify(sl.keys && sl.keys['en8020.ltr12']));
    const cu2 = { app: 'tieng-anh-8020', version: 1, saved: '2026-11-01T00:00:00.000Z', keys: { 'en8020.boxes': JSON.stringify({ want: 2 }), 'en8020.due': JSON.stringify({ want: 99999 }) } };
    fs.writeFileSync(fileTam, JSON.stringify(cu2));
    await ph.evaluate(() => localStorage.removeItem('en8020.ltr12'));
    await ph.setInputFiles('#bkImport', fileTam);
    await ph.waitForSelector('#bkDe'); await ph.click('#bkDe'); // gói I: nút ghi đè nay có id riêng; nút đầu tiên là "Nạp gộp"
    await ph.waitForTimeout(1500);
    await ph.goto(URL_TRANG + '#tu-vung'); await ph.reload(); await ph.waitForSelector('#fc-core-b');
    const hauNap = await ph.evaluate(() => ({ b: localStorage.getItem('en8020.boxes'), l: localStorage.getItem('en8020.ltr12') }));
    kiem(hauNap.b === JSON.stringify({ want: 2 }) && hauNap.l === null && (await ph.inputValue('#fc-core-b')) === 'all', 'gói H · nạp tệp sao lưu CŨ (không có khóa lộ trình): nạp được, chế độ theo lộ trình tắt, mặc định "Tất cả"', JSON.stringify(hauNap));
    fs.unlinkSync(fileTam);
    // giá trị lưu hỏng: không làm vỡ trang. Mong đợi gõ tay: [chế độ bật?, tuần]
    const HONG = [['"rac"', false, '1'], ['{"on":"có","w":99}', false, '1'], ['{"on":true,"w":"3"}', true, '1'], ['null', false, '1'], ['[1,2]', false, '1'], ['{"on":true,"w":7}', true, '7']];
    for (const [hong, mongBat, mongTuan] of HONG) {
      await ph.evaluate(v => localStorage.setItem('en8020.ltr12', v), hong);
      await ph.goto(URL_TRANG + '#tu-vung'); await ph.reload(); await ph.waitForSelector('#fc-core-b');
      const v = await ph.evaluate(() => ({ on: document.getElementById('ltrOn').checked, w: document.getElementById('ltrW').value }));
      kiem(v.on === mongBat && v.w === mongTuan, `gói H · giá trị lưu ${hong}: trang vẫn mở, bật=${mongBat}, tuần ${mongTuan}`, JSON.stringify(v));
    }
    kiem(loiH.length === 0, 'gói H · các kịch bản thẻ theo tuần và chế độ theo lộ trình: không lỗi console', loiH.slice(0, 3).join(' || '));
    await ctxH.close();

    // 390 px không tràn ngang; chế độ sáng, tối tự động, tối ép: chữ, liên kết, nhãn, khung điều khiển đủ tương phản
    for (const cach of ['sang', 'auto-toi', 'ep-toi']) {
      const c4 = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 }, colorScheme: cach === 'auto-toi' ? 'dark' : 'light' });
      const p4 = await c4.newPage();
      await p4.goto(URL_TRANG + '#lo-trinh-12'); await p4.waitForSelector('#plan12 .week');
      if (cach === 'ep-toi') await p4.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      const kq = await p4.evaluate(() => {
        const toi = s => { const c = s.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
        const nen = el => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba?\(.*,\s*0\)$|transparent/.test(b)) return b; } return 'rgb(0,0,0)'; };
        const tp = el => { const x = toi(getComputedStyle(el).color), y = toi(nen(el)); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
        const mau = [['liên kết trong tuần', '#plan12 .week a'], ['nhãn Số tự đặt', '#plan12 .week .tag.hyp'], ['chữ khung điều khiển', '.ltr-ctl label'], ['chữ trong tuần', '#plan12 .week li'], ['chữ bảng mốc', '#lo-trinh-12 table td']];
        return { tran: document.documentElement.scrollWidth - window.innerWidth, tp: mau.map(([ten, s]) => { const el = document.querySelector(s); return { ten, tp: el ? tp(el) : 0 }; }) };
      });
      kiem(kq.tran <= 1, `gói H · ${cach}: 390 px, trang Lộ trình 12 tuần không tràn ngang`, 'tràn ' + kq.tran + ' px');
      for (const r of kq.tp) kiem(r.tp >= NGUONG_TUONG_PHAN, `gói H · ${cach === 'sang' ? 'chế độ sáng' : cach === 'auto-toi' ? 'tối tự động' : 'tối ép data-theme'}: ${r.ten} tương phản ${r.tp.toFixed(2)}:1`, `thấp hơn ${NGUONG_TUONG_PHAN}:1`);
      await c4.close();
    }
  }
  // 12. Gói G: trang Phân tích câu chạy với bộ phân tích đã sửa (độ chính xác do kiem-phan-tich.mjs đo; ở đây chỉ kiểm trang chạy thật)
  {
    const cG = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 } });
    const pG = await cG.newPage(); const loiG = [];
    pG.on('pageerror', e => loiG.push(e.message)); pG.on('console', m => { if (m.type() === 'error') loiG.push(m.text()); });
    await pG.goto(URL_TRANG + '#phan-tich'); await pG.waitForSelector('#pcText');
    const mau = ['The teacher, tired and hungry, left the room.', 'They appointed her manager.', 'She painted the wall white.', 'He left her sister a note.'];
    await pG.fill('#pcText', mau.join(' ')); await pG.click('#pcGo');
    await pG.waitForSelector('#pcRes .pc-ph', { timeout: 5000 }).catch(() => {});
    const kq = await pG.evaluate(() => { const t = r => [...document.querySelectorAll('#pcRes .pc-ph[data-r="' + r + '"]')].map(e => e.textContent.replace(/\s+/g, ' ').replace(/^[A-Za-z]\s(?=[A-Z a-z])/, '').trim()); return { M: t('M'), C: t('C'), O: t('O'), thua: document.documentElement.scrollWidth - window.innerWidth }; });
    const co = (r, x) => kq[r].some(c => c.includes(x) && c.length <= x.length + 2); /* khớp cả cụm, cho phép chữ nhãn đứng trước; một nhãn gộp nhiều cụm thì không khớp */
    kiem(co('M', 'tired and hungry') && co('C', 'manager') && co('C', 'white') && co('O', 'note') && co('O', 'her sister') && co('O', 'her'), 'gói G · trang Phân tích câu hiện đúng 4 câu lỗi cũ (M tired and hungry, O her + C manager, C white, O her sister + O a note)', JSON.stringify(kq));
    kiem(kq.thua <= 0, 'gói G · 390 px: trang Phân tích câu có kết quả vẫn không tràn ngang', kq.thua + ' px');
    kiem(loiG.length === 0, 'gói G · trang Phân tích câu không lỗi console', loiG.slice(0, 3).join(' || '));
    await cG.close();
  }

  /* ---------- 13. Gói I: nạp gộp tiến độ và báo cáo tuần ---------- */
  {
    const ghiChu = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => ['en8020.' + k, JSON.stringify(v)]));
    const gop = (loc, inc) => trang.evaluate(([a, b]) => { const r = window.__GOP.gop(a, b); return r; }, [loc, inc]);
    const giaiMa = (kq) => Object.fromEntries(Object.entries(kq.ghi || {}).map(([k, v]) => [k.replace('en8020.', ''), JSON.parse(v)]));
    const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    // (a) hàm gộp: bảng đáp án gõ tay. Ngày ôn gần nhất = ngày hẹn − [1,3,7,14,30][hộp−1] (hộp 0: chính ngày hẹn).
    // máy trống: nhận nguyên file
    const dayDu = ghiChu({ done: { 'to-be': true }, plan: { w0t0: true }, prac: { s1a: true }, boxes: { want: 3, need: 0 }, due: { want: 110, need: 100 }, ptLast: { level: 'B1', date: '5/11/2026', vocab: 4000 }, ltr12: { on: true, w: 4 }, slow: true });
    {
      const r = await gop({}, dayDu), g = giaiMa(r);
      kiem(r.ok && bang(g.boxes, { want: 3, need: 0 }) && bang(g.due, { want: 110, need: 100 }) && bang(g.done, { 'to-be': true }) && bang(g.plan, { w0t0: true }) && bang(g.prac, { s1a: true }) && g.ptLast?.level === 'B1' && bang(g.ltr12, { on: true, w: 4 }) && g.slow === true && r.bao.the.them === 2 && r.bao.bai === 1,
        'gói I · nạp gộp vào máy trống: nhận đủ bài, thẻ, ngày hẹn, kết quả kiểm tra, tuần lộ trình, cài đặt', JSON.stringify(r));
    }
    // hai bản trùng nhau: không đổi gì
    {
      const r = await gop(dayDu, dayDu);
      kiem(r.ok && Object.keys(r.ghi).length === 0 && r.bao.the.them === 0 && r.bao.the.capNhat === 0 && r.bao.the.giu === 2, 'gói I · nạp gộp hai bản giống nhau: không ghi gì, giữ nguyên 2 thẻ', JSON.stringify(r));
    }
    // xung đột thẻ: [tên, máy này {hộp, hẹn}, file {hộp, hẹn}, ai thắng]
    const XUNG = [
      ['quên gần đây hơn: máy có hộp 3 hẹn 110 (ôn ngày 103), file hộp 1 hẹn 106 (ôn ngày 105)', [3, 110], [1, 106], 'file'],
      ['file ôn mới hơn và hộp cao hơn: máy hộp 2 hẹn 100 (ôn 97), file hộp 4 hẹn 130 (ôn 116)', [2, 100], [4, 130], 'file'],
      ['máy ôn mới hơn: máy hộp 4 hẹn 130 (ôn 116), file hộp 2 hẹn 100 (ôn 97)', [4, 130], [2, 100], 'may'],
      ['cùng ngày ôn 104, hộp cao hơn thắng: máy hộp 2 hẹn 107, file hộp 3 hẹn 111', [2, 107], [3, 111], 'file'],
      ['cùng ngày ôn 104, máy hộp cao hơn: máy hộp 3 hẹn 111, file hộp 2 hẹn 107', [3, 111], [2, 107], 'may'],
      ['hộp 0 cùng ngày ôn 120 với hộp 5 hẹn 150: hộp cao hơn thắng', [0, 120], [5, 150], 'file'],
    ];
    for (const [ten, [mb, md], [fb, fd], thang] of XUNG) {
      const r = await gop(ghiChu({ boxes: { want: mb }, due: { want: md } }), ghiChu({ boxes: { want: fb }, due: { want: fd } }));
      const g = giaiMa(r);
      const mong = thang === 'file' ? [fb, fd] : [mb, md];
      const dung = thang === 'file' ? (r.ok && g.boxes?.want === mong[0] && g.due?.want === mong[1] && r.bao.the.capNhat === 1) : (r.ok && Object.keys(r.ghi).length === 0 && r.bao.the.giu === 1);
      kiem(dung, 'gói I · xung đột thẻ, ' + ten + ' → thắng: ' + thang, JSON.stringify(r));
    }
    {
      // file không có ngày hẹn (tệp rất cũ) không đè thẻ có ngày hẹn; thẻ chỉ một bên được giữ/thêm; thẻ máy khác không mất
      const r = await gop(ghiChu({ boxes: { a: 1, chiMay: 2 }, due: { a: 50, chiMay: 60 } }), ghiChu({ boxes: { a: 4, chiFile: 1 } }));
      const g = giaiMa(r);
      kiem(r.ok && bang(Object.entries(g.boxes || {}).sort(), [['a', 1], ['chiFile', 1], ['chiMay', 2]]) && g.due?.a === 50 && g.due?.chiMay === 60 && r.bao.the.them === 1 && r.bao.the.giu === 1,
        'gói I · file thiếu ngày hẹn không đè thẻ có ngày hẹn; thẻ chỉ có ở một bên đều được giữ', JSON.stringify(r));
    }
    {
      // bài, lộ trình, danh sách kiểm: hợp các dấu đã đánh, không bỏ dấu nào của máy này
      const r = await gop(ghiChu({ done: { a: true, b: false, c: true } }), ghiChu({ done: { a: false, b: true, d: false, e: true } }));
      const g = giaiMa(r);
      kiem(r.ok && bang(Object.entries(g.done || {}).sort(), [['a', true], ['b', true], ['c', true], ['d', false], ['e', true]]) && r.bao.bai === 2, 'gói I · bài đã học: hợp dấu của hai máy (a,c ở máy; b,e ở file) và không bỏ dấu nào', JSON.stringify(r));
    }
    {
      // ngày kiểm tra: so theo số, không so chữ ("9/12/2026" mới hơn "10/11/2026")
      const T = (a, b) => gop(ghiChu({ ptLast: a }), ghiChu({ ptLast: b }));
      const r1 = await T({ level: 'A2', date: '10/11/2026' }, { level: 'B1', date: '9/12/2026' });
      const r2 = await T({ level: 'B1', date: '9/12/2026' }, { level: 'A2', date: '10/11/2026' });
      const r3 = await T({ level: 'A2', date: '5/11/2026' }, { level: 'B1', date: 'hôm qua' });
      const r4 = await gop({}, ghiChu({ ptLastShort: { level: 'A1', label: 'A1', date: '1/1/2026', ok: 9, n: 15 } }));
      kiem(giaiMa(r1).ptLast?.level === 'B1' && Object.keys(r2.ghi).length === 0 && Object.keys(r3.ghi).length === 0 && giaiMa(r4).ptLastShort?.ok === 9,
        'gói I · kết quả kiểm tra: ngày mới hơn thắng (so theo số: 9/12 mới hơn 10/11), ngày hỏng không đè, máy chưa có thì nhận', JSON.stringify([r1, r2, r3, r4]));
    }
    {
      // lộ trình 12 tuần: bật/tắt của máy này, tuần lấy số lớn
      const T = (a, b) => gop(ghiChu({ ltr12: a }), ghiChu({ ltr12: b }));
      const r1 = await T({ on: false, w: 2 }, { on: true, w: 5 });
      const r2 = await T({ on: true, w: 6 }, { on: false, w: 3 });
      const r3 = await gop({}, ghiChu({ ltr12: { on: true, w: 99 } }));
      const r4 = await gop(ghiChu({ ltr12: 'rac' }), ghiChu({ ltr12: { on: true, w: 4 } }));
      kiem(bang(giaiMa(r1).ltr12, { on: false, w: 5 }) && Object.keys(r2.ghi).length === 0 && bang(giaiMa(r3).ltr12, { on: true, w: 1 }) && bang(giaiMa(r4).ltr12, { on: true, w: 4 }),
        'gói I · en8020.ltr12: giữ bật/tắt của máy này, tuần lấy số lớn hơn (2 và 5 → 5; 6 và 3 → giữ), tuần ngoài 1–12 về 1, giá trị hỏng ở máy thì nhận của file', JSON.stringify([r1, r2, r3, r4]));
    }
    {
      // khóa lạ chỉ nhận khi máy chưa có; cài đặt đọc chậm giữ của máy
      const r = await gop(ghiChu({ lạ1: { x: 1 }, slow: false }), ghiChu({ lạ1: { x: 2 }, lạ2: [1, 2], slow: true }));
      const g = giaiMa(r);
      kiem(r.ok && bang(g['lạ2'], [1, 2]) && !('lạ1' in g) && !('slow' in g), 'gói I · khóa lạ: chỉ nhận khi máy chưa có; cài đặt đọc chậm giữ của máy này', JSON.stringify(r));
    }
    {
      // file hỏng: từ chối cả file, không ghi gì
      const XAU = [['boxes ngoài 0–5', { boxes: { want: 9 } }], ['boxes không phải số nguyên', { boxes: { want: 1.5 } }], ['done chứa chữ', { done: { a: 'x' } }], ['due là chuỗi', { due: { a: '5' } }], ['plan là mảng', { plan: [true] }]];
      const loi = [];
      for (const [ten, o] of XAU) { const r = await gop(ghiChu({ boxes: { a: 1 }, due: { a: 5 } }), ghiChu(o)); if (r.ok || !r.loi) loi.push(ten + ' → ' + JSON.stringify(r)); }
      const rj = await gop({}, { 'en8020.boxes': '{không phải json' });
      if (rj.ok) loi.push('JSON hỏng vẫn được nhận');
      kiem(loi.length === 0, 'gói I · file hỏng (hộp ngoài 0–5, số lẻ, dấu không phải đúng/sai, JSON hỏng): từ chối cả file với lời báo, không ghi gì', loi.join(' ; '));
    }
    {
      // khóa nguy hiểm và không đổi đầu vào
      const loc = ghiChu({ done: { a: true } }); const locCopy = JSON.stringify(loc);
      const r = await trang.evaluate(([a, b]) => { const kq = window.__GOP.gop(a, b); return { kq, sau: JSON.stringify(a), proto: ({}).x === undefined && Object.getPrototypeOf({}) === Object.prototype }; }, [loc, { 'en8020.done': '{"__proto__":true,"x":true}', 'en8020.boxes': '{"__proto__":2,"constructor":1}', 'en8020.due': '{"__proto__":100}' }]);
      kiem(r.kq.ok && r.sau === locCopy && r.proto, 'gói I · khóa "__proto__" trong file không làm hỏng Object.prototype, và hàm gộp không sửa dữ liệu đầu vào', JSON.stringify(r));
    }

    // (b) làm thật bằng trình duyệt: máy có tiến độ A, file sao lưu của máy B
    const cI = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 }, colorScheme: 'light', acceptDownloads: true });
    const pI = await cI.newPage(); const loiI = [], yeuCauMang = [];
    pI.on('pageerror', e => loiI.push('pageerror: ' + e.message)); pI.on('console', m => { if (m.type() === 'error') loiI.push(m.text()); });
    pI.on('request', r => { if (!/^(file|data|blob):/.test(r.url()) && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.url())) yeuCauMang.push(r.method() + ' ' + r.url()); else if (r.method() !== 'GET') yeuCauMang.push(r.method() + ' ' + r.url()); });
    await pI.goto(URL_TRANG + '#lo-trinh'); await pI.waitForSelector('#bkExport');
    const inf = await pI.evaluate(() => window.__GOP.info());
    const idBai2 = inf.counted.slice(0, 3);
    const t0 = inf.today;
    const kho = {
      done: { [idBai2[0]]: true }, plan: { w0t0: true }, prac: { s1a: true },
      boxes: { want: 3, need: 1 }, due: { want: t0 + 7, need: t0 - 5 },
      ptLast: { level: 'A2', date: '1/11/2026', vocab: 2500 },
    };
    const datKho = async (o) => { await pI.evaluate(v => { localStorage.clear(); for (const [k, x] of Object.entries(v)) localStorage.setItem('en8020.' + k, JSON.stringify(x)); }, o); await pI.reload(); await pI.waitForSelector('#bkExport'); };
    const docKho = () => pI.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('en8020.')).map(k => [k.slice(7), JSON.parse(localStorage.getItem(k))])));
    const fileB = path.join(os.tmpdir(), 'gop-b-' + process.pid + '.json');
    const khoB = {
      done: { [idBai2[1]]: true, [idBai2[0]]: true }, plan: { w0t0: true, w0t1: true }, prac: { s2a: true },
      boxes: { want: 1, need: 4, 'child (children)': 2 }, due: { want: t0 + 1, need: t0 + 14, 'child (children)': t0 + 3 },
      ptLast: { level: 'B1', date: '20/11/2026', vocab: 4100 }, ltr12: { on: true, w: 3 },
    };
    // want: máy A hộp 3 hẹn t0+7 (ôn t0), file B hộp 1 hẹn t0+1 (ôn t0): cùng ngày → hộp cao hơn (máy A) thắng. need: A hộp 1 hẹn t0−5 (ôn t0−6), B hộp 4 hẹn t0+14 (ôn t0) → B thắng. child: chỉ B.
    fs.writeFileSync(fileB, JSON.stringify({ app: 'tieng-anh-8020', version: 1, saved: '2026-11-22T00:00:00.000Z', keys: ghiChu(khoB) }));
    await datKho(kho);
    await pI.setInputFiles('#bkImport', fileB);
    await pI.waitForSelector('#bkGop');
    const dau = await pI.evaluate(() => [...document.querySelectorAll('#bkMsg button')].map(b => b.id + ':' + b.textContent));
    const loiNhan = await pI.evaluate(() => document.getElementById('bkMsg').textContent);
    kiem(bang(dau, ['bkGop:Nạp gộp', 'bkDe:Thay hẳn bằng file này (ghi đè)', 'bkHuy:Hủy']) && /1 thẻ mới/.test(loiNhan) && /1 thẻ ôn gần đây hơn/.test(loiNhan) && /1 bài đã học xong/.test(loiNhan) && /1 việc ở Lộ trình 8 tuần/.test(loiNhan) && /1 ô danh sách kiểm/.test(loiNhan) && /kiểm tra trình độ mới hơn/.test(loiNhan) && /Giữ nguyên 1 thẻ/.test(loiNhan),
      'gói I · nạp file: xem trước ghi đúng số thay đổi, ba nút theo thứ tự Nạp gộp (mặc định) / Thay hẳn / Hủy', loiNhan + ' | ' + dau.join(','));
    const truocHuy = await docKho();
    await pI.click('#bkHuy');
    kiem(bang(await docKho(), truocHuy) && await pI.evaluate(() => document.getElementById('bkMsg').hidden), 'gói I · bấm Hủy: không ghi gì, hộp thông báo đóng', '');
    await pI.setInputFiles('#bkImport', fileB); await pI.waitForSelector('#bkGop');
    await pI.click('#bkGop'); await pI.waitForTimeout(1500);
    await pI.waitForSelector('#bkExport');
    const sau = await docKho();
    const mongKho = { done: { [idBai2[0]]: true, [idBai2[1]]: true }, plan: { w0t0: true, w0t1: true }, prac: { s1a: true, s2a: true }, boxes: { want: 3, need: 4, 'child (children)': 2 }, due: { want: t0 + 7, need: t0 + 14, 'child (children)': t0 + 3 }, ptLast: { level: 'B1', date: '20/11/2026', vocab: 4100 }, ltr12: { on: true, w: 3 } };
    const ssanh = {}; for (const k of Object.keys(mongKho)) ssanh[k] = bang(JSON.stringify(sau[k]) && sau[k], mongKho[k]) || JSON.stringify(Object.entries(sau[k] || {}).sort()) === JSON.stringify(Object.entries(mongKho[k]).sort());
    kiem(Object.values(ssanh).every(Boolean), 'gói I · bấm Nạp gộp: máy có hợp tiến độ hai bên (bài, lộ trình, ô kiểm, thẻ thắng thua đúng, kết quả mới hơn, tuần lộ trình) và trang tải lại', JSON.stringify({ ssanh, sau }));
    // nạp lần hai đúng file đó: không còn gì để gộp
    await pI.setInputFiles('#bkImport', fileB); await pI.waitForSelector('#bkMsg button');
    const lan2 = await pI.evaluate(() => ({ t: document.getElementById('bkMsg').textContent, gop: !!document.getElementById('bkGop'), de: !!document.getElementById('bkDe') }));
    kiem(/nạp gộp sẽ không đổi gì/.test(lan2.t) && !lan2.gop && lan2.de, 'gói I · nạp lại đúng file đó: báo "không đổi gì", không còn nút Nạp gộp', JSON.stringify(lan2));
    // file hỏng: báo lỗi, không ghi gì, không có nút nạp
    const fileHong = path.join(os.tmpdir(), 'gop-hong-' + process.pid + '.json');
    fs.writeFileSync(fileHong, JSON.stringify({ app: 'tieng-anh-8020', version: 1, keys: { 'en8020.boxes': JSON.stringify({ want: 9 }) } }));
    const truocH = await docKho();
    await pI.setInputFiles('#bkImport', fileHong); await pI.waitForSelector('#bkMsg:not([hidden])');
    const loiH2 = await pI.evaluate(() => ({ t: document.getElementById('bkMsg').textContent, nut: document.querySelectorAll('#bkMsg button').length }));
    kiem(/Không nạp được/.test(loiH2.t) && /boxes/.test(loiH2.t) && loiH2.nut === 0 && bang(await docKho(), truocH), 'gói I · file hỏng: báo lỗi nêu tên mục, không có nút nạp, tiến độ không đổi', JSON.stringify(loiH2));
    // Thay hẳn: ghi đè từng mục có trong file như cũ
    await datKho(kho);
    await pI.setInputFiles('#bkImport', fileB); await pI.waitForSelector('#bkDe'); await pI.click('#bkDe'); await pI.waitForTimeout(1500); await pI.waitForSelector('#bkExport');
    const de = await docKho();
    kiem(bang(Object.entries(de.boxes || {}).sort(), Object.entries(khoB.boxes).sort()) && !de.prac?.s1a && de.done?.[idBai2[0]] === true && de.ptLast?.level === 'B1', 'gói I · "Thay hẳn": ghi đè từng mục có trong file (thẻ, ô kiểm của máy này mất), đúng như bản cũ', JSON.stringify(de));
    // vòng sao lưu: xuất rồi nạp vào máy trống → giống hệt
    await datKho(mongKho);
    const [dlI] = await Promise.all([pI.waitForEvent('download'), pI.click('#bkExport')]);
    const fileXuat = path.join(os.tmpdir(), 'gop-xuat-' + process.pid + '.json'); await dlI.saveAs(fileXuat);
    await datKho({});
    await pI.setInputFiles('#bkImport', fileXuat); await pI.waitForSelector('#bkGop'); await pI.click('#bkGop'); await pI.waitForTimeout(1500); await pI.waitForSelector('#bkExport');
    const vong = await docKho();
    kiem(bang(Object.keys(vong).sort(), Object.keys(mongKho).sort()) && Object.keys(mongKho).every(k => JSON.stringify(Object.entries(vong[k]).sort?.() ?? vong[k]) === JSON.stringify(Object.entries(mongKho[k]).sort?.() ?? mongKho[k])), 'gói I · xuất file rồi nạp gộp vào máy trống: tiến độ giống hệt', JSON.stringify(vong));
    // tệp sao lưu cũ (gói H, không ltr12) nạp gộp được và không đụng thẻ khác
    const fileCu = path.join(os.tmpdir(), 'gop-cu-' + process.pid + '.json');
    fs.writeFileSync(fileCu, JSON.stringify({ app: 'tieng-anh-8020', version: 1, saved: '2026-11-01T00:00:00.000Z', keys: { 'en8020.boxes': JSON.stringify({ want: 2 }), 'en8020.due': JSON.stringify({ want: 99999 }) } }));
    await datKho(kho);
    await pI.setInputFiles('#bkImport', fileCu); await pI.waitForSelector('#bkMsg button');
    const cuMsg = await pI.evaluate(() => document.getElementById('bkMsg').textContent);
    kiem(/Giữ nguyên 1 thẻ|1 thẻ ôn gần đây hơn/.test(cuMsg), 'gói I · tệp sao lưu cũ (chỉ có boxes và due) vẫn nạp gộp được', cuMsg);
    kiem(yeuCauMang.length === 0, 'gói I · nạp gộp, sao lưu, báo cáo không gửi gì ra mạng (chỉ phông chữ có sẵn của trang, không có yêu cầu POST)', yeuCauMang.slice(0, 3).join(' ; '));

    // (c) báo cáo tuần. Số đếm gõ tay: 2 bài, 5 thẻ nền tảng (2 thuộc, 3 đến hạn), 1 thẻ AWL thuộc, 2 việc lộ trình, 3 ô kiểm.
    const tu = await pI.evaluate(() => window.__BO.vocab.slice(0, 5));
    const awl0 = inf.awl0;
    const tong = { awl: inf.awl, field: inf.field, plan: inf.plan };
    const tongPrac = [...SRC.matchAll(/<input type="checkbox" data-k="/g)].length;
    const khoBC = {
      done: { [idBai2[0]]: true, [idBai2[1]]: true, [idBai2[2]]: false },
      plan: { w0t0: true, w0t1: true, w0t2: false },
      prac: { s1a: true, s1b: true, s2a: true, s2b: false },
      boxes: { [tu[0]]: 3, [tu[1]]: 4, [tu[2]]: 1, [tu[3]]: 0, [tu[4]]: 2, ['awl:' + awl0]: 5, 'ma-khong-co-that': 5 },
      due: { [tu[0]]: t0 + 7, [tu[1]]: t0 - 1, [tu[2]]: t0, [tu[3]]: t0, [tu[4]]: t0 + 3, ['awl:' + awl0]: t0 + 30, 'ma-khong-co-that': t0 - 9 },
      ptLast: { level: 'B1', date: '20/11/2026', vocab: 4100 },
      ptLastShort: { level: 'full', label: 'từ A2 trở lên (nên làm bản đầy đủ)', date: '21/11/2026', ok: 13, n: 15 },
    };
    await datKho(khoBC);
    const bcDau = await pI.evaluate(() => ({ an: document.getElementById('bcText').hidden, tat: document.getElementById('bcChep').disabled }));
    kiem(bcDau.an && bcDau.tat, 'gói I · trước khi bấm "Tạo báo cáo": khối chữ ẩn, nút Sao chép chưa bật', JSON.stringify(bcDau));
    await pI.click('#bcTao');
    const bc = await pI.evaluate(() => document.getElementById('bcText').value);
    const dong = bc.split('\n');
    const n1 = inf.zone.filter(z => z === 1).length, n2 = inf.zone.filter(z => z === 2).length;
    const c1 = inf.zone.slice(0, 2).filter(z => z === 1).length;
    const mong = [
      /^BÁO CÁO TIẾN ĐỘ TIẾNG ANH · \d{1,2}\/\d{1,2}\/\d{4}$/,
      `• Bài đã học xong: Khu 1 ${c1}/${n1} · Khu 2 ${2 - c1}/${n2}`,
      '• Thẻ từ nền tảng: đã thuộc 2/186 · đến hạn ôn hôm nay 3 · chưa gặp 181',
      `• Thẻ AWL: đã thuộc 1/${tong.awl} · thẻ theo ngành: đã thuộc 0/${tong.field}`,
      `• Lộ trình 8 tuần: đã đánh dấu 2/${tong.plan} việc`,
      `• Thực hành tình huống: đã đánh dấu 3/${tongPrac} ô trong danh sách kiểm`,
      '• Kiểm tra trình độ gần nhất: bản đầy đủ 20/11/2026: B1 (vốn từ ước lượng khoảng 4.100 họ từ) · bản ngắn 21/11/2026: từ A2 trở lên (đúng 13/15 câu)',
    ];
    const khop = mong.map((m, i) => (m instanceof RegExp ? m.test(dong[i]) : dong[i] === m));
    kiem(khop.every(Boolean) && dong.length === 8 && /số đếm/.test(dong[7]), 'gói I · báo cáo tuần: từng dòng khớp số đếm gõ tay (bài, thẻ thuộc/đến hạn/chưa gặp, AWL, lộ trình, ô kiểm, kiểm tra gần nhất)', bc);
    kiem((await pI.evaluate(() => !document.getElementById('bcText').hidden && !document.getElementById('bcChep').disabled)), 'gói I · sau "Tạo báo cáo": khối chữ hiện, nút Sao chép bật', '');
    // báo cáo chỉ có số đếm: nhét chữ lạ vào mọi chỗ có thể, chữ đó không được xuất hiện
    await datKho({ ...khoBC, ptLast: { level: 'BÍ-MẬT-1', date: 'BÍ-MẬT-2', vocab: 'BÍ-MẬT-3' }, ptLastShort: { level: 'BÍ-MẬT-4', label: 'BÍ-MẬT-5', date: '<b>BÍ-MẬT-6</b>', ok: 'BÍ-MẬT-7', n: 15 }, 'tu-go': { cau: 'BÍ-MẬT-8' }, slow: false });
    await pI.click('#bcTao');
    const bc2 = await pI.evaluate(() => document.getElementById('bcText').value);
    kiem(!/BÍ-MẬT|<|>/.test(bc2) && /Kiểm tra trình độ gần nhất: bản đầy đủ \?: \?/.test(bc2), 'gói I · báo cáo không chép chữ lạ từ dữ liệu lưu (mức, ngày, nhãn không hợp lệ ra "?"), chỉ số đếm', bc2);
    // chưa làm kiểm tra
    await datKho({});
    await pI.click('#bcTao');
    const bc3 = await pI.evaluate(() => document.getElementById('bcText').value);
    kiem(/Kiểm tra trình độ gần nhất: chưa làm/.test(bc3) && /đã thuộc 0\/186 · đến hạn ôn hôm nay 0 · chưa gặp 186/.test(bc3), 'gói I · học viên mới: báo cáo ghi "chưa làm" và 0 thẻ thuộc / 186 chưa gặp', bc3);
    // sao chép vào clipboard
    const cC = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const pC = await cC.newPage();
    await pC.goto(URL_TRANG + '#lo-trinh'); await pC.waitForSelector('#bcTao');
    await pC.click('#bcTao'); await pC.click('#bcChep');
    await pC.waitForFunction(() => /Đã chép|Chưa chép/.test(document.getElementById('toast').textContent), null, { timeout: 4000 }).catch(() => {});
    const cb = await pC.evaluate(async () => ({ toast: document.getElementById('toast').textContent, text: document.getElementById('bcText').value, clip: await navigator.clipboard.readText().catch(e => 'LỖI ' + e.message) }));
    kiem(/Đã chép/.test(cb.toast) && cb.clip === cb.text && cb.text.length > 100, 'gói I · nút Sao chép đưa đúng khối báo cáo vào clipboard và báo "Đã chép"', JSON.stringify(cb).slice(0, 300));
    await cC.close();

    // (d) 390 px không tràn khi hiện báo cáo và thông báo nạp; không lỗi console; tương phản chế độ sáng/tối
    await datKho(khoBC); await pI.click('#bcTao');
    await pI.setInputFiles('#bkImport', fileB); await pI.waitForSelector('#bkGop');
    const tran = await pI.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    kiem(tran <= 1, 'gói I · 390 px: Lộ trình với thông báo nạp gộp và khối báo cáo không tràn ngang', tran + ' px');
    kiem(loiI.length === 0, 'gói I · nạp gộp, báo cáo, sao chép: không lỗi console', loiI.slice(0, 3).join(' || '));
    await cI.close();
    for (const cach of ['sang', 'auto-toi', 'ep-toi']) {
      const c5 = await trinhDuyet.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: cach === 'auto-toi' ? 'dark' : 'light' });
      const p5 = await c5.newPage();
      await p5.goto(URL_TRANG + '#lo-trinh'); await p5.waitForSelector('#bcTao');
      if (cach === 'ep-toi') await p5.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await p5.click('#bcTao'); await p5.setInputFiles('#bkImport', fileB); await p5.waitForSelector('#bkGop');
      const tp5 = await p5.evaluate(() => {
        const toi = s => { const c = s.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
        const nen = el => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba?\(.*,\s*0\)$|transparent/.test(b)) return b; } return 'rgb(0,0,0)'; };
        const tp = el => { const x = toi(getComputedStyle(el).color), y = toi(nen(el)); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
        return [['khối báo cáo', '#bcText'], ['chữ thông báo nạp', '#bkMsg'], ['nút Nạp gộp', '#bkGop'], ['nút Thay hẳn', '#bkDe'], ['nút Tạo báo cáo', '#bcTao'], ['nút Sao chép', '#bcChep']].map(([ten, s]) => { const el = document.querySelector(s); return { ten, tp: el ? tp(el) : 0 }; });
      });
      for (const r of tp5) kiem(r.tp >= NGUONG_TUONG_PHAN, `gói I · ${cach === 'sang' ? 'chế độ sáng' : cach === 'auto-toi' ? 'tối tự động' : 'tối ép data-theme'}: ${r.ten} tương phản ${r.tp.toFixed(2)}:1`, `thấp hơn ${NGUONG_TUONG_PHAN}:1`);
      await c5.close();
    }
    for (const f of [fileB, fileHong, fileXuat, fileCu]) { try { fs.unlinkSync(f); } catch {} }
  }

  /* ---------- 14. Gói J: giọng thầy (tệp mp3) cho hội thoại, quay về giọng máy khi không có ---------- */
  {
    const bang = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const { spawnSync } = await import('node:child_process');
    const congCu = path.join(here, 'tao-danh-sach-am-thanh.mjs');
    const chayCongCu = (thuMuc, ...them) => { const r = spawnSync(process.execPath, [congCu, ...(thuMuc ? [thuMuc] : []), ...them], { encoding: 'utf8' }); return { ma: r.status, ra: (r.stdout || '') + (r.stderr || '') }; };
    const goc = path.join(here, '..');
    const taoBanSao = () => {
      const t = fs.mkdtempSync(path.join(os.tmpdir(), 'trang-j-'));
      fs.copyFileSync(path.join(goc, 'index.html'), path.join(t, 'index.html'));
      fs.cpSync(path.join(goc, 'phan-tich'), path.join(t, 'phan-tich'), { recursive: true });
      fs.cpSync(path.join(goc, 'am-thanh'), path.join(t, 'am-thanh'), { recursive: true });
      return t;
    };
    const mau = path.join(here, 'am-thanh-mau', 'th1-01.mp3');
    const CAU1 = "Hi, I'm Linh. Nice to meet you.", CAU2 = "Nice to meet you, too. I'm Tom. Where are you from?", CAU3 = "I'm from Vietnam. I work in food R&D.", CAU4 = 'Oh, interesting! What do you do exactly?', CAU5 = 'I develop sauces and drinks. And you?';

    // (a) tệp danh sách trong repo đang đúng (công cụ chạy ở chế độ chỉ kiểm)
    const rep = chayCongCu(null, '--kiem');
    kiem(rep.ma === 0 && /17 hội thoại, 115 dòng/.test(rep.ra), 'gói J · am-thanh/danh-sach.js và CAU-CAN-GHI.md khớp các hội thoại và tệp mp3 hiện có (17 hội thoại, 115 dòng)', rep.ra.slice(0, 300));
    const nDlgTrang = await trang.evaluate(() => ({ dlg: document.querySelectorAll('ul.dlg').length, dong: [...document.querySelectorAll('ul.dlg')].reduce((s, u) => s + u.querySelectorAll(':scope > li').length, 0) }));
    kiem(nDlgTrang.dlg === 17 && nDlgTrang.dong === 115, 'gói J · số hội thoại và số dòng trên trang đúng bằng số công cụ đếm (17, 115): thêm hội thoại mới thì phải chạy lại công cụ', JSON.stringify(nDlgTrang));

    // (b) công cụ trên bản sao: tệp đặt đúng tên được nhận, sai tên bị báo, chạy lại không ghi thêm
    {
      const t = taoBanSao();
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th1-01.mp3'));
      const r1 = chayCongCu(t);
      const js = fs.readFileSync(path.join(t, 'am-thanh', 'danh-sach.js'), 'utf8');
      const md = fs.readFileSync(path.join(t, 'am-thanh', 'CAU-CAN-GHI.md'), 'utf8');
      const mong = 'window.AM_THANH = {\n ' + JSON.stringify(CAU1) + ': "am-thanh/th1-01.mp3"\n};\n';
      kiem(r1.ma === 0 && js.endsWith(mong) && /đã có tiếng 1\./.test(md) && /\| th1-01\.mp3 \| A \| Hi, I'm Linh\. Nice to meet you\. \| ✓ \|/.test(md) && /th1: 1\/6 dòng \(thiếu 02 03 04 05 06\)/.test(r1.ra),
        'gói J · công cụ: một tệp th1-01.mp3 → danh sách có đúng một câu, bảng CAU-CAN-GHI đánh ✓ đúng dòng, báo "1/6 dòng"', r1.ra + js);
      const r2 = chayCongCu(t);
      const r3 = chayCongCu(t, '--kiem');
      kiem(r2.ma === 0 && /không ghi lại/.test(r2.ra) && r3.ma === 0, 'gói J · công cụ: chạy lại lần hai không ghi gì, chế độ --kiem báo đúng', r2.ra + r3.ra);
      // thêm tệp mà chưa chạy lại công cụ: --kiem phải báo danh sách đang cũ
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th1-05.mp3'));
      const rCu = chayCongCu(t, '--kiem');
      kiem(rCu.ma === 1 && /đang cũ/.test(rCu.ra), 'gói J · công cụ --kiem: thêm tệp mp3 mà chưa chạy lại công cụ thì báo danh sách đang cũ, thoát mã 1', rCu.ra);
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th1-2.mp3'));
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th99-01.mp3'));
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th1-03.wav'));
      const r4 = chayCongCu(t, '--kiem');
      kiem(r4.ma === 1 && /«th1-2\.mp3» không khớp dòng nào; có phải ý bạn là «th1-02\.mp3»/.test(r4.ra) && /«th99-01\.mp3» không khớp/.test(r4.ra) && /«th1-03\.wav» không khớp dòng nào \(chỉ nhận đuôi \.mp3/.test(r4.ra),
        'gói J · công cụ: tệp sai tên (th1-2, th99-01, đuôi .wav) bị báo LỖI, thoát mã 1, gợi ý đúng tên', r4.ra);
      // tệp quá nặng
      fs.unlinkSync(path.join(t, 'am-thanh', 'th1-2.mp3')); fs.unlinkSync(path.join(t, 'am-thanh', 'th99-01.mp3')); fs.unlinkSync(path.join(t, 'am-thanh', 'th1-03.wav'));
      // dòng có số: khóa là chữ đọc (data-say), không phải chữ số trên trang
      fs.unlinkSync(path.join(t, 'am-thanh', 'th1-01.mp3'));
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'gio-ngay-tien-1-02.mp3'));
      const r6 = chayCongCu(t);
      const js6 = fs.readFileSync(path.join(t, 'am-thanh', 'danh-sach.js'), 'utf8');
      kiem(r6.ma === 0 && js6.includes('"It starts at two thirty p.m. on Thursday.": "am-thanh/gio-ngay-tien-1-02.mp3"') && !js6.includes('2:30'), 'gói J · công cụ: dòng có số (data-say) được khai bằng chữ đọc "two thirty", không phải "2:30"', js6);
      fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th1-01.mp3'));
      fs.writeFileSync(path.join(t, 'am-thanh', 'th1-04.mp3'), Buffer.alloc(400 * 1024));
      const r5 = chayCongCu(t);
      kiem(/CẢNH BÁO th1-04\.mp3 nặng 400 KB/.test(r5.ra), 'gói J · công cụ: cảnh báo tệp nặng hơn 300 KB cho một dòng ngắn', r5.ra);
      fs.rmSync(t, { recursive: true, force: true });
    }

    // (c) trình duyệt: tệp có thì phát tệp; không có, tệp hỏng, đường dẫn lạ, trình duyệt chặn phát thì giọng máy
    const t = taoBanSao();
    fs.copyFileSync(mau, path.join(t, 'am-thanh', 'th1-01.mp3'));
    fs.writeFileSync(path.join(t, 'am-thanh', 'danh-sach.js'), 'window.AM_THANH = ' + JSON.stringify({
      [CAU1]: 'am-thanh/th1-01.mp3', [CAU2]: 'am-thanh/th1-02.mp3' /* tệp không có thật */, [CAU3]: 'http://evil.example/x.mp3', [CAU4]: '../am-thanh/th1-01.mp3',
    }) + ';\n');
    const urlT = pathToFileURL(path.join(t, 'index.html')).href + '#thuc-hanh';
    const cJ = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 } });
    const loiJ = [];
    await cJ.addInitScript(() => {
      window.__nhat = { play: [], tts: [], audios: [], chan: false };
      const goc = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { window.__nhat.play.push({ src: this.src, toc: this.playbackRate }); window.__nhat.audios.push(this); return window.__nhat.chan ? Promise.reject(new Error('bị chặn')) : goc.call(this); };
    });
    const pJ = await cJ.newPage();
    pJ.on('pageerror', e => loiJ.push('pageerror: ' + e.message));
    await pJ.goto(urlT); await pJ.waitForFunction(() => window.__AM && document.querySelectorAll('#thuc-hanh .sit').length >= 6);
    await pJ.evaluate(() => { const ss = window.speechSynthesis; ss.cancel = () => {}; ss.speak = u => window.__nhat.tts.push(u.text); });
    const bam = (i) => pJ.evaluate(i => { window.__nhat.play.length = 0; window.__nhat.tts.length = 0; document.querySelectorAll('#thuc-hanh .sit')[0].querySelectorAll('ul.dlg > li .spk')[i].click(); }, i);
    const nhat = () => pJ.evaluate(() => ({ play: window.__nhat.play.map(p => p.src.replace(/^.*\/am-thanh\//, 'am-thanh/')), toc: window.__nhat.play.map(p => p.toc), tts: window.__nhat.tts.slice() }));
    kiem(await pJ.evaluate(() => Object.keys(window.__AM.map).length) === 4, 'gói J · trang đọc được danh sách am-thanh/danh-sach.js (4 mục thử)', '');
    await bam(0); await pJ.waitForTimeout(150);
    let k = await nhat();
    kiem(bang(k.play, ['am-thanh/th1-01.mp3']) && k.tts.length === 0, 'gói J · câu có tệp: bấm loa phát tệp mp3, giọng máy không đọc', JSON.stringify(k));
    const ketThuc = await pJ.waitForFunction(() => window.__nhat.audios[0] && (window.__nhat.audios[0].ended || window.__nhat.audios[0].currentTime > 0.2), null, { timeout: 4000 }).then(() => true, () => false);
    kiem(ketThuc && await pJ.evaluate(() => !window.__nhat.audios[0].error), 'gói J · tệp mp3 thật sự phát được trong trình duyệt (chạy tới cuối hoặc quá 0,2 giây, không lỗi giải mã)', '');
    await bam(4); await pJ.waitForTimeout(100);
    k = await nhat();
    kiem(k.play.length === 0 && bang(k.tts, [CAU5]), 'gói J · câu không có trong danh sách: giọng máy đọc như cũ, không phát tệp', JSON.stringify(k));
    await bam(1); await pJ.waitForTimeout(600);
    k = await nhat();
    kiem(bang(k.play, ['am-thanh/th1-02.mp3']) && bang(k.tts, [CAU2]), 'gói J · danh sách ghi tệp nhưng tệp không có: thử phát, lỗi thì quay về giọng máy đúng câu đó', JSON.stringify(k));
    await bam(2); await bam(3);
    await pJ.waitForTimeout(150);
    k = await nhat();
    kiem(k.play.length === 0 && bang(k.tts, [CAU4]), 'gói J · đường dẫn lạ (http://..., ../...) trong danh sách bị bỏ qua: không phát, dùng giọng máy', JSON.stringify(k));
    await pJ.evaluate(() => { window.__nhat.chan = true; });
    await bam(0); await pJ.waitForTimeout(200);
    k = await nhat();
    kiem(bang(k.play, ['am-thanh/th1-01.mp3']) && bang(k.tts, [CAU1]), 'gói J · trình duyệt chặn phát (play bị từ chối): quay về giọng máy', JSON.stringify(k));
    await pJ.evaluate(() => { window.__nhat.chan = false; });
    await pJ.check('#slowToggle'); await bam(0); await pJ.waitForTimeout(100);
    k = await nhat();
    kiem(k.toc[0] === 0.8, 'gói J · bật "đọc chậm": tệp mp3 phát với tốc độ 0,8', JSON.stringify(k));
    await pJ.uncheck('#slowToggle');
    // bấm câu khác khi đang phát: tệp cũ dừng
    await bam(0); await bam(4); await pJ.waitForTimeout(100);
    kiem(await pJ.evaluate(() => window.__nhat.audios[window.__nhat.audios.length - 1].paused), 'gói J · bấm loa câu khác khi tệp đang phát: tệp cũ dừng', '');
    kiem(loiJ.length === 0, 'gói J · các thao tác trên không gây lỗi JS', loiJ.slice(0, 3).join(' || '));
    await cJ.close();

    // (d) không có tệp danh sách (bị xóa) hoặc rỗng: trang vẫn chạy, mọi câu dùng giọng máy
    fs.unlinkSync(path.join(t, 'am-thanh', 'danh-sach.js'));
    const cK = await trinhDuyet.newContext({ viewport: { width: 390, height: 800 } });
    await cK.addInitScript(() => { window.__nhat = { tts: [] }; });
    const pK = await cK.newPage(); const loiK2 = [];
    pK.on('pageerror', e => loiK2.push('pageerror: ' + e.message));
    await pK.goto(urlT); await pK.waitForFunction(() => window.__AM && document.querySelectorAll('#thuc-hanh .sit').length >= 6);
    await pK.evaluate(() => { const ss = window.speechSynthesis; ss.cancel = () => {}; ss.speak = u => window.__nhat.tts.push(u.text); document.querySelectorAll('#thuc-hanh .sit')[0].querySelector('ul.dlg > li .spk').click(); });
    kiem(bang(await pK.evaluate(() => window.__nhat.tts), [CAU1]) && loiK2.length === 0 && await pK.evaluate(() => Object.keys(window.__AM.map).length) === 0, 'gói J · thiếu tệp danh-sach.js: trang vẫn chạy, câu dùng giọng máy, không lỗi JS', loiK2.join(' | '));
    await cK.close();
    fs.rmSync(t, { recursive: true, force: true });
  }
  // 16. Gói L: rà số liệu Khu 2. Mọi số dưới đây GÕ TAY từ nguồn đã đọc ngày 2026-11-22 (Coxhead 2000 Table 4-5; Victoria University of Wellington; British Council; ielts.org), không tính lại từ trang.
  {
    const cL = await trinhDuyet.newContext({ viewport: { width: 1280, height: 900 } });
    const pL = await cL.newPage(); const loiL = [];
    pL.on('pageerror', e => loiL.push('pageerror: ' + e.message));
    await pL.goto(URL_TRANG);
    await pL.waitForFunction(() => window.__COUNTS && document.getElementById('hoc-thuat'));
    const vanBan = id => pL.evaluate(i => document.getElementById(i).textContent.replace(/\s+/g, ' '), id);
    const b10 = await vanBan('hoc-thuat'), b12 = await vanBan('ielts'), home = await vanBan('home');
    // (a) số học thuật khớp bảng gốc; số cũ đã bỏ không quay lại
    const so = { gsl1: 71.4, gsl2: 4.7, awl: 10.0, subs: [3.6, 1.8, 1.2, 0.9, 0.8, 0.6, 0.5, 0.3, 0.2, 0.1], kh: [9.1, 65.7, 5.0], fic: 1.4 };
    const r1 = n => Math.round(n * 10) / 10;
    kiem(r1(so.gsl1 + so.gsl2) === 76.1 && r1(so.gsl1 + so.gsl2 + so.awl) === 86.1 && r1(so.subs.reduce((a, b) => a + b, 0)) === 10.0 && r1(so.kh[0] + so.kh[1] + so.kh[2]) === 79.8, 'gói L · bảng gốc Coxhead gõ tay tự khớp: 71,4 + 4,7 = 76,1; + 10,0 = 86,1; mười sublist cộng 10,0; khoa học 9,1 + 65,7 + 5,0 = 79,8', '');
    const vn = n => n.toFixed(1).replace('.', ',') + '%';
    kiem([so.gsl1, so.gsl2, 76.1, 86.1, 79.8, 12.0, 9.1].every(n => b10.includes(vn(n))), 'gói L · Bài 10 ghi 71,4% · 4,7% · 76,1% · 86,1% · 79,8% · 12,0% · 9,1% (khớp Coxhead 2000, Table 4-5)', b10.slice(0, 120));
    kiem([3.6, 1.8, 1.2, 0.2].every(n => b10.includes(vn(n))) && b10.includes('570 họ từ') && b10.includes('1,4%'), 'gói L · Bài 10 giữ đúng 570 họ từ, 1,4% tiểu thuyết, độ phủ sublist 3,6 / 1,8 / 1,2 / 0,2', '');
    kiem(!/90% chữ trong văn bản học thuật|khoảng 90%/.test(b10.replace(/Số đã bỏ[\s\S]*?nữa\./, '')) && !/Có nguồn thứ cấp/.test(b10), 'gói L · Bài 10 không còn số "khoảng 90%" của infographic (chỉ còn trong ghi chú "Số đã bỏ") và không còn nhãn nguồn thứ cấp cho nó', '');
    kiem(!/EAP Foundation[^.]*phủ khoảng 80%/.test(b10), 'gói L · Bài 10 không còn câu gán "GSL phủ khoảng 80%" cho EAP', '');
    // (b) bộ thẻ AWL khớp danh sách gốc (kiem/nguon-awl-sublist.json: 180 họ từ sublist 1-3)
    const goc = JSON.parse(fs.readFileSync(path.join(here, 'nguon-awl-sublist.json'), 'utf8'));
    kiem(goc.sublist1.length === 60 && goc.sublist2.length === 60 && goc.sublist3.length === 60, 'gói L · tệp nguồn AWL có đúng 60 + 60 + 60 họ từ', `${goc.sublist1.length}/${goc.sublist2.length}/${goc.sublist3.length}`);
    const khoiAWL = SRC.slice(SRC.indexOf('var AWL = ['), SRC.indexOf('];', SRC.indexOf('var AWL = [')));
    const the = [...khoiAWL.matchAll(/\["([^"]+)","[^"]*","[^"]*","(s[123])"\]/g)].map(m => [m[1], m[2]]);
    const sai3 = the.filter(([w, g]) => !(goc['sublist' + g.slice(1)] || []).includes(w));
    const thieuS1 = goc.sublist1.filter(w => !the.some(([x, g]) => x === w && g === 's1'));
    kiem(the.length === 118 && sai3.length === 0 && thieuS1.length === 0, 'gói L · bộ thẻ AWL: 118 thẻ, mỗi thẻ đúng sublist theo danh sách gốc, sublist 1 đủ 60', `thẻ=${the.length}; sai: ${sai3.slice(0, 5).join(',')}; thiếu s1: ${thieuS1.slice(0, 5).join(',')}`);
    kiem(/118 họ từ/.test(b10) && /32 và 26 họ từ/.test(b10) && the.filter(x => x[1] === 's2').length === 32 && the.filter(x => x[1] === 's3').length === 26, 'gói L · câu ghi "118 họ từ", "32 và 26 họ từ" khớp số thẻ thật', '');
    // (c) IELTS: số gõ tay từ British Council / ielts.org
    const b12ok = ['2 giờ 45 phút', 'khoảng 30 phút', '60 phút', '150', '250', '11–14', '40 câu', '25%', '2/3', '8.5', '7.0', '5.5 – 6.5', '4.0 – 5.0'].filter(s => !b12.includes(s));
    kiem(b12ok.length === 0, 'gói L · Bài 12 còn đủ số thi đã đối chiếu (2 giờ 45; 30/60/60/11–14 phút; 150/250 chữ; 40 câu; 25% mỗi tiêu chí; Task 2 = 2/3)', 'thiếu: ' + b12ok.join(' | '));
    kiem(/band 5 cũng ở ranh B1\/B2/.test(b12) && /band 8 là giáp ranh C1\/C2/.test(b12) && /Có nguồn thứ cấp/.test(b12), 'gói L · Bài 12 nêu band 5 và band 8 là ranh giới, và ghi bảng CEFR là nguồn thứ cấp (biểu đồ là hình)', '');
    kiem(/class="tag inf">Suy luận<\/span>NOT GIVEN/.test(await pL.evaluate(() => document.getElementById('ielts').innerHTML)) && !/Theo hướng dẫn chính thức của IELTS, kiến thức ngoài/.test(b12), 'gói L · Bài 12: "không dùng kiến thức ngoài bài" hạ xuống Suy luận (chưa thấy câu chữ chính thức)', '');
    kiem(/10 lỗi người Việt hay mất điểm Tự soạn/.test(b12) && /chưa có khảo sát/.test(b12), 'gói L · Bài 12: "10 lỗi người Việt" có nhãn Tự soạn và ghi chưa có khảo sát', '');
    // (d) Kiểm vốn từ: nhãn nhóm khớp công thức, ghi rõ số tự đặt
    const mYNB = SRC.match(/var YNB = \{b1:"([^"]*)", b2:"([^"]*)", b3:"([^"]*)"/);
    const khoiYN = SRC.slice(SRC.indexOf('var YN = {'), SRC.indexOf('};', SRC.indexOf('var YN = {')));
    const dem12 = k => ((khoiYN.match(new RegExp(k + ':\\[([^\\]]*)\\]')) || [, ''])[1].match(/"[^"]+"/g) || []).length;
    const yn = await pL.evaluate(() => ({ tran: window.__PT.ynScore({ b1: 12, b2: 12, b3: 12, awl: 12, fake: 0 }).size, nua: window.__PT.ynScore({ b1: 12, b2: 6, b3: 0, awl: 0, fake: 0 }).size }));
    yn.nhan = { b2: mYNB ? mYNB[2] : '', b3: mYNB ? mYNB[3] : '' };
    yn.ten = ['b1', 'b2', 'b3', 'awl'].map(k => [k, dem12(k)]);
    kiem(yn.tran === 9000 && /2\.001–5\.000/.test(yn.nhan.b2) && /5\.001–9\.000/.test(yn.nhan.b3) && yn.ten.every(([, n]) => n === 12), 'gói L · kiểm vốn từ: công thức tối đa 9.000 họ từ khớp nhãn nhóm (1–2.000 / 2.001–5.000 / 5.001–9.000), mỗi nhóm 12 từ', JSON.stringify(yn));
    kiem(yn.nua === 2000 + 1500, 'gói L · kiểm vốn từ: biết hết nhóm 1 và nửa nhóm 2 → 3.500 họ từ (bảng gõ tay)', String(yn.nua));
    kiem(/class="tag hyp">Số tự đặt<\/span>Bốn nhóm từ do người soạn chọn/.test(SRC), 'gói L · bảng kết quả vốn từ có nhãn "Số tự đặt" nói rõ ranh giới nhóm là quy ước', '');
    // (e) trang chủ Khu 2 giữ số 570 / 10% / 1,4%
    kiem(/570 họ từ/.test(home) && /1,4%/.test(home), 'gói L · trang chủ Khu 2 vẫn ghi 570 họ từ và 1,4% (khớp bảng gốc)', '');
    kiem(loiL.length === 0, 'gói L · không lỗi JS khi mở trang', loiL.slice(0, 3).join(' || '));
    await cL.close();
  }
} finally {
  await trinhDuyet.close();
}

console.log(loi === 0 ? '\nTẤT CẢ XANH' : `\n${loi} phép ĐỎ`);
process.exit(loi === 0 ? 0 : 1);
