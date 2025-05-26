import React, { useState, useEffect } from "react";
import "../styles/EditProfile.css";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user, token, login } = useAuth();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    contact: user?.contact || "",
    address: user?.address || "",
    language: user?.language || "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile_picture || "");

  useEffect(() => {
    if (user?.profile_picture) {
      setPreviewUrl(user.profile_picture);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Token:", token);

    try {
      // Update profile info (PATCH)
      const res1 = await fetch(`/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res1.ok) throw new Error("Failed to update profile info");

      // Upload profile picture if selected
      if (profileImage) {
        const uploadData = new FormData();
        uploadData.append("file", profileImage);

        const res2 = await fetch(`/users/${user.id}/upload-profile-picture`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        });

        if (!res2.ok) throw new Error("Failed to upload profile picture");
      }

      // Refresh user data
      const res3 = await fetch(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = await res3.json();
      login(updatedUser, token);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-image-section">
          <label htmlFor="profileImage" className="image-upload-label">
            {previewUrl ? (
              <img
                src={
                  previewUrl?.startsWith("/static")
                    ? `http://localhost:8000${previewUrl}`
                    : previewUrl
                }
                alt="Profile"
                className="profile-preview"
              />
            ) : (
              <div className="profile-placeholder">Upload Image</div>
            )}
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="form-fields">
          <input
            id="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
          <input
            id="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
          <input
            id="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleInputChange}
          />
          <input
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <input
            id="language"
            placeholder="Language(s)"
            value={formData.language}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="save-profile-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
