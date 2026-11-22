// Phép kiểm chung cho index.html: chạy sau MỖI lần sửa trang để biết có làm vỡ gì không.
// Chạy: node kiem/kiem-web.mjs        (cần Node.js và Playwright; thoát mã 1 nếu có một phép đỏ)
//   Cài Playwright một lần: npm install --no-save playwright && npx playwright install chromium
// Kiểm gì (mỗi phép in một dòng OK/LỖI):
//   1. Số thẻ từ / mẫu câu / câu quiz khớp mốc ở BAN_DAU, và khớp chữ ghi trên trang.
//   2. Mọi liên kết "#..." (trong HTML tĩnh, trong chuỗi của mã JS, và trong DOM sau khi vẽ) trỏ tới bài có thật.
//   3. Mở từng bài: không lỗi console, không lỗi JS.
//   4. Màn hình 390 px: không bài nào tràn ngang.
//   5. Chế độ tối: chữ ở menu bài đang chọn, nút tab và nút chính đạt tương phản >= 4,5:1.
//   7. Bộ từ theo buổi dạy (gói B): hai bộ 20 từ khớp hai file kiem/bo-tu-vung/*.md; hai kịch bản (học viên mới, học viên có tiến độ sẵn).
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
} finally {
  await trinhDuyet.close();
}

console.log(loi === 0 ? '\nTẤT CẢ XANH' : `\n${loi} phép ĐỎ`);
process.exit(loi === 0 ? 0 : 1);
