/**
 * Pharmacy domain server services.
 */
import { db } from "../db";

export async function getMedicines() {
  return db.medicine.findMany({ orderBy: { name: "asc" } });
}

export async function createMedicine(data: any) {
  return db.medicine.create({ data });
}

export async function getOrders(pharmacistId: string) {
  return db.order.findMany({
    where: { pharmacistId },
    include: { patient: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: string) {
  return db.order.update({ where: { id }, data: { status: status as any } });
}

export async function getInventory(pharmacistId: string) {
  return db.medicinePrice.findMany({
    where: { pharmacistId },
    include: { medicine: true },
  });
}
