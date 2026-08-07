# Todo List với hiệu ứng Cursor Trail "Biển Đêm"

Ứng dụng Todo List đơn giản xây dựng bằng React + TypeScript, điểm nhấn là hiệu ứng vệt chuột (cursor trail) lấy cảm hứng từ tông màu "biển đêm" — tím, chàm, xanh dương, xanh ngọc trôi mượt theo chuyển động con trỏ.

## ✨ Tính năng

- **Quản lý công việc**: thêm, đánh dấu hoàn thành, xóa công việc
- **Lưu trữ cục bộ**: danh sách được lưu vào `localStorage`, không mất khi tải lại trang
- **Giao diện tối (dark mode)**: nền gradient tối, hiệu ứng kính mờ (glassmorphism) cho từng item
- **Hiệu ứng Cursor Trail**:
  - Vệt các chấm màu bay theo chuyển động chuột, mờ dần tự nhiên
  - Bảng màu "biển đêm" (tím lavender → chàm → xanh dương → xanh trời → xanh ngọc → xanh lục biển) được nội suy mượt mà theo thời gian thay vì đổi màu ngẫu nhiên giật cục
  - Vòng tròn (ring) bám theo con trỏ có độ trễ (lerp), tự phóng to khi hover vào phần tử tương tác (nút, checkbox, link)

## 🛠️ Công nghệ sử dụng

- [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) cho styling
- Canvas API (`<canvas>` + `requestAnimationFrame`) cho hiệu ứng cursor trail
