/* eslint-disable import/prefer-default-export */

export const delaySeconds = (seconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
