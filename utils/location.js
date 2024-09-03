/**
 * Fetches road information including distance and driving time from the restaurant to a specified destination.
 *
 * @param {string} destination - The destination address to which the distance and driving time should be calculated.
 * @returns {Promise<{ distanceKm: number, timeToDriveMinutes: number }>}
 * An object containing:
 * - `distanceKm`: The distance from the restaurant to the destination in kilometers.
 * - `timeToDriveMinutes`: The estimated driving time in minutes.
 * @throws {Error} If there is an issue with the API request or response.
 */
const getRoadInfo = async (destination) => {
  // Construct the URL for the Google Maps Distance Matrix API request.
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json
?destinations=${destination}
&origins=${process.env.RESTAURANT_ADDRESS}
&units=imperial
&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  // - `destination`: The destination address to calculate the distance to.
  // - `process.env.RESTAURANT_ADDRESS`: The origin address, fetched from environment variables.
  // - `process.env.GOOGLE_MAPS_API_KEY`: The API key for accessing Google Maps services, stored in environment variables.

  try {
    const response = await fetch(url);
    // Send the API request to the constructed URL and wait for the response.

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
      // If the response is not OK (e.g., status code is not 200), throw an error with the status code.
    }

    const json = await response.json();

    if (json.status !== "OK") {
      throw new Error(`Response status: ${response.status}`);
    }

    const roadData = json.rows[0].elements[0];

    const distanceKm = roadData.distance.value / 1000;
    const timeToDriveMinutes = Math.ceil(roadData.duration.value / 60);

    return { distanceKm, timeToDriveMinutes };
  } catch (err) {
    throw new Error(err.message);
  }
};

export default getRoadInfo;
