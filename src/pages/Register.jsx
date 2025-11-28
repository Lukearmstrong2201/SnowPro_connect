import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import "../styles/Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [language, setLanguage] = useState("");

  // Instructor-specific fields
  const [experience, setExperience] = useState("");
  const [certificateBody, setCertificateBody] = useState("");
  const [qualificationLevel, setQualificationLevel] = useState("");

  // Student-specific fields

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const registrationData = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
      contact,
      address,
      date_of_birth: dateOfBirth,
      language,
      ...(role === "instructor" && {
        certificate_body: certificateBody,
        level_of_qualification: parseInt(qualificationLevel, 10),
        years_of_experience: parseInt(experience, 10),
        languages: language,
      }),
    };

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      alert(error.message || "Error during registration.");
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-section">
        <h1 className="register-title">Create an Account</h1>
        <p className="form-description">
          Register as a Student or Instructor to access the platform
        </p>

        <form onSubmit={handleRegister}>
          {/* Common Fields (Shown for Both Students & Instructors) */}
          <InputField
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Enter your first name"
          />

          <InputField
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Enter your last name"
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
            id="address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter your address"
          />

          <InputField
            id="contact"
            label="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder="Enter your contact number"
          />

          <InputField
            id="language"
            label="Language(s)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            placeholder="Enter your preferred language(s)"
          />

          {/* Instructor-specific fields */}
          {role === "instructor" && (
            <>
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
                id="experience"
                label="Years of Experience"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                placeholder="Enter years of experience"
              />
            </>
          )}

          <SelectField
            id="role"
            label="Select Your Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "student", label: "Student" },
              { value: "instructor", label: "Instructor" },
            ]}
          />

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

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
