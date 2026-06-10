'use client';

import { useState } from "react";
import { updateProfile, uploadProfilePhoto } from "@/actions/profile";
import {
  User,
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
  GraduationCap,
  Briefcase,
  Save,
  Camera,
} from "lucide-react";

const Github = ({ size = 20, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 20, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


interface ProfileData {
  phone: string | null;
  location: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  skills: string | null;
  experienceYears: string | null;
  education: string | null;
  profilePhotoUrl: string | null;
}

export default function ProfileForm({
  profile,
  userName,
  userEmail,
}: {
  profile: ProfileData | null;
  userName: string;
  userEmail: string;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(profile?.profilePhotoUrl || null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  async function handleProfileSave(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateProfile(formData);
    if (result?.error) {
      setMessage(result.error);
      setMessageType("error");
    } else {
      setMessage("Profile updated successfully!");
      setMessageType("success");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const result = await uploadProfilePhoto(formData);
      if (result?.error) {
        setMessage(result.error);
        setMessageType("error");
      } else if (result?.photoUrl) {
        setCurrentPhotoUrl(result.photoUrl);
        setMessage("Profile photo updated successfully!");
        setMessageType("success");
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      setMessage("Failed to upload photo. The file may be too large or there was a server error.");
      setMessageType("error");
    }
    setUploading(false);
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          Complete your profile to stand out to recruiters
        </p>
      </div>

      {message && (
        <div
          className={`alert ${
            messageType === "success" ? "alert-success" : "alert-error"
          }`}
          style={{ marginBottom: "var(--space-6)" }}
        >
          {messageType === "success" && <CheckCircle2 size={16} />}
          {message}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="profile-header">
        <div 
          className="avatar avatar-xl" 
          style={{ 
            position: "relative", 
            cursor: "pointer", 
            overflow: "hidden",
            border: "2px solid var(--color-border-hover)"
          }}
          title="Click to change profile photo"
          onClick={() => document.getElementById("profile-photo-input")?.click()}
        >
          {uploading ? (
            <Loader2 size={24} className="spinner" />
          ) : currentPhotoUrl ? (
            <img 
              src={currentPhotoUrl} 
              alt={userName} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            userName?.charAt(0).toUpperCase() || "U"
          )}
          <div 
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0, 0, 0, 0.6)",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.85,
            }}
          >
            <Camera size={14} style={{ color: "#fff" }} />
          </div>
        </div>
        <input 
          type="file" 
          id="profile-photo-input" 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={handlePhotoChange}
          disabled={uploading}
        />
        <div>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
            {userName}
          </h2>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            {userEmail}
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Profile Form */}
        <div className="card">
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              marginBottom: "var(--space-6)",
            }}
          >
            Personal Information
          </h3>

          <form
            action={handleProfileSave}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">
                Phone Number
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="profile-phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  defaultValue={profile?.phone || ""}
                  placeholder="+1 (555) 000-0000"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-location">
                Location
              </label>
              <div style={{ position: "relative" }}>
                <MapPin
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="profile-location"
                  name="location"
                  type="text"
                  className="form-input"
                  defaultValue={profile?.location || ""}
                  placeholder="San Francisco, CA"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">
                Bio
              </label>
              <textarea
                id="profile-bio"
                name="bio"
                className="form-input form-textarea"
                defaultValue={profile?.bio || ""}
                placeholder="Tell recruiters about yourself..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-skills">
                Skills
              </label>
              <input
                id="profile-skills"
                name="skills"
                type="text"
                className="form-input"
                defaultValue={profile?.skills || ""}
                placeholder="React, TypeScript, Node.js (comma separated)"
              />
              <span className="form-helper">
                Enter your skills separated by commas
              </span>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-experience">
                  Experience
                </label>
                <div style={{ position: "relative" }}>
                  <Briefcase
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                    }}
                  />
                  <input
                    id="profile-experience"
                    name="experienceYears"
                    type="text"
                    className="form-input"
                    defaultValue={profile?.experienceYears || ""}
                    placeholder="3 years"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-education">
                  Education
                </label>
                <div style={{ position: "relative" }}>
                  <GraduationCap
                    size={16}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                    }}
                  />
                  <input
                    id="profile-education"
                    name="education"
                    type="text"
                    className="form-input"
                    defaultValue={profile?.education || ""}
                    placeholder="B.S. Computer Science"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-linkedin">
                LinkedIn URL
              </label>
              <div style={{ position: "relative" }}>
                <Linkedin
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="profile-linkedin"
                  name="linkedinUrl"
                  type="url"
                  className="form-input"
                  defaultValue={profile?.linkedinUrl || ""}
                  placeholder="https://linkedin.com/in/yourprofile"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-github">
                GitHub URL
              </label>
              <div style={{ position: "relative" }}>
                <Github
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="profile-github"
                  name="githubUrl"
                  type="url"
                  className="form-input"
                  defaultValue={profile?.githubUrl || ""}
                  placeholder="https://github.com/yourusername"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-portfolio">
                Portfolio URL
              </label>
              <div style={{ position: "relative" }}>
                <Globe
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  id="profile-portfolio"
                  name="portfolioUrl"
                  type="url"
                  className="form-input"
                  defaultValue={profile?.portfolioUrl || ""}
                  placeholder="https://yourportfolio.com"
                  style={{ paddingLeft: "38px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              id="save-profile-btn"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
