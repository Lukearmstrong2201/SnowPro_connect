// src/components/icons/ResortBadge.jsx
import { Mountain } from "lucide-react";

export default function ResortBadge({ resortName }) {
  return (
    <div className="badge-container">
      <Mountain size={20} className="icon-white" />
      <span className="badge-text">{resortName || "No Resort Selected"}</span>
    </div>
  );
}
