import React, { useEffect, useState } from "react";
import { getResortsList } from "../services/api";
import "../styles/Booking.css";
import InstructorCard from "../components/InstructorCard";

export default function Booking() {
  const [resorts, setResorts] = useState([]);
  const [selectedResort, setSelectedResort] = useState("");
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    async function fetchResorts() {
      const data = await getResortsList();
      setResorts(data);
    }

    fetchResorts();
  }, []);

  useEffect(() => {
    if (!selectedResort) return;

    async function fetchInstructors() {
      try {
        const response = await fetch(
          `/instructors?resort=${encodeURIComponent(selectedResort)}`
        );
        if (!response.ok) throw new Error("Failed to fetch instructors");
        const data = await response.json();
        setInstructors(data);
      } catch (err) {
        console.error("Instructor fetch error:", err);
        setInstructors([]);
      }
    }

    fetchInstructors();
  }, [selectedResort]);

  return (
    <div className="booking-container">
      <h2>Select Your Ski Resort</h2>

      <select
        value={selectedResort}
        onChange={(e) => setSelectedResort(e.target.value)}
        className="resort-select"
      >
        <option value="">-- Choose a Resort --</option>
        {resorts.map((resort) => (
          <option key={resort.id} value={resort.name}>
            {resort.name}
          </option>
        ))}
      </select>

      {selectedResort && (
        <>
          <h3 className="instructor-title">
            Available Instructors at {selectedResort}
          </h3>
          {instructors.length === 0 ? (
            <p>No instructors found for this resort.</p>
          ) : (
            <div className="instructor-list">
              {instructors.map((inst) => (
                <InstructorCard
                  key={inst.id}
                  instructor={inst}
                  onSelect={(instructor) =>
                    console.log("Request lesson for:", instructor)
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
