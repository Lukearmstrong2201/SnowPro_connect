import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/InstructorDashboard.css";

import StarRating from "../../components/icons/StarRating";
import ResortBadge from "../../components/icons/ResortBadge";
import CertificateBadge from "../../components/icons/CertificateBadge";

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8000/instructors/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setInstructor(res.data);
      } catch (err) {
        console.error("Failed to load instructor data", err);
      }
    };

    fetchInstructor();
  }, []);

  if (!instructor) return <div>Loading...</div>;

  // Temporary rating until DB field exists
  const rating = 4.8;

  return (
    <div className="instructor-dashboard">
      <div className="welcome-section">
        <div className="welcome-content">
          {/* LEFT SIDE */}
          <div className="welcome-left">
            {/* Greeting row: "Welcome back," + name */}
            <div className="welcome-greeting-row">
              <p className="welcome-sub">Welcome back,</p>
              <h1 className="welcome-name">{instructor.first_name}</h1>
            </div>

            {/* Certificate + Star Rating */}
            <div className="badge-row">
              <CertificateBadge level={instructor.level_of_qualification} />

              <div className="rating-row">
                <StarRating rating={rating} />
                <span className="rating-value">{rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="welcome-right">
            <ResortBadge resortName={instructor.local_resort} />
          </div>
        </div>
      </div>
    </div>
  );
}
