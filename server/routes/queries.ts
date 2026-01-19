import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// 1. Aéroports d'une ville
router.get('/aeroports/:ville', async (req, res) => {
	const { ville } = req.params;
	const result = await pool.query(`
		SELECT a.nom_aeroport AS nom
		FROM aeroport a
		JOIN ville v ON a.ville_id = v.ville_id
		WHERE v.nom_ville = $1
	`, [ville]);
	res.json(result.rows);
});

// 2. Vols atterrissant à un aéroport
router.get('/vols/:aeroport', async (req, res) => {
	const { aeroport } = req.params;
	const result = await pool.query(`
		SELECT v.numero AS numero_vol, c.nom AS compagnie, av.modele
		FROM vol v
		JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
		JOIN compagnie c ON v.compagnie_id = c.compagnie_id
		JOIN avion av ON v.avion_id = av.avion_id
		WHERE aer_arr.nom_aeroport = $1
	`, [aeroport]);
	res.json(result.rows);
});

// 3. Compagnies avec avions de capacité > X
router.get('/compagnies/capacite-min/:capacite', async (req, res) => {
	const capacite = parseInt(req.params.capacite, 10);
	const result = await pool.query(`
		SELECT DISTINCT c.nom
		FROM compagnie c
		JOIN vol v ON v.compagnie_id = c.compagnie_id
		JOIN avion a ON v.avion_id = a.avion_id
		WHERE a.capacite > $1
	`, [capacite]);
	res.json(result.rows);
});

// 4. Pilotes décollant d'un aéroport
router.get('/pilotes/:aeroport', async (req, res) => {
	const { aeroport } = req.params;
	const result = await pool.query(`
		SELECT DISTINCT p.nom, p.prenom, c.nom AS nom_compagnie
		FROM vol v
		JOIN operation op ON v.vol_id = op.vol_id
		JOIN personnel p ON op.personnel_id = p.personnel_id
		JOIN pilote pi ON p.personnel_id = pi.personnel_id
		JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
		JOIN compagnie c ON v.compagnie_id = c.compagnie_id
		WHERE aer_dep.nom_aeroport = $1
	`, [aeroport]);
	res.json(result.rows);
});

// 5. Copilotes décollant d'une ville avec vols >= X passagers
router.get('/copilotes/:ville/:min', async (req, res) => {
	const { ville } = req.params;
	const min = parseInt(req.params.min, 10);
	const result = await pool.query(`
		SELECT DISTINCT p.nom, p.prenom, c.nom AS nom_compagnie
		FROM vol v
		JOIN operation op ON v.vol_id = op.vol_id
		JOIN personnel p ON op.personnel_id = p.personnel_id
		JOIN copilote co ON p.personnel_id = co.personnel_id
		JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
		JOIN ville vi ON aer_dep.ville_id = vi.ville_id
		JOIN compagnie c ON v.compagnie_id = c.compagnie_id
		JOIN vol_passager vp ON v.vol_id = vp.vol_id
		WHERE vi.nom_ville = $1
		AND vp.nb_passagers >= $2
	`, [ville, min]);
	res.json(result.rows);
});

// 6. Navigants avec nom, prénom et date d'entrée dans la compagnie
router.get('/navigants', async (req, res) => {
	const result = await pool.query(`
		SELECT p.nom, p.prenom, n.date_entree_compagnie, c.nom AS compagnie
		FROM navigant n
		JOIN personnel p ON n.personnel_id = p.personnel_id
		JOIN compagnie c ON n.compagnie_id = c.compagnie_id
		ORDER BY n.date_entree_compagnie
	`);
	res.json(result.rows);
});

// 7. Vols de fret avec poids > X kg
router.get('/fret/poids-min/:poids', async (req, res) => {
	const poids = parseFloat(req.params.poids);
	const result = await pool.query(`
		SELECT v.numero, vf.poids_kg, c.nom AS compagnie,
		       aer_dep.nom_aeroport AS depart, aer_arr.nom_aeroport AS arrivee
		FROM vol_fret vf
		JOIN vol v ON vf.vol_id = v.vol_id
		JOIN compagnie c ON v.compagnie_id = c.compagnie_id
		JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
		JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
		WHERE vf.poids_kg > $1
		ORDER BY vf.poids_kg DESC
	`, [poids]);
	res.json(result.rows);
});

// 8. Avions d'un constructeur
router.get('/avions/constructeur/:nom', async (req, res) => {
	const { nom } = req.params;
	const result = await pool.query(`
		SELECT a.modele, a.capacite, a.date_mise_service
		FROM avion a
		JOIN constructeur c ON a.constructeur_id = c.constructeur_id
		WHERE c.nom = $1
		ORDER BY a.date_mise_service DESC
	`, [nom]);
	res.json(result.rows);
});

// 9. Tous les vols d'une compagnie
router.get('/vols/compagnie/:nom', async (req, res) => {
	const { nom } = req.params;
	const result = await pool.query(`
		SELECT v.numero, v.date_vol, v.heure_depart, v.heure_arrivee,
		       aer_dep.nom_aeroport AS depart, aer_arr.nom_aeroport AS arrivee,
		       av.modele
		FROM vol v
		JOIN compagnie c ON v.compagnie_id = c.compagnie_id
		JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
		JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
		JOIN avion av ON v.avion_id = av.avion_id
		WHERE c.nom = $1
		ORDER BY v.date_vol, v.heure_depart
	`, [nom]);
	res.json(result.rows);
});

// 10. Nombre de vols par compagnie
router.get('/stats/vols-par-compagnie', async (req, res) => {
	const result = await pool.query(`
		SELECT c.nom AS compagnie, COUNT(v.vol_id) AS nombre_vols
		FROM compagnie c
		LEFT JOIN vol v ON c.compagnie_id = v.compagnie_id
		GROUP BY c.compagnie_id, c.nom
		HAVING COUNT(v.vol_id) > 0
		ORDER BY nombre_vols DESC
	`);
	res.json(result.rows);
});

// 11. Constructeurs et leurs avions (RIGHT JOIN)
router.get('/constructeurs/avions', async (req, res) => {
	const result = await pool.query(`
		SELECT c.nom AS constructeur, a.modele, a.capacite
		FROM avion a
		RIGHT JOIN constructeur c ON a.constructeur_id = c.constructeur_id
		ORDER BY c.nom, a.modele
	`);
	res.json(result.rows);
});

// 12. Vols avec plus de passagers que la moyenne (requête imbriquée)
router.get('/stats/vols-passagers-sup-moyenne', async (req, res) => {
	const result = await pool.query(`
		SELECT v.numero, c.nom AS compagnie, vp.nb_passagers,
		       aer_dep.nom_aeroport AS depart, aer_arr.nom_aeroport AS arrivee
		FROM vol_passager vp
		JOIN vol v ON vp.vol_id = v.vol_id
		JOIN compagnie c ON v.compagnie_id = c.compagnie_id
		JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
		JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
		WHERE vp.nb_passagers > (SELECT AVG(nb_passagers) FROM vol_passager)
		ORDER BY vp.nb_passagers DESC
	`);
	res.json(result.rows);
});

export default router;
