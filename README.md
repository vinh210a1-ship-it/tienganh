# Tiếng Anh 80/20

Web học tiếng Anh bằng tiếng Việt, hai khu: **Học để dùng** (20% kiến thức, 80% ứng dụng) và **Nâng cao và IELTS**.

Trang chính là `index.html`, cộng thêm bộ phân tích câu `phan-tich/phan-tich.js` (một file JavaScript, không cần cài gì). Bấm đúp `index.html` để mở bằng Chrome, Edge hoặc Safari; giữ nguyên thư mục `phan-tich/` bên cạnh nó.

## Cấu trúc
- **Khu 1 · Học để dùng:** Bài 0–9, Bài 5B (so sánh, hiện tại hoàn thành, for/since), 6 tình huống Thực hành, Lộ trình 8 tuần.
- **Khu 2 · Nâng cao và IELTS:** Bài 10 (AWL), Bài 11 (chuyên ngành), Bài 12 (IELTS).
- **Kiểm tra trình độ** dùng chung (A1 → C1 và vốn từ).
- **Công cụ · Phân tích câu:** dán hoặc tải tệp (.txt, .md, .docx), bật chế độ phân tích để gạch chân S, V, O, C, A, to-V theo màu. Chạy hoàn toàn trong trình duyệt, kết quả chỉ là gợi ý.

## Tiến độ
Lưu trong trình duyệt (localStorage, khóa bắt đầu bằng `en8020.`). Sao lưu và nạp lại ở trang "Lộ trình và kiểm tra".

## Quay lại bản cũ
`goc/ban-goc-artifact-2026-11-19.html` là bản nguyên gốc trước khi sửa.

## Nơi sửa dữ liệu (phần `<script>` trong `index.html`)
`LESSONS` (mục lục, khu), `VOCAB` (thẻ từ), `PHRASES` (mẫu câu), `QUIZ` (bài tập nhanh), `AWL`, `FIELD` (thuật ngữ ngành), `PTB` (ngân hàng kiểm tra trình độ), `WEEKS` (lộ trình).

## Phân tích câu: nơi sửa và cách kiểm
- `phan-tich/phan-tich.js`: từ điển nhỏ, luật gán thành phần, xuất HTML. Thêm từ mới: sửa các danh sách đầu file (`VERBS`, `NOUNS`, `ADJS`, `IRREG`).
- `kiem/`: các bộ câu có lời giải viết tay (`gold-*.txt`) và `kiem-phan-tich.mjs`. Chạy `node kiem/kiem-phan-tich.mjs --chi-tiet` (cần Node.js) để đo lại sau mỗi lần sửa luật. Bộ `gold-tap4.txt` chỉ chạy lần đầu để lấy số thật, đừng chỉnh luật theo nó.
- Giao diện nằm trong `index.html` (mục `id="phan-tich"`, CSS `.pc-*`, mã JS "Phân tích câu").

Nhật ký thay đổi: `NHAT-KY.md`.
