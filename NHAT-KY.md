# Nhật ký web Tiếng Anh 80/20 (mục mới nhất ở trên)

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
