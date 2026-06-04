export const getEnv = (key, defaultValue = "") => {
  // Runtime (Docker): window.__ENV__
  if (window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }

  // Local development: import.meta.env
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }

  return defaultValue;
};
