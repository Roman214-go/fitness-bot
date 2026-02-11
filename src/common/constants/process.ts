export const process = {
  env: {
    REACT_APP_BASE_URL: import.meta.env.REACT_APP_BASE_URL,
    REACT_APP_BASE_EMPTY_URL: import.meta.env.REACT_APP_BASE_EMPTY_URL,
  } as { [key in string]: string },
} as const;
