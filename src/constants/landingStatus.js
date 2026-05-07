const LandingStatus = {
  ACTIVA: "ACTIVE",
  BORRADOR: "DRAFT",
  FINALIZADA: "DONE",
};

function normalizeStatus(status) {
  if (!status) return null;

  const value = status.trim().toUpperCase();

  if (Object.values(LandingStatus).includes(value)) {
    return value;
  }

  return null;
}

module.exports = {
  LandingStatus,
  normalizeStatus,
};