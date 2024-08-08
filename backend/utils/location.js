async function getDistance(destination) {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    console.log(API_KEY);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json
?destinations=${destination}
&origins=Київ, Ніжинська 29
&units=imperial
&key=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (json.status === "OK") {
            return json.rows[0].elements[0];
        }
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

export default getDistance;
