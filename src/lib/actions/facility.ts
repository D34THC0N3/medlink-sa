"use server";

import { db } from "@/lib/db";
import type { Facility } from "@/lib/data/shared";

/* ---------- helpers ---------- */

const HOSPITAL_TYPES = new Set([
  "central_hospital",
  "tertiary_hospital",
  "regional_hospital",
  "district_hospital",
]);

const CLINIC_TYPES = new Set([
  "community_health_centre",
  "primary_health_care",
]);

function deriveCategory(prismaType: string): "hospital" | "clinic" | "pharmacy" {
  if (prismaType === "pharmacy") return "pharmacy";
  if (CLINIC_TYPES.has(prismaType)) return "clinic";
  return "hospital";
}

function toDisplayType(prismaType: string): Facility["facilityType"] {
  return prismaType.replace(/_/g, " ") as Facility["facilityType"];
}

/* ---------- actions ---------- */

export async function getFacilities() {
  const rows = await db.facility.findMany({ orderBy: { name: "asc" } });

  return rows.map((r) => ({
    id: r.id,
    uid: r.uid,
    name: r.name,
    category: deriveCategory(r.facilityType),
    facilityType: toDisplayType(r.facilityType),
    location: r.location,
    province: r.province,
    provinceCode: r.provinceCode,
    distanceKm: 0, // computed at query time by client
    rating: r.rating ?? 0,
    open: true, // real-time status not in DB yet
    openUntil: "24/7",
    beds: undefined,
    queueWait: undefined,
    tags: (r.tags as string[]) ?? [],
    lat: r.lat ?? 0,
    lng: r.lng ?? 0,
  }));
}

export async function getFacilityByUid(uid: string) {
  const r = await db.facility.findUnique({ where: { uid } });
  if (!r) return null;

  return {
    id: r.id,
    uid: r.uid,
    name: r.name,
    category: deriveCategory(r.facilityType),
    facilityType: toDisplayType(r.facilityType),
    location: r.location,
    province: r.province,
    provinceCode: r.provinceCode,
    distanceKm: 0,
    rating: r.rating ?? 0,
    open: true,
    openUntil: "24/7",
    beds: undefined,
    queueWait: undefined,
    tags: (r.tags as string[]) ?? [],
    lat: r.lat ?? 0,
    lng: r.lng ?? 0,
  };
}
