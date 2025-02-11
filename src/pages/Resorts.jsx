import React, { useState, useEffect } from "react";
import "../styles/Resorts.css";
import { getResortsList, getSkiResortData } from "../services/api";

export default function Resort() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resorts, setResorts] = useState([]);
  const [filteredResorts, setFilteredResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState(null);
  const [snowBase, setSnowBase] = useState(null);
  const [location, setLocation] = useState(null);
  const [lifts, setLifts] = useState(null);
  const [generalData, setGeneralData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch the list of resorts from the API when the component mounts
  useEffect(() => {
    const fetchResorts = async () => {
      const data = await getResortsList();
      setResorts(data); // Set fetched resorts data
      setFilteredResorts(data); // Set filtered resorts initially
    };

    fetchResorts();
  }, []);

  // Handle search input change to filter resorts
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter resorts based on the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = resorts.filter((resort) =>
        resort.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResorts(filtered);
    }, 500);

    return () => clearTimeout(timer); // Clear the timer on every change
  }, [searchQuery, resorts]);

  // Show dashboard when a resort is selected
  const handleResortSelect = async (resort) => {
    if (selectedResort?.name === resort.name || isFetching) return; // Avoid unnecessary requests and if already fetching
    setSelectedResort(resort);
    setIsFetching(true);

    // Fetch all data for the selected resort
    const data = await getSkiResortData(resort.name);

    if (data) {
      setGeneralData(data.data); // Set general data (name, country, region)
      setLocation(data.location); // Set location data (latitude, longitude)
      setSnowBase(data.conditions.base); // Set snow base
      setLifts(data.lifts); // Set lifts status and stats
    }

    setIsFetching(false); // Reset fetching state
  };

  return (
    <div className="resorts-container">
      <h2> Choose your Resort</h2>

      <input
        type="text"
        placeholder="Search for a resort..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <div className="resorts-list">
        {filteredResorts.length > 0 ? (
          filteredResorts.map((resort) => (
            <div
              key={resort.id}
              className="resort-item"
              onClick={() => handleResortSelect(resort)} // Fetch data on resort click
            >
              <h3>{resort.name}</h3>
              <p>{resort.location}</p>
            </div>
          ))
        ) : (
          <p>No resorts found</p>
        )}
      </div>

      {selectedResort && (
        <div className="resort-dashboard">
          <h3>{selectedResort.name} - Resort Information</h3>

          <div className="grid-container">
            {/* General Data */}
            <div className="grid-item">
              <h4>General Data</h4>
              {generalData ? (
                <div>
                  <p>Name: {generalData.name}</p>
                  <p>Country: {generalData.country}</p>
                  <p>Region: {generalData.region}</p>
                  <p>
                    <a
                      href={generalData.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Resort Website
                    </a>
                  </p>
                </div>
              ) : (
                <p>Loading general data...</p>
              )}
            </div>

            {/* Location Data */}
            <div className="grid-item">
              <h4>Location</h4>
              {location ? (
                <div>
                  <p>Latitude: {location.latitude}</p>
                  <p>Longitude: {location.longitude}</p>
                </div>
              ) : (
                <p>Loading location data...</p>
              )}
            </div>

            {/* Snow Base */}
            <div className="grid-item">
              <h4>Snow Base</h4>
              {snowBase !== null ? (
                <p>{snowBase} cm</p>
              ) : (
                <p>Loading snow base data...</p>
              )}
            </div>

            {/* Lifts Data */}
            <div className="grid-item">
              <h4>Lifts</h4>
              {lifts ? (
                <div>
                  <p>Status: {lifts.status}</p>
                  <p>Stats: {lifts.stats}</p>
                </div>
              ) : (
                <p>Loading lifts data...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
