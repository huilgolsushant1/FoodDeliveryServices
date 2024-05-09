const express = require("express");

const apiKey = "eqi3q2O1zlkovRfuMnjXxg3Ev0GAkD5N";
const sourceCoords = "18.968555507998804,72.83261687709988";
const destinationCoords = "18.962280011567497,72.83195284427188";

// TC 1
const weatherCondition = "rainy";
const distance = 10;
const orderQuantity = 2;
const isDelicate = false;

//Calling of main function
selectModeOfTransport(weatherCondition, distance, orderQuantity, isDelicate);

//Function to get the Routes Data from Tom-Tom's Route API
async function getRouteData(
  apiKey,
  sourceCoords,
  destinationCoords,
  modeOfTransport
) {
  try {
    const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${sourceCoords}:${destinationCoords}/json?key=${apiKey}&traffic=true&computeTravelTimeFor=all&routeType=fastest&language=en&instructionsType=tagged&travelMode=${modeOfTransport}`;

    const routeResponse = await fetch(routeUrl);
    return await routeResponse.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

//Function to get fastest mode of trasport
function getFastestTransportMode(routesData) {
  let fastestMode = null;
  let shortestTravelTime = Infinity;
  routesData.forEach((route) => {
    const travelTime = route?.routes[0]["summary"].travelTimeInSeconds;
    if (travelTime < shortestTravelTime) {
      shortestTravelTime = travelTime;
      fastestMode = route;
    }
  });

  return fastestMode?.routes[0]["sections"][0].travelMode;
}

//Function to get the Traffic Density
function calculateTrafficDensity(trafficData) {
  const actualTravelTime = trafficData.routes[0]["summary"].travelTimeInSeconds;
  const noTrafficTravelTime =
    trafficData.routes[0]["summary"].noTrafficTravelTimeInSeconds;

  const trafficRatio = actualTravelTime / noTrafficTravelTime;

  const lowDensityThreshold = 1.2;
  const mediumDensityThreshold = 1.5;

  if (trafficRatio < lowDensityThreshold) {
    return "Low";
  } else if (
    trafficRatio >= lowDensityThreshold &&
    trafficRatio < mediumDensityThreshold
  ) {
    return "Medium";
  } else {
    return "High";
  }
}

//Main Function
async function selectModeOfTransport(
  weatherCondition,
  distance,
  orderQuantity,
  isDelicate
) {
  let modeOfTransport = "bike";
  let hasDelayInOrder = true;

  let car = await getRouteData(apiKey, sourceCoords, destinationCoords, "car");

  let bike = await getRouteData(
    apiKey,
    sourceCoords,
    destinationCoords,
    "motorcycle"
  );

  let bicycle = await getRouteData(
    apiKey,
    sourceCoords,
    destinationCoords,
    "bicycle"
  );

  let routesData = [car, bike];

  if (!hasDelayInOrder) {
    if ((distance >= 6 && orderQuantity > 3) || isDelicate) {
      modeOfTransport = "car";
    } else if (
      (weatherCondition === "rainy" || weatherCondition === "sunny") &&
      distance >= 4 &&
      distance <= 6 &&
      orderQuantity <= 3
    ) {
      modeOfTransport = "bike";
    } else if (
      (weatherCondition === "rainy" || weatherCondition === "sunny") &&
      distance < 3 &&
      orderQuantity <= 2
    ) {
      modeOfTransport = "bicycle";
    } else if (orderQuantity <= 3 && distance >= 5) {
      modeOfTransport = getFastestTransportMode(routesData);
      if (modeOfTransport === "motorcycle") {
        modeOfTransport = "bike";
      }
    } else {
      modeOfTransport = "car";
    }
  } else {
    if (distance >= 3 && !isDelicate) {
      modeOfTransport = getFastestTransportMode(routesData);
      if (modeOfTransport === "motorcycle") {
        modeOfTransport = "bike";
      }
    } else {
      modeOfTransport = "car";
    }
  }

  console.log(modeOfTransport);
  return modeOfTransport;
}

//Function to shorten the array of coordinates
function sliceAtSpecificCount(array) {
  const count = Math.ceil(array.length / 10);
  let result = [];
  result.push(array[0]);
  for (let i = count - 1; i < array.length - 1; i += count) {
    result.push(array[i]);
  }
  result.push(array[array.length - 1]);
  return result;
}

//This function will return the fastest routes coordinates
async function getTotalRouteTimeforMultipleRoutes(
  pathArrays,
  modeOfTransport
) {
  let shortestTravelTime = Infinity;
  let shortestPath;

  for (let i = 0; i < pathArrays.length; i++) {
    let coordinates = sliceAtSpecificCount(pathArrays[i].path);
    let fastestMode = null;
    try {
      let totalTravelTime = 0;

      for (let j = 0; j < coordinates.length - 1; j++) {
        const sourceCoords = `${coordinates[j][0]},${coordinates[j][1]}`;
        const destinationCoords = `${coordinates[j + 1][0]},${
          coordinates[j + 1][1]
        }`;
        const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${sourceCoords}:${destinationCoords}/json?key=${apiKey}&traffic=true&computeTravelTimeFor=all&routeType=fastest&language=en&instructionsType=tagged&travelMode=${modeOfTransport}`;
        const routeResponse = await fetch(routeUrl);
        const trafficData = await routeResponse.json();
        
        if (
          trafficData &&
          trafficData.routes &&
          trafficData.routes.length > 0
        ) {
          const actualTravelTime =
            trafficData.routes[0]["summary"].travelTimeInSeconds;
          totalTravelTime += actualTravelTime;
        }
      }
      console.log("Travel Time:"+totalTravelTime)
      pathArrays[i].totalTravelTime = totalTravelTime;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
    // pathArrays.forEach((route) => {
    //   const travelTime = route.totalTravelTime;
    //   if (travelTime < shortestTravelTime) {
    //     shortestPath=route;
    //   }
    // });
  }
 
    return pathArrays;
}


module.exports = { getTotalRouteTimeforMultipleRoutes, selectModeOfTransport };