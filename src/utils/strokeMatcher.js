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
 * Trích xuất các đỉnh (vertices) từ chuỗi SVG path
 */
export function extractPathVertices(svgPath) {
  if (!svgPath || typeof svgPath !== "string") return [];
  const matches = svgPath.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);
  if (!matches) return [];

  const vertices = [];
  let current = { x: 0, y: 0 };

  matches.forEach((cmdStr) => {
    const type = cmdStr[0];
    const args = cmdStr.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);
    if ((type.toUpperCase() === "M" || type.toUpperCase() === "L") && args.length >= 2) {
      current = { x: args[args.length - 2], y: args[args.length - 1] };
      vertices.push({ ...current });
    } else if (type.toUpperCase() === "Q" && args.length >= 4) {
      current = { x: args[2], y: args[3] };
      vertices.push({ ...current });
    } else if (type.toUpperCase() === "C" && args.length >= 6) {
      current = { x: args[4], y: args[5] };
      vertices.push({ ...current });
    }
  });

  return vertices;
}

/**
 * Trích xuất toạ độ điểm đầu và điểm cuối từ chuỗi SVG path
 */
export function extractStrokeEndpoints(svgPath) {
  if (!svgPath) return { start: { x: 50, y: 50 }, end: { x: 150, y: 150 } };

  const vertices = extractPathVertices(svgPath);
  if (vertices.length >= 2) {
    return {
      start: vertices[0],
      end: vertices[vertices.length - 1]
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
 * Trích xuất chỉ dẫn trực quan (Start, End, Các mũi tên hướng vẽ theo đoạn)
 */
export function extractStrokeDirectives(svgPath) {
  if (!svgPath) return null;
  const vertices = extractPathVertices(svgPath);
  if (vertices.length < 2) {
    const endpoints = extractStrokeEndpoints(svgPath);
    return {
      start: endpoints.start,
      end: endpoints.end,
      corners: [],
      arrows: [{ x: (endpoints.start.x + endpoints.end.x) / 2, y: (endpoints.start.y + endpoints.end.y) / 2, icon: "south" }]
    };
  }

  const start = vertices[0];
  const end = vertices[vertices.length - 1];
  const corners = vertices.slice(1, -1);
  const arrows = [];

  for (let i = 0; i < vertices.length - 1; i++) {
    const p1 = vertices[i];
    const p2 = vertices[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    let icon = "east";
    if (Math.abs(dx) > Math.abs(dy) * 1.5) {
      icon = dx > 0 ? "east" : "west";
    } else if (Math.abs(dy) > Math.abs(dx) * 1.5) {
      icon = dy > 0 ? "south" : "north";
    } else {
      if (dx > 0 && dy > 0) icon = "south_east";
      else if (dx < 0 && dy > 0) icon = "south_west";
      else if (dx > 0 && dy < 0) icon = "north_east";
      else icon = "north_west";
    }

    arrows.push({ x: midX, y: midY, icon });
  }

  return { start, end, corners, arrows };
}

/**
 * Lấy N điểm cách đều theo chiều dài thực tế của SVG path
 */
export function sampleSvgPath(svgPath, numSamples = 24) {
  if (!svgPath || typeof svgPath !== "string") return null;

  if (typeof document !== "undefined") {
    try {
      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", svgPath);
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
      // Fallback
    }
  }

  return fallbackSampleSvgPath(svgPath, numSamples);
}

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

  matches.forEach((cmdStr) => {
    const type = cmdStr[0];
    const args = cmdStr.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);
    if (type.toUpperCase() === "M" && args.length >= 2) {
      current = { x: args[0], y: args[1] };
      polyline.push({ ...current });
    } else if (type.toUpperCase() === "L" && args.length >= 2) {
      current = { x: args[0], y: args[1] };
      polyline.push({ ...current });
    } else if (type.toUpperCase() === "Q" && args.length >= 4) {
      const p0 = { ...current };
      const p1 = { x: args[0], y: args[1] };
      const p2 = { x: args[2], y: args[3] };
      for (let t = 0.2; t <= 1.0; t += 0.2) {
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        polyline.push({ x, y });
      }
      current = p2;
    } else if (type.toUpperCase() === "C" && args.length >= 6) {
      const p0 = { ...current };
      const p1 = { x: args[0], y: args[1] };
      const p2 = { x: args[2], y: args[3] };
      const p3 = { x: args[4], y: args[5] };
      for (let t = 0.2; t <= 1.0; t += 0.2) {
        const mt = 1 - t;
        const x =
          mt * mt * mt * p0.x +
          3 * mt * mt * t * p1.x +
          3 * mt * t * t * p2.x +
          t * t * t * p3.x;
        const y =
          mt * mt * mt * p0.y +
          3 * mt * mt * t * p1.y +
          3 * mt * t * t * p2.y +
          t * t * t * p3.y;
        polyline.push({ x, y });
      }
      current = p3;
    }
  });

  if (polyline.length < 2) return null;
  return resamplePointsEquidistant(polyline, numSamples);
}

/**
 * Lấy mẫu lại chuỗi điểm thành đúng N điểm cách đều nhau theo chiều dài nét vẽ
 */
export function resamplePointsEquidistant(points, numSamples = 24) {
  if (!points || points.length === 0) return { points: [], totalLength: 0 };
  if (points.length === 1) {
    return {
      points: Array(numSamples).fill({ ...points[0] }),
      totalLength: 0
    };
  }

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
  return points.map((p) => ({
    x: (p.x / canvasWidth) * svgBoxSize,
    y: (p.y / canvasHeight) * svgBoxSize
  }));
}

/**
 * Thuật toán kiểm tra nét vẽ người dùng đa điểm (Multi-point Trajectory & Shape Profile Matching)
 */
export function validateStrokeDrawing(userPoints, expectedSvgPath, canvasWidth, canvasHeight, svgBoxSize = 200) {
  // 1. Kiểm tra dữ liệu đầu vào
  if (!userPoints || userPoints.length < 3) {
    return {
      isValid: false,
      accuracy: 0,
      reason: "Nét vẽ quá ngắn hoặc chưa chạm bút! Vui lòng viết dứt khoát."
    };
  }

  // Chuẩn hóa toạ độ người dùng về không gian toạ độ ký tự
  const normPoints = normalizeUserPoints(userPoints, canvasWidth, canvasHeight, svgBoxSize);

  // Tỉ lệ scale so với khung chuẩn 200px
  const scaleRatio = svgBoxSize / 200;
  const N = 24;

  // 2. Nội suy chuỗi điểm người dùng thành N = 24 điểm cách đều
  const userSample = resamplePointsEquidistant(normPoints, N);
  const userPts = userSample.points;
  const userTotalLength = userSample.totalLength;

  if (userTotalLength < 6 * scaleRatio) {
    return {
      isValid: false,
      accuracy: 15,
      reason: "Nét vẽ quá ngắn! Hãy đưa bút liền mạch theo hình dáng nét."
    };
  }

  // 3. Lấy N = 24 điểm mẫu chuẩn từ SVG Path
  const expectedSample = sampleSvgPath(expectedSvgPath, N);
  if (!expectedSample || !expectedSample.points || expectedSample.points.length < N) {
    return {
      isValid: true,
      accuracy: 96,
      reason: "Nét vẽ được chấp nhận!"
    };
  }

  const expPts = expectedSample.points;
  const expTotalLength = expectedSample.totalLength;

  const uStart = userPts[0];
  const uEnd = userPts[N - 1];
  const eStart = expPts[0];
  const eEnd = expPts[N - 1];

  // 4. KIỂM TRA DUNG SAI ĐIỂM ĐẦU & ĐIỂM CUỐI (Nới lỏng để phù hợp viết chạm ngón tay và bút cảm ứng)
  const startTolerance = 46 * scaleRatio;
  const endTolerance = 50 * scaleRatio;

  const distStart = euclideanDist(uStart, eStart);
  const distEnd = euclideanDist(uEnd, eEnd);

  // 4a. Kiểm tra vẽ ngược chiều nét bút
  const distReverseStart = euclideanDist(uStart, eEnd);
  if (distReverseStart < 22 * scaleRatio && distStart > 32 * scaleRatio) {
    return {
      isValid: false,
      accuracy: 35,
      reason: "Bạn đang vẽ ngược chiều nét! Hãy bắt đầu từ vị trí điểm đánh số."
    };
  }

  // 4b. Kiểm tra điểm dừng có phải là góc gập bị ngắt quãng không? (Multi-segment corner detection)
  const pathVertices = extractPathVertices(expectedSvgPath);
  if (pathVertices.length > 2) {
    // Có góc gập trung gian (như nét 2 của chữ 日, 口, 田: ngang gập xuống)
    const corners = pathVertices.slice(1, -1);
    for (const corner of corners) {
      const distToCorner = euclideanDist(uEnd, corner);
      if (distToCorner < 26 * scaleRatio) {
        return {
          isValid: false,
          accuracy: 65,
          reason: "💡 Bạn đã vẽ đúng đoạn đầu! Đây là nét gập liền mạch, hãy tiếp tục vuốt xuống dưới không nhấc bút nhé!"
        };
      }
    }
  }

  // 4c. Kiểm tra điểm đặt bút
  if (distStart > startTolerance) {
    return {
      isValid: false,
      accuracy: Math.max(40, Math.round(90 - (distStart / startTolerance) * 35)),
      reason: "Điểm đặt bút hơi xa điểm bắt đầu. Hãy bắt đầu gần vị trí số chỉ dẫn nhé!"
    };
  }

  // 4d. Kiểm tra điểm nhấc bút kết thúc nét
  if (distEnd > endTolerance) {
    return {
      isValid: false,
      accuracy: Math.max(45, Math.round(90 - (distEnd / endTolerance) * 30)),
      reason: "Điểm dừng bút hơi xa điểm kết thúc nét. Hãy vuốt trọn vẹn nét nhé!"
    };
  }

  // 5. KIỂM TRA CHIỀU DÀI NÉT VẼ (Nới lỏng: 40% - 200%)
  if (expTotalLength > 10 * scaleRatio) {
    const lengthRatio = userTotalLength / expTotalLength;
    if (lengthRatio < 0.40) {
      const pct = Math.round(lengthRatio * 100);
      return {
        isValid: false,
        accuracy: Math.max(40, pct),
        reason: `Nét vẽ còn hơi ngắn (${pct}% so với mẫu). Hãy đưa bút dài hơn chút nhé!`
      };
    }
    if (lengthRatio > 2.0) {
      return {
        isValid: false,
        accuracy: 50,
        reason: "Nét vẽ bị kéo hơi dài so với nét mẫu. Hãy dừng bút đúng điểm."
      };
    }
  }

  // 6. NHẬN DIỆN GÓC GẬP & ĐỘ CONG
  const midIdx = Math.floor(N / 2);
  const eMid = expPts[midIdx];
  const uMid = userPts[midIdx];

  const vExp1 = { x: eMid.x - eStart.x, y: eMid.y - eStart.y };
  const vExp2 = { x: eEnd.x - eMid.x, y: eEnd.y - eMid.y };
  const magExp1 = Math.hypot(vExp1.x, vExp1.y);
  const magExp2 = Math.hypot(vExp2.x, vExp2.y);

  if (magExp1 > 12 * scaleRatio && magExp2 > 12 * scaleRatio) {
    const dotExp = vExp1.x * vExp2.x + vExp1.y * vExp2.y;
    const cosExp = dotExp / (magExp1 * magExp2);

    if (cosExp < 0.60) {
      const vUser1 = { x: uMid.x - uStart.x, y: uMid.y - uStart.y };
      const vUser2 = { x: uEnd.x - uMid.x, y: uEnd.y - uMid.y };
      const magUser1 = Math.hypot(vUser1.x, vUser1.y);
      const magUser2 = Math.hypot(vUser2.x, vUser2.y);

      if (magUser1 > 8 * scaleRatio && magUser2 > 8 * scaleRatio) {
        const dotUser = vUser1.x * vUser2.x + vUser1.y * vUser2.y;
        const cosUser = dotUser / (magUser1 * magUser2);
        const midDist = euclideanDist(uMid, eMid);
        const maxMidAllowed = 38 * scaleRatio;

        if (cosUser > 0.97 && midDist > maxMidAllowed) {
          return {
            isValid: false,
            accuracy: 50,
            reason: "Nét này có gập góc, hãy uốn hoặc gập nét theo mẫu thay vì quẹt chéo nhé!"
          };
        }
      }
    }
  }

  // 7. ĐO ĐỘ LỆCH QUỸ ĐẠO TOÀN NÉT
  let sumError = 0;
  let maxError = 0;

  for (let i = 0; i < N; i++) {
    const d = euclideanDist(userPts[i], expPts[i]);
    sumError += d;
    if (d > maxError) maxError = d;
  }

  const meanError = sumError / N;
  const maxAllowedMeanError = 36 * scaleRatio;
  const maxAllowedPeakError = 64 * scaleRatio;

  if (meanError > maxAllowedMeanError) {
    return {
      isValid: false,
      accuracy: Math.max(45, Math.round(100 - (meanError / maxAllowedMeanError) * 40)),
      reason: "Nét vẽ hơi chệch so với quỹ đạo nét mẫu, hãy thử lại nhé!"
    };
  }

  if (maxError > maxAllowedPeakError) {
    return {
      isValid: false,
      accuracy: Math.max(50, Math.round(100 - (maxError / maxAllowedPeakError) * 35)),
      reason: "Nét vẽ hơi lệch quỹ đạo, hãy đưa bút theo đường mẫu!"
    };
  }

  // 8. TÍNH ĐỘ CHÍNH XÁC
  const normalizedErrorRatio = meanError / maxAllowedMeanError;
  const accuracy = Math.max(
    85,
    Math.min(100, Math.round(100 - normalizedErrorRatio * 15))
  );

  return {
    isValid: true,
    accuracy,
    reason: accuracy >= 94 ? "Nét vẽ tuyệt đẹp, chuẩn xác!" : "Nét vẽ rất tốt!"
  };
}
