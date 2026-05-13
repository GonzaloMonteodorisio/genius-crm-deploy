const db = require("../data/db");

const getUpcomingMatches = () => {
  const now = new Date();

  return db.matches
    .filter((match) => new Date(match.matchDate) > now)
    .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate))
    .map((match) => ({
      ...match,
      hasActiveOffer: match.offer?.active || false,
    }));
};

module.exports = {
  getUpcomingMatches,
};
