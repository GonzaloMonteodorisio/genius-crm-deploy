const express = require("express");
const router = express.Router();
const matchesService = require("../services/matches.service");

/**
 * @swagger
 * /api/matches/upcoming:
 *   get:
 *     summary: Obtener próximos partidos del Mundial 2026
 *     description: Retorna los próximos partidos con información de oferta opcional para mostrar u ocultar el contador en frontend.
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: Lista de próximos partidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 */
router.get("/upcoming", (req, res, next) => {
  try {
    const upcomingMatches = matchesService.getUpcomingMatches();

    res.status(200).json(upcomingMatches);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
