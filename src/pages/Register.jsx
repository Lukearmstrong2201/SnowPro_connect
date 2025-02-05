import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import "../styles/Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  // Instructor-specific fields
  const [instructorName, setInstructorName] = useState("");
  const [instructorContact, setInstructorContact] = useState("");
  const [certificateBody, setCertificateBody] = useState("");
  const [qualificationLevel, setQualificationLevel] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [experience, setExperience] = useState("");
  const [language, setLanguage] = useState("");

  // Student-specific fields
  const [studentName, setStudentName] = useState("");
  const [studentDob, setStudentDob] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentLanguage, setStudentLanguage] = useState("");
  const [studentContact, setStudentContact] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const registrationData = {
      email,
      password,
      role,
      ...(role === "instructor" && {
        name: instructorName,
        contactNumber: instructorContact,
        certificateBody,
        qualificationLevel,
        address,
        dateOfBirth,
        experience,
        language,
      }),
      ...(role === "student" && {
        name: studentName,
        dob: studentDob,
        address: studentAddress,
        language: studentLanguage,
        contactNumber: studentContact,
      }),
    };

    console.log("Registering:", registrationData);

    // Handle API registration logic (TO COMPLETE)
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <div className="register-section">
        <h1 className="register-title">Create an Account</h1>
        <p className="form-description">
          Register as a Student or Instructor to access the platform
        </p>
        <form onSubmit={handleRegister}>
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />

          <SelectField
            id="role"
            label="Select your role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "student", label: "Student" },
              { value: "instructor", label: "Instructor" },
            ]}
          />

          {/* Instructor-specific fields */}
          {role === "instructor" && (
            <>
              <InputField
                id="instructorName"
                label="Full Name"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                required
                placeholder="Enter your full name"
              />

              <InputField
                id="instructorContact"
                label="Contact Number"
                value={instructorContact}
                onChange={(e) => setInstructorContact(e.target.value)}
                required
                placeholder="Enter your contact number"
              />

              <SelectField
                id="certificateBody"
                label="Certificate Body"
                value={certificateBody}
                onChange={(e) => setCertificateBody(e.target.value)}
                options={[
                  { value: "CASI", label: "CASI" },
                  { value: "CSIA", label: "CSIA" },
                  { value: "NZSIA", label: "NZSIA" },
                  { value: "BASI", label: "BASI" },
                ]}
                required
              />

              <SelectField
                id="qualificationLevel"
                label="Level of Qualification"
                value={qualificationLevel}
                onChange={(e) => setQualificationLevel(e.target.value)}
                options={[
                  { value: "1", label: "Level 1" },
                  { value: "2", label: "Level 2" },
                  { value: "3", label: "Level 3" },
                  { value: "4", label: "Level 4" },
                ]}
                required
              />

              <InputField
                id="address"
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter your address"
              />

              <InputField
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />

              <InputField
                id="experience"
                label="Years of Experience"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                placeholder="Enter years of experience"
              />

              <InputField
                id="language"
                label="Language(s)"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                placeholder="Languages spoken"
              />
            </>
          )}

          {/* Student-specific fields */}
          {role === "student" && (
            <>
              <InputField
                id="studentName"
                label="Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                placeholder="Enter your full name"
              />

              <InputField
                id="studentDob"
                label="Date of Birth"
                type="date"
                value={studentDob}
                onChange={(e) => setStudentDob(e.target.value)}
                required
              />

              <InputField
                id="studentAddress"
                label="Address"
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                required
                placeholder="Enter your address"
              />

              <InputField
                id="studentLanguage"
                label="Preferred Language(s)"
                value={studentLanguage}
                onChange={(e) => setStudentLanguage(e.target.value)}
                required
                placeholder="Enter preferred language(s)"
              />

              <InputField
                id="studentContact"
                label="Contact Number"
                value={studentContact}
                onChange={(e) => setStudentContact(e.target.value)}
                required
                placeholder="Enter your contact number"
              />
            </>
          )}

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
