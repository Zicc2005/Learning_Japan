---
name: Japanese Stroke Order Canvas Engine
description: Kiến trúc và thuật toán xây dựng Canvas tập viết nét bút thuận tiếng Nhật (Hiragana, Katakana, Kanji): nhận diện thứ tự nét, so khớp vector hướng, tính điểm chuẩn nét 100%, giả lập cọ mực thư pháp và hỗ trợ lưới Mễ/Điền.
---

# Japanese Stroke Order Canvas Engine

Skill này hướng dẫn chi tiết kiến trúc kỹ thuật Frontend và thuật toán toán học để xây dựng màn hình **Luyện Nét Bút Thuận Chuẩn Xác** (như mẫu giao diện HSK Hán tự chuyên nghiệp).

---

## 1. Bản Chất Kỹ Thuật Của Nét Bút Thuận

Một chữ Hán hoặc chữ Kana tiếng Nhật được tạo thành từ tập hợp $N$ nét có thứ tự nghiêm ngặt:
$$S = \{s_1, s_2, s_3, \dots, s_n\}$$

Mỗi nét $s_i$ không chỉ là một hình vẽ, mà là một **vector đường cong có hướng** (Directed Path) bắt đầu từ toạ độ $P_{start}$ đến $P_{end}$.
* **Quy tắc 1 (Thứ tự):** Người dùng PHẢI viết nét $s_k$ sau khi đã hoàn thành nét $s_{k-1}$. Nếu người dùng cố tình vẽ nét $s_{k+1}$ trước, hệ thống từ chối và cảnh báo rung/âm thanh.
* **Quy tắc 2 (Chiều nét):** Điểm đặt bút phải gần $P_{start}$ của nét hiện tại, và điểm nhấc bút phải kết thúc gần $P_{end}$. Vẽ ngược chiều (vd: nét sổ vẽ từ dưới lên trên) bị coi là SAI.

---

## 2. Thuật Toán So Khớp Nét Vẽ (Stroke Matching Algorithm)

### Bước 1: Chuẩn hóa toạ độ (Normalization)
Chuyển đổi kích thước Canvas của người dùng (vd: $400 \times 400$ px) về hệ toạ độ gốc của bộ dữ liệu SVG (Bounding Box $[0, 0, 200, 200]$ hoặc $[0, 0, 1024, 1024]$):
$$x_{norm} = \frac{x_{user}}{W_{canvas}} \times W_{svg}, \quad y_{norm} = \frac{y_{user}}{H_{canvas}} \times H_{svg}$$

### Bước 2: Lấy mẫu điểm (Point Sampling)
Khi người dùng di chuột hoặc chạm ngón tay (`pointermove`), ghi lại mảng các điểm:
$$U = [(x_0, y_0), (x_1, y_1), \dots, (x_m, y_m)]$$

### Bước 3: So khớp Hướng & Vị trí (Direction & Proximity Check)
Với nét mẫu mong đợi $E$ lấy từ SVG Path:
1. **Kiểm tra điểm bắt đầu:**
   $$d_{start} = \text{Euclidean}(U[0], E[0]) < \text{Threshold}_{radius}$$
2. **Kiểm tra điểm kết thúc:**
   $$d_{end} = \text{Euclidean}(U[m], E[\text{last}]) < \text{Threshold}_{radius}$$
3. **Kiểm tra Vector định hướng chính (Cosine Similarity):**
   $$\vec{v}_{user} = U[m] - U[0], \quad \vec{v}_{expected} = E[\text{last}] - E[0]$$
   $$\cos(\theta) = \frac{\vec{v}_{user} \cdot \vec{v}_{expected}}{\|\vec{v}_{user}\| \|\vec{v}_{expected}\|} > 0.75$$

Nếu cả 3 điều kiện thoả mãn $\rightarrow$ **Nét chính xác!** Cho nét mẫu sáng lên (snap vào nét chuẩn), tăng biến đếm `currentStrokeIndex++`, cập nhật thanh tiến độ nét và tính độ chuẩn xác (Accuracy Score).

---

## 3. Kiến Trúc Giao Diện Chuẩn (UI Components)

Màn hình luyện viết cần bao gồm các khối thành phần sau:
1. **Lưới nền (Grid Overlay):**
   - **Mễ tự cách (米字格):** Gồm 2 đường chéo, 1 đường ngang và 1 đường dọc đứt nét màu hồng phấn/cam nhạt.
   - **Điền tự cách (田字格):** 1 đường ngang và 1 đường dọc chia 4 ô vuông.
   - **Tỉnh tự cách (井字格):** 4 đường chia khung thành 9 ô cân đối.
2. **Bộ chuyển đổi chế độ cọ vẽ (Brush Engine):**
   - **Bút dạ (Felt Pen):** Nét tròn đều (`ctx.lineCap = 'round'`, `ctx.lineWidth = 12`).
   - **Bút lông thư pháp (Calligraphy Brush):** Độ dày nét tỉ lệ nghịch với vận tốc di chuyển chuột (vẽ chậm nét dày, vuốt nhanh nét mảnh nhọn ở đuôi).
3. **Nút "Nét mờ: BẬT / TẮT":**
   - BẬT: Hiển thị mờ các nét SVG chưa vẽ phía dưới nền để học viên đồ theo.
   - TẮT: Nền trống hoàn toàn, buộc học viên phải nhớ thứ tự trong đầu.
4. **Nút "Xem nét mẫu (Auto Replay Animation)":**
   - Tự động chạy animation vẽ từng nét theo đúng thứ tự 1, 2, 3 bằng hiệu ứng `stroke-dashoffset` trên SVG.

---

## 4. Code Mẫu Triển Khai Canvas Luyện Nét Bút (HTML5 / React)

```javascript
// Tính khoảng cách giữa hai toạ độ
export function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Kiểm tra nét vẽ người dùng có khớp với nét mong đợi
export function validateStroke(userPoints, expectedStart, expectedEnd, tolerance = 35) {
  if (userPoints.length < 2) return false;
  const start = userPoints[0];
  const end = userPoints[userPoints.length - 1];
  
  const startValid = distance(start, expectedStart) <= tolerance;
  const endValid = distance(end, expectedEnd) <= tolerance;
  
  return startValid && endValid;
}
```
