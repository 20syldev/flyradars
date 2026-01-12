import { Router } from 'express';
import { pool } from '../db.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlDir = join(__dirname, '../../sql');

// Exécuter un script SQL
router.post('/execute', async (req, res) => {
	const { script } = req.body;

	const scripts: Record<string, string> = {
		drop: '01_drop.sql',
		create: '02_create.sql',
		insert: '03_insert.sql',
		views: '04_views.sql'
	};

	if (!script || !scripts[script]) {
		return res.status(400).json({ error: 'Script invalide' });
	}

	try {
		const filePath = join(sqlDir, scripts[script]);
		const sql = readFileSync(filePath, 'utf-8');

		await pool.query(sql);

		res.json({ success: true, message: `Script ${scripts[script]} exécuté avec succès` });
	} catch (err) {
		console.error('Erreur exécution SQL:', err);
		res.status(500).json({
			error: err instanceof Error ? err.message : 'Erreur inconnue'
		});
	}
});

// Récupérer les données d'une vue
router.get('/views/:viewName', async (req, res) => {
	const { viewName } = req.params;

	// Liste des vues autorisées
	const allowedViews = [
		'v_personnel_public',
		'v_vols_details',
		'v_stats_compagnies',
		'v_navigants',
		'v_pilotes_stats',
		'v_copilotes_stats',
		'v_vols_passagers',
		'v_vols_fret',
		'v_avions_constructeurs',
		'v_aeroports_stats'
	];

	if (!allowedViews.includes(viewName)) {
		return res.status(400).json({ error: 'Vue non autorisée' });
	}

	try {
		const result = await pool.query(`SELECT * FROM ${viewName} LIMIT 100`);
		res.json(result.rows);
	} catch (err) {
		console.error('Erreur lecture vue:', err);
		res.status(500).json({
			error: err instanceof Error ? err.message : 'Erreur inconnue'
		});
	}
});

export default router;
