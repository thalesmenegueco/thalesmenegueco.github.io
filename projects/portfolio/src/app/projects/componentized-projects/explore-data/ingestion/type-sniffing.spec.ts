import { isDateValue, isNumericValue, profileColumn, sniffType } from './type-sniffing';

describe('type-sniffing', () => {
  it('detects numerical columns', () => {
    expect(sniffType([1, 2, 3, 4.5])).toBe('numerical');
    expect(sniffType(['1', '2', '3'])).toBe('numerical');
    expect(sniffType(['10.5', '20', '-3'])).toBe('numerical');
  });

  it('detects categorical columns', () => {
    expect(sniffType(['a', 'b', 'c', 'd'])).toBe('categorical');
    expect(sniffType(['azul', 'verde', 'azul', 'vermelho'])).toBe('categorical');
  });

  it('detects boolean columns', () => {
    expect(sniffType(['true', 'false', 'true'])).toBe('boolean');
    expect(sniffType(['sim', 'não', 'sim'])).toBe('boolean');
  });

  it('detects datetime columns', () => {
    expect(sniffType(['2024-01-01', '2024-02-01', '2024-03-01'])).toBe('datetime');
    expect(sniffType(['01/01/2024', '02/01/2024', '03/01/2024'])).toBe('datetime');
  });

  it('falls back to categorical for empty or null-only columns', () => {
    expect(sniffType([null, '', undefined])).toBe('categorical');
  });

  it('does not treat plain numbers as dates', () => {
    expect(isDateValue('2024')).toBeFalse();
    expect(isDateValue(2024)).toBeFalse();
    expect(isDateValue('12.5')).toBeFalse();
  });

  it('treats strings with date separators as dates', () => {
    expect(isDateValue('2024-01-01')).toBeTrue();
    expect(isDateValue('01/01/2024')).toBeTrue();
  });

  it('recognizes numeric strings', () => {
    expect(isNumericValue('42')).toBeTrue();
    expect(isNumericValue('42.5')).toBeTrue();
    expect(isNumericValue('abc')).toBeFalse();
    expect(isNumericValue('')).toBeFalse();
    expect(isNumericValue(null)).toBeFalse();
  });

  it('builds a profile with counts and rates', () => {
    const profile = profileColumn('col', ['1', '2', '3', null, '']);
    expect(profile.name).toBe('col');
    expect(profile.totalCount).toBe(5);
    expect(profile.nonNullCount).toBe(3);
    expect(profile.distinctCount).toBe(3);
    expect(profile.numericRate).toBe(1);
    expect(profile.suggestedType).toBe('numerical');
    expect(profile.sampleValues).toEqual(['1', '2', '3']);
  });
});
