// API Key and base URL
const API_KEY = "62f0873bb4msh3cea61075dcbf82p114512jsn86cf70f5e42d";
const BASE_URL = "https://ski-resorts-and-conditions.p.rapidapi.com/v1";

// Fetch the list of resorts
export const getResortsList = async () => {
  const url = `${BASE_URL}/resort`; // API endpoint to get the list of resorts
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "ski-resorts-and-conditions.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result; // Assuming the result is an array of resorts
  } catch (error) {
    console.error("Error fetching resorts list:", error);
    return []; // Return an empty array if an error occurs
  }
};

// Fetch the details for a specific resort
export const getSkiResortData = async (resortName) => {
  // Format the resort name into the correct format for the URL
  let formattedResortName = resortName.toLowerCase().replace(/\s+/g, "-");

  const url = `${BASE_URL}/resort/${formattedResortName}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "ski-resorts-and-conditions.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    // Check if the result data exists
    if (!result || !result.data) {
      throw new Error("Invalid response structure from API");
    }

    const data = result.data;
    return {
      data: {
        name: data.name,
        country: data.country,
        region: data.region,
        href: data.href,
      },
      location: data.location, // latitude, longitude
      conditions: data.conditions, // base, season, snowfall
      lifts: data.lifts, // lifts status and stats
    };
  } catch (error) {
    console.error("Error fetching ski resort data:", error);
    return null; // Return null in case of an error
  }
};
