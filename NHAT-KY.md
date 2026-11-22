# Nhật ký web Tiếng Anh 80/20 (mục mới nhất ở trên)

## 2026-11-22 tối · gói B: thẻ từ ôn theo bộ của buổi dạy (nhánh claude/project-thread-ovb6lb)
- Làm gì: Bài 4 có ô "Bộ của buổi dạy" (Tất cả / Bộ 1 / Bộ 2, mỗi bộ 20 từ dạy ngày 22/11), nằm cạnh ô "Nhóm"; hai ô lọc cùng lúc. Mặc định vẫn "Tất cả". Mở link `#tu-vung?bo=1` hoặc `?bo=2` là vào đúng bộ; đổi ô thì địa chỉ đổi theo; có nút "Sao chép link bộ này" cho thầy. Bộ không có trong link thì về "Tất cả". Bộ lọc thuần túy: lịch ôn (hộp 1/3/7/14/30 ngày), khóa lưu `en8020.boxes`, `en8020.due` không đổi, không thẻ nào đổi hộp.
- Khi học xong 20 thẻ của bộ thì dừng ("Hết thẻ đến hạn"), không đẩy sang 186 thẻ.
- Ba thẻ ghép ("child (children)", "easy / difficult", "cheap / expensive") là một thẻ trong VOCAB, nên Bộ 2 hiện luôn từ "easy" và "cheap" đi kèm "difficult", "expensive" (vẫn 20 thẻ mỗi bộ). Không tách thẻ để khỏi đổi khóa lưu cũ.
- Phép kiểm tự động mới (mục 7 trong `kiem/kiem-web.mjs`, nguồn từ ở `kiem/bo-tu-vung/bo-1.md`, `bo-2.md` là bản sao hai file 20 từ của buổi dạy): mọi từ của hai file có mặt trong VOCAB đúng một thẻ và đúng bộ, không thừa thẻ, hai bộ không trùng; kịch bản học viên mới (link bộ 1, bộ 2: 20 thẻ hiện ra đều thuộc bộ, không lặp, học xong thì dừng; đổi link khi đang mở trang); kịch bản có tiến độ sẵn (gieo kho cũ: hộp cũ đọc đúng theo bộ, học một thẻ chỉ đổi thẻ đó, nạp lại không mất khóa nào). Cố ý làm hỏng BO_TU (bỏ "need", thêm "understand" vào Bộ 1) → 11 phép đỏ. Bản đã sửa: xanh toàn bộ (cũ + mới).
- Phụ: `route()` bỏ phần sau `?` của địa chỉ (trước đây `#tu-vung?bo=1` sẽ rơi về trang chủ); phép kiểm liên kết `#` cũng bỏ phần `?`. Đã chụp màn hình 390 px: ô chọn và nút không tràn.
- Chưa kiểm được (cloud): trang live github.io (link `#tu-vung?bo=1` sau khi đăng), nút sao chép link trên Safari iPhone, nghe bằng tai. Từ "work" có hai thẻ trùng khóa trong VOCAB từ trước (không thuộc bộ nào, không ảnh hưởng gói B; nếu sửa thì đụng khóa lưu "work").
- Bộ các tuần sau (mục 5 giáo trình): thêm theo hướng dẫn trong README mục "Bộ từ theo buổi dạy".
- Chưa chép sang E:\web tiếng anh (chờ gộp PR).

## 2026-11-22 chiều · gói A: sửa chỗ web nói sai + bộ kiểm chung (nhánh claude/project-thread-t6ipwc)
- Bài 4: bỏ câu "Mỗi ngày thêm 10–15 từ mới… Sau 8 tuần thuộc hết bộ này" (mâu thuẫn bộ 186 thẻ). Thay bằng: bộ có 186 thẻ; nhịp gợi ý khoảng 15–20 từ mới mỗi tuần (2–3 từ mỗi ngày) cộng ôn thẻ đến hạn; học hết bộ khoảng 9–12 tuần (186/20 ≈ 9,3; 186/15 ≈ 12,4). Nhịp này gắn nhãn Ước lượng (nhãn [G]), không phải kết quả nghiên cứu.
- Trang Lộ trình: câu "Mục tiêu tuần 8: thuộc hết bộ thẻ" cũng mâu thuẫn nên sửa thành "đã mở hết các nhóm thẻ ghi trong lộ trình và không dồn thẻ quá hạn; thuộc cả 186 thẻ cần khoảng 9–12 tuần".
- "Sau khóa này học gì tiếp": bỏ hiện tại hoàn thành và so sánh (đã dạy ở Bài 5B, có liên kết). Việc còn lại: hoàn thành bộ thẻ, cụm động từ, mở rộng vốn từ 2.000–3.000 họ từ, đọc sách phân cấp + nghe có phụ đề, dùng lại kiến thức qua Thực hành và Phân tích câu.
- Bài 3 (bảng động từ bất quy tắc): câu "hiện tại hoàn thành, sẽ học ở giai đoạn sau" cũng lỗi thời, nay trỏ tới Bài 5B.
- Thêm `kiem/kiem-web.mjs` (cần Playwright): đếm thẻ/mẫu câu/câu quiz so với mốc 186/80/87 và so với chữ trên trang; mọi liên kết # (HTML tĩnh, chuỗi JS, DOM sau khi vẽ) trỏ tới bài có thật; mở 19 bài không lỗi console; 390 px không tràn ngang; tương phản chế độ tối (tự động và ép data-theme) ≥ 4,5:1 ở menu bài đang chọn (8,49), số bài (6,92), nút tab (8,49), nút chính (9,10); chặn câu "10–15 từ mới" quay lại.
- Đã thử bắt lỗi thật: chạy trên `index.html` của main cũ ra 4 phép đỏ (đúng hai lỗi của gói A); cố ý làm hỏng một liên kết ra đỏ; cố ý đổi màu chữ chế độ tối ra 2,19:1 đỏ. Bản đã sửa: xanh toàn bộ.
- Chưa kiểm được (cloud): trang live github.io, nghe bằng tai, Safari iPhone. Bộ kiểm không đo được nội dung đúng/sai về ngữ pháp, chỉ bắt trang vỡ.
- Lệnh cho các gói sau: `node kiem/kiem-web.mjs` (cố ý đổi số thẻ/mẫu câu/câu quiz thì sửa `BAN_DAU` ở đầu file cùng PR). `node kiem/kiem-phan-tich.mjs` vẫn dùng cho Phân tích câu.
- Chưa chép sang E:\web tiếng anh (chờ gộp PR, làm một lần sau gói A, sao lưu bản cũ vào goc\).

## 2026-11-22 tối · sửa lỗi Kiểm định tìm ở PR #2 (nhánh claude/phan-tich-sua-oc)
- Kiểm định đã gộp PR #2 và ghi 5 lỗi nhỏ; sửa 1–4 và một phần 5:
  1. O + C: "He called me a liar", "They elected Maria president", "They named the baby Anna", "I consider him my friend" nay ra O rồi C (động từ call/name/elect/appoint/declare/crown/vote/label/consider; ban đầu có thêm choose/find/keep/leave nhưng Kiểm định chỉ ra làm hỏng "He left me a message", "He left the company a year ago"... nên đã bỏ, các động từ này giữ O + tính từ; có tách "Maria president" thành O + C khi một chữ viết hoa).
  2. Cụm động từ + tiểu từ + V-ing: "gave up smoking last year" → V "gave up" + O "smoking" + A.
  3. "a lot", "a bit" thành A (mức độ/tần suất).
  4. Mệnh đề wh-/that làm tân ngữ thứ hai sau ask/tell/show/teach/inform/remind/warn/promise ("asked him where he lived", "told me that..."); "What did you buy?" ra O đã đảo lên đầu câu (khi thiếu tân ngữ khác).
  5. "Having a car is useful" nay đúng. "The teacher, tired and hungry, left the room" CHƯA sửa.
- Lỗi cũ tìm thấy khi sửa và đã sửa: "She is reading a book" / "He is writing a letter" bị gắn C (do danh sách danh động từ-danh từ), "What are you doing?" và "I am doing my homework" mất động từ "doing". "He asked what time it was" bị đọc sai.
- "a year ago", "two days ago" nay là A thời gian (trước đây rớt khỏi câu); thêm keep/save vào nhóm hai tân ngữ ("keep you a seat").
- Thêm `kiem/gold-hoi-quy.txt` (26 câu hồi quy, chỉ để chống lỗi quay lại, KHÔNG dùng làm độ chính xác). Bốn tập cũ giữ nguyên điểm (10/10, 43/43, 40/40, tập 4 27/30).

## 2026-11-22 tối · chế độ Phân tích câu (nhánh claude/project-thread-jgi8mn)
- vinh nhờ: thêm chỗ dán/tải tài liệu, bật chế độ phân tích thì gạch chân theo màu kiểu artifact AACbN2Tw4k85V4FHHv9v1n, và kiểm xem nhãn đã đúng chưa vì "O" gạch cả giới từ và động từ.
- Kết luận ngữ pháp: artifact gộp "O/C" và gạch O qua cả giới từ, động từ thứ hai, cả mệnh đề là SAI. Bộ nhãn dùng ở đây: S, V, O (chỉ cụm danh từ), C (bổ ngữ sau be/seem/become, look + tính từ...), A (trạng ngữ, có loại nơi chốn/thời gian/cách thức/lý do), T (to + V, có O riêng), X (từ nối), M (bổ sung sau dấu phẩy). Mệnh đề vẽ thành khung có nhãn, bên trong gạch chân từng cụm lá.
- Thêm `phan-tich/phan-tich.js` (bộ phân tích luật + từ điển nhỏ, chạy trong trình duyệt, không thư viện, không gửi dữ liệu đi) và trang "Phân tích câu" (nhóm Công cụ): ô dán, tải .txt/.md/.docx (PDF chưa hỗ trợ, có hướng dẫn sao chép), 3 mẫu thử, 3 chế độ (Tắt tự gạch thử / Thành phần câu / Loại từ), chú giải bấm để làm nổi một loại, bấm vào đoạn gạch chân xem giải thích, khung câu, huy hiệu độ tin cậy kèm lý do, chữ cái cạnh gạch chân (không chỉ dựa vào màu), màu đạt tương phản AA sáng/tối, thử ở 390 px. Phần "Cách đọc các nhãn" giải thích vì sao O không gồm giới từ và động từ.
- Độ chính xác ĐO ĐƯỢC (lời giải viết tay trước khi chạy): tập mới 40 câu chạy lần đầu: 30/40 câu đúng hoàn toàn (75%), F1 theo thành phần 92,4%. Tập 4 (30 câu chưa từng thấy) chạy lần đầu: 21/30 (70%), F1 89,1%. Sau khi sửa lỗi tìm ra, điểm các tập ≈ 90–100% nhưng là điểm "đã chỉnh theo đề", không dùng làm độ chính xác thật. Tập 4 sau sửa: 27/30; cả 3 câu còn lại là chỗ lời giải tôi viết khác quy ước của chính bộ phân tích (V tách đôi khi có trạng từ chen: "have never seen", "had already started"; "cheaper than that one" tách phần so sánh thành A), không phải lỗi bóc tách; giữ nguyên file lời giải để không "sửa đề theo máy". Lỗi thật còn biết: "Having a car is useful" (have + V-ing làm chủ ngữ) chưa xử lý được.
- Quét 242 câu ví dụ có sẵn của web: 220 câu tìm thấy động từ, 22 câu cụt (chào hỏi, cụm danh từ) được báo "không phải câu đầy đủ". 40.000 ký tự phân tích khoảng 50 ms. Fuzz 3.000 chuỗi lộn xộn không lỗi.
- Giới hạn đã biết: câu rất dài/nhiều mệnh đề lồng, từ ngoài từ điển (đoán theo đuôi từ), từ vừa danh từ vừa động từ, chế độ "Loại từ" thô hơn chế độ "Thành phần", .docx chỉ lấy chữ chính. Chưa có PDF.
- Chưa làm: chấm điểm bài tự gạch, lưu tài liệu, PDF, kiểm bằng người (chưa có giáo viên tiếng Anh xem lại các câu mẫu).
- PR chờ luồng Kiểm định duyệt; không tự gộp. Muốn bỏ: `git revert` commit gộp. Chưa chép sang E:\web tiếng anh và chưa cập nhật bản copy index.html trong /mnt/project-files/tieng-anh/ (chờ vinh đồng ý).

## 2026-11-19 · lần sửa đầu
- Chia hai khu: Khu 1 Học để dùng (20% kiến thức, 80% ứng dụng), Khu 2 Nâng cao và IELTS. Trang chủ có hai thẻ chọn khu; mục lục và thanh tiến độ tách theo khu; nhãn khu hiện cả trên điện thoại.
- Sửa tương phản chế độ tối tự động (menu bài đang chọn, nút tab, số bài): từ 2,19:1 và 1,76:1 lên 8,49:1 và 6,92:1 (đo bằng trình duyệt).
- Thẻ ôn có lịch ngày thật: hộp 1–5 hẹn 1, 3, 7, 14, 30 ngày; thẻ đến hạn hiện trước, hết thì dừng, có nút "Ôn thêm". Bài 0 và Bài 4 đã sửa lời cho khớp.
- Thêm Bài 5B (so sánh, hiện tại hoàn thành, for/since, quá khứ tiếp diễn) để khóa dạy đủ phần bậc A2 mà bài kiểm tra hỏi. Thêm vào Lộ trình tuần 6.
- Thêm trang Thực hành: 6 tình huống nói thật, mỗi cái có hội thoại, lượt của bạn, danh sách kiểm (lưu theo trình duyệt). Thêm vào tuần 7 và 8.
- Kiểm tra trình độ: bỏ câu từ gốc REDUCTION (lạ), sửa hai đáp án nhiễu sai ngữ pháp, thêm 3 đoạn đọc (A1, A2, B1) và 5 câu nghe để làm lại ít trùng. Vẫn 53 câu mỗi lần.
- Thêm Sao lưu / Nạp tiến độ (file JSON).
- Sửa lỗi mở link có #bài bị che tiêu đề dưới thanh dính.
- Bài 10: số "GSL ≈ 80%, + AWL ≈ 90%" ghi rõ là nguồn thứ cấp (EAP Foundation), chưa đối chiếu bài gốc Coxhead 2000. Chỉ số AWL ≈ 10% đã thấy ở nhiều trang tổng hợp.
- Bài 11: thêm liên kết sang từ điển Anh–Việt của web Nhũ tương (chưa kiểm được link từ môi trường cloud).
- Giữ nguyên giọng đọc máy theo ý vinh.

Còn lại (chưa làm): tách thành trang tĩnh nhiều URL cho SEO/chia sẻ; ghi âm trong trình duyệt; thêm đoạn đọc B2, C1; đối chiếu bảng tần suất cho 4 nhóm từ vốn từ; thêm tình huống thực hành.
