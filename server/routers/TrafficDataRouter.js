const express = require("express");
const router = express.Router();

const apiKey = "eqi3q2O1zlkovRfuMnjXxg3Ev0GAkD5N";

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

router.get("/routedata", async (req, res) => {
  try {
    let sourceAddress = req.body.sourceAddress;
    let destAddress = req.body.destAddress;
    let modeOfTransport = "car";
    let routeData = await getRouteData(
      apiKey,
      sourceCoords,
      destinationCoords,
      modeOfTransport
    );
    res.json(routeData);
    console.log(routeData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
