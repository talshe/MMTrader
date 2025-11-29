export const toISO = (value: Date | string | number): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }

  return new Date(value).toISOString();
};

export const nowISO = (): string => new Date().toISOString();

