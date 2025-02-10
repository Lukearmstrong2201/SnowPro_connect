const API_KEY = ""; //Enter
const BASE_URL = "https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort";

export const getSkiResortData = async (resortName) => {
  let formattedResortName = resortName.toLowerCase().replace(/\s+/g, "-");

  let url = `${BASE_URL}/${formattedResortName}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${API_KEY}`,
      "x-rapidapi-host": "ski-resorts-and-conditions.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    //  check if the data exists
    if (!result || !result.data) {
      throw new Error("Invalid response structure from API");
    }

    // Return all the required data as an object
    const data = result.data; // The main resort data (name, country, etc.)
    return {
      data: {
        name: data.name,
        country: data.country,
        region: data.region,
        href: data.href,
      },
      location: data.location, // latitude, longitude
      conditions: data.conditions, // base, season, twelve_hours, twentyfour_hours, fortyeight_hours, seven_days
      lifts: data.lifts, // lifts status and stats
    };
  } catch (error) {
    console.error("Error fetching ski resort data:", error);
    return null;
  }
};
