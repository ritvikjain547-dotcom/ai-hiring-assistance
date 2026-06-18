import { getRecruiterApplications } from "@/actions/applications";
import { Brain } from "lucide-react";
import { ApplicationsList } from "./ApplicationsList";

export default async function RecruiterApplicationsPage() {
  const applications = await getRecruiterApplications();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div className="ai-icon-wrapper">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="page-title">AI Hiring</h1>
            <p className="page-subtitle">
              Review AI-screened candidates with intelligent classification and full override control
            </p>
          </div>
        </div>
      </div>

      <ApplicationsList applications={applications} />
    </div>
  );
}
