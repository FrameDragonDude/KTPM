# Product Management System - Frontend

## Cấu trúc Frontend

```
frontend/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── index.css
    ├── App.js
    ├── App.css
    ├── setupTests.js
    ├── components/
    │   ├── ProductList.jsx
    │   ├── ProductForm.jsx
    │   └── ProductDetail.jsx
    ├── services/
    │   └── productService.js
    └── __tests__/
        └── integration/
            ├── ProductList.integration.test.js
            ├── ProductForm.integration.test.js
            └── ProductDetail.integration.test.js
```

## Cài đặt và Chạy

### Cài đặt dependencies:
```bash
cd frontend
npm install
```

### Chạy ứng dụng:
```bash
npm start
```

### Chạy tests:
```bash
npm test
```

### Chạy tests với coverage:
```bash
npm run test:ci
```

## Components

### 1. ProductList
- Hiển thị danh sách sản phẩm từ API
- Chức năng xóa sản phẩm
- Loading và error states

### 2. ProductForm
- Tạo sản phẩm mới
- Cập nhật sản phẩm
- Validation (name >= 3 chars, price > 0, quantity >= 0)
- Loading và error handling

### 3. ProductDetail
- Hiển thị chi tiết sản phẩm theo ID
- Loading và error states

## Integration Tests

### ProductList Tests (6 tests):
1. ✅ Tạo sản phẩm mới thành công
2. ✅ Hiển thị loading khi đang tải dữ liệu
3. ✅ Hiển thị thông báo lỗi khi API thất bại
4. ✅ Hiển thị thông báo khi không có sản phẩm
5. ✅ Xóa sản phẩm thành công
6. ✅ Hủy xóa sản phẩm khi người dùng không xác nhận

### ProductForm Tests (7 tests):
1. ✅ Tạo sản phẩm mới với dữ liệu hợp lệ
2. ✅ Cập nhật sản phẩm đã tồn tại
3. ✅ Hiển thị lỗi validation khi tên quá ngắn
4. ✅ Hiển thị lỗi validation khi giá không hợp lệ
5. ✅ Hiển thị lỗi validation khi số lượng âm
6. ✅ Hiển thị thông báo lỗi khi API thất bại
7. ✅ Hiển thị loading khi đang tải sản phẩm để chỉnh sửa

### ProductDetail Tests (6 tests):
1. ✅ Hiển thị chi tiết sản phẩm thành công
2. ✅ Hiển thị loading khi đang tải dữ liệu
3. ✅ Hiển thị thông báo lỗi khi API thất bại
4. ✅ Hiển thị thông báo khi không có product ID
5. ✅ Hiển thị N/A khi description null
6. ✅ Reload khi productId thay đổi

**Tổng cộng: 19 frontend integration tests**
