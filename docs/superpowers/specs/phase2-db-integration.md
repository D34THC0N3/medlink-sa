# Phase 2: Full DB Integration — Design Doc

## Overview

Phase 1 wired `Facility` (explore/service pages) from Prisma to the UI.
Phase 2 replaces **all remaining hardcoded mock data** with live database queries
across five dashboards: Doctor, Patient, Pharmacy, Hospital, and Admin.

**Selected approach:** Dashboard-First (Approach B) — wire one dashboard at a time,
verify, commit, move to the next.

**Derived data strategy:** Hybrid — live-computed for real-time counts/positions;
cached summary fields for historical aggregates.

---

## Models to Wire

| # | Prisma Model | Mock Data Replacement | Dashboard(s) |
|---|---|---|---|
| 1 | `Appointment` | `PATIENT_APPOINTMENTS`, `DOCTOR_SCHEDULE`, `HOSPITAL_QUEUE` | Doctor, Patient, Hospital |
| 2 | `Prescription` | `TODAY_PRESCRIBED`, `RECENT_PRESCRIBED`, `PATIENT_PRESCRIPTIONS` | Doctor, Patient, Pharmacy |
| 3 | `HealthRecord` | `CLINICAL_NOTES` (partial), `PATIENT_HEALTH_RECORDS` | Doctor, Patient |
| 4 | `Order` | `PHARMACY_ORDERS`, `PTV_ORDERS_INITIAL`, `PATIENT_ORDERS` | Pharmacy, Patient |
| 5 | `Equipment` | `BED_GRID`, `WARDS` (partial) | Hospital |

---

## Execution Order (Dashboard-First)

### Sprint 1: Appointments — Doctor + Patient + Hospital

**Why start here:** Appointments are the backbone — Doctors schedule them,
Patients book them, Hospitals track queue positions.

| Dashboard | Mock Data → DB | Server Actions |
|---|---|---|
| Doctor | `SCHEDULE` (4 items) → `getDoctorAppointments(userId)` | `src/lib/actions/appointment.ts` |
| Patient | `PATIENT_APPOINTMENTS` (6 items) → `getPatientAppointments(userId)` | Same file, different action |
| Hospital | `HOSPITAL_QUEUE` (6 items) → `getHospitalAppointments(hospitalId)` | Same file, hospital action |

**Derived:**
- `queuePosition` → computed from `WHERE datetime < :target AND status = 'scheduled'` count + 1
- `waitTimeEstimate` → computed from average appointment duration

### Sprint 2: Prescriptions — Doctor + Patient + Pharmacy

| Dashboard | Mock Data → DB | Server Actions |
|---|---|---|
| Doctor | `TODAY_PRESCRIBED` (5), `RECENT_PRESCRIBED` (5) → `getDoctorPrescriptions(userId)` | `src/lib/actions/prescription.ts` |
| Patient | `PATIENT_PRESCRIPTIONS` → `getPatientPrescriptions(userId)` | Same file |
| Pharmacy | `PTV_ORDERS_INITIAL` (5) → `getPharmacyOrders(pharmacistId)` | `src/lib/actions/order.ts` |

**Derived:**
- `dispenseStatus` → live from `Order.status` joined to `Prescription`
- `medicationCount` → live from `json_array_length(Prescription.items)`

### Sprint 3: Orders — Pharmacy + Patient

| Dashboard | Mock Data → DB | Server Actions |
|---|---|---|
| Pharmacy | `ORDERS_INITIAL` (5), `PHARMACY_ORDERS` → `getOrdersByPharmacy(pharmacistId)` | `src/lib/actions/order.ts` |
| Patient | (if patient orders view exists) → `getPatientOrders(userId)` | Same file |

**Derived:**
- `activeOrdersCount` → `COUNT(*) WHERE status NOT IN ('delivered','cancelled')`
- `weeklyRevenue` → `SUM(total) WHERE createdAt >= date_trunc('week', NOW())`

### Sprint 4: Health Records — Doctor + Patient

| Dashboard | Mock Data → DB | Server Actions |
|---|---|---|
| Doctor | `CLINICAL_NOTES` (8 items) → `getDoctorHealthRecords(userId)` | `src/lib/actions/health-record.ts` |
| Patient | (patient health records view) → `getPatientHealthRecords(userId)` | Same file |

**Derived:**
- `recentActivity` → `ORDER BY createdAt DESC LIMIT 5`
- `recordTypeCount` → `GROUP BY type`

### Sprint 5: Equipment + Hospital → Admin Full Wiring

| Dashboard | Mock Data → DB | Server Actions |
|---|---|---|
| Hospital | `BED_GRID` (80), `WARDS` → `getHospitalEquipment(hospitalId)`, `getHospitalWards(hospitalId)` | `src/lib/actions/equipment.ts`, `src/lib/actions/facility.ts` |
| Admin | `ADMIN_USERS` (7), `ADMIN_HOSPITALS` (5), `NETWORK_ACTIVITY` → `getAdminUsers()`, `getAdminHospitals()`, `getAdminMetrics()` | `src/lib/actions/admin.ts` |

**Admin gets FULL DB wiring** — all dashboards feed into admin aggregate views.

**Derived for Admin:**
- `totalPatients` → `COUNT(*) FROM User WHERE role = 'patient'`
- `totalDoctors` → `COUNT(*) FROM User WHERE role = 'doctor'`
- `activeOrders` → `COUNT(*) FROM Order WHERE status NOT IN ('delivered','cancelled')`
- `bedOccupancy` → live from `Ward.capacity` vs `COUNT(Appointment) WHERE status = 'scheduled'`
- `monthlyRevenue` → `SUM(Order.total) WHERE createdAt >= date_trunc('month', NOW())`

---

## Hybrid Derived Data Strategy

### Live-Computed (Real-Time)
These are computed on each page load via Prisma queries — no caching needed
because the data changes frequently and is cheap to compute:

| Field | Calculation | Used In |
|---|---|---|
| `queuePosition` | `COUNT(*) + 1` of earlier-scheduled appointments | Doctor, Hospital dashboards |
| `activeOrdersCount` | `COUNT(*) WHERE status NOT IN ('delivered','cancelled')` | Admin, Pharmacy |
| `bedOccupancy` | Ward capacity vs current scheduled appointments | Hospital, Admin |
| `waitTimeEstimate` | Average appointment duration × queue position | Doctor, Hospital |
| `recentActivity` | `ORDER BY createdAt DESC LIMIT N` | Health Records |

### Cached Summary Fields (Historical)
These are stored as denormalized fields on models or computed periodically.
Rationale: expensive aggregate queries on large datasets shouldn't run on every page load.

| Field | Storage Strategy | Model | Update Trigger |
|---|---|---|---|
| `monthlyRevenue` | Revalidate via `revalidatePath` after order status change | Computed in `getAdminMetrics()` | Order delivery/cancellation |
| `patientVisitCount` | Revalidate after appointment completion | Computed in `getHospitalMetrics()` | Appointment status → completed |
| `facilityAggregateStats` | Revalidate after any facility-scoped data change | Computed in `getAdminMetrics()` | Various |

**Implementation:** Use Next.js `revalidatePath()` / `revalidateTag()` after mutations
rather than maintaining separate cache tables. This keeps the code simple and the data
consistent.

---

## Server Actions Pattern

Every dashboard gets its own actions file:

```
src/lib/actions/
├── facility.ts          (Phase 1 — existing)
├── appointment.ts       (Sprint 1)
├── prescription.ts      (Sprint 2)
├── order.ts             (Sprint 3)
├── health-record.ts     (Sprint 4)
├── equipment.ts         (Sprint 5)
└── admin.ts             (Sprint 5)
```

Each file exports server functions that:
1. Accept relevant IDs (userId, hospitalId, pharmacistId)
2. Query via `db` (Prisma singleton)
3. Return typed results matching the component's expected shape
4. Include `revalidatePath` calls where applicable

---

## Per-Dashboard Mock Data Replacement Map

### Doctor Dashboard (`src/app/dashboard/doctor/_components/`)

| Component | Mock | DB Query | Sprint |
|---|---|---|---|
| `ScheduleCard` | `DOCTOR_SCHEDULE` | `getDoctorAppointments(userId)` | 1 |
| `PatientsList` | `DOCTOR_PATIENTS` | `getDoctorPatients(userId)` | 1 |
| `PrescriptionWriter` | `TODAY_PRESCRIBED` | `getDoctorPrescriptions(userId)` | 2 |
| `ClinicalNotes` | `CLINICAL_NOTES` | `getDoctorHealthRecords(userId)` | 4 |
| `ConsultationList` | `CONVERSATIONS` | `getDoctorConversations(userId)` | 4 |

### Patient Dashboard (`src/app/dashboard/patient/_components/`)

| Component | Mock | DB Query | Sprint |
|---|---|---|---|
| `AppointmentsList` | `PATIENT_APPOINTMENTS` | `getPatientAppointments(userId)` | 1 |
| `PrescriptionList` | `PATIENT_PRESCRIPTIONS` | `getPatientPrescriptions(userId)` | 2 |
| `OrderHistory` | (if exists) | `getPatientOrders(userId)` | 3 |
| `HealthRecords` | (if exists) | `getPatientHealthRecords(userId)` | 4 |

### Pharmacy Dashboard (`src/app/dashboard/pharmacy/_components/mock-data.ts`)

| Export | DB Query | Sprint |
|---|---|---|
| `ORDERS_INITIAL` | `getOrdersByPharmacy(pharmacistId)` | 3 |
| `PTV_ORDERS_INITIAL` | `getPharmacyOrders(pharmacistId)` | 2 |
| `INVENTORY_INITIAL` | `getPharmacyInventory(pharmacistId)` | 3 |
| `DRIVERS` / `DELIVERY_PINS` | Keep as mock (external service) | — |
| `WEEKLY_REVENUE` | `getWeeklyRevenue(pharmacistId)` | 3 |

### Hospital Dashboard (`src/app/dashboard/hospital/_components/mock-data.ts`)

| Export | DB Query | Sprint |
|---|---|---|
| `BED_GRID` | `getHospitalEquipment(hospitalId)` | 5 |
| `WARDS` (implicit) | `getHospitalWards(hospitalId)` | 5 |
| `PATIENT_FLOW` | Keep as mock (analytics) | — |
| `DEPARTMENTS` | Keep as mock (static config) | — |

### Admin Dashboard (`src/app/dashboard/admin/_components/mock-data.ts`)

| Export | DB Query | Sprint |
|---|---|---|
| `ADMIN_USERS` | `getAdminUsers()` | 5 |
| `ADMIN_HOSPITALS` | `getAdminHospitals()` | 5 |
| `AUDIT_EXTENDED` | `getAdminAuditLog()` | 5 |
| `SYSTEM_METRICS` | `getAdminMetrics()` | 5 |
| `API_RESPONSE_TREND` | Keep as mock (external monitoring) | — |
| `SA_PROVINCES_HEALTH` | `getAdminProvinceStats()` | 5 |
| `PENDING_DOCTORS` / `PENDING_PATIENTS` | `getPendingVerifications()` | 5 |

---

## Migration Strategy

1. **No schema changes** — all 5 models already exist in Prisma
2. **Seed data** — extend `prisma/seed.ts` with sample appointments, prescriptions, orders, health records, and equipment per facility
3. **Incremental commits** — one commit per sprint
4. **Backward compatible** — components fall back to empty arrays if DB has no data yet
5. **No breaking changes** — existing Phase 1 facility wiring remains untouched

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Empty DB on first run | Seed script creates sample data; components handle empty arrays gracefully |
| Type mismatches between mock and DB | Create adapter functions in server actions that map DB shape to component shape |
| Performance on large datasets | Add pagination via `skip`/`take`; limit initial queries to 20-50 records |
| Auth context missing userId | Guard every server action with session check; redirect if unauthenticated |

---

## Acceptance Criteria

- [ ] All 5 dashboards load data from PostgreSQL via server actions
- [ ] No hardcoded mock data remains in dashboard components (except static config: `DEPARTMENTS`, `PATIENT_FLOW`, `DRIVERS`, `API_RESPONSE_TREND`)
- [ ] Build passes (`npx next build --webpack`)
- [ ] TypeScript compiles with zero errors
- [ ] Each sprint committed individually
- [ ] Seed script covers all 5 models with realistic sample data
