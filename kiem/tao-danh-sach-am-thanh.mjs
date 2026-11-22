// Công cụ cho gói J (giọng thầy): đọc các hội thoại trên trang, đối chiếu với tệp mp3 trong thư mục am-thanh/,
// rồi ghi lại hai tệp:
//   am-thanh/danh-sach.js     câu nào có tệp mp3 (trang đọc tệp này để biết nên phát giọng thầy hay giọng máy)
//   am-thanh/CAU-CAN-GHI.md   danh sách từng dòng hội thoại, tên tệp cần đặt, và dòng nào đã có tiếng
//
// Cách đặt tên tệp: <mã hội thoại>-<số dòng 2 chữ số>.mp3, ví dụ th1-01.mp3 là dòng 1 của tình huống 1.
//   th<N>        = tình huống số N ở trang Thực hành (số N ghi ngay trước tên tình huống); nếu tình huống có hội thoại thứ hai thì th<N>b
//   <id bài>-<k> = hội thoại thứ k trong bài đó (ví dụ gio-ngay-tien-2 = hội thoại 2 của Bài 3B)
// Chạy:  node kiem/tao-danh-sach-am-thanh.mjs            (ghi lại hai tệp)
//        node kiem/tao-danh-sach-am-thanh.mjs --kiem     (không ghi; thoát mã 1 nếu hai tệp đang cũ hoặc có tệp đặt sai tên)
//        node kiem/tao-danh-sach-am-thanh.mjs <thư mục trang>   (làm việc trên bản sao, dùng cho phép kiểm)
// Cần Playwright (như kiem-web.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('Thiếu Playwright. Chạy: npm install --no-save playwright && npx playwright install chromium'); process.exit(2); }

const here = path.dirname(new URL(import.meta.url).pathname);
const args = process.argv.slice(2);
const chiKiem = args.includes('--kiem');
const goc = path.resolve(args.find(a => !a.startsWith('--')) || path.join(here, '..'));
const dirAm = path.join(goc, 'am-thanh');
const KICH_CO_CANH_BAO = 300 * 1024; // một dòng hội thoại ngắn không cần quá 300 KB

const trinhDuyet = await chromium.launch();
let cac;
try {
  const trang = await (await trinhDuyet.newContext()).newPage();
  await trang.goto(pathToFileURL(path.join(goc, 'index.html')).href);
  await trang.waitForFunction(() => window.__AM && window.__COUNTS);
  cac = await trang.evaluate(() => {
    const norm = window.__AM.norm;
    const sits = [...document.querySelectorAll('.sit')];
    const ra = [];
    const dem = {};
    for (const ul of document.querySelectorAll('ul.dlg')) {
      const sit = ul.closest('.sit');
      let id;
      if (sit) {
        const base = 'th' + (sit.getAttribute('data-sit') || (sits.indexOf(sit) + 1));
        dem[base] = (dem[base] || 0) + 1;
        id = dem[base] === 1 ? base : base + String.fromCharCode(96 + dem[base]); // hội thoại thứ hai trong cùng tình huống: th8b, th8c…
      }
      else {
        const sec = ul.closest('section.lesson');
        const idSec = sec ? sec.id : 'trang';
        dem[idSec] = (dem[idSec] || 0) + 1;
        id = idSec + '-' + dem[idSec];
      }
      const tieuDe = (sit ? sit.querySelector('h2') : ul.previousElementSibling && ul.previousElementSibling.tagName === 'H3' ? ul.previousElementSibling : null);
      const dong = [...ul.querySelectorAll(':scope > li')].map((li, i) => {
        const el = li.querySelector('.say');
        if (!el) return null;
        const noi = norm(el.getAttribute('data-say') || el.textContent);
        const hien = norm(el.textContent);
        return { n: i + 1, noi, hien, vai: (li.querySelector('b') || {}).textContent || '' };
      }).filter(Boolean);
      ra.push({ id, tieuDe: tieuDe ? norm(tieuDe.textContent.replace(/Tự soạn/, '')) : '', dong });
    }
    return ra;
  });
} finally { await trinhDuyet.close(); }

const hai = n => String(n).padStart(2, '0');
const tenTep = (id, n) => `${id}-${hai(n)}.mp3`;
const idTrung = cac.map(c => c.id).filter((x, i, a) => a.indexOf(x) !== i);
if (idTrung.length) { console.error('Mã hội thoại bị trùng: ' + [...new Set(idTrung)].join(', ')); process.exit(1); }

const coTep = fs.existsSync(dirAm) ? fs.readdirSync(dirAm).filter(f => /\.(mp3|wav|m4a|ogg|aac|webm)$/i.test(f)) : [];
const hopLe = new Set(cac.flatMap(c => c.dong.map(d => tenTep(c.id, d.n))));
const sai = coTep.filter(f => !hopLe.has(f));
const goiY = f => { const m = /^(.*?)[-_]0?(\d{1,2})\.(\w+)$/.exec(f); return m ? `${m[1]}-${hai(+m[2])}.mp3` : null; };
const loi = [];
for (const f of sai) {
  const dung = goiY(f);
  loi.push(`Tệp «${f}» không khớp dòng nào` + (/\.mp3$/.test(f) ? '' : ' (chỉ nhận đuôi .mp3 thường)') + (dung && hopLe.has(dung) ? `; có phải ý bạn là «${dung}»?` : '.'));
}

// danh sách: câu (đúng như trang sẽ đọc) -> tệp. Cùng một câu ở nhiều chỗ thì dùng tệp đầu tiên theo thứ tự trên trang.
const ds = {}; const cung = [];
for (const c of cac) for (const d of c.dong) {
  const f = tenTep(c.id, d.n);
  if (!coTep.includes(f)) continue;
  if (Object.prototype.hasOwnProperty.call(ds, d.noi)) { if (ds[d.noi] !== 'am-thanh/' + f) cung.push(`«${d.noi}» có ở ${ds[d.noi].slice(9)} và ${f}: trang dùng ${ds[d.noi].slice(9)}`); continue; }
  ds[d.noi] = 'am-thanh/' + f;
}
const kb = f => fs.statSync(path.join(dirAm, f)).size;
const nang = coTep.filter(f => kb(f) > KICH_CO_CANH_BAO);
const tong = coTep.reduce((s, f) => s + kb(f), 0);

const dsSorted = Object.entries(ds).sort((a, b) => a[1].localeCompare(b[1]));
const noiDungJs = '// Tệp do kiem/tao-danh-sach-am-thanh.mjs sinh ra. Đừng sửa tay.\n' +
  (dsSorted.length ? `// ${dsSorted.length} câu có giọng thầy; câu khác vẫn do giọng máy đọc.\n` : '// Hiện chưa có tệp giọng thầy nào: mọi câu vẫn do giọng máy đọc.\n') +
  'window.AM_THANH = {' + (dsSorted.length ? '\n' + dsSorted.map(([k, v]) => ' ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n') + '\n' : '') + '};\n';

const tongDong = cac.reduce((s, c) => s + c.dong.length, 0);
const coDong = cac.reduce((s, c) => s + c.dong.filter(d => coTep.includes(tenTep(c.id, d.n))).length, 0);
const md = ['# Câu cần ghi âm cho giọng thầy', '',
  'Tệp này do `kiem/tao-danh-sach-am-thanh.mjs` sinh ra, đừng sửa tay. Cách làm: ghi từng dòng thành một tệp mp3 ngắn, đặt tên đúng như cột "Tên tệp", bỏ vào thư mục `am-thanh/`, rồi chạy lại công cụ.',
  '', `Tổng ${tongDong} dòng hội thoại trong ${cac.length} hội thoại; đã có tiếng ${coDong}.`, ''];
for (const c of cac) {
  md.push(`## ${c.id}${c.tieuDe ? ' · ' + c.tieuDe : ''}`, '', '| Tên tệp | Vai | Câu (đọc như thế này) | Đã có |', '|---|---|---|---|');
  for (const d of c.dong) md.push(`| ${tenTep(c.id, d.n)} | ${d.vai} | ${d.noi.replace(/\|/g, '\\|')}${d.noi !== d.hien ? ' (trên trang: ' + d.hien.replace(/\|/g, '\\|') + ')' : ''} | ${coTep.includes(tenTep(c.id, d.n)) ? '✓' : ''} |`);
  md.push('');
}
const noiDungMd = md.join('\n');

const doc = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
const fJs = path.join(dirAm, 'danh-sach.js'), fMd = path.join(dirAm, 'CAU-CAN-GHI.md');
const cu = doc(fJs) !== noiDungJs || doc(fMd) !== noiDungMd;
if (chiKiem) {
  if (cu) loi.push('am-thanh/danh-sach.js hoặc CAU-CAN-GHI.md đang cũ: chạy `node kiem/tao-danh-sach-am-thanh.mjs` rồi commit.');
} else if (cu) { fs.mkdirSync(dirAm, { recursive: true }); fs.writeFileSync(fJs, noiDungJs); fs.writeFileSync(fMd, noiDungMd); }

console.log(`${cac.length} hội thoại, ${tongDong} dòng; có tiếng ${coDong} dòng (${dsSorted.length} câu khác nhau); dung lượng am-thanh/ ${(tong / 1024).toFixed(1)} KB.`);
for (const c of cac) {
  const co = c.dong.filter(d => coTep.includes(tenTep(c.id, d.n)));
  if (co.length) console.log(`  ${c.id}: ${co.length}/${c.dong.length} dòng` + (co.length < c.dong.length ? ' (thiếu ' + c.dong.filter(d => !coTep.includes(tenTep(c.id, d.n))).map(d => hai(d.n)).join(' ') + ')' : ''));
}
for (const f of nang) console.log(`CẢNH BÁO ${f} nặng ${(kb(f) / 1024).toFixed(0)} KB (nên dưới ${KICH_CO_CANH_BAO / 1024} KB cho một dòng ngắn; mp3 mono 64 kbps là đủ).`);
for (const x of cung) console.log('CẢNH BÁO câu trùng ' + x);
for (const x of loi) console.log('LỖI ' + x);
if (!chiKiem && !cu) console.log('(hai tệp danh sách đã đúng, không ghi lại)');
process.exit(loi.length ? 1 : 0);
