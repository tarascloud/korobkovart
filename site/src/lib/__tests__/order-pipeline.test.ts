import { describe, it, expect } from 'vitest';

// Valid order statuses as defined in /api/admin/orders/[id]/route.ts
type OrderStatus = 'INQUIRY' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// Forward pipeline: each status can transition to the next ones
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  INQUIRY: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

const VALID_STATUSES: OrderStatus[] = ['INQUIRY', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function isValidStatus(status: string): status is OrderStatus {
  return VALID_STATUSES.includes(status as OrderStatus);
}

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

describe('order status validation', () => {
  it('INQUIRY is a valid status', () => {
    expect(isValidStatus('INQUIRY')).toBe(true);
  });

  it('CONFIRMED is a valid status', () => {
    expect(isValidStatus('CONFIRMED')).toBe(true);
  });

  it('UNKNOWN is not a valid status', () => {
    expect(isValidStatus('UNKNOWN')).toBe(false);
  });

  it('empty string is not a valid status', () => {
    expect(isValidStatus('')).toBe(false);
  });
});

describe('order state transitions', () => {
  it('INQUIRY → CONFIRMED is valid', () => {
    expect(canTransition('INQUIRY', 'CONFIRMED')).toBe(true);
  });

  it('SHIPPED → DELIVERED is valid', () => {
    expect(canTransition('SHIPPED', 'DELIVERED')).toBe(true);
  });

  it('DELIVERED → INQUIRY is NOT valid', () => {
    expect(canTransition('DELIVERED', 'INQUIRY')).toBe(false);
  });

  it('CONFIRMED → SHIPPED is valid', () => {
    expect(canTransition('CONFIRMED', 'SHIPPED')).toBe(true);
  });

  it('INQUIRY → SHIPPED skipping CONFIRMED is NOT valid', () => {
    expect(canTransition('INQUIRY', 'SHIPPED')).toBe(false);
  });

  it('DELIVERED → CANCELLED is NOT valid (terminal state)', () => {
    expect(canTransition('DELIVERED', 'CANCELLED')).toBe(false);
  });

  it('any status → CANCELLED is valid (except DELIVERED)', () => {
    expect(canTransition('INQUIRY', 'CANCELLED')).toBe(true);
    expect(canTransition('CONFIRMED', 'CANCELLED')).toBe(true);
    expect(canTransition('SHIPPED', 'CANCELLED')).toBe(true);
  });

  it('CANCELLED → any state is NOT valid (terminal state)', () => {
    expect(canTransition('CANCELLED', 'INQUIRY')).toBe(false);
    expect(canTransition('CANCELLED', 'CONFIRMED')).toBe(false);
  });
});
