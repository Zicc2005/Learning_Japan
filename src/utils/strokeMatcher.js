// Stroke Recognition & Matching Algorithm Engine
// Multi-point Trajectory & Shape Profile Matching

/**
 * Tính khoảng cách Euclidean giữa hai toạ độ
 */
export function euclideanDist(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Trích xuất toạ độ điểm đầu và điểm cuối từ chuỗi SVG path
 */
export function extractStrokeEndpoints(svgPath) {
  if (!svgPath) return { start: { x: 50, y: 50 }, end: { x: 150, y: 150 } };

  // Thử lấy chính xác qua sampleSvgPath nếu có thể
  const sample = sampleSvgPath(svgPath, 2);
  if (sample && sample.points && sample.points.length >= 2) {
    return {
      start: sample.points[0],
      end: sample.points[1]
    };
  }

  // Fallback regex tìm lệnh M (MoveTo)
  const moveMatch = svgPath.match(/M\s*([\d.]+)\s*([\d.]+)/i);
  const start = moveMatch 
    ? { x: parseFloat(moveMatch[1]), y: parseFloat(moveMatch[2]) } 
    : { x: 50, y: 50 };

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
 * Lấy N điểm cách đều theo chiều dài thực tế của SVG path
 * Sử dụng W3C SVGPathElement.getPointAtLength khi chạy trong trình duyệt
 */
export function sampleSvgPath(svgPath, numSamples = 24) {
  if (!svgPath || typeof svgPath !== 'string') return null;

  if (typeof document !== 'undefined') {
    try {
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', svgPath);
      const totalLength = pathEl.getTotalLength();
      if (totalLength && totalLength > 0 && !isNaN(totalLength)) {
        const points = [];
        for (let i = 0; i < numSamples; i++) {
          const dist = (i / (numSamples - 1)) * totalLength;
          const pt = pathEl.getPointAtLength(dist);
          points.push({ x: pt.x, y: pt.y });
        }
        return { points, totalLength };
      }
    } catch (e) {
      // Fallback nếu DOM lỗi hoặc SSR
    }
  }

  return fallbackSampleSvgPath(svgPath, numSamples);
}

/**
 * Fallback phân tích chuỗi SVG Path khi không có SVG DOM
 */
function fallbackSampleSvgPath(svgPath, numSamples = 24) {
  const matches = svgPath.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
  if (!matches) {
    const nums = svgPath.match(/[\d.]+/g);
    if (nums && nums.length >= 4) {
      const p1 = { x: parseFloat(nums[0]), y: parseFloat(nums[1]) };
      const p2 = { x: parseFloat(nums[nums.length - 2]), y: parseFloat(nums[nums.length - 1]) };
      return resamplePointsEquidistant([p1, p2], numSamples);
    }
    return null;
  }

  const polyline = [];
  let current = { x: 0, y: 0 };

  matches.forEach(cmdStr => {
    const type = cmdStr[0];
    const args = cmdStr.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);
    if (type.toUpperCase() === 'M' && args.length >= 2) {
      current = { x: args[0], y: args[1] };
      polyline.push({ ...current });
    } else if (type.toUpperCase() === 'L' && args.length >= 2) {
      current = { x: args[0], y: args[1] };
      polyline.push({ ...current });
    } else if (type.toUpperCase() === 'Q' && args.length >= 4) {
      // Quadratic Bezier approx
      const p0 = { ...current };
      const p1 = { x: args[0], y: args[1] };
      const p2 = { x: args[2], y: args[3] };
      for (let t = 0.2; t <= 1.0; t += 0.2) {
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        polyline.push({ x, y });
      }
      current = p2;
    } else if (type.toUpperCase() === 'C' && args.length >= 6) {
      // Cubic Bezier approx
      const p0 = { ...current };
      const p1 = { x: args[0], y: args[1] };
      const p2 = { x: args[2], y: args[3] };
      const p3 = { x: args[4], y: args[5] };
      for (let t = 0.2; t <= 1.0; t += 0.2) {
        const mt = 1 - t;
        const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
        const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
        polyline.push({ x, y });
      }
      current = p3;
    }
  });

  if (polyline.length < 2) return null;
  return resamplePointsEquidistant(polyline, numSamples);
}

/**
 * Lấy mẫu lại (Resample) chuỗi điểm thành đúng N điểm cách đều nhau theo chiều dài nét vẽ (arc length)
 */
export function resamplePointsEquidistant(points, numSamples = 24) {
  if (!points || points.length === 0) return { points: [], totalLength: 0 };
  if (points.length === 1) {
    return {
      points: Array(numSamples).fill({ ...points[0] }),
      totalLength: 0
    };
  }

  // 1. Tính tổng chiều dài và độ dài tích lũy từng mốc
  const cumDists = [0];
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const d = euclideanDist(points[i - 1], points[i]);
    totalLength += d;
    cumDists.push(totalLength);
  }

  if (totalLength === 0) {
    return {
      points: Array(numSamples).fill({ ...points[0] }),
      totalLength: 0
    };
  }

  // 2. Lấy mẫu tại các mốc khoảng cách đều nhau
  const resampled = [{ x: points[0].x, y: points[0].y }];
  const step = totalLength / (numSamples - 1);
  let curSegment = 0;

  for (let i = 1; i < numSamples - 1; i++) {
    const targetDist = i * step;

    while (curSegment < cumDists.length - 2 && cumDists[curSegment + 1] < targetDist) {
      curSegment++;
    }

    const segStartDist = cumDists[curSegment];
    const segEndDist = cumDists[curSegment + 1];
    const segLen = segEndDist - segStartDist;

    if (segLen === 0) {
      resampled.push({ x: points[curSegment].x, y: points[curSegment].y });
    } else {
      const t = (targetDist - segStartDist) / segLen;
      const p1 = points[curSegment];
      const p2 = points[curSegment + 1];
      resampled.push({
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      });
    }
  }

  const lastPt = points[points.length - 1];
  resampled.push({ x: lastPt.x, y: lastPt.y });

  return { points: resampled, totalLength };
}

/**
 * Chuyển đổi toạ độ vẽ trên Canvas (kích thước thực tế WxH) về hệ toạ độ chuẩn của ký tự
 */
export function normalizeUserPoints(points, canvasWidth, canvasHeight, svgBoxSize = 200) {
  return points.map(p => ({
    x: (p.x / canvasWidth) * svgBoxSize,
    y: (p.y / canvasHeight) * svgBoxSize
  }));
}

/**
 * Thuật toán kiểm tra nét vẽ người dùng đa điểm (Multi-point Trajectory & Shape Profile Matching)
 * @param {Array} userPoints - Mảng các toạ độ {x, y} trên Canvas
 * @param {String} expectedSvgPath - Chuỗi SVG path của nét hiện tại
 * @param {Number} canvasWidth - Chiều rộng Canvas
 * @param {Number} canvasHeight - Chiều cao Canvas
 * @param {Number} svgBoxSize - Kích thước viewBox chuẩn của ký tự (100, 200, hoặc 220)
 * @returns {Object} { isValid: boolean, accuracy: number, reason: string }
 */
export function validateStrokeDrawing(userPoints, expectedSvgPath, canvasWidth, canvasHeight, svgBoxSize = 200) {
  // 1. Kiểm tra dữ liệu đầu vào
  if (!userPoints || userPoints.length < 3) {
    return {
      isValid: false,
      accuracy: 0,
      reason: 'Nét vẽ quá ngắn hoặc chưa chạm bút! Vui lòng viết dứt khoát.'
    };
  }

  // Chuẩn hóa toạ độ người dùng về không gian toạ độ ký tự (svgBoxSize)
  const normPoints = normalizeUserPoints(userPoints, canvasWidth, canvasHeight, svgBoxSize);

  // Tỉ lệ scale so với khung chuẩn 200px
  const scaleRatio = svgBoxSize / 200;
  const N = 24; // Lấy mẫu 24 điểm đều nhau

  // 2. Nội suy chuỗi điểm người dùng thành N = 24 điểm cách đều
  const userSample = resamplePointsEquidistant(normPoints, N);
  const userPts = userSample.points;
  const userTotalLength = userSample.totalLength;

  if (userTotalLength < 8 * scaleRatio) {
    return {
      isValid: false,
      accuracy: 15,
      reason: 'Nét vẽ quá ngắn! Hãy đưa bút liền mạch theo hình dáng nét.'
    };
  }

  // 3. Lấy N = 24 điểm mẫu chuẩn từ SVG Path
  const expectedSample = sampleSvgPath(expectedSvgPath, N);
  if (!expectedSample || !expectedSample.points || expectedSample.points.length < N) {
    // Fallback dự phòng nếu ký tự không có SVG path (bộ thủ tự do)
    return {
      isValid: true,
      accuracy: 96,
      reason: 'Nét vẽ được chấp nhận!'
    };
  }

  const expPts = expectedSample.points;
  const expTotalLength = expectedSample.totalLength;

  const uStart = userPts[0];
  const uEnd = userPts[N - 1];
  const eStart = expPts[0];
  const eEnd = expPts[N - 1];

  // 4. KIỂM TRA DUNG SAI ĐIỂM ĐẦU & ĐIỂM CUỐI (Nới lỏng để viết tự nhiên, không quá khó)
  // startTolerance = 36px, endTolerance = 42px (với khung 200px)
  const startTolerance = 36 * scaleRatio;
  const endTolerance = 42 * scaleRatio;

  const distStart = euclideanDist(uStart, eStart);
  const distEnd = euclideanDist(uEnd, eEnd);

  // 4a. Kiểm tra vẽ ngược chiều nét bút (chỉ bắt khi điểm đầu và cuối bị đảo chiều rất rõ)
  const distReverseStart = euclideanDist(uStart, eEnd);
  const distReverseEnd = euclideanDist(uEnd, eStart);
  if (distReverseStart < 20 * scaleRatio && distStart > 32 * scaleRatio) {
    return {
      isValid: false,
      accuracy: 35,
      reason: 'Bạn đang vẽ ngược chiều nét! Hãy bắt đầu từ vị trí điểm đỏ chỉ dẫn.'
    };
  }

  // 4b. Kiểm tra điểm đặt bút
  if (distStart > startTolerance) {
    return {
      isValid: false,
      accuracy: Math.max(40, Math.round(90 - (distStart / startTolerance) * 35)),
      reason: 'Điểm đặt bút hơi xa điểm bắt đầu. Hãy bắt đầu gần điểm đỏ chỉ dẫn nhé!'
    };
  }

  // 4c. Kiểm tra điểm nhấc bút kết thúc nét
  if (distEnd > endTolerance) {
    return {
      isValid: false,
      accuracy: Math.max(45, Math.round(90 - (distEnd / endTolerance) * 30)),
      reason: 'Điểm dừng bút hơi xa điểm kết thúc nét.'
    };
  }

  // 5. KIỂM TRA CHIỀU DÀI NÉT VẼ (Nới lỏng: 45% - 185%)
  if (expTotalLength > 12 * scaleRatio) {
    const lengthRatio = userTotalLength / expTotalLength;
    if (lengthRatio < 0.45) {
      const pct = Math.round(lengthRatio * 100);
      return {
        isValid: false,
        accuracy: Math.max(40, pct),
        reason: `Nét vẽ còn hơi ngắn (${pct}% so với mẫu). Hãy đưa bút dài hơn chút nhé!`
      };
    }
    if (lengthRatio > 1.85) {
      return {
        isValid: false,
        accuracy: 50,
        reason: 'Nét vẽ bị kéo hơi dài so với nét mẫu. Hãy dừng bút đúng điểm.'
      };
    }
  }

  // 6. NHẬN DIỆN GÓC GẬP & ĐỘ CONG (Corner Detection - Nới rộng dung sai)
  const midIdx = Math.floor(N / 2); // Điểm giữa nét
  const eMid = expPts[midIdx];
  const uMid = userPts[midIdx];

  const vExp1 = { x: eMid.x - eStart.x, y: eMid.y - eStart.y };
  const vExp2 = { x: eEnd.x - eMid.x, y: eEnd.y - eMid.y };
  const magExp1 = Math.hypot(vExp1.x, vExp1.y);
  const magExp2 = Math.hypot(vExp2.x, vExp2.y);

  if (magExp1 > 12 * scaleRatio && magExp2 > 12 * scaleRatio) {
    const dotExp = vExp1.x * vExp2.x + vExp1.y * vExp2.y;
    const cosExp = dotExp / (magExp1 * magExp2);

    // Chỉ kiểm tra khi nét mẫu có góc gập vuông rất rõ ràng (cos < 0.6)
    if (cosExp < 0.60) {
      const vUser1 = { x: uMid.x - uStart.x, y: uMid.y - uStart.y };
      const vUser2 = { x: uEnd.x - uMid.x, y: uEnd.y - uMid.y };
      const magUser1 = Math.hypot(vUser1.x, vUser1.y);
      const magUser2 = Math.hypot(vUser2.x, vUser2.y);

      if (magUser1 > 8 * scaleRatio && magUser2 > 8 * scaleRatio) {
        const dotUser = vUser1.x * vUser2.x + vUser1.y * vUser2.y;
        const cosUser = dotUser / (magUser1 * magUser2);
        const midDist = euclideanDist(uMid, eMid);
        const maxMidAllowed = 34 * scaleRatio;

        // Chỉ bắt lỗi khi người dùng hoàn toàn vẽ thẳng chéo cắt góc (cosUser > 0.95 và lệch tâm lớn)
        if (cosUser > 0.96 && midDist > maxMidAllowed) {
          return {
            isValid: false,
            accuracy: 50,
            reason: 'Nét này có gập góc, hãy uốn cong hoặc gập nét theo mẫu thay vì quẹt chéo nhé!'
          };
        }
      }
    }
  }

  // 7. ĐO ĐỘ LỆCH QUỸ ĐẠO TOÀN NÉT (Nới lỏng để dễ vẽ và mượt mà)
  let sumError = 0;
  let maxError = 0;

  for (let i = 0; i < N; i++) {
    const d = euclideanDist(userPts[i], expPts[i]);
    sumError += d;
    if (d > maxError) maxError = d;
  }

  const meanError = sumError / N;

  // Ngưỡng sai số quỹ đạo trung bình cho phép (32px trên khung 200px, gấp đôi mức cũ)
  const maxAllowedMeanError = 32 * scaleRatio;
  // Ngưỡng sai số cực đại của một điểm bất kỳ (56px trên khung 200px)
  const maxAllowedPeakError = 56 * scaleRatio;

  if (meanError > maxAllowedMeanError) {
    return {
      isValid: false,
      accuracy: Math.max(45, Math.round(100 - (meanError / maxAllowedMeanError) * 40)),
      reason: 'Nét vẽ hơi chệch so với quỹ đạo nét mẫu, hãy thử lại nhé!'
    };
  }

  if (maxError > maxAllowedPeakError) {
    return {
      isValid: false,
      accuracy: Math.max(50, Math.round(100 - (maxError / maxAllowedPeakError) * 35)),
      reason: 'Nét vẽ hơi lệch quỹ đạo, hãy đưa bút theo đường mẫu!'
    };
  }

  // 8. TÍNH ĐỘ CHÍNH XÁC (ACCURACY PERCENTAGE TỪ 82% ĐẾN 100%)
  const normalizedErrorRatio = meanError / maxAllowedMeanError;
  const accuracy = Math.max(
    82,
    Math.min(100, Math.round(100 - normalizedErrorRatio * 18))
  );

  return {
    isValid: true,
    accuracy,
    reason: accuracy >= 94 ? 'Nét vẽ tuyệt đẹp, chuẩn xác!' : 'Nét vẽ rất tốt!'
  };
}
