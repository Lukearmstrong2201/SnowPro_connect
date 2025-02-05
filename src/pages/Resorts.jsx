import React from "react";
import { useState, useEffect } from "react";
import "../styles/Resorts.css";

//Demo Ski Resort Data (To create and fetch from an API)
const resortData = [
  { id: 1, name: "Whistler Blackcomb", location: "British Columbia, Canada" },
  { id: 2, name: "Aspen Mountain", location: "Colorado, USA" },
  { id: 3, name: "Banff Sunshine", location: "Alberta, Canada" },
  { id: 4, name: "Zermatt", location: "Switzerland" },
  { id: 5, name: "Chamonix", location: "France" },
];

export default function Resort() {
  //state for the search query and filtered resorts
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResorts, setFilteredResorts] = useState(resortData);
  const [selectedResort, setSelectedResort] = useState(null);

  //Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Show dashboard when a resort is selected
  const handleResortSelect = (resort) => {
    setSelectedResort(resort);
  };

  // Filter Resorts based on the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = resortData.filter((resort) =>
        resort.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResorts(filtered);
    }, 500);

    return () => clearTimeout(timer); // Clear the timer on every change
  }, [searchQuery]);

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
              onClick={handleResortSelect}
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
            <div className="grid-item">
              <h4>Snow Base</h4>
              <p>
                This section will show the current snow depth and snow
                conditions at the resort.
              </p>
            </div>
            <div className="grid-item">
              <h4>Lifts Open</h4>
              <p>
                This section will show how many lifts are currently open, and
                their operating hours.
              </p>
            </div>
            <div className="grid-item">
              <h4>Runs Open</h4>
              <p>
                This section will show how many ski runs are open and their
                difficulty levels.
              </p>
            </div>
            <div className="grid-item">
              <h4>Weather</h4>
              <p>
                This section will display the current weather, temperature, and
                snowfall forecast.
              </p>
            </div>
            <div className="grid-item">
              <h4>Lift Queue Times</h4>
              <p>
                This section will show the average wait time for the lifts at
                the resort.
              </p>
            </div>
            <div className="grid-item">
              <h4>Avalanche Risk</h4>
              <p>
                This section will show the current avalanche risk and warnings
                at the resort.
              </p>
            </div>
            <div className="grid-item">
              <h4>Resort Events</h4>
              <p>
                This section will display any upcoming events, competitions, or
                special activities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
