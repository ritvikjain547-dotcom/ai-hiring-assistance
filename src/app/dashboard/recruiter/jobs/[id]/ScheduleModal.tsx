'use client';

import { useState } from "react";
import { scheduleRound } from "@/actions/rounds";
import {
  Loader2,
  Calendar,
  Clock,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ScheduleModalProps {
  roundId: string;
  roundName: string;
  roundNumber: number;
  applicantName: string;
  onClose: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleModal({
  roundId,
  roundName,
  roundNumber,
  applicantName,
  onClose,
}: ScheduleModalProps) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [currentMonth, setCurrentMonth] = useState(tomorrow.getMonth());
  const [currentYear, setCurrentYear] = useState(tomorrow.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");
  const [interviewLink, setInterviewLink] = useState("");
  const [interviewInfo, setInterviewInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month: number, year: number) {
    return new Date(year, month, 1).getDay();
  }

  function isDateSelectable(day: number) {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(0, 0, 0, 0);
    const todayCopy = new Date();
    todayCopy.setHours(0, 0, 0, 0);
    return d > todayCopy;
  }

  function isSelected(day: number) {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  }

  function isToday(day: number) {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function handleSelectDay(day: number) {
    if (!isDateSelectable(day)) return;
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setError("");
  }

  function getScheduledDateTime(): Date | null {
    if (!selectedDate) return null;
    let h = parseInt(hour);
    if (amPm === "PM" && h !== 12) h += 12;
    if (amPm === "AM" && h === 12) h = 0;
    const dt = new Date(selectedDate);
    dt.setHours(h, parseInt(minute), 0, 0);
    return dt;
  }

  async function handleSubmit() {
    const dt = getScheduledDateTime();
    if (!dt) {
      setError("Please select a date");
      return;
    }
    setError("");
    setLoading(true);
    const result = await scheduleRound(
      roundId, 
      dt.toISOString(),
      interviewLink,
      interviewInfo
    );
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    onClose();
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const scheduledDt = getScheduledDateTime();

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div
        className="review-modal-content schedule-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "480px" }}
      >
        {/* Header */}
        <div className="review-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div className="review-modal-icon schedule">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="review-modal-title">Schedule Interview</h3>
              <p className="review-modal-subtitle">
                {applicantName} — {roundName}
              </p>
            </div>
          </div>
          <button className="review-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="review-modal-body" style={{ padding: "var(--space-4) var(--space-5)" }}>
          {/* Calendar */}
          <div className="cal-container">
            {/* Month Navigation */}
            <div className="cal-header">
              <button className="cal-nav-btn" onClick={handlePrevMonth} type="button">
                <ChevronLeft size={16} />
              </button>
              <span className="cal-month-label">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <button className="cal-nav-btn" onClick={handleNextMonth} type="button">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day names */}
            <div className="cal-grid">
              {DAYS.map((d) => (
                <div key={d} className="cal-day-name">{d}</div>
              ))}

              {/* Days */}
              {calendarDays.map((day, idx) => (
                <div key={idx}>
                  {day ? (
                    <button
                      type="button"
                      className={`cal-day ${
                        isSelected(day) ? "selected" : ""
                      } ${isToday(day) ? "today" : ""} ${
                        !isDateSelectable(day) ? "disabled" : ""
                      }`}
                      onClick={() => handleSelectDay(day)}
                      disabled={!isDateSelectable(day)}
                    >
                      {day}
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div className="cal-time-section">
            <div className="cal-time-label">
              <Clock size={14} />
              Interview Time
            </div>
            <div className="cal-time-picker">
              <select
                className="cal-time-select"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={String(h)}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="cal-time-colon">:</span>
              <select
                className="cal-time-select"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="cal-ampm-toggle">
                <button
                  type="button"
                  className={`cal-ampm-btn ${amPm === "AM" ? "active" : ""}`}
                  onClick={() => setAmPm("AM")}
                >
                  AM
                </button>
                <button
                  type="button"
                  className={`cal-ampm-btn ${amPm === "PM" ? "active" : ""}`}
                  onClick={() => setAmPm("PM")}
                >
                  PM
                </button>
              </div>
            </div>
          </div>


          {/* Meeting Details */}
          <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "var(--text-xs)" }}>
                Interview Link (Optional)
              </label>
              <input
                type="url"
                className="form-input form-input-sm"
                placeholder="https://zoom.us/j/..."
                value={interviewLink}
                onChange={(e) => setInterviewLink(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "var(--text-xs)" }}>
                Additional Information (Optional)
              </label>
              <textarea
                className="form-input form-textarea"
                placeholder="Instructions, passwords, or agenda..."
                value={interviewInfo}
                onChange={(e) => setInterviewInfo(e.target.value)}
                rows={2}
                style={{ fontSize: "var(--text-sm)", padding: "8px 12px" }}
              />
            </div>
          </div>

          {/* Preview */}
          {selectedDate && (
            <div className="schedule-preview">
              <div className="schedule-preview-label">Interview will be scheduled for:</div>
              <div className="schedule-preview-date">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="schedule-preview-time">
                {scheduledDt?.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
              <div className="schedule-preview-email">
                <Send size={12} />
                Email will be sent to {applicantName} automatically
                {(interviewLink || interviewInfo) && " with your meeting details"}
              </div>
            </div>
          )}

          {error && <div className="schedule-error">{error}</div>}
        </div>

        {/* Actions */}
        <div className="review-modal-actions">
          <button onClick={onClose} className="btn btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || !selectedDate}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" /> Scheduling...
              </>
            ) : (
              <>
                <Send size={16} /> Schedule & Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
