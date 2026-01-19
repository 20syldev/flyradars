import { useState } from 'react';
import { Play, Loader2, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface Requete {
	id: number;
	titre: string;
	description: string;
	endpoint: string;
	sql: string;
	params?: { nom: string; placeholder: string }[];
}

const requetes: Requete[] = [
	{
		id: 1,
		titre: 'Aéroports d\'une ville',
		description: 'Liste des aéroports situés dans une ville donnée',
		endpoint: '/api/aeroports',
		sql: `SELECT a.nom_aeroport AS nom
FROM aeroport a
JOIN ville v ON a.ville_id = v.ville_id
WHERE v.nom_ville = $1`,
		params: [{ nom: 'ville', placeholder: 'Paris' }]
	},
	{
		id: 2,
		titre: 'Vols atterrissant à un aéroport',
		description: 'Numéro de vol, compagnie et modèle d\'avion',
		endpoint: '/api/vols',
		sql: `SELECT v.numero AS numero_vol, c.nom AS compagnie, av.modele
FROM vol v
JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN avion av ON v.avion_id = av.avion_id
WHERE aer_arr.nom_aeroport = $1`,
		params: [{ nom: 'aeroport', placeholder: 'JFK Airport' }]
	},
	{
		id: 3,
		titre: 'Compagnies par capacité',
		description: 'Compagnies avec avions de capacité supérieure à X',
		endpoint: '/api/compagnies/capacite-min',
		sql: `SELECT DISTINCT c.nom
FROM compagnie c
JOIN vol v ON v.compagnie_id = c.compagnie_id
JOIN avion a ON v.avion_id = a.avion_id
WHERE a.capacite > $1`,
		params: [{ nom: 'capacite', placeholder: '300' }]
	},
	{
		id: 4,
		titre: 'Pilotes par aéroport',
		description: 'Pilotes décollant d\'un aéroport donné',
		endpoint: '/api/pilotes',
		sql: `SELECT DISTINCT p.nom, p.prenom, c.nom AS nom_compagnie
FROM vol v
JOIN operation op ON v.vol_id = op.vol_id
JOIN personnel p ON op.personnel_id = p.personnel_id
JOIN pilote pi ON p.personnel_id = pi.personnel_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
WHERE aer_dep.nom_aeroport = $1`,
		params: [{ nom: 'aeroport', placeholder: 'Roissy Charles de Gaulle' }]
	},
	{
		id: 5,
		titre: 'Copilotes par ville',
		description: 'Copilotes décollant d\'une ville avec vols >= X passagers',
		endpoint: '/api/copilotes',
		sql: `SELECT DISTINCT p.nom, p.prenom, c.nom AS nom_compagnie
FROM vol v
JOIN operation op ON v.vol_id = op.vol_id
JOIN personnel p ON op.personnel_id = p.personnel_id
JOIN copilote co ON p.personnel_id = co.personnel_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN ville vi ON aer_dep.ville_id = vi.ville_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN vol_passager vp ON v.vol_id = vp.vol_id
WHERE vi.nom_ville = $1
AND vp.nb_passagers >= $2`,
		params: [
			{ nom: 'ville', placeholder: 'Paris' },
			{ nom: 'min', placeholder: '200' }
		]
	},
	{
		id: 6,
		titre: 'Personnel navigant',
		description: 'Nom, prénom et date d\'entrée dans la compagnie',
		endpoint: '/api/navigants',
		sql: `SELECT p.nom, p.prenom, n.date_entree_compagnie, c.nom AS compagnie
FROM navigant n
JOIN personnel p ON n.personnel_id = p.personnel_id
JOIN compagnie c ON n.compagnie_id = c.compagnie_id
ORDER BY n.date_entree_compagnie`,
	},
	{
		id: 7,
		titre: 'Vols de fret',
		description: 'Vols de fret avec poids supérieur à X kg',
		endpoint: '/api/fret/poids-min',
		sql: `SELECT v.numero, vf.poids_kg, c.nom AS compagnie,
       aer_dep.nom_aeroport AS depart, aer_arr.nom_aeroport AS arrivee
FROM vol_fret vf
JOIN vol v ON vf.vol_id = v.vol_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
WHERE vf.poids_kg > $1
ORDER BY vf.poids_kg DESC`,
		params: [{ nom: 'poids', placeholder: '10000' }]
	},
	{
		id: 8,
		titre: 'Avions par constructeur',
		description: 'Modèles, capacité et date de mise en service',
		endpoint: '/api/avions/constructeur',
		sql: `SELECT a.modele, a.capacite, a.date_mise_service
FROM avion a
JOIN constructeur c ON a.constructeur_id = c.constructeur_id
WHERE c.nom = $1
ORDER BY a.date_mise_service DESC`,
		params: [{ nom: 'nom', placeholder: 'Airbus' }]
	},
	{
		id: 9,
		titre: 'Vols d\'une compagnie',
		description: 'Tous les vols d\'une compagnie donnée',
		endpoint: '/api/vols/compagnie',
		sql: `SELECT v.numero, v.date_vol, v.heure_depart, v.heure_arrivee,
       aer_dep.nom_aeroport AS depart, aer_arr.nom_aeroport AS arrivee,
       av.modele
FROM vol v
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
JOIN avion av ON v.avion_id = av.avion_id
WHERE c.nom = $1
ORDER BY v.date_vol, v.heure_depart`,
		params: [{ nom: 'nom', placeholder: 'Air France' }]
	},
	{
		id: 10,
		titre: 'Statistiques par compagnie',
		description: 'Nombre de vols par compagnie (LEFT JOIN)',
		endpoint: '/api/stats/vols-par-compagnie',
		sql: `SELECT c.nom AS compagnie, COUNT(v.vol_id) AS nombre_vols
FROM compagnie c
LEFT JOIN vol v ON c.compagnie_id = v.compagnie_id
GROUP BY c.compagnie_id, c.nom
HAVING COUNT(v.vol_id) > 0
ORDER BY nombre_vols DESC`,
	},
	{
		id: 11,
		titre: 'Constructeurs et avions (RIGHT JOIN)',
		description: 'Liste des constructeurs avec leurs avions (inclut constructeurs sans avion)',
		endpoint: '/api/constructeurs/avions',
		sql: `SELECT c.nom AS constructeur, a.modele, a.capacite
FROM avion a
RIGHT JOIN constructeur c ON a.constructeur_id = c.constructeur_id
ORDER BY c.nom, a.modele`,
	},
	{
		id: 12,
		titre: 'Vols > moyenne passagers (Imbriquée)',
		description: 'Vols avec plus de passagers que la moyenne (requête imbriquée)',
		endpoint: '/api/stats/vols-passagers-sup-moyenne',
		sql: `SELECT v.numero, c.nom AS compagnie, vp.nb_passagers,
       aer_dep.nom_aeroport AS depart, aer_arr.nom_aeroport AS arrivee
FROM vol_passager vp
JOIN vol v ON vp.vol_id = v.vol_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
WHERE vp.nb_passagers > (SELECT AVG(nb_passagers) FROM vol_passager)
ORDER BY vp.nb_passagers DESC`,
	},
];

export function QueriesTab() {
	const [selectedQuery, setSelectedQuery] = useState<Requete | null>(null);
	const [params, setParams] = useState<Record<string, string>>({});
	const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const executeQuery = async () => {
		if (!selectedQuery) return;

		setLoading(true);
		setError(null);
		setResults(null);

		try {
			let url = `http://localhost:3001${selectedQuery.endpoint}`;

			if (selectedQuery.params) {
				const paramValues = selectedQuery.params.map(p => encodeURIComponent(params[p.nom] || p.placeholder));
				url += '/' + paramValues.join('/');
			}

			const response = await fetch(url);
			if (!response.ok) throw new Error('Erreur serveur');

			const data = await response.json();
			setResults(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur inconnue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-foreground mb-2">
					Requêtes SQL
				</h2>
				<p className="text-muted-foreground">
					Exécutez des requêtes prédéfinies sur la base de données
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Liste des requêtes */}
				<Card className="lg:col-span-1">
					<CardContent className="p-2 space-y-1">
						{requetes.map((req, index) => (
							<Button
								key={req.id}
								variant={selectedQuery?.id === req.id ? 'secondary' : 'ghost'}
								className="w-full justify-start gap-2 animate-slide-up"
								style={{ animationDelay: `${index * 30}ms` }}
								onClick={() => {
									setSelectedQuery(req);
									setParams({});
									setResults(null);
									setError(null);
								}}
							>
								<span className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
									{req.id}
								</span>
								<span className="truncate text-sm">{req.titre}</span>
							</Button>
						))}
					</CardContent>
				</Card>

				{/* Zone d'exécution */}
				<div className="lg:col-span-2">
					{selectedQuery ? (
						<Card>
							<CardHeader>
								<CardTitle>{selectedQuery.titre}</CardTitle>
								<CardDescription>{selectedQuery.description}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Requête SQL */}
								<div className="rounded-md bg-slate-950 p-4 overflow-x-auto">
									<div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
										<Code className="h-3 w-3" />
										SQL
									</div>
									<pre className="text-sm text-green-400 font-mono whitespace-pre">
										{selectedQuery.sql}
									</pre>
								</div>

								{/* Paramètres */}
								{selectedQuery.params && (
									<div className="flex flex-wrap gap-3">
										{selectedQuery.params.map(param => (
											<Input
												key={param.nom}
												type="text"
												placeholder={param.placeholder}
												value={params[param.nom] || ''}
												onChange={(e) => setParams({ ...params, [param.nom]: e.target.value })}
												className="w-auto"
											/>
										))}
									</div>
								)}

								<Button onClick={executeQuery} disabled={loading} className="gap-2">
									{loading ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin"/>
											Chargement...
										</>
									) : (
										<>
											<Play className="h-4 w-4"/>
											Exécuter
										</>
									)}
								</Button>

								{/* Erreur */}
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{/* Résultats */}
								{results && (
									<div className="overflow-hidden">
										<p className="text-sm text-muted-foreground mb-2">
											{results.length} résultat{results.length > 1 ? 's' : ''}
										</p>
										<div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
											{results.length > 0 ? (
												<Table>
													<TableHeader>
														<TableRow>
															{Object.keys(results[0]).map(key => (
																<TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
															))}
														</TableRow>
													</TableHeader>
													<TableBody>
														{results.map((row, i) => (
															<TableRow
																key={i}
																className="animate-fade-in"
																style={{ animationDelay: `${i * 20}ms` }}
															>
																{Object.values(row).map((val, j) => (
																	<TableCell key={j} className="whitespace-nowrap">{String(val)}</TableCell>
																))}
															</TableRow>
														))}
													</TableBody>
												</Table>
											) : (
												<div className="p-4 text-center text-muted-foreground">
													Aucun résultat trouvé
												</div>
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					) : (
						<Card className="h-full flex items-center justify-center border-dashed border-gray-300 dark:border-gray-600">
							<CardContent className="py-12">
								<p className="text-muted-foreground text-center">
									Sélectionnez une requête à gauche pour l'exécuter
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
