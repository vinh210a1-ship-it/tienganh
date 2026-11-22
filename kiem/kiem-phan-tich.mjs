// Đo độ chính xác của bộ phân tích câu trên các tập câu có lời giải viết tay (kiem/gold-*.txt).
// Chạy: node kiem/kiem-phan-tich.mjs [--chi-tiet]    (thoát mã 1 nếu F1 tập giữ lại thấp hơn ngưỡng)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const here = path.dirname(new URL(import.meta.url).pathname);
const PT = require(path.join(here, '..', 'phan-tich', 'phan-tich.js'));
const chiTiet = process.argv.includes('--chi-tiet');
const BO_QUA = new Set(['X', 'm']);
const norm = s => s.toLowerCase().replace(/[^a-z0-9À-ɏ]/g, '');

/* đọc chú thích tay thành danh sách phần tử {kind, role, text} */
function docGold(str) {
  const out = []; let i = 0;
  function words(a) { return a.replace(/\[[A-Za-z]+ |\]|<[A-Za-z]+ |>/g, ' '); }
  (function parse(stack) { })();
  const re = /\[([A-Za-z]+) ([^\]]*)\]|<([A-Za-z]+) |>/g; let m; const st = [];
  while ((m = re.exec(str))) {
    if (m[1]) { out.push({ kind: 'ph', role: m[1], text: norm(m[2]) }); for (const c of st) c.buf += ' ' + m[2]; }
    else if (m[3]) st.push({ role: m[3], buf: '', pos: m.index });
    else { const c = st.pop(); out.push({ kind: 'cl', role: c.role, text: null, raw: c, end: m.index }); }
  }
  // văn bản của mệnh đề = mọi chữ bên trong (gồm cả chữ nằm ngoài dấu ngoặc con, ví dụ "than", "of")
  return out.map(e => {
    if (e.kind === 'cl') { const inner = str.slice(e.raw.pos, e.end).replace(/^<[A-Za-z]+ /, '').replace(/\[[A-Za-z]+ |\]|<[A-Za-z]+ |>/g, ' '); return { kind: 'cl', role: e.role, text: norm(inner) }; }
    return e;
  });
}
function docMay(sent, text) {
  const T = sent.tokens, out = [];
  const words = (a, b) => norm(T.slice(a, b).filter(t => !t.p).map(t => text.slice(t.s, t.e)).join(''));
  (function walk(list) {
    for (const k of list) {
      const role = (k.mod || k.r === 'mod' || k.r === 'rel') ? 'm' : k.r;
      if (k.k === 'ph') out.push({ kind: 'ph', role, text: words(k.a, k.b) });
      else { out.push({ kind: 'cl', role, text: words(k.a, k.b) }); walk(k.kids || []); }
    }
  })(sent.kids);
  return out;
}
const key = e => e.kind + ':' + e.role + ':' + e.text;
function chamTap(file, ten) {
  const lines = fs.readFileSync(path.join(here, file), 'utf8').split(/\r?\n/).filter(l => l && !l.startsWith('#'));
  let tp = 0, fp = 0, fn = 0, exact = 0, n = 0, vOK = 0; const chi = [];
  for (const ln of lines) {
    const [en, gold] = ln.split(' ||| ');
    const r = PT.analyze(en); const s = r.sentences[0];
    const g = docGold(gold).filter(e => !BO_QUA.has(e.role));
    const m = docMay(s, r.text).filter(e => !BO_QUA.has(e.role));
    const gs = new Map(), ms = new Map();
    g.forEach(e => gs.set(key(e), (gs.get(key(e)) || 0) + 1)); m.forEach(e => ms.set(key(e), (ms.get(key(e)) || 0) + 1));
    let t = 0, f1 = 0, f2 = 0;
    for (const [k, c] of gs) { const d = Math.min(c, ms.get(k) || 0); t += d; f2 += c - d; }
    for (const [k, c] of ms) { f1 += c - Math.min(c, gs.get(k) || 0); }
    tp += t; fp += f1; fn += f2; n++;
    if (f1 === 0 && f2 === 0) exact++;
    else chi.push({ en, thieu: [...gs.keys()].filter(k => !ms.has(k)), thua: [...ms.keys()].filter(k => !gs.has(k)), conf: s.confidence });
  }
  const P = tp / (tp + fp), R = tp / (tp + fn), F = 2 * P * R / (P + R);
  console.log(`\n== ${ten}: ${n} câu | đúng hoàn toàn ${exact}/${n} (${(100 * exact / n).toFixed(0)}%) | chính xác ${(100 * P).toFixed(1)}% | phủ ${(100 * R).toFixed(1)}% | F1 ${(100 * F).toFixed(1)}%`);
  if (chiTiet) chi.forEach(c => console.log(`  ✗ [${c.conf}] ${c.en}\n      thiếu: ${c.thieu.join(' | ')}\n      thừa:  ${c.thua.join(' | ')}`));
  return { F, exact: exact / n };
}
const a = chamTap('gold-ielts.txt', 'Tập chỉnh (10 câu IELTS, đã dùng để sửa code)');
const b = chamTap('gold-heldout.txt', 'Tập giữ lại (viết lời giải trước khi chạy)');
const c = chamTap('gold-moi.txt', 'Tập mới (40 câu, chạy lần đầu để lấy số trung thực)');
const d = chamTap('gold-tap4.txt', 'Tập 4 (30 câu chưa từng thấy, chạy một lần rồi mới sửa)');
const NGUONG = 0.75;
if (c.F < NGUONG) { console.log(`\nF1 tập mới ${(100 * c.F).toFixed(1)}% thấp hơn ngưỡng ${NGUONG * 100}%`); process.exit(1); }
