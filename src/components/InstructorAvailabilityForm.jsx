import React, { useState } from "react";
import axios from "axios";

const InstructorAvailabilityForm = ({ instructorId }) => {
  const [availability, setAvailability] = useState([
    { day_of_week: "Monday", start_time: "09:00", end_time: "17:00" },
    { day_of_week: "Tuesday", start_time: "09:00", end_time: "17:00" },
    { day_of_week: "Wednesday", start_time: "09:00", end_time: "17:00" },
    { day_of_week: "Thursday", start_time: "09:00", end_time: "17:00" },
    { day_of_week: "Friday", start_time: "09:00", end_time: "17:00" },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `/api/instructor/${instructorId}/set-availability`,
        availability
      );
      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Error updating availability", error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newAvailability = [...availability];
    newAvailability[index][name] = value;
    setAvailability(newAvailability);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set Your Weekly Availability</h3>
      {availability.map((slot, index) => (
        <div key={index}>
          <label>{slot.day_of_week}</label>
          <div>
            <label>Start Time: </label>
            <input
              type="time"
              name="start_time"
              value={slot.start_time}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>End Time: </label>
            <input
              type="time"
              name="end_time"
              value={slot.end_time}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
      ))}
      <button type="submit">Set Availability</button>
    </form>
  );
};

export default InstructorAvailabilityForm;
