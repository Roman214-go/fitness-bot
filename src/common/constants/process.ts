export const process = {
  env: {
    REACT_APP_BASE_URL: import.meta.env.REACT_APP_BASE_URL,
  } as { [key in string]: string },
} as const;
