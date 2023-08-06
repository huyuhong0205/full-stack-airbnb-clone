const emailFormat =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const valNotEmpty = (value: string) => value.trim().length !== 0;

export const valIsEmail = (value: string) => emailFormat.test(value);

export const valIsSame = (compareVal: string) => (value: string) =>
  compareVal === value;

export const valMinLength = (length: number) => (value: string) =>
  value.trim().length >= length;

export const valMaxLength = (length: number) => (value: string) =>
  value.trim().length <= length;

export const valMinValue = (min: number) => (value: string) =>
  !Number.isNaN(+value) && +value >= min;

export const valMaxValue = (max: number) => (value: string) =>
  !Number.isNaN(+value) && +value <= max;
