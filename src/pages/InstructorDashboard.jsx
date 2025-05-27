import "../styles/StudentDashboard.css";
import { useState, useEffect } from "react";

export default function InstructorDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedLessons, setAcceptedLessons] = useState([]);

  const mockLessonRequests = [
    {
      id: 1,
      studentName: "Karyn Loney",
      date: "2025-06-01",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Rachael Dawes",
      date: "2025-06-03",
      time: "2:00 PM",
      status: "accepted",
    },
    {
      id: 3,
      studentName: "Harry Tucker",
      date: "2025-05-28",
      time: "1:30 PM",
      status: "rejected",
    },
  ];

  useEffect(() => {
    const pending = mockLessonRequests.filter((r) => r.status === "pending");
    const accepted = mockLessonRequests.filter((r) => r.status === "accepted");
    setPendingRequests(pending);
    setAcceptedLessons(accepted);
  }, []);

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
    // You could store rejected items if needed
  };

  return (
    <>
      <section className="dashboard-container">
        <h3 className="section-title">Instructor Overview</h3>
        <div className="personal-details-grid">
          <div className="card">
            <h3>Profile Summary</h3>
            <p>Luke Armstrong</p>
          </div>
          <div className="card">
            <h3>Certifications</h3>
            <p>CASI – Level 2</p>
          </div>
          <div className="card">
            <h3>Experience</h3>
            <p>5 Years</p>
          </div>
          <div className="card">
            <h3>Contact Info</h3>
            <p>Email: luke@example.com</p>
            <p>Phone: 07572421816</p>
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
    </>
  );
}
