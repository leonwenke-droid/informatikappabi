import { UNIT_S01_U01 } from './unit-s01-u01';
import { STUB_UNITS } from './stubs';
import type { PathUnit } from '../../../types/learning';

const all: PathUnit[] = [UNIT_S01_U01, ...STUB_UNITS];

export const UNITS_BY_ID: Record<string, PathUnit> = Object.fromEntries(all.map((u) => [u.id, u]));

export function getUnit(id: string): PathUnit | undefined {
  return UNITS_BY_ID[id];
}

export function getAllUnits(): PathUnit[] {
  return all;
}
