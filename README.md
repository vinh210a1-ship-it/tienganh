# Tiếng Anh 80/20

Web học tiếng Anh bằng tiếng Việt, hai khu: **Học để dùng** (20% kiến thức, 80% ứng dụng) và **Nâng cao và IELTS**.

Trang chính là `index.html`, cộng thêm bộ phân tích câu `phan-tich/phan-tich.js` (một file JavaScript, không cần cài gì). Bấm đúp `index.html` để mở bằng Chrome, Edge hoặc Safari; giữ nguyên thư mục `phan-tich/` bên cạnh nó.

## Cấu trúc
- **Khu 1 · Học để dùng:** Bài 0–9, Bài 2B (S + V + O, số ít/số nhiều, to be đầy đủ, bài tập A–H, 5 bài đọc), Bài 3B (đọc giờ, thứ–ngày–tháng–năm, số thứ tự, giá tiền, số điện thoại; hỏi và đáp, 3 hội thoại, bài tập A–E, 12 câu quiz), Bài 5B (so sánh, hiện tại hoàn thành, for/since), 12 tình huống Thực hành (6 đầu thiên về công việc, 6 sau 7–12 là đời sống: gia đình, hẹn lịch, mua hàng, hiệu thuốc, khách sạn, sân bay; mỗi tình huống mới khai "Học trước" và bị bộ kiểm dò cấu trúc), Lộ trình 8 tuần (cho người tự học khá) và Lộ trình 12 tuần cho người mất gốc (mỗi tuần: nói được gì, bài, bộ thẻ, tình huống, phép kiểm; 186 thẻ ở Bài 4 chia vào tuần 1–10; ô "Bộ thẻ" cho ôn riêng từng bộ: buổi dạy 22/11 và Tuần 1–10, link dạng `#tu-vung?bo=1` hoặc `#tu-vung?bo=t3`).
- **Khu 2 · Nâng cao và IELTS:** Bài 10 (AWL), Bài 11 (chuyên ngành), Bài 12 (IELTS).
- **Kiểm tra trình độ** dùng chung: bản đầy đủ (A1 → C1 và vốn từ, 53 câu) và bản ngắn A1–A2 (15 câu).
- **Công cụ · Bảng tổng hợp ngữ pháp:** trang tra cứu A1–A2 (link `#bang-ngu-phap`). Bài 2B và bảng này do người soạn tự viết, chưa người bản xứ duyệt, nên mỗi mục mang nhãn "Tự soạn".
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

## Kiểm cả trang trước khi gộp PR
`node kiem/kiem-web.mjs` (cần Node.js và Playwright: `npm install --no-save playwright && npx playwright install chromium`). Kiểm số thẻ/mẫu câu/câu quiz, liên kết `#`, lỗi console, tràn ngang ở 390 px, tương phản chữ chế độ tối. Kiểm cả Bộ từ theo buổi dạy (hai kịch bản: học viên mới và học viên có tiến độ sẵn), nút ghost ở chế độ tối, và gói C: mọi ví dụ trên Bảng tổng hợp ngữ pháp và Bài 2B phải có trong file gốc `kiem/nguon-ngu-phap/*.md` (sửa nội dung thì sửa file gốc trước, rồi sửa trang). Thêm hoặc bớt thẻ, mẫu câu, câu quiz thì sửa `BAN_DAU` ở đầu file cùng PR.

## Bài 3B: số, giờ, ngày, tiền, số điện thoại (gói D)
- Mỗi số viết trên trang đi kèm chữ đọc (`.say`). Có hai kiểu, bộ kiểm bắt cả hai:
  - **Bảng:** ô số có thuộc tính `data-n`, ô kế bên chứa các `.say` bằng chữ (không có chữ số). Bộ kiểm đổi số thành mọi cách đọc chấp nhận được rồi so với chữ trên trang.
  - **Câu có số** (ví dụ `It's 3:15.`): `<span class="say" data-say="It's three fifteen.">It's 3:15.</span>`. Nút loa đọc `data-say`, không đọc chữ số, vì giọng máy có thể đọc số lạ. `data-say` không được còn chữ số.
- `kiem/doc-so.mjs` là bộ đổi số (giờ kiểu 12 giờ, past/to, tiền $ £ € VND, %, số thứ tự, năm, ngày kiểu Anh, số điện thoại từng chữ số). Nó không nằm trên web, chỉ phục vụ bộ kiểm. Nó tự được kiểm bằng `kiem/gold-doc-so.mjs`: bảng đáp án gõ tay (cách đọc đúng phải nhận, cách đọc sai phải bị từ chối). Thêm kiểu số mới thì thêm dòng đúng và dòng sai vào đó.
- Giới hạn: giờ chỉ 1–12, không có cách nói riêng của Anh ("double five", "half three"). Chưa nghe thử bằng tai.
- Lộ trình 8 tuần: Bài 3B nối vào CUỐI tuần 3 và tuần 7. Thêm mục vào cuối tuần, đừng chèn giữa: khóa tiến độ `w{tuần}t{số}` đã lưu trong máy học viên sẽ lệch.

Nhật ký thay đổi: `NHAT-KY.md`.

## Bộ từ theo buổi dạy (thẻ từ Bài 4)
- Mỗi buổi thầy dạy một bộ 20 từ thì thêm một mục vào `BO_TU` (đầu phần "Thẻ từ" trong `index.html`): `{id, ten, tu:[khóa thẻ...]}`. Khóa thẻ là chữ đầu của thẻ trong `VOCAB` (thẻ ghép như `"easy / difficult"` đi nguyên một thẻ).
- Chép file 20 từ của buổi vào `kiem/bo-tu-vung/bo-N.md` (bảng có cột `| số | **từ** |`) rồi thêm `N` vào vòng lặp ở mục 7 của `kiem/kiem-web.mjs`; phép kiểm so từng từ với `VOCAB` và với `BO_TU`.
- Link gửi học viên: `.../tienganh/#tu-vung?bo=1`. Lịch ôn và khóa lưu `en8020.boxes`/`en8020.due` không đổi: xem theo bộ chỉ là bộ lọc.

## Bài kiểm tra trình độ ngắn A1–A2 (gói F)
- Cùng ngân hàng `PTB` với bản đầy đủ, không có ngân hàng riêng. `buildShort()` rút 15 câu: A1 7 (3 ngữ pháp + 1 đoạn đọc 2 câu + 2 nghe), A2 8 (4 + 2 + 2); kế hoạch ở `SHORT_PLAN`. Bản đầy đủ (`buildTest`, `ptResult`) không đổi; `ptFinish()` chỉ chọn màn kết quả.
- Kết quả do `shortOutcome(a1, a2)`: đạt bậc khi đúng từ 70% (`SHORT_PASS`); A1 chưa đạt thì Dưới A1; đạt A2 mà sai tối đa 1 câu A2 (`SHORT_VUNG`) thì "nên làm bản đầy đủ". Cả hai là số do người soạn đặt ([G]), chưa kiểm với học viên thật; đổi thì sửa bảng gõ tay ở mục 11 của `kiem-web.mjs`.
- Kết quả bản ngắn lưu ở khóa `en8020.ptLastShort`, tách khỏi `ptLast` của bản đầy đủ. Thời gian làm chưa đo với học viên thật nên khung giới thiệu không ghi phút (phép kiểm cấm).
- Phép kiểm: mục 11 của `node kiem/kiem-web.mjs`. Bản đầy đủ luôn rút `PT_DAY_DU` = 53 câu; đổi ngân hàng cố ý thì sửa số này cùng PR.

## Lộ trình 12 tuần (gói H)
- Trang `#lo-trinh-12`, nằm cạnh Lộ trình 8 tuần (giữ nguyên). Dữ liệu ở mảng `W12` (cạnh `WEEKS` trong `index.html`): mỗi tuần có `noi` (nói được gì), `bai` (liên kết tới bài: `[mã bài, chữ]`), `th` (tình huống), `kiem` (phép kiểm cuối tuần, ngưỡng là số tự đặt) và `nhanh` (chỉ tuần 10). Nguồn: `GIAO-TRINH-12-TUAN` mục 5, 7, 8.
- **Thẻ theo tuần:** bảng `SET12` (đầu phần "Thẻ từ") chia 186 thẻ vào tuần 1–10 theo thứ tự nhóm trong `VOCAB`: `[tuần, nhóm, số thẻ]`. Khóa thẻ là "chữ|nhóm" vì `VOCAB` có hai thẻ cùng chữ `work` (động từ và danh từ). Thêm hoặc bớt thẻ ở `VOCAB` thì sửa `SET12` cùng PR, nếu không phép kiểm báo (tổng phải đúng 186, mỗi thẻ đúng một tuần).
- **Chế độ theo lộ trình:** trên trang này, ô "Theo lộ trình 12 tuần" và "Tôi đang học tuần N", lưu ở khóa `en8020.ltr12` (`{"on":true,"w":3}`, nằm trong tệp sao lưu; tệp sao lưu cũ không có khóa này vẫn nạp được, giá trị hỏng thì về mặc định). Bật thì ô "Bộ thẻ" ở Bài 4 bỏ "Tất cả" và các bộ tuần chưa tới, mặc định là "thẻ đến hết tuần N". Tắt thì về như cũ. Chỉ là bộ lọc: hộp và ngày hẹn của thẻ (`en8020.boxes`, `en8020.due`) không đổi.
- **Thêm tình huống mới vào lộ trình:** xếp vào tuần trong `W12`; nếu tình huống khai `data-cho-phep`, phép kiểm bắt khi nó dùng cấu trúc mà lộ trình 12 tuần dạy sau tuần đó (bảng `TUAN_DAY` ở mục 12 của `kiem-web.mjs`).
- Chưa thử với học viên thật; mọi ngưỡng đạt và cách chia thẻ là số tự đặt.
