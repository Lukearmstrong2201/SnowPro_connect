import React, { useState, useEffect } from "react";
import "../styles/Resorts.css";
import { getResortsList, getSkiResortData } from "../services/api";

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

  // Fetch resorts list when the component mounts
  useEffect(() => {
    const fetchResorts = async () => {
      const data = await getResortsList(); // Returns a list of resort objects

      setResortsData(data); // Store full objects
      setResorts(data.map((resort) => resort.name)); // Store only names for search
      setFilteredResorts([]); // Start with an empty list (fix: hide resorts initially)
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

      setGeneralData(data.data || {});
      setLocation(data.location || { latitude: "N/A", longitude: "N/A" });
      setSnowBase(data.conditions?.base ?? "N/A"); // Safe access with default value
      setLifts(data.lifts || { status: "N/A", stats: "N/A" });
    } catch (error) {
      console.error("Error fetching resort details:", error);
      setGeneralData(null);
      setLocation(null);
      setSnowBase("N/A");
      setLifts(null);
    }

    setIsFetching(false);
  };

  return (
    <div className="resorts-container">
      <h2>Choose Your Resort</h2>

      <input
        type="text"
        placeholder="Search for a resort..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

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
          </div>
        </div>
      )}
    </div>
  );
}
