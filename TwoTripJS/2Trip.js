let blossom = require("./AdditionalFiles/edmonds-blossom");
const MAX_DISTANCE = 10000;
const FOOD_BANK_POS = [0, 0];

const distFromStart = [754, 825, 1362, 1487, 2001, 2653];
const restaurantDistMatrix = [
  [0, 814, 1828, 2242, 2784, 3615],
  [680, 0, 1120, 2061, 2269, 3100],
  [1633, 972, 0, 2658, 1814, 3067],
  [2242, 2173, 2403, 0, 1982, 1262],
  [2799, 2313, 1342, 1610, 0, 1085],
  [3345, 3148, 2176, 1262, 1085, 0],
];

function findDistance(point1, point2) {
  let dist = Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
  return dist;
}

function getInputPoints() {
  let noOfRestaurants = distFromStart.length;
  let newData = [];
  for (let i = 0; i < noOfRestaurants; i++) {
    for (let j = i + 1; j < noOfRestaurants; j++) {
      let edge = [i, j, MAX_DISTANCE - restaurantDistMatrix[i][j]];
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
  distFromStart.forEach((distance) => {
    totalDistance = totalDistance + distance;
  });
  return totalDistance;
}

function distanceForOptimalMatch() {
  let optimalMatch = findOptimalMatching();
  let totalDistance = 0;
  for (let i = 0; i < optimalMatch.length; i++) {
    totalDistance = totalDistance + restaurantDistMatrix[i][optimalMatch[i]];
  }
  return totalDistance / 2;
}

function computeTotalDistance() {
  let dist1 = distanceFromOrigin();
  let dist2 = distanceForOptimalMatch();
  return dist1 + dist2;
}

console.log(computeTotalDistance());
