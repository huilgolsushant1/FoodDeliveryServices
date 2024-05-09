const express = require("express");
const { distinct } = require("rxjs");

const apiKey = "eqi3q2O1zlkovRfuMnjXxg3Ev0GAkD5N";

//Main Function
async function selectModeOfTransport(data, orderItesm, isDelicate) {
  try {
    let orderQuantity = orderItesm.length;
    let distance = data.distance / 1000;
    let modeOfTransport = "bike";
    let hasDelayInOrder = flase;
    let pathLenth = data.path.length;
    let sourceCoords = `${data.path[0][0]},${data.path[0][1]}`;
    let destinationCoords = `${data.path[pathLenth - 1][0]},${
      data.path[pathLenth - 1][1]
    }`;

    let weatherCondition = getWeatherData(destinationCoords);
    let car = await getRouteData(
      apiKey,
      sourceCoords,
      destinationCoords,
      "car"
    );

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
      if (
        (distance >= 6 && orderQuantity > 3 && checkRidersAvailibilty("car")) ||
        isDelicate
      ) {
        modeOfTransport = "car";
      } else if (
        (weatherCondition === "rainy" || weatherCondition === "sunny") &&
        distance >= 4 &&
        distance <= 6 &&
        orderQuantity <= 3 &&
        checkRidersAvailibilty("bike")
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

    return modeOfTransport;
  } catch (error) {
    console.log("Error to determine the mode of transport: ", error);
  }
}

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
async function getTotalRouteTimeforMultipleRoutes(pathArrays, modeOfTransport) {
  for (let i = 0; i < pathArrays.length; i++) {
    let coordinates = sliceAtSpecificCount(pathArrays[i].path);
    let fastestMode = null;
    let shortestTravelTime = Infinity;
    try {
      let totalTravelTime = 0;

      for (let j = 0; j < coordinates.length - 1; j++) {
        const sourceCoords = `${coordinates[j][0]},${coordinates[j][1]}`;
        const destinationCoords = `${coordinates[j + 1][0]},${
          coordinates[j + 1][1]
        }`;
        const routeUrl = `https://api.tomtom.com/routing/1/calculateRoute/${sourceCoords}:${destinationCoords}/json?key=${apiKey}&traffic=true&computeTravelTimeFor=all&routeType=fastest&language=en&instructionsType=tagged&travelMode=${modeOfTransport}`;
        console.log(routeUrl);
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
      pathArrays[i].totalTravelTime = totalTravelTime;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
    let shortestPath;
    pathArrays.forEach((route) => {
      console.log(route.totalTravelTime);
      const travelTime = route.totalTravelTime;
      if (travelTime < shortestTravelTime) {
        shortestPath = route;
      }
    });
    console.log("hi");
    console.log(shortestPath);
    return shortestPath;
  }
}

//Function to check the availibilty of rider for selected mode of transport
async function checkRidersAvailibilty(modeOfTransport) {
  try {
    const db = client.db("FoodDeliveryService");
    const collection = db.collection("riders");
    const riders = await collection
      .find({ vehicleType: modeOfTransport, status: "available" })
      .toArray();
    if (riders.length != 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking for riders availibilty: ", error);
  }
}

//Function to get the weather data
async function getWeatherData(location) {
  try {
    const apiKey = "f5b7ac4a88014420b2e163532240705";
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    const conditionText = weatherData.current.condition.text.toLowerCase();
    let weatherCategory;

    if (conditionText.includes("rain") || conditionText.includes("drizzle")) {
      weatherCategory = "rainy";
    } else if (
      conditionText.includes("snow") ||
      conditionText.includes("sleet")
    ) {
      weatherCategory = "snowy";
    } else {
      weatherCategory = "sunny";
    }

    console.log(weatherCategory);
    return weatherCategory;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

module.exports = { getTotalRouteTimeforMultipleRoutes, selectModeOfTransport };
