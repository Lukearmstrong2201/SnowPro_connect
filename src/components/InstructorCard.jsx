import "../styles/InstructorCard.css";

export default function InstructorCard({ instructor, onSelect }) {
  return (
    <div className="instructor-card">
      <img
        src={
          instructor.profile_picture?.startsWith("/static")
            ? `http://localhost:8000${instructor.profile_picture}`
            : instructor.profile_picture
            ? `http://localhost:8000/uploads/${instructor.profile_picture}`
            : defaultProfile
        }
        alt={`${instructor.first_name}'s profile`}
        className="profile-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultProfile;
        }}
      />
      <h3>
        {instructor.first_name} {instructor.last_name}
      </h3>
      <p>
        <strong>Certification:</strong> {instructor.certificate_body} - Level{" "}
        {instructor.level_of_qualification}
      </p>
      <p>
        <strong>Experience:</strong> {instructor.years_of_experience} years
      </p>
      <p>
        <strong>Resort:</strong> {instructor.local_resort}
      </p>
      <button className="select-button" onClick={() => onSelect(instructor)}>
        Request Lesson
      </button>
    </div>
  );
}
