/* eslint-disable no-restricted-globals */
const FOOD_BANK_POS = [49.28552611515978, -123.11244303386674];
const REST_POS = [
  [49.28393035793476, -123.10523314765034],
  [49.28022112670912, -123.10994323160365],
  [49.27687945236046, -123.11942842320242],
  [49.29175178058913, -123.12747539582053],
  [49.28188085125591, -123.13258708089386],
  [49.288119726242485, -123.1405391737439],
];

const distFromStart = [754, 825, 1362, 1487, 2001, 2653];
const restaurantDistMatrix = [
  [0, 814, 1828, 2242, 2784, 3615],
  [680, 0, 1120, 2061, 2269, 3100],
  [1633, 972, 0, 2658, 1814, 3067],
  [2242, 2173, 2403, 0, 1982, 1262],
  [2799, 2313, 1342, 1610, 0, 1085],
  [3345, 3148, 2176, 1262, 1085, 0],
];

const distance_old = (pt1, pt2) => {
  const [lng1, lat1] = pt1;
  const [lng2, lat2] = pt2;
  if (lat1 === lat2 && lng1 === lng2) {
    return 0;
  }

  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;

  var theta = lng1 - lng2;
  var radtheta = (Math.PI * theta) / 180;

  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  return dist * 60 * 1.1515 * 1.609344;
};

const findIndex = (point) => {
  const [lng, lat] = point;
  for (let i = 0; i < REST_POS.length; i++) {
    if (lng === REST_POS[i][0] && lat === REST_POS[i][1]) {
      return i;
    }
  }
  return -1;
};

const distance = (pt1, pt2) => {
  if (pt1 == FOOD_BANK_POS) {
    return distFromStart[findIndex(pt2)];
  } else if (pt2 == FOOD_BANK_POS) {
    return distFromStart[findIndex(pt1)];
  } else {
    let sourceIndex = findIndex(pt1);
    let destIndex = findIndex(pt2);
    return restaurantDistMatrix[sourceIndex][destIndex];
  }
};

const pathCost = (path) => {
  return path
    .slice(0, -1)
    .map((point, idx) => distance(point, path[idx + 1]))
    .reduce((a, b) => a + b, 0);
};

const counterClockWise = (p, q, r) => {
  return (q[0] - p[0]) * (r[1] - q[1]) < (q[1] - p[1]) * (r[0] - q[0]);
};

const rotateToStartingPoint = (path, startingPoint) => {
  const startIdx = path.findIndex((p) => p === startingPoint);
  path.unshift(...path.splice(startIdx, path.length));
};

const convexHull = (points) => {
  const sp = points[0];

  // Find the "left most point"
  let leftmost = points[0];
  for (const p of points) {
    if (p[1] < leftmost[1]) {
      leftmost = p;
    }
  }

  const path = [leftmost];

  while (true) {
    const curPoint = path[path.length - 1];
    let [selectedIdx, selectedPoint] = [0, null];

    // find the "most counterclockwise" point
    for (let [idx, p] of points.entries()) {
      if (!selectedPoint || counterClockWise(curPoint, p, selectedPoint)) {
        // this point is counterclockwise with respect to the current hull
        // and selected point (e.g. more counterclockwise)
        [selectedIdx, selectedPoint] = [idx, p];
      }
    }

    // adding this to the hull so it's no longer available
    points.splice(selectedIdx, 1);

    // back to the furthest left point, formed a cycle, break
    if (selectedPoint === leftmost) {
      break;
    }

    // add to hull
    path.push(selectedPoint);
  }

  while (points.length > 0) {
    let [bestRatio, bestPointIdx, insertIdx] = [Infinity, null, 0];

    for (let [freeIdx, freePoint] of points.entries()) {
      // for every free point, find the point in the current path
      // that minimizes the cost of adding the path minus the cost of
      // the original segment
      let [bestCost, bestIdx] = [Infinity, 0];
      for (let [pathIdx, pathPoint] of path.entries()) {
        const nextPathPoint = path[(pathIdx + 1) % path.length];

        // the new cost minus the old cost
        const evalCost =
          pathCost([pathPoint, freePoint, nextPathPoint]) -
          pathCost([pathPoint, nextPathPoint]);

        if (evalCost < bestCost) {
          [bestCost, bestIdx] = [evalCost, pathIdx];
        }
      }

      // figure out how "much" more expensive this is with respect to the
      // overall length of the segment
      const nextPoint = path[(bestIdx + 1) % path.length];
      const prevCost = pathCost([path[bestIdx], nextPoint]);
      const newCost = pathCost([path[bestIdx], freePoint, nextPoint]);
      const ratio = newCost / prevCost;

      if (ratio < bestRatio) {
        [bestRatio, bestPointIdx, insertIdx] = [ratio, freeIdx, bestIdx + 1];
      }
    }

    const [nextPoint] = points.splice(bestPointIdx, 1);
    path.splice(insertIdx, 0, nextPoint);
  }

  // rotate the array so that starting point is back first
  rotateToStartingPoint(path, sp);

  // go back home
  // path.push(sp);
  const cost = pathCost(path);

  return path;
  // console.log("Path: ", path);
  // console.log("Cost: ", cost);
};

const threeTrip = () => {
  let path = convexHull(REST_POS.slice());
  let dupPath = path;
  for (let i = 0; i < dupPath.length; i += 4) {
    path.splice(i, 0, FOOD_BANK_POS);
  }
  path.push(FOOD_BANK_POS);
  const cost = pathCost(path);
  console.log(path);
  console.log(cost);
};

threeTrip();
