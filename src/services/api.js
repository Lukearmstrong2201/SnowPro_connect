const API_KEY = "10249de295msh286762ddd8dd817p10df24jsn84a15d6b41d0";
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
    const data = await data.json();
    return data.conditions;
  } catch (error) {
    console.error("Error fetching ski resort data:", error);
  }
};

export const getSkiResort = async () => {
  const response = await fetch(url, options);
  const data = await data.json();
  return data;
};
getSkiResort();
