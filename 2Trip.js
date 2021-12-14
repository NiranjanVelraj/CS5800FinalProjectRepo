let blossom = require("./AdditionalFiles/edmonds-blossom");
const MAX_DISTANCE = 10000;
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

function findDistance(point1, point2) {
  let dist = Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
  return dist;
}

function getInputPoints() {
  let points = REST_POS;
  let newData = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let edge = [i, j, MAX_DISTANCE - findDistance(points[i], points[j])];
      newData.push(edge);
    }
  }
  return newData;
}

function findOptimalMatching() {
  let data = getInputPoints();
  let results = blossom(data);
  console.log(results);
  return results;
}

function distanceFromOrigin() {
  let totalDistance = 0;
  REST_POS.forEach((position) => {
    totalDistance = totalDistance + findDistance(FOOD_BANK_POS, position);
  });
  return totalDistance;
}

function distanceForOptimalMatch() {
  let optimalMatch = findOptimalMatching();
  let totalDistance = 0;
  for (let i = 0; i < optimalMatch.length; i++) {
    totalDistance =
      totalDistance + findDistance(REST_POS[i], REST_POS[optimalMatch[i]]);
  }
  return totalDistance / 2;
}

function computeTotalDistance() {
  let dist1 = distanceFromOrigin();
  let dist2 = distanceForOptimalMatch();
  return dist1 + dist2;
}

console.log(computeTotalDistance());
