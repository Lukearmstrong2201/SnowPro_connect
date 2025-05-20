import React, { useState, useEffect } from "react";
import "../styles/Resorts.css";
import { getResortsList, getSkiResortData } from "../services/api";
import { fetchWeatherForecast } from "../services/weatherService";

export default function Resort() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resortsData, setResortsData] = useState([]); // Store full resort objects
  const [resorts, setResorts] = useState([]); // Store just names for search
  const [filteredResorts, setFilteredResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);
  const [snowBase, setSnowBase] = useState(null);
  const [location, setLocation] = useState(null);
  const [lifts, setLifts] = useState(null);
  const [generalData, setGeneralData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState([]);

  // Fetch resorts list when the component mounts
  useEffect(() => {
    const fetchResorts = async () => {
      const data = await getResortsList(); // Returns a list of resort objects

      setResortsData(data); // Store full objects
      setResorts(data.map((resort) => resort.name)); // Store only names for search
      setFilteredResorts([]); // Start with an empty list
    };

    fetchResorts();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter resorts based on the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResorts([]); // Show nothing if search bar is empty
      setSelectedResort(null); // Reset resort details when search bar is cleared
    } else {
      const filtered = resorts.filter((resort) =>
        resort.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResorts(filtered);
    }
  }, [searchQuery, resorts]);

  // Show dashboard when a resort is selected
  const handleResortSelect = async (resortName) => {
    if (isFetching) return; // Prevent multiple fetches

    // Find the full resort object based on the name
    const fullResort = resortsData.find((resort) => resort.name === resortName);

    if (!fullResort) {
      console.error("Resort not found in the list:", resortName);
      return;
    }

    setSelectedResort(fullResort);
    setFilteredResorts([resortName]);
    setIsFetching(true);

    try {
      // Fetch all data for the selected resort
      const data = await getSkiResortData(fullResort.name);

      if (!data || data.error) {
        console.error(
          "Failed to fetch resort details:",
          data ? data.message : "Unknown error"
        );
        setGeneralData(null);
        setLocation(null);
        setSnowBase("N/A");
        setLifts(null);
        setIsFetching(false);
        return;
      }
      console.log("Conditions Object:", data.conditions);
      setGeneralData(data.data || {});
      setLocation(data.location || { latitude: "N/A", longitude: "N/A" });
      setSnowBase(data.conditions?.base ?? "N/A"); // Safe access with default value
      setLifts({
        status: data.lifts?.status ?? {},
        stats: data.lifts?.stats ?? {},
      });

      const weatherData = await fetchWeatherForecast(
        data.location.latitude,
        data.location.longitude
      );
      console.log("5-day forecast:", weatherData);
    } catch (error) {
      console.error("Error fetching resort details:", error);
      setGeneralData(null);
      setLocation(null);
      setSnowBase("N/A");
      setLifts(null);
    }

    setIsFetching(false);
  };

  const findNearestResort = () => {
    alert(
      "Feature coming soon! We’ll use your location to find the best resorts nearby!"
    );
  };

  return (
    <div className="resorts-container">
      <div className="resorts-hero-section">
        <h1>Choose Your Perfect Ski Resort</h1>
        <p>
          Search for the best ski resorts and book with top local instructors!
        </p>
      </div>

      <input
        type="text"
        placeholder="Search for a resort..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <button
        className="find-nearest-resort-button"
        onClick={findNearestResort}
      >
        Find Nearest Resort
      </button>

      <div className="resorts-list">
        {filteredResorts.length > 0 ? (
          filteredResorts.map((resortName) => (
            <div
              key={resortName}
              className="resort-item"
              onClick={() => handleResortSelect(resortName)}
            >
              <h3>{resortName}</h3>
            </div>
          ))
        ) : searchQuery ? ( // Show "No resorts found" only if user has typed something
          <p>No resorts found</p>
        ) : null}
      </div>

      {selectedResort && (
        <div className="resort-dashboard">
          <h3>{selectedResort.name} - Resort Information</h3>

          <div className="grid-container">
            <div className="grid-item">
              <h4>General Data</h4>
              {generalData ? (
                <div>
                  <p>Name: {generalData.name || "N/A"}</p>
                  <p>Country: {generalData.country || "N/A"}</p>
                  <p>Region: {generalData.region || "N/A"}</p>
                  <p>
                    <a
                      href={generalData.href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resort Website
                    </a>
                  </p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            <div className="grid-item">
              <h4>Location</h4>
              {location ? (
                <div>
                  <p>Latitude: {location.latitude || "N/A"}</p>
                  <p>Longitude: {location.longitude || "N/A"}</p>
                </div>
              ) : (
                <p>Loading location data...</p>
              )}
            </div>

            <div className="grid-item">
              <h4>Snow Base</h4>
              <p>
                {snowBase !== "N/A" ? `${snowBase} cm` : "Data not available"}
              </p>
            </div>
            <div className="grid-item">
              <h4>Lift Status</h4>
              {lifts?.status && Object.keys(lifts.status).length > 0 ? (
                <div className="lift-status-container">
                  {Object.entries(lifts.status).map(
                    ([liftName, liftStatus]) => (
                      <div key={liftName} className="lift-status-item">
                        <span
                          className={`status-circle ${
                            liftStatus.toLowerCase() === "open"
                              ? "open"
                              : "closed"
                          }`}
                        ></span>
                        <strong>{liftName}</strong>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>No lift status data available.</p>
              )}
            </div>

            {/* Lift Statistics */}
            <div className="grid-item">
              <h4>Lift Statistics</h4>
              {lifts?.stats ? (
                <div>
                  <p>
                    <strong>Open:</strong> {lifts.stats.open ?? "N/A"}
                  </p>
                  <p>
                    <strong>On Hold:</strong> {lifts.stats.hold ?? "N/A"}
                  </p>
                  <p>
                    <strong>Scheduled:</strong> {lifts.stats.scheduled ?? "N/A"}
                  </p>
                  <p>
                    <strong>Closed:</strong> {lifts.stats.closed ?? "N/A"}
                  </p>
                </div>
              ) : (
                <p>No lift statistics available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
