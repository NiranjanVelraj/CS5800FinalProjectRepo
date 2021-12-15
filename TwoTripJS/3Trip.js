/* eslint-disable no-restricted-globals */
const FOOD_BANK_POS = [0, 0];
const REST_POS = [
  [1.5, 4.5],
  [3.3, 3.1],
  [3.5, 1.0],
  [2.5, -1.0],
  [3.2, -3.0],
  [2.0, -4.0],
  [0.8, -3.0],
  [-1.5, -4.0],
  [-3.5, -2.0],
  [-4.0, 1.0],
  [-1.8, 1.5],
  [-2.5, 3.5],
];

const distance = (point1, point2) => {
  let dist = Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
  return dist;
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
  let path = convexHull(REST_POS);
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
