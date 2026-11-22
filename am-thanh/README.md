# Giọng thầy cho hội thoại (gói J)

Trang vốn đọc mọi câu bằng giọng máy. Thư mục này cho phép thay bằng giọng người thật, từng dòng một. Câu nào chưa có tệp thì vẫn do giọng máy đọc, nên làm dần từng hội thoại cũng được.

## Cách làm cho một hội thoại
1. Mở `CAU-CAN-GHI.md`, chọn một hội thoại (gợi ý bắt đầu: `th1` Tự giới thiệu, 6 dòng; hoặc `th2` Gọi món, 6 dòng).
2. Ghi âm từng dòng thành một tệp ngắn bằng điện thoại, đọc đúng câu ở cột "Câu (đọc như thế này)" (với dòng có số thì đọc bằng chữ như cột đó ghi).
3. Đổi thành **mp3, mono, khoảng 64 kbps** (một dòng ngắn chỉ vài chục KB), ví dụ với ffmpeg: `ffmpeg -i goc.m4a -ac 1 -b:a 64k th1-01.mp3`.
4. Đặt tên **đúng như cột "Tên tệp"** (ví dụ `th1-01.mp3`) rồi bỏ vào thư mục `am-thanh/`.
5. Chạy `node kiem/tao-danh-sach-am-thanh.mjs`. Công cụ cập nhật `danh-sach.js` và `CAU-CAN-GHI.md` (cột "Đã có"), báo tệp nào đặt sai tên hoặc quá nặng. Rồi commit và mở PR như thường lệ.

## Nên biết
- Nếu một câu giống hệt nhau xuất hiện ở hai hội thoại, trang dùng tệp của chỗ đầu tiên theo thứ tự trên trang.
- Nếu sửa chữ của một câu trên trang thì tệp cũ không còn khớp: chạy lại công cụ, và ghi âm lại câu đó.
- Mỗi dòng nên dưới 300 KB (công cụ cảnh báo). Tệp lớn làm repo nặng và trang tải chậm trên điện thoại.
- Bản ghi âm là giọng của người ghi; không đưa vào repo giọng của người khác khi chưa có phép.
