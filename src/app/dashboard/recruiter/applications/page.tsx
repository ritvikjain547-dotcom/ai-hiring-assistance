import { getRecruiterApplications } from "@/actions/applications";
import { Brain } from "lucide-react";
import { ApplicationsList } from "./ApplicationsList";

import Link from "next/link";

export default async function RecruiterApplicationsPage(props: {
  searchParams?: Promise<{ status?: string; classification?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusFilter = searchParams.status;
  const classificationFilter = searchParams.classification;

  let applications = await getRecruiterApplications(classificationFilter);
  if (statusFilter) {
    applications = applications.filter((a) => a.status === statusFilter);
  }

  const hasFilter = statusFilter || classificationFilter;

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <div className="ai-icon-wrapper">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="page-title">
              AI Hiring {statusFilter && `(${statusFilter})`} {classificationFilter && `[${classificationFilter}]`}
            </h1>
            <p className="page-subtitle">
              Review AI-screened candidates with intelligent classification and full override control
            </p>
          </div>
        </div>
        {hasFilter && (
          <Link href="/dashboard/recruiter/applications" className="btn btn-secondary">
            Clear Filter
          </Link>
        )}
      </div>

      <ApplicationsList applications={applications} />
    </div>
  );
}
