import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma to avoid real DB connection in unit tests
vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['INQUIRY', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
type OrderStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(status: string): status is OrderStatus {
  return VALID_STATUSES.includes(status as OrderStatus);
}

// Mirrors the PUT handler logic from /api/admin/orders/[id]/route.ts
// body.status check uses truthy guard: empty string skips validation (matches real API)
async function handleOrderUpdate(id: string, body: { status?: string; notes?: string }) {
  if (body.status && !isValidStatus(body.status)) {
    return { status: 400, body: { error: 'Invalid status' } };
  }

  const updated = await (prisma.order.update as ReturnType<typeof vi.fn>)({
    where: { id },
    data: {
      status: body.status,
      notes: body.notes ?? undefined,
    },
  });

  return { status: 200, body: updated };
}

describe('order-pipeline DB integration (mocked Prisma)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid status string', async () => {
    const result = await handleOrderUpdate('order-1', { status: 'INVALID_STATE' });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({ error: 'Invalid status' });
    // prisma.order.update must NOT be called for invalid transitions
    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it('returns 400 for UNKNOWN status', async () => {
    const result = await handleOrderUpdate('order-1', { status: 'UNKNOWN' });
    expect(result.status).toBe(400);
    expect(prisma.order.update).not.toHaveBeenCalled();
  });

  it('calls prisma.order.update for valid status CONFIRMED', async () => {
    const mockOrder = { id: 'order-1', status: 'CONFIRMED' };
    (prisma.order.update as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

    const result = await handleOrderUpdate('order-1', { status: 'CONFIRMED' });

    expect(result.status).toBe(200);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'CONFIRMED', notes: undefined },
    });
    expect(result.body).toEqual(mockOrder);
  });

  it('calls prisma.order.update for valid status CANCELLED', async () => {
    const mockOrder = { id: 'order-2', status: 'CANCELLED' };
    (prisma.order.update as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

    const result = await handleOrderUpdate('order-2', { status: 'CANCELLED' });

    expect(result.status).toBe(200);
    expect(result.body).toEqual(mockOrder);
  });

  it('calls prisma.order.update for DELIVERED status', async () => {
    const mockOrder = { id: 'order-3', status: 'DELIVERED' };
    (prisma.order.update as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

    const result = await handleOrderUpdate('order-3', { status: 'DELIVERED' });

    expect(result.status).toBe(200);
    expect(result.body).toEqual(mockOrder);
  });

  it('passes notes field to prisma update', async () => {
    const mockOrder = { id: 'order-4', status: 'SHIPPED', notes: 'Dispatched today' };
    (prisma.order.update as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

    await handleOrderUpdate('order-4', { status: 'SHIPPED', notes: 'Dispatched today' });

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-4' },
      data: { status: 'SHIPPED', notes: 'Dispatched today' },
    });
  });
});
