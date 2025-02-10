import React, { useState, useEffect } from "react";
import "../styles/Resorts.css";
import { getSkiResortData } from "../services/api";

// Demo Ski Resort Data
const resortData = [
  { id: 1, name: "Whistler Blackcomb", location: "British Columbia, Canada" },
  { id: 2, name: "Aspen Mountain", location: "Colorado, USA" },
  { id: 3, name: "Banff Sunshine", location: "Alberta, Canada" },
  { id: 4, name: "Zermatt", location: "Switzerland" },
  { id: 5, name: "Chamonix", location: "France" },
];

export default function Resort() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResorts, setFilteredResorts] = useState(resortData);
  const [selectedResort, setSelectedResort] = useState(null);
  const [snowBase, setSnowBase] = useState(null);
  const [location, setLocation] = useState(null);
  const [lifts, setLifts] = useState(null);
  const [generalData, setGeneralData] = useState(null);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter resorts based on the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = resortData.filter((resort) =>
        resort.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResorts(filtered);
    }, 500);

    return () => clearTimeout(timer); // Clear the timer on every change
  }, [searchQuery]);

  // Show dashboard when a resort is selected
  const handleResortSelect = async (resort) => {
    if (selectedResort?.name === resort.name) return; // Avoid API call if the same resort is selected again
    setSelectedResort(resort);

    // Fetch all data for the selected resort
    const data = await getSkiResortData(resort.name);

    if (data) {
      setGeneralData(data.data); // Set general data (name, country, region)
      setLocation(data.location); // Set location data (latitude, longitude)
      setSnowBase(data.conditions.base); // Set snow base
      setLifts(data.lifts); // Set lifts status and stats
    }
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
