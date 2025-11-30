import "../../styles/StudentDashboard.css";
import { useState, useEffect } from "react";
import InstructorAvailabilityForm from "../../components/InstructorAvailabilityForm";
import AvailableSlots from "../../components/AvailableSlots";
import axios from "axios";

export default function InstructorDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedLessons, setAcceptedLessons] = useState([]);
  const [instructorData, setInstructorData] = useState(null); // For storing instructor profile info
  const [selectedDay, setSelectedDay] = useState(null); // Track selected day for availability
  const [availability, setAvailability] = useState({
    Monday: { start_time: "", end_time: "" },
    Tuesday: { start_time: "", end_time: "" },
    Wednesday: { start_time: "", end_time: "" },
    Thursday: { start_time: "", end_time: "" },
    Friday: { start_time: "", end_time: "" },
    Saturday: { start_time: "", end_time: "" },
    Sunday: { start_time: "", end_time: "" },
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date

  const instructorId = 1; // This should come from your auth/user state

  // Fetch data for pending requests, accepted lessons, and instructor details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonRequestsResponse = await axios.get(
          `/api/instructor/${instructorId}/lesson-requests`
        );
        const pending = lessonRequestsResponse.data.filter(
          (r) => r.status === "pending"
        );
        const accepted = lessonRequestsResponse.data.filter(
          (r) => r.status === "accepted"
        );

        setPendingRequests(pending);
        setAcceptedLessons(accepted);

        const instructorProfileResponse = await axios.get(
          `/api/instructor/${instructorId}`
        );
        setInstructorData(instructorProfileResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [instructorId]);

  // Handle availability time changes for the selected day
  const handleTimeChange = (day, type, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  // Handle day selection (e.g., Monday, Tuesday, etc.)
  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleAccept = (id) => {
    const request = pendingRequests.find((r) => r.id === id);
    if (request) {
      request.status = "accepted";
      setPendingRequests((prev) => prev.filter((r) => r.id !== id));
      setAcceptedLessons((prev) => [...prev, request]);
    }
  };

  const handleReject = (id) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Submit the availability
  const handleSubmitAvailability = async () => {
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

  return (
    <>
      <section className="dashboard-container">
        <h3 className="section-title">Instructor Overview</h3>
        <div className="personal-details-grid">
          <div className="card">
            <h3>Profile Summary</h3>
            {instructorData ? (
              <p>
                {instructorData.first_name} {instructorData.last_name}
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="card">
            <h3>Certifications</h3>
            {instructorData ? (
              <p>
                {instructorData.certification_body} – Level{" "}
                {instructorData.level_of_qualification}
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="card">
            <h3>Experience</h3>
            {instructorData ? (
              <p>{instructorData.years_of_experience} Years</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="card">
            <h3>Contact Info</h3>
            {instructorData ? (
              <>
                <p>Email: {instructorData.email}</p>
                <p>Phone: {instructorData.contact}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h3 className="section-title">Lesson Requests</h3>
        <div className="lesson-management-grid">
          {/* INCOMING REQUESTS */}
          <div className="incoming-requests-section card">
            <h3>Incoming Requests</h3>
            {pendingRequests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="lesson-request-card">
                  <div className="lesson-card-header">
                    <span className="student-name">{request.studentName}</span>
                    <span className={`status-dot ${request.status}`}></span>
                  </div>
                  <p>
                    {request.date} @ {request.time}
                  </p>
                  <p>
                    <strong>Requested Resort:</strong> {request.ski_resort}
                  </p>
                  <p className="lesson-status">Status: {request.status}</p>
                  <div className="request-buttons">
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </button>
                    <button className="profile-btn">View Student</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SCHEDULED LESSONS */}
          <div className="lesson-schedule-section card">
            <h3>Lesson Schedule</h3>
            {acceptedLessons.length === 0 ? (
              <p>No scheduled lessons yet.</p>
            ) : (
              acceptedLessons.map((lesson) => (
                <div key={lesson.id} className="lesson-request-card">
                  <div className="lesson-card-header">
                    <span className="student-name">{lesson.studentName}</span>
                    <span className={`status-dot accepted`}></span>
                  </div>
                  <p>
                    {lesson.date} @ {lesson.time}
                  </p>
                  <p className="lesson-status">Status: Accepted</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Manage Instructor Availability */}
      <section>
        <h3 className="section-title">Set Weekly Availability</h3>
        <div className="days-buttons">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <button
              key={day}
              className={`day-btn ${selectedDay === day ? "selected" : ""}`}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </button>
          ))}
        </div>

        {selectedDay && (
          <div className="availability-form">
            <h4>{selectedDay} Availability</h4>
            <label>
              Start Time:
              <input
                type="time"
                value={availability[selectedDay]?.start_time || ""}
                onChange={(e) =>
                  handleTimeChange(selectedDay, "start_time", e.target.value)
                }
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={availability[selectedDay]?.end_time || ""}
                onChange={(e) =>
                  handleTimeChange(selectedDay, "end_time", e.target.value)
                }
              />
            </label>
          </div>
        )}
        <button className="submit-btn" onClick={handleSubmitAvailability}>
          Submit Availability
        </button>
      </section>
    </>
  );
}
