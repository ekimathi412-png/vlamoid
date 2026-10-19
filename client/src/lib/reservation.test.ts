import { describe, expect, it } from "vitest";
import {
  formatReservationDate,
  getNairobiToday,
  getReservationTimes,
  validateReservation,
  type ReservationInput,
} from "./reservation";

const referenceNow = new Date("2025-06-09T12:00:00.000Z"); // 15:00 on Monday in Nairobi

const validReservation: ReservationInput = {
  date: "2025-06-10",
  time: "18:00",
  partySize: "2",
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+254 700 123 456",
};

describe("getNairobiToday", () => {
  it("uses Nairobi's calendar date at the UTC day boundary", () => {
    expect(getNairobiToday(new Date("2025-06-10T20:59:59.000Z"))).toBe(
      "2025-06-10"
    );
    expect(getNairobiToday(new Date("2025-06-10T21:00:00.000Z"))).toBe(
      "2025-06-11"
    );
  });
});

describe("getReservationTimes", () => {
  it("returns the draft hours with the last reservation included", () => {
    expect(getReservationTimes("2025-06-10", referenceNow)).toEqual([
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
    ]);
    expect(getReservationTimes("2025-06-13", referenceNow)).toHaveLength(11);
    expect(getReservationTimes("2025-06-15", referenceNow)).toEqual([
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ]);
  });

  it("returns no slots on Monday and rejects impossible dates", () => {
    expect(getReservationTimes("2025-06-09", referenceNow)).toEqual([]);
    expect(getReservationTimes("2025-02-29", referenceNow)).toEqual([]);
    expect(getReservationTimes("2025-6-10", referenceNow)).toEqual([]);
  });

  it("filters today's slots using Nairobi time, including the current minute", () => {
    const eighteenTenNairobi = new Date("2025-06-10T15:10:00.000Z");
    expect(getReservationTimes("2025-06-10", eighteenTenNairobi)).toEqual([
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
    ]);

    expect(
      getReservationTimes("2025-06-10", new Date("2025-06-10T15:00:00.000Z"))
    ).toEqual(["18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]);
  });
});

describe("formatReservationDate", () => {
  it("renders an English human-readable date without browser timezone drift", () => {
    expect(formatReservationDate("2025-06-10")).toBe("Tuesday, June 10, 2025");
    expect(formatReservationDate("2025-02-29")).toBe("");
  });
});

describe("validateReservation", () => {
  it("accepts a valid future reservation and the 90-day boundary", () => {
    expect(validateReservation(validReservation, referenceNow)).toBeNull();

    expect(
      validateReservation(
        { ...validReservation, date: "2025-09-07", time: "13:00" },
        referenceNow
      )
    ).toBeNull();
  });

  it("requires exact, real dates within today's Nairobi 90-day window", () => {
    expect(
      validateReservation(
        { ...validReservation, date: "2025-02-29" },
        referenceNow
      )
    ).toMatch(/valid reservation date/i);
    expect(
      validateReservation(
        { ...validReservation, date: "2025-6-10" },
        referenceNow
      )
    ).toMatch(/valid reservation date/i);
    expect(
      validateReservation(
        { ...validReservation, date: "2025-06-08", time: "13:00" },
        referenceNow
      )
    ).toMatch(/between/i);
    expect(
      validateReservation(
        { ...validReservation, date: "2025-09-08", time: "13:00" },
        referenceNow
      )
    ).toMatch(/between/i);
    expect(
      validateReservation(
        { ...validReservation, date: "2025-06-09", time: "18:00" },
        referenceNow
      )
    ).toMatch(/closed/i);
  });

  it("requires an available future slot on the selected Nairobi date", () => {
    const sameDay = new Date("2025-06-10T15:00:00.000Z"); // 18:00 EAT
    expect(
      validateReservation(
        { ...validReservation, date: "2025-06-10", time: "18:00" },
        sameDay
      )
    ).toMatch(/passed/i);
    expect(
      validateReservation(
        { ...validReservation, date: "2025-06-10", time: "18:30" },
        sameDay
      )
    ).toBeNull();
    expect(
      validateReservation(
        { ...validReservation, date: "2025-06-10", time: "16:30" },
        referenceNow
      )
    ).toMatch(/available/i);
  });

  it("validates party size, name, email, and optional phone", () => {
    expect(
      validateReservation({ ...validReservation, partySize: "0" }, referenceNow)
    ).toMatch(/party size/i);
    expect(
      validateReservation(
        { ...validReservation, partySize: "1.5" },
        referenceNow
      )
    ).toMatch(/party size/i);
    expect(
      validateReservation({ ...validReservation, name: "A" }, referenceNow)
    ).toMatch(/name/i);
    expect(
      validateReservation(
        { ...validReservation, name: "a".repeat(101) },
        referenceNow
      )
    ).toMatch(/name/i);
    expect(
      validateReservation(
        { ...validReservation, email: "not-an-email" },
        referenceNow
      )
    ).toMatch(/email/i);
    expect(
      validateReservation(
        { ...validReservation, email: `${"a".repeat(250)}@x.com` },
        referenceNow
      )
    ).toMatch(/email/i);
    expect(
      validateReservation({ ...validReservation, phone: "12345" }, referenceNow)
    ).toMatch(/phone/i);
    expect(
      validateReservation(
        { ...validReservation, phone: "+254 700-123-456" },
        referenceNow
      )
    ).toBeNull();
    expect(
      validateReservation(
        { ...validReservation, phone: "call-me-please" },
        referenceNow
      )
    ).toMatch(/phone/i);
  });

  it("reports missing required fields with actionable messages", () => {
    expect(
      validateReservation({ ...validReservation, date: "" }, referenceNow)
    ).toMatch(/choose.*date/i);
    expect(
      validateReservation({ ...validReservation, time: "" }, referenceNow)
    ).toMatch(/choose.*time/i);
    expect(
      validateReservation({ ...validReservation, name: "  " }, referenceNow)
    ).toMatch(/enter.*name/i);
    expect(
      validateReservation({ ...validReservation, email: "  " }, referenceNow)
    ).toMatch(/enter.*email/i);
  });
});
