// Lazy load Prisma to avoid hard dependency during quick local tests
let prisma: any = null;
const getPrisma = async () => {
  if (prisma) return prisma;
  try {
    const mod = await import('@prisma/client');
    prisma = new mod.PrismaClient();
    return prisma;
  } catch (err) {
    // Prisma not available — we'll fall back to in-memory store
    prisma = null;
    return null;
  }
};

// Simple in-memory fallback for local testing when DB is not reachable
const memoryStore = {
  chargers: new Map<number, any>(),
  idSeq: 1000
};

export const createCharger = async (data: any) => {
  try {
    const p = await getPrisma();
    if (p) {
      const created = await p.charger.create({ data });
      return created;
    }
  } catch (err) {
    // fall through to memory fallback
  }
  // Fallback to in-memory store for quick local testing
  const id = ++memoryStore.idSeq;
  const record = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
  memoryStore.chargers.set(id, record);
  return record;
};

export const getChargers = async (filters: any) => {
  try {
    const p = await getPrisma();
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.connectorType) where.connectorType = filters.connectorType;
    if (p) {
      const list = await p.charger.findMany({ where, take: 100 });
      return list;
    }
  } catch (err) {
    // fall through to memory fallback
  }
  // Return memory store values
  return Array.from(memoryStore.chargers.values());
};

export const getChargerById = async (id: number) => {
  try {
    const p = await getPrisma();
    if (p) return await p.charger.findUnique({ where: { id } });
  } catch (err) {
    // fall through
  }
  return memoryStore.chargers.get(id) || null;
};

export const updateCharger = async (id: number, patch: any) => {
  try {
    const p = await getPrisma();
    if (p) return await p.charger.update({ where: { id }, data: patch });
  } catch (err) {
    // fall through to memory fallback
  }
  const existing = memoryStore.chargers.get(id);
  if (!existing) return null;
  const merged = { ...existing, ...patch, updatedAt: new Date() };
  memoryStore.chargers.set(id, merged);
  return merged;
};

export const deleteCharger = async (id: number) => {
  try {
    const p = await getPrisma();
    if (p) {
      await p.charger.delete({ where: { id } });
      return true;
    }
  } catch (err) {
    // fall through
  }
  return memoryStore.chargers.delete(id);
};

export const getChargersByHost = async (hostId: number) => {
  try {
    const p = await getPrisma();
    if (p) return await p.charger.findMany({ where: { hostId } });
  } catch (err) {
    // fall through
  }
  return Array.from(memoryStore.chargers.values()).filter(c => c.hostId === hostId);
};

export default {
  createCharger,
  getChargers,
  getChargerById,
  updateCharger,
  deleteCharger,
  getChargersByHost
};
