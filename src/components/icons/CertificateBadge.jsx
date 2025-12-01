// src/components/icons/CertificateBadge.jsx
import { BadgeCheck } from "lucide-react";

export default function CertificateBadge({ level }) {
  return (
    <div className="badge-container">
      <BadgeCheck size={20} className="icon-white" />
      <span className="badge-text">Certified Level {level}</span>
    </div>
  );
}
