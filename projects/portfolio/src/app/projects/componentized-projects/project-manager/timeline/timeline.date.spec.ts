import {
  addDays,
  classifySchedule,
  formatDay,
  intervalDays,
  isValidIsoDate,
  parseIsoDay,
} from './timeline.date';

describe('timeline.date', () => {
  describe('parseIsoDay', () => {
    it('should parse a valid date', () => {
      expect(parseIsoDay('2026-02-10')).not.toBeNull();
      expect(parseIsoDay('1970-01-01')).toBe(0);
    });

    it('should reject malformed strings', () => {
      expect(parseIsoDay('not-a-date')).toBeNull();
      expect(parseIsoDay('2026-2-10')).toBeNull();
      expect(parseIsoDay('')).toBeNull();
    });

    it('should reject impossible calendar dates', () => {
      expect(parseIsoDay('2026-02-30')).toBeNull();
      expect(parseIsoDay('2026-13-01')).toBeNull();
      expect(parseIsoDay('2026-00-10')).toBeNull();
    });

    it('should handle leap-year dates', () => {
      expect(parseIsoDay('2024-02-29')).not.toBeNull();
      expect(parseIsoDay('2026-02-29')).toBeNull();
    });

    it('should handle month and year boundaries', () => {
      expect(parseIsoDay('2026-12-31')).not.toBeNull();
      expect(parseIsoDay('2027-01-01')).not.toBeNull();
      expect(addDays(parseIsoDay('2026-12-31') as number, 1)).toBe(
        parseIsoDay('2027-01-01') as number
      );
    });

    it('should be timezone-stable (round trip through UTC)', () => {
      const day = parseIsoDay('2026-07-15') as number;
      expect(formatDay(day)).toBe('2026-07-15');
      expect(parseIsoDay(formatDay(day))).toBe(day);
    });
  });

  describe('isValidIsoDate', () => {
    it('should mirror parseIsoDay', () => {
      expect(isValidIsoDate('2026-01-01')).toBeTrue();
      expect(isValidIsoDate('garbage')).toBeFalse();
    });
  });

  describe('classifySchedule', () => {
    it('should classify both-empty as unscheduled', () => {
      expect(classifySchedule('', '')).toEqual({ kind: 'unscheduled' });
    });

    it('should classify one-empty as missing', () => {
      expect(classifySchedule('2026-01-01', '')).toEqual({ kind: 'invalid', reason: 'missing' });
      expect(classifySchedule('', '2026-01-01')).toEqual({ kind: 'invalid', reason: 'missing' });
    });

    it('should classify malformed dates', () => {
      expect(classifySchedule('x', '2026-01-01')).toEqual({ kind: 'invalid', reason: 'malformed' });
    });

    it('should classify reversed dates', () => {
      expect(classifySchedule('2026-02-05', '2026-02-01')).toEqual({
        kind: 'invalid',
        reason: 'reversed',
      });
    });

    it('should classify equal start/end as a milestone', () => {
      const result = classifySchedule('2026-02-10', '2026-02-10');
      expect(result.kind).toBe('scheduled');
      if (result.kind === 'scheduled') {
        expect(result.milestone).toBeTrue();
        expect(intervalDays(result.interval)).toBe(1);
      }
    });

    it('should produce a half-open interval with inclusive end converted', () => {
      const result = classifySchedule('2026-02-01', '2026-02-03');
      expect(result.kind).toBe('scheduled');
      if (result.kind === 'scheduled') {
        expect(result.milestone).toBeFalse();
        expect(result.interval.startDay).toBe(parseIsoDay('2026-02-01') as number);
        expect(result.interval.endDayExclusive).toBe(parseIsoDay('2026-02-04') as number);
      }
    });
  });
});
