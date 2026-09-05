// Stroke Recognition & Matching Algorithm Engine

/**
 * Tính khoảng cách Euclidean giữa hai toạ độ
 */
export function euclideanDist(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Trích xuất toạ độ điểm đầu và điểm cuối từ chuỗi SVG path
 * Hỗ trợ các lệnh SVG cơ bản: M x y, L x y, Q cx cy x y
 */
export function extractStrokeEndpoints(svgPath) {
  if (!svgPath) return { start: { x: 50, y: 50 }, end: { x: 150, y: 150 } };

  // Tìm lệnh M (MoveTo)
  const moveMatch = svgPath.match(/M\s*([\d.]+)\s*([\d.]+)/i);
  const start = moveMatch 
    ? { x: parseFloat(moveMatch[1]), y: parseFloat(moveMatch[2]) } 
    : { x: 50, y: 50 };

  // Tìm điểm cuối cùng trong path
  const allNumbers = svgPath.match(/[\d.]+/g);
  let end = { x: 150, y: 150 };
  if (allNumbers && allNumbers.length >= 2) {
    end = {
      x: parseFloat(allNumbers[allNumbers.length - 2]),
      y: parseFloat(allNumbers[allNumbers.length - 1])
    };
  }

  return { start, end };
}

/**
 * Chuyển đổi toạ độ vẽ trên Canvas (kích thước thực tế WxH) về hệ toạ độ chuẩn SVG 200x200
 */
export function normalizeUserPoints(points, canvasWidth, canvasHeight, svgBoxSize = 200) {
  return points.map(p => ({
    x: (p.x / canvasWidth) * svgBoxSize,
    y: (p.y / canvasHeight) * svgBoxSize
  }));
}

/**
 * Kiểm tra xem nét vẽ người dùng có khớp với nét mong đợi của ký tự không
 * @param {Array} userPoints - Mảng các toạ độ {x, y} trên Canvas
 * @param {String} expectedSvgPath - Chuỗi SVG path của nét hiện tại
 * @param {Number} canvasWidth - Chiều rộng Canvas
 * @param {Number} canvasHeight - Chiều cao Canvas
 * @returns {Object} { isValid: boolean, accuracy: number, reason: string }
 */
export function validateStrokeDrawing(userPoints, expectedSvgPath, canvasWidth, canvasHeight, svgBoxSize = 200) {
  if (!userPoints || userPoints.length < 3) {
    return {
      isValid: false,
      accuracy: 0,
      reason: 'Nét vẽ quá ngắn! Vui lòng viết dứt khoát.'
    };
  }

  // Chuẩn hóa toạ độ người dùng về hệ toạ độ của ký tự (100 hoặc 220)
  const normPoints = normalizeUserPoints(userPoints, canvasWidth, canvasHeight, svgBoxSize);
  const userStart = normPoints[0];
  const userEnd = normPoints[normPoints.length - 1];

  // Lấy điểm mẫu mong đợi
  const { start: expStart, end: expEnd } = extractStrokeEndpoints(expectedSvgPath);

  // 1. Kiểm tra độ dài nét vẽ tối thiểu (scale theo boxSize)
  const scaleRatio = svgBoxSize / 200;
  const strokeLength = euclideanDist(userStart, userEnd);
  if (strokeLength < 8 * scaleRatio) {
    return {
      isValid: false,
      accuracy: 20,
      reason: 'Nét vẽ chưa đủ độ dài, hãy đưa bút theo hình dáng nét.'
    };
  }

  // 2. Tính sai số điểm đặt bút và điểm kết thúc (scale theo boxSize)
  const startTolerance = 48 * scaleRatio;
  const endTolerance = 52 * scaleRatio;
  const distStart = euclideanDist(userStart, expStart);
  const distEnd = euclideanDist(userEnd, expEnd);

  // Kiểm tra vẽ ngược chiều (Start gần ExpEnd và End gần ExpStart)
  const distReverseStart = euclideanDist(userStart, expEnd);
  const distReverseEnd = euclideanDist(userEnd, expStart);
  if (distReverseStart < distStart && distReverseEnd < distEnd) {
    return {
      isValid: false,
      accuracy: 30,
      reason: 'Bạn đang vẽ NGƯỢC CHIỀU nét bút! Hãy bắt đầu từ điểm đỏ chỉ dẫn.'
    };
  }

  // 3. Kiểm tra định hướng vector
  const vUser = { x: userEnd.x - userStart.x, y: userEnd.y - userStart.y };
  const vExp = { x: expEnd.x - expStart.x, y: expEnd.y - expStart.y };
  const dotProd = vUser.x * vExp.x + vUser.y * vExp.y;
  const magUser = Math.hypot(vUser.x, vUser.y);
  const magExp = Math.hypot(vExp.x, vExp.y);

  let cosTheta = 1;
  if (magUser > 0 && magExp > 0) {
    cosTheta = dotProd / (magUser * magExp);
  }

  // Nếu góc lệch quá lớn (> 90 độ, tức cosTheta < -0.2)
  if (cosTheta < -0.2 && magExp > 15 * scaleRatio) {
    return {
      isValid: false,
      accuracy: 40,
      reason: 'Hướng nét vẽ bị lệch quá nhiều so với nét chuẩn.'
    };
  }

  // Đánh giá thành công nếu điểm đầu & điểm cuối nằm trong phạm vi cho phép
  const isStartNear = distStart <= startTolerance;
  const isEndNear = distEnd <= endTolerance;

  // Tính điểm chuẩn nét (Accuracy percentage từ 75% đến 100%)
  const avgError = (distStart + distEnd) / 2;
  const accuracy = Math.max(70, Math.min(100, Math.round(100 - avgError * 0.4)));

  if (isStartNear && isEndNear) {
    return {
      isValid: true,
      accuracy,
      reason: 'Nét vẽ rất chuẩn xác!'
    };
  }

  // Nới lỏng nhẹ nếu nét người dùng vẽ theo đúng hướng vector và độ dài tương thích
  if (cosTheta > 0.65 && strokeLength > 20 && distStart <= startTolerance * 1.3) {
    return {
      isValid: true,
      accuracy: Math.max(75, accuracy),
      reason: 'Nét vẽ được chấp nhận!'
    };
  }

  return {
    isValid: false,
    accuracy: Math.max(30, accuracy),
    reason: `Điểm đặt bút hoặc điểm nhấc bút chưa đúng vị trí nét mẫu.`
  };
}
