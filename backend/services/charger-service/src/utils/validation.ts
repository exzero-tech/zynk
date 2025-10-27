export const validateChargerPayload = (payload: any, opts?: { partial?: boolean }) => {
  if (!payload) return { valid: false, message: 'Empty payload' };
  const { partial } = opts || {};
  if (!partial) {
    if (!payload.name) return { valid: false, message: 'name is required' };
    if (!payload.location && !payload.lat && !payload.lng) return { valid: false, message: 'location or lat/lng required' };
  }
  // Basic shape checks (can be extended)
  return { valid: true };
};

export default { validateChargerPayload };
