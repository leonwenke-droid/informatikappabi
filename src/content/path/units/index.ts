import { UNIT_S01_U01 } from './unit-s01-u01';
import { UNIT_S02A_U01 } from './unit-s02a-u01';
import { UNIT_S02B_U01 } from './unit-s02b-u01';
import { UNIT_S03_U01 } from './unit-s03-u01';
import { UNIT_S04_U01 } from './unit-s04-u01';
import { STUB_UNITS } from './stubs';
import type { PathUnit } from '../../../types/learning';

const all: PathUnit[] = [
  UNIT_S01_U01,
  UNIT_S02A_U01,
  UNIT_S02B_U01,
  UNIT_S03_U01,
  UNIT_S04_U01,
  ...STUB_UNITS,
];

export const UNITS_BY_ID: Record<string, PathUnit> = Object.fromEntries(all.map((u) => [u.id, u]));

export function getUnit(id: string): PathUnit | undefined {
  return UNITS_BY_ID[id];
}

export function getAllUnits(): PathUnit[] {
  return all;
}
