# Hướng dẫn sử dụng — Vết Lành

**Phiên bản:** 1.0 · **Cập nhật:** 2026-06-23  
**Website:** https://vetlanh.io.vn

---

## Mục lục

- [Phần 1 — Dành cho Người dùng](#phần-1--dành-cho-người-dùng)
  - [1. Tạo tài khoản & Đăng nhập](#1-tạo-tài-khoản--đăng-nhập)
  - [2. Trang chủ Dashboard](#2-trang-chủ-dashboard)
  - [3. Trò chuyện AI](#3-trò-chuyện-ai)
  - [4. Tâm trạng hôm nay](#4-tâm-trạng-hôm-nay)
  - [5. Bài tập tâm lý](#5-bài-tập-tâm-lý)
  - [6. Âm thanh thư giãn](#6-âm-thanh-thư-giãn)
  - [7. Nhật ký](#7-nhật-ký)
  - [8. Ghi chép suy nghĩ (CBT)](#8-ghi-chép-suy-nghĩ-cbt)
  - [9. Đánh giá PHQ-9](#9-đánh-giá-phq-9)
  - [10. Kế hoạch an toàn](#10-kế-hoạch-an-toàn)
  - [11. Thư viện nội dung](#11-thư-viện-nội-dung)
  - [12. Nâng cấp Pro](#12-nâng-cấp-pro)
  - [13. Hồ sơ & Cài đặt](#13-hồ-sơ--cài-đặt)
  - [14. Chuyển đổi giao diện sáng / tối](#14-chuyển-đổi-giao-diện-sáng--tối)
- [Phần 2 — Dành cho Quản trị viên](#phần-2--dành-cho-quản-trị-viên)
  - [1. Đăng nhập Admin](#1-đăng-nhập-admin)
  - [2. Dashboard tổng quan](#2-dashboard-tổng-quan)
  - [3. Quản lý người dùng](#3-quản-lý-người-dùng)
  - [4. Quản lý đăng ký Pro](#4-quản-lý-đăng-ký-pro)
  - [5. Quản lý âm thanh](#5-quản-lý-âm-thanh)
  - [6. Quản lý thư viện](#6-quản-lý-thư-viện)
  - [7. Báo cáo lỗi](#7-báo-cáo-lỗi)

---

## Phần 1 — Dành cho Người dùng

---

### 1. Tạo tài khoản & Đăng nhập

#### Đăng ký tài khoản mới

1. Vào trang chủ **vetlanh.io.vn** → nhấn **"Đăng ký ngay"**
2. Điền thông tin:
   - **Tên hiển thị** — tên sẽ xuất hiện trong ứng dụng
   - **Email** hoặc **tên đăng nhập**
   - **Mật khẩu** (tối thiểu 8 ký tự)
3. Nhấn **"Đăng ký"** → hệ thống gửi email xác minh
4. Mở email → nhấn liên kết xác minh → tự động đăng nhập và chuyển vào `/services`

> **Lưu ý:** Nếu không nhận được email, nhấn **"Gửi lại email xác minh"** ở trang chờ.

#### Đăng nhập

1. Nhấn **"Đăng nhập"** trên trang chủ
2. Nhập email/username và mật khẩu → nhấn **"Đăng nhập"**
3. Chuyển vào trang chủ ứng dụng (`/services`)

---

### 2. Trang chủ Dashboard

Sau khi đăng nhập, bạn thấy màn hình Dashboard với các khu vực:

| Khu vực | Mô tả |
|---------|-------|
| **Check-in tâm trạng** | Widget nhanh để ghi lại cảm xúc hôm nay |
| **Nhắc nhở PHQ-9** | Banner xuất hiện nếu bạn chưa đánh giá trong 7 ngày qua |
| **Bài tập nhanh** | 3 bài tập gợi ý phù hợp với trạng thái hiện tại |
| **Nút AI Chat** | Bắt đầu cuộc trò chuyện với AI ngay từ dashboard |
| **Nút Tài nguyên khẩn** | Luôn hiển thị — cung cấp đường dây hỗ trợ khủng hoảng |
| **Thanh điều hướng trái** | Truy cập tất cả tính năng |

---

### 3. Trò chuyện AI

**Route:** `/services/chat`

Trò chuyện riêng tư với AI hỗ trợ sức khỏe tâm thần bằng tiếng Việt.

**Cách sử dụng:**
1. Nhấn **"Tin nhắn"** trên thanh sidebar
2. Gõ nội dung vào ô chat → nhấn **Enter** hoặc nút gửi
3. AI trả lời theo kiểu stream (chữ xuất hiện từng từ)
4. Panel **Live Insights** bên phải hiển thị nhận xét tức thì

**Quản lý hội thoại:**
- Mỗi phiên chat là một cuộc hội thoại độc lập
- Lịch sử các cuộc hội thoại hiển thị ở sidebar trái
- Nhấn vào cuộc hội thoại cũ để xem lại

**Giới hạn:**
- **Tài khoản Free:** Giới hạn số tin nhắn mỗi ngày
- **Tài khoản Pro:** Không giới hạn

---

### 4. Tâm trạng hôm nay

**Route:** `/services/mood`

Ghi lại cảm xúc hàng ngày để theo dõi xu hướng theo thời gian.

**Check-in hàng ngày:**
1. Chọn mức độ tâm trạng (thang emoji từ 😞 đến 😄)
2. Chọn mức năng lượng: **Thấp / Trung bình / Cao**
3. Chọn yếu tố ảnh hưởng (giấc ngủ, công việc, các mối quan hệ...)
4. Ghi chú thêm (tuỳ chọn)
5. Nhấn **"Lưu"**

**Xem lịch sử:**
- **Biểu đồ xu hướng** — đường cong tâm trạng theo 7 ngày hoặc 30 ngày
- **Lịch heatmap** — màu sắc thể hiện tâm trạng từng ngày trong tháng
- **Nhận xét AI** — phân tích xu hướng cá nhân sau khi có đủ 7 ngày dữ liệu

---

### 5. Bài tập tâm lý

**Route:** `/services/exercises`

Thư viện bài tập hướng dẫn giúp giảm căng thẳng và lo âu.

**Danh mục bài tập:**
| Danh mục | Mô tả |
|----------|-------|
| **Thở** | Kỹ thuật thở có nhịp điệu (hộp vuông, 4-7-8...) |
| **Thiền định** | Bài tập mindfulness có hướng dẫn |
| **Grounding** | Kỹ thuật 5-4-3-2-1 kết nối với hiện tại |
| **Thư giãn** | Giãn cơ tuần tiến (PMR) |

**Cách thực hiện:**
1. Chọn danh mục hoặc tìm kiếm theo tên
2. Nhấn vào bài tập muốn thực hiện
3. Đọc hướng dẫn và nghe âm thanh kèm theo (nếu có)
4. Thực hiện theo từng bước được hướng dẫn

---

### 6. Âm thanh thư giãn

**Route:** `/services/sounds`

Thư viện âm thanh thiên nhiên và nhạc thiền định.

**Cách sử dụng:**
1. Duyệt danh sách âm thanh theo danh mục
2. Nhấn nút **▶ Phát** để bắt đầu nghe
3. Bật **Lặp lại** để phát liên tục khi tập bài tập hoặc viết nhật ký
4. Điều chỉnh âm lượng trên trình phát

---

### 7. Nhật ký

**Route:** `/services/journal`

Ghi chép cảm xúc và suy nghĩ hàng ngày.

**Viết nhật ký mới:**
1. Nhấn **"Viết mới"** ở góc trên bên phải
2. Nhập tiêu đề (tuỳ chọn) và nội dung
3. Nhật ký tự động lưu nháp sau 2 giây khi đang chỉnh sửa
4. Nhấn **"Lưu nhật ký"** để hoàn tất

**Xem và quản lý:**
- Danh sách nhật ký hiển thị theo thứ tự ngày mới nhất
- Tìm kiếm theo tiêu đề qua ô tìm kiếm
- Nhấn vào nhật ký để đọc đầy đủ
- Nhấn **"Sửa"** để chỉnh sửa · Nhấn **"Xóa"** để xóa (không thể khôi phục)

---

### 8. Ghi chép suy nghĩ (CBT)

**Route:** `/services/thought-records`

Bảng ghi chép theo phương pháp Cognitive Behavioral Therapy (CBT) giúp nhận ra và tái cấu trúc suy nghĩ tiêu cực.

**Cách điền:**
1. **Tình huống** — Điều gì đã xảy ra?
2. **Suy nghĩ tự động** — Suy nghĩ đầu tiên xuất hiện trong đầu là gì?
3. **Loại méo mó nhận thức** — Chọn kiểu suy nghĩ không chính xác (phóng đại, tư duy nhị phân, đọc suy nghĩ...)
4. **Bằng chứng** — Điều gì ủng hộ / phản bác suy nghĩ đó?
5. **Suy nghĩ cân bằng hơn** — Viết lại suy nghĩ theo hướng thực tế hơn

---

### 9. Đánh giá PHQ-9

**Route:** `/services/assessment`

Bảng câu hỏi PHQ-9 chuẩn để đánh giá mức độ trầm cảm (9 câu, thang điểm 0–27).

**Thực hiện đánh giá:**
1. Đọc kỹ từng câu hỏi
2. Chọn tần suất phù hợp: **Không có / Vài ngày / Hơn nửa số ngày / Hầu hết các ngày**
3. Bài làm tự động lưu nháp — có thể thoát và tiếp tục sau
4. Sau khi trả lời đủ 9 câu → nhấn **"Xem kết quả"**

**Kết quả:**
| Điểm | Mức độ |
|------|--------|
| 0–4 | Tối thiểu |
| 5–9 | Nhẹ |
| 10–14 | Trung bình |
| 15–19 | Nặng vừa |
| 20–27 | Nặng |

Kết quả bao gồm mô tả và gợi ý các mục tiêu phù hợp. Lịch sử đánh giá lưu lại để theo dõi tiến triển.

> **Lưu ý:** Đây là công cụ tự kiểm tra, không thay thế chẩn đoán y tế.

---

### 10. Kế hoạch an toàn

**Route:** `/services/safety-plan`

Kế hoạch cá nhân giúp bạn vượt qua những thời điểm khó khăn nhất. Chỉ bạn mới thấy được nội dung này.

**Các mục cần điền:**

| Mục | Mô tả | Ví dụ |
|-----|-------|-------|
| **Dấu hiệu cảnh báo** | Những suy nghĩ/cảm xúc báo hiệu bạn đang gặp khó khăn | Mất ngủ liên tiếp, cảm thấy vô vọng |
| **Hoạt động đối phó** | Việc bạn có thể tự làm để cảm thấy tốt hơn | Đi bộ 15 phút, nghe nhạc |
| **Người tin cậy** | Tên và số điện thoại người có thể gọi | Mẹ — 0901 234 567 |
| **Lý do để sống** | Những điều quan trọng và có ý nghĩa nhất | Gia đình, ước mơ chưa thực hiện |

Nhấn **"Lưu kế hoạch"** / **"Cập nhật kế hoạch"** để lưu.

> Nút **"Tài nguyên khẩn"** trên dashboard cung cấp đường dây hỗ trợ khủng hoảng 24/7 và luôn hiển thị.

---

### 11. Thư viện nội dung

**Route:** `/services/library`

Các bài viết và hướng dẫn về sức khỏe tâm thần được biên tập bởi đội ngũ Vết Lành.

- Duyệt theo chủ đề
- Nhấn vào bài để đọc đầy đủ
- Nội dung cập nhật thường xuyên bởi Admin

---

### 12. Nâng cấp Pro

**Route:** `/services/upgrade`

#### Các gói Pro

| Gói | Giá | Ghi chú |
|-----|-----|---------|
| 1 tháng | 79.000 ₫ | — |
| 3 tháng | 199.000 ₫ | ~66.000 ₫/tháng |
| 6 tháng | 349.000 ₫ | ~58.000 ₫/tháng |
| 1 năm | 599.000 ₫ | Được khuyến nghị |
| Trọn đời | 999.000 ₫ | Phổ biến nhất |

#### Tính năng Pro bao gồm:
- AI Chat không giới hạn
- Hành trình healing cá nhân hoá
- Toàn bộ thư viện bài tập
- Biểu đồ tâm trạng nâng cao
- Lịch sử nhật ký & ghi chép CBT đầy đủ
- Ưu tiên hỗ trợ kỹ thuật

#### Quy trình thanh toán:

1. Chọn gói muốn đăng ký
2. Hệ thống hiển thị mã QR VietQR và thông tin tài khoản ngân hàng
3. Chuyển khoản đúng **số tiền** và **nội dung chuyển khoản** được cung cấp
4. Chụp ảnh màn hình xác nhận chuyển khoản
5. Tải ảnh lên ô **"Bằng chứng thanh toán"** → nhấn **"Gửi yêu cầu"**
6. Chờ Admin xác nhận (thường trong vòng 24 giờ)

> **Quan trọng:** Điền đúng nội dung chuyển khoản để hệ thống tự động khớp giao dịch.

---

### 13. Hồ sơ & Cài đặt

#### Hồ sơ (`/services/profile`)
- Xem trạng thái tài khoản (Free / Pro)
- Ngày hết hạn Pro (nếu có)
- Thông tin tài khoản

#### Cài đặt (`/services/settings`)

**Thông tin cá nhân:**
- Thay đổi **tên hiển thị** — nhấn vào tên, sửa, nhấn **Lưu**
- Upload **ảnh đại diện** — nhấn vào avatar → chọn ảnh (JPG/PNG, tối đa 5MB)

**Bảo mật:**
- **Đổi mật khẩu** — nhập mật khẩu hiện tại + mật khẩu mới → **Lưu**
- **Đổi email** — nhập email mới + mật khẩu hiện tại → hệ thống gửi link xác minh đến email mới → nhấn link → tự động đăng xuất (vì lý do bảo mật)

> **Lưu ý:** Sau khi đổi email thành công, bạn sẽ bị đăng xuất và cần đăng nhập lại bằng email mới.

---

### 14. Chuyển đổi giao diện sáng / tối

Nhấn biểu tượng **☀️/🌙** trên thanh sidebar để chuyển giữa chế độ **Sáng** và **Tối**. Thiết lập được lưu tự động cho lần truy cập sau.

---

---

## Phần 2 — Dành cho Quản trị viên

---

### 1. Đăng nhập Admin

1. Truy cập `/admin` hoặc `/admin/dashboard`
2. Nhập tài khoản admin (cấp bởi nhóm kỹ thuật)
3. Sau khi đăng nhập, chuyển vào Dashboard quản trị

> Admin sử dụng tài khoản riêng biệt, không trùng với tài khoản người dùng thông thường.

---

### 2. Dashboard tổng quan

**Route:** `/admin/dashboard`

Cái nhìn tổng thể về tình trạng hệ thống theo thời gian thực:

| Thẻ thống kê | Mô tả |
|-------------|-------|
| **Tổng người dùng** | Số tài khoản đã đăng ký |
| **Đăng ký đang hoạt động** | Số Pro hiện tại |
| **Doanh thu** | Tổng doanh thu tích lũy |
| **Yêu cầu chờ duyệt** | Số lượng đăng ký Pro chưa xử lý |
| **Báo cáo lỗi** | Lỗi được người dùng gửi gần đây |
| **Biểu đồ hoạt động** | Số đăng ký mới theo từng ngày trong 7 ngày qua |

---

### 3. Quản lý người dùng

**Route:** `/admin/users`

#### Tìm kiếm và xem danh sách:
- Danh sách hiển thị 20 người dùng/trang
- Tìm kiếm theo **tên** hoặc **email** qua ô tìm kiếm
- Mỗi dòng hiển thị: tên, email, loại tài khoản (Email / Google), trạng thái đăng ký (Free / Pro / Hết hạn), ngày đăng ký

#### Xóa người dùng:
1. Tìm người dùng cần xóa
2. Nhấn nút **Xóa** trên dòng đó
3. Xác nhận trong hộp thoại xác nhận
4. Tài khoản và toàn bộ dữ liệu của người dùng bị xóa vĩnh viễn

> **Cảnh báo:** Thao tác xóa không thể hoàn tác.

---

### 4. Quản lý đăng ký Pro

**Route:** `/admin/subscriptions`

Hai tab chính:

#### Tab "Chờ duyệt":
Danh sách yêu cầu nâng cấp Pro chưa được xử lý.

1. Nhấn vào yêu cầu để xem chi tiết: tên người dùng, gói đăng ký, ảnh bằng chứng thanh toán
2. Kiểm tra ảnh chụp màn hình chuyển khoản
3. Nhấn **"Duyệt"** nếu hợp lệ → hệ thống tự động kích hoạt Pro cho người dùng
4. Nhấn **"Từ chối"** nếu không hợp lệ (sai số tiền, sai nội dung...)

#### Tab "Đang hoạt động":
Danh sách tất cả người dùng Pro hiện tại với ngày hết hạn.

---

### 5. Quản lý âm thanh

**Route:** `/admin/sounds`

#### Thêm âm thanh mới:
1. Nhấn **"Thêm âm thanh"**
2. Điền thông tin:
   - **Tiêu đề** âm thanh
   - **Danh mục** (thiên nhiên, nhạc thiền, tiếng trắng...)
   - **Thời lượng** (giây)
3. Nhấn **"Tạo"** → hệ thống tạo bản ghi trong database
4. Nhấn **"Tải file"** trên bản ghi vừa tạo → chọn file âm thanh (MP3/WAV)
5. File upload thẳng lên Cloudinary — chờ hoàn tất

> Hệ thống tự động tạo ID duy nhất cho mỗi âm thanh để tránh xung đột.

#### Quản lý âm thanh hiện có:

| Thao tác | Mô tả |
|----------|-------|
| **Tải lại file** | Thay thế file âm thanh, giữ nguyên metadata |
| **Bật/Tắt hiển thị** | Toggle hiện/ẩn âm thanh với người dùng |
| **Xóa** | Xóa vĩnh viễn âm thanh và file trên Cloudinary |

---

### 6. Quản lý thư viện

**Route:** `/admin/library`

Quản lý nội dung bài viết xuất hiện tại `/services/library`.

#### Thêm bài viết mới:
1. Nhấn **"Thêm bài viết"**
2. Điền: tiêu đề, nội dung, danh mục, ảnh bìa (tuỳ chọn)
3. Nhấn **"Lưu"** để xuất bản ngay hoặc **"Lưu nháp"** để lưu tạm

#### Chỉnh sửa / Xóa:
- Nhấn **"Sửa"** để cập nhật nội dung bài viết
- Nhấn **"Xóa"** để gỡ bài (cần xác nhận)

---

### 7. Báo cáo lỗi

**Route:** `/admin/errors`

Nhật ký báo cáo lỗi do người dùng gửi từ ứng dụng.

**Cột thông tin:**
- Người dùng báo cáo
- Mô tả lỗi
- Mức độ: **CAO / TRUNG BÌNH / THẤP**
- Thời gian báo cáo
- Trạng thái xử lý

**Quy trình xử lý:**
1. Đọc mô tả lỗi và xác định mức độ ưu tiên
2. Điều tra và sửa lỗi theo mức độ CAO → TRUNG BÌNH → THẤP
3. Đánh dấu đã xử lý sau khi hoàn tất

---

## Hỗ trợ & Liên hệ

Nếu gặp vấn đề khi sử dụng, vui lòng:
- Sử dụng nút **"Báo cáo lỗi"** trong ứng dụng
- Email: support@vetlanh.io.vn

---

*Tài liệu này được cập nhật theo từng phiên bản. Phiên bản mới nhất luôn có tại `docs/mamual_vetlanh.md`.*
