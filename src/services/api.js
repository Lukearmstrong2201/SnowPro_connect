const API_KEY = "Enter RapidApi API Key"; //Enter 
const BASE_URL = "https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort";
let url = `${BASE_URL}/whistler-blackcomb`; //STATE NEEDS LIFTING FROM RESORTS PAGE (Replace Resort with formatted string)

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": `${API_KEY}`,
    "x-rapidapi-host": "ski-resorts-and-conditions.p.rapidapi.com",
  },
};

//object properties are: base, season, twelve_hours, twentyfour_hours, fortyeight_hours (integers represent cm)
export const getSkiResortConditions = async () => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error fetching ski resort data:", error);
  }
};
