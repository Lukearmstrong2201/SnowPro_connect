import "../../styles/StudentDashboard.css";

export default function StudentDashboard() {
  return (
    <>
      <section className="dashboard-container">
        <h3 className="section-title">Personal Information</h3>
        <div className="personal-details-grid">
          <div className="profile-name card">
            <h3>Profile Overview</h3>
            <p>user name</p>
          </div>
          <div className="Date-of-Birth card">
            <h3>Date of Birth</h3>
            <p>DOB</p>
          </div>
          <div className="language card">
            <h3>Language</h3>
            <p>Language</p>
          </div>
          <div className="contact-information card">
            <h3>Contact Information</h3>
            <p>Email Address</p>
            <p>email</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="section-title">Lesson management</h3>
        <div className="lesson-management-grid">
          <div className="upcoming-lessons-section card">
            <h3>Upcoming Lessons</h3>
            <div className="instructor-grid">
              <div>
                <img src="#" />
              </div>
              <div>
                <p> instructor Name</p>
              </div>
              <div>
                <p>lesson Date & time</p>
                <p>Resort Location</p>
                <p>Lesson Status</p>
              </div>
            </div>
          </div>
          <div className="past-lessons-section card">
            <h3>Past lessons</h3>
            <div> map past lessons to this section</div>
          </div>
          <div className="lesson-requests-section card">
            <h3>Lesson requests</h3>
            <div>
              <p>fill this section with instuctor details</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
