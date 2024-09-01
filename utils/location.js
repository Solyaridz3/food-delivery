const getRoadInfo = async (destination) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
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
        if (json.status !== "OK") {
            throw new Error(`Response status: ${response.status}`);
        }

        const roadData = json.rows[0].elements[0];

        const distanceKm = roadData.distance.value / 1000;
        const timeToDriveMinutes = Math.ceil(roadData.duration.value / 60);

        return {distanceKm, timeToDriveMinutes};
    } catch (error) {
        console.error(error.message);
    }
};

export default getRoadInfo;
