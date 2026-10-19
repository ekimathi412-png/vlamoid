import { useEffect, useMemo, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Users,
  X,
} from "lucide-react";
import {
  formatReservationDate,
  getNairobiToday,
  getReservationTimes,
  validateReservation,
} from "../../lib/reservation";

type RequestDetails = {
  date: string;
  time: string;
  partySize: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

function addDays(date: string, days: number) {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

export default function ReservationForm() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [reviewed, setReviewed] = useState<RequestDetails | null>(null);
  const [open, setOpen] = useState(false);
  const times = useMemo(() => (date ? getReservationTimes(date) : []), [date]);

  useEffect(() => {
    const now = getNairobiToday();
    setToday(now);
    let initial = now;
    for (let offset = 0; offset < 7; offset++) {
      initial = addDays(now, offset);
      if (getReservationTimes(initial).length > 0) break;
    }
    const slots = getReservationTimes(initial);
    setDate(initial);
    setTime(slots.includes("19:00") ? "19:00" : slots[0] || "");
  }, []);

  function changeDate(nextDate: string) {
    const slots = nextDate ? getReservationTimes(nextDate) : [];
    setDate(nextDate);
    setTime(slots.includes("19:00") ? "19:00" : slots[0] || "");
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const details: RequestDetails = {
      date,
      time,
      partySize,
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      notes: String(form.get("notes") || "").trim(),
    };
    const problem = validateReservation(details);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setReviewed(details);
    setOpen(true);
  }

  return (
    <>
      <form className="reservation-form" onSubmit={submit}>
        <div className="form-heading">
          <h3>A seat at the table</h3>
          <span>01 — 08 GUESTS</span>
        </div>
        <div className="booking-controls">
          <label className="booking-field">
            <span>
              <CalendarDays size={15} />
              Date
            </span>
            <input
              aria-describedby="date-help"
              name="date"
              type="date"
              required
              min={today || undefined}
              max={today ? addDays(today, 90) : undefined}
              value={date}
              onChange={event => changeDate(event.target.value)}
            />
          </label>
          <label className="booking-field">
            <span>
              <Clock3 size={15} />
              Time
            </span>
            <select
              name="time"
              required
              value={time}
              onChange={event => setTime(event.target.value)}
              disabled={!times.length}
            >
              <option value="">
                {date ? "No available times" : "Choose a date"}
              </option>
              {times.map(slot => (
                <option key={slot} value={slot}>
                  {new Date(`2000-01-01T${slot}:00Z`).toLocaleTimeString(
                    "en-GB",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    }
                  )}
                </option>
              ))}
            </select>
          </label>
          <label className="booking-field">
            <span>
              <Users size={15} />
              Party size
            </span>
            <select
              name="partySize"
              value={partySize}
              onChange={event => setPartySize(event.target.value)}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map(size => (
                <option key={size} value={String(size)}>
                  {size} {size === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p id="date-help" className="field-help">
          Nairobi time · Based on draft opening hours · Up to 90 days ahead
        </p>
        {date && !times.length && (
          <p className="form-warning" role="status">
            No evening slots for this date. Monday is closed in the draft
            schedule; try another date.
          </p>
        )}
        <div className="guest-fields">
          <label className="text-field">
            <span>Your name</span>
            <input
              name="name"
              autoComplete="name"
              placeholder="First and last name"
              required
              minLength={2}
              maxLength={100}
            />
          </label>
          <label className="text-field">
            <span>Email address</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />
          </label>
          <label className="text-field full-width">
            <span>
              Phone number <small>OPTIONAL</small>
            </span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+254"
              maxLength={30}
            />
          </label>
          <label className="text-field full-width">
            <span>
              A little something we should know? <small>OPTIONAL</small>
            </span>
            <textarea
              name="notes"
              placeholder="An occasion, an allergy, a special request…"
              rows={2}
              maxLength={500}
            />
          </label>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button button-brass form-submit">
          Review reservation <ArrowUpRight size={18} />
        </button>
        <p className="form-privacy">
          Preview only. No availability is guaranteed and no request is sent.
        </p>
      </form>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="reservation-dialog">
            <Dialog.Close
              className="dialog-close"
              aria-label="Close reservation review"
            >
              <X size={22} />
            </Dialog.Close>
            <span className="review-icon">
              <Check size={25} strokeWidth={1.5} />
            </span>
            <span className="eyebrow">YOUR EVENING, AT A GLANCE</span>
            <Dialog.Title>
              Looking forward to <em>this?</em>
            </Dialog.Title>
            <Dialog.Description>
              Your reservation preview is ready. This is a review only — it has
              not been sent to Vlamoid and is not a confirmed booking.
            </Dialog.Description>
            {reviewed && (
              <dl className="review-details">
                <div>
                  <dt>Guest</dt>
                  <dd>{reviewed.name}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{formatReservationDate(reviewed.date)}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{reviewed.time} EAT</dd>
                </div>
                <div>
                  <dt>Table for</dt>
                  <dd>
                    {reviewed.partySize}{" "}
                    {reviewed.partySize === "1" ? "guest" : "guests"}
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{reviewed.email}</dd>
                </div>
                {reviewed.phone && (
                  <div>
                    <dt>Phone</dt>
                    <dd>{reviewed.phone}</dd>
                  </div>
                )}
                {reviewed.notes && (
                  <div>
                    <dt>Special request</dt>
                    <dd>{reviewed.notes}</dd>
                  </div>
                )}
              </dl>
            )}
            <Dialog.Close className="button button-brass">
              Back to my details <ArrowUpRight size={17} />
            </Dialog.Close>
            <p className="quiet-note">
              Live booking will be available after the restaurant connects its
              reservation destination.
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
