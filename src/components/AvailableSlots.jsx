import { useState, useEffect } from "react";
import axios from "axios";

const AvailableSlots = ({ instructorId, date }) => {
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `/api/instructor/${instructorId}/availability`,
          { params: { date } }
        );
        console.log("Available slots response:", response.data); // Log the response data

        // Make sure it's an array before setting state
        if (Array.isArray(response.data)) {
          setAvailableSlots(response.data);
        } else {
          setAvailableSlots([]); // Fallback to an empty array if the data isn't in the correct format
        }
      } catch (error) {
        console.error("Error fetching available slots", error);
        setAvailableSlots([]); // Fallback to an empty array on error
      }
    };

    fetchAvailableSlots();
  }, [instructorId, date]);

  return (
    <div>
      <h3>Available Slots</h3>
      {availableSlots.length > 0 ? (
        availableSlots.map((slot, index) => (
          <div key={index}>
            <span>
              {slot.start_time} - {slot.end_time}
            </span>
            <button
              onClick={() =>
                alert(
                  `Booking slot from ${slot.start_time} to ${slot.end_time}`
                )
              }
            >
              Book
            </button>
          </div>
        ))
      ) : (
        <p>No available slots</p>
      )}
    </div>
  );
};

export default AvailableSlots;
