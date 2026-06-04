export const hasRole = (user, roles = []) => {
  // No required roles → visible for any authenticated user
  if (!roles.length) return true;

  const userRoles = user?.roles || [];

  return roles.some(role => userRoles.includes(role));
};
