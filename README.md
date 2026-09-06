# Todo List "Biển Đêm" — Trình quản lý công việc thực tế

Ứng dụng quản lý công việc (task manager) đầy đủ tính năng, xây dựng bằng React 19 + TypeScript + Tailwind CSS v4. Điểm nhấn giao diện là hiệu ứng vệt chuột (cursor trail) tông màu "biển đêm" — tím, chàm, xanh dương, xanh ngọc trôi mượt theo con trỏ.

## ✨ Tính năng

### Quản lý công việc
- **Thêm / sửa / xóa / hoàn thành** công việc
- **Sửa nhanh**: nhấp đúp vào công việc để chỉnh sửa toàn bộ thông tin
- **Mức độ ưu tiên**: Cao / Trung bình / Thấp (viền màu bên trái mỗi thẻ)
- **Danh mục**: Cá nhân, Công việc, Học tập, Mua sắm, Sức khỏe... (tự sinh màu ổn định theo tên)
- **Hạn chót (due date)**: hiển thị thân thiện "Hôm nay / Ngày mai / Còn N ngày / Quá hạn N ngày"
- **Ghi chú** cho từng công việc (thu gọn / mở rộng)

### Tìm kiếm, lọc & sắp xếp
- **Tìm kiếm** theo nội dung và ghi chú
- **Lọc theo trạng thái**: Tất cả / Đang làm / Hoàn thành / Quá hạn
- **Lọc theo danh mục**
- **Sắp xếp**: Mới nhất / Theo hạn chót / Theo ưu tiên / Theo bảng chữ cái

### Thống kê & thao tác hàng loạt
- **Bảng thống kê**: tổng số, đã hoàn thành, đến hạn hôm nay, quá hạn
- **Thanh tiến độ** theo % hoàn thành
- **Chọn / bỏ chọn tất cả**, **xóa toàn bộ việc đã hoàn thành**

### Dữ liệu
- **Lưu trữ cục bộ** qua `localStorage` (tự động migrate dữ liệu từ phiên bản cũ)
- **Sao lưu / khôi phục**: xuất và nhập dữ liệu dưới dạng file JSON

### Giao diện
- Dark mode nền gradient tối, hiệu ứng kính mờ (glassmorphism)
- Responsive cho cả điện thoại và máy tính
- **Hiệu ứng Cursor Trail** "biển đêm": vệt chấm màu nội suy mượt, vòng tròn bám con trỏ có độ trễ và phóng to khi hover

## 🛠️ Công nghệ sử dụng

- [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) cho styling
- [Vite](https://vite.dev/) cho dev/build
- Canvas API (`<canvas>` + `requestAnimationFrame`) cho hiệu ứng cursor trail

## 🚀 Chạy dự án

```bash
npm install
npm run dev      # chạy dev server
npm run build    # build production
npm run lint     # kiểm tra lint
```

## 📁 Cấu trúc

```
src/
  App.tsx                 # màn hình chính, lọc/sắp xếp/bulk action/export-import
  useTodos.ts             # hook quản lý state + localStorage + migrate
  types.ts                # kiểu dữ liệu (Todo, Priority, Filter, Sort...)
  utils.ts                # tiện ích: ưu tiên, màu danh mục, định dạng hạn chót
  MouseTrail.tsx          # hiệu ứng cursor trail
  components/
    StatsBar.tsx          # thống kê + thanh tiến độ
    AddTodoForm.tsx       # form thêm công việc (mở rộng)
    Toolbar.tsx           # tìm kiếm + tab trạng thái + lọc + sắp xếp
    TodoItem.tsx          # từng thẻ công việc + sửa inline
```

## Demo
https://todo-list-pdp.vercel.app/
