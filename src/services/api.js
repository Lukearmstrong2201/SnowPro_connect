const API_KEY = "62f0873bb4msh3cea61075dcbf82p114512jsn86cf70f5e42d";
const BASE_URL = "https://ski-resorts-and-conditions.p.rapidapi.com/v1";

// Fetch the list of resorts
export const getResortsList = async () => {
  const url = `${BASE_URL}/resort`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": "ski-resorts-and-conditions.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    return result.data.map((resort) => ({
      id: resort.id || Math.random().toString(36).substr(2, 9), // Assign random ID if missing
      name: resort.name || "Unknown Resort",
      location: resort.location || "Location not available",
    }));
  } catch (error) {
    console.error("Error fetching resorts list:", error);
    return [];
  }
};

// Fetch ski resort data by name
export const getSkiResortData = async (resortName) => {
  // Properly format resort name for API request
  let formattedResortName = encodeURIComponent(
    resortName.toLowerCase().replace(/\s+/g, "-")
  );

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

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (!result || !result.data) {
      throw new Error("Invalid response structure from API");
    }

    const data = result.data;

    return {
      data: {
        name: data.name || "Unknown",
        country: data.country || "Unknown",
        region: data.region || "Unknown",
        href: data.href || "#",
      },
      location: data.location || { latitude: "N/A", longitude: "N/A" },
      conditions: data.conditions || {
        base: "N/A",
        season: "N/A",
        snowfall: "N/A",
      },
      lifts: data.lifts || { status: "N/A", stats: "N/A" },
    };
  } catch (error) {
    console.error("Error fetching ski resort data:", error);
    return { error: true, message: error.message };
  }
};
