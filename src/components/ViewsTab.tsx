import { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface ViewInfo {
	nom: string;
	description: string;
	colonnes: string[];
}

const views: ViewInfo[] = [
	{
		nom: 'v_personnel_public',
		description: 'Personnel sans données sensibles',
		colonnes: ['personnel_id', 'nom', 'prenom']
	},
	{
		nom: 'v_vols_details',
		description: 'Vols avec toutes les informations',
		colonnes: ['vol_id', 'numero', 'date_vol', 'compagnie', 'avion', 'ville_depart', 'ville_arrivee']
	},
	{
		nom: 'v_stats_compagnies',
		description: 'Statistiques par compagnie',
		colonnes: ['compagnie', 'nombre_vols', 'avions_utilises', 'aeroports_depart', 'aeroports_arrivee']
	},
	{
		nom: 'v_navigants',
		description: 'Navigants avec ancienneté',
		colonnes: ['nom', 'prenom', 'date_entree_compagnie', 'compagnie', 'annees_anciennete']
	},
	{
		nom: 'v_pilotes_stats',
		description: 'Pilotes avec nombre de vols',
		colonnes: ['nom', 'prenom', 'date_obtention_licence', 'nombre_vols', 'annees_experience']
	},
	{
		nom: 'v_copilotes_stats',
		description: 'Copilotes avec nombre de vols',
		colonnes: ['nom', 'prenom', 'date_capacite_ligne', 'nombre_vols', 'annees_experience']
	},
	{
		nom: 'v_vols_passagers',
		description: 'Vols passagers avec taux de remplissage',
		colonnes: ['numero', 'date_vol', 'compagnie', 'nb_passagers', 'capacite_avion', 'taux_remplissage']
	},
	{
		nom: 'v_vols_fret',
		description: 'Vols fret avec détails',
		colonnes: ['numero', 'date_vol', 'compagnie', 'poids_kg', 'depart', 'arrivee']
	},
	{
		nom: 'v_avions_constructeurs',
		description: 'Avions groupés par constructeur',
		colonnes: ['constructeur', 'modele', 'capacite', 'date_mise_service', 'nombre_vols']
	},
	{
		nom: 'v_aeroports_stats',
		description: 'Statistiques par aéroport',
		colonnes: ['nom_aeroport', 'nom_ville', 'pays', 'vols_depart', 'vols_arrivee', 'total_mouvements']
	},
];

export function ViewsTab() {
	const [selectedView, setSelectedView] = useState<ViewInfo | null>(null);
	const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const executeView = async (view: ViewInfo) => {
		setSelectedView(view);
		setLoading(true);
		setError(null);
		setResults(null);

		try {
			const response = await fetch(`http://localhost:3001/api/admin/views/${view.nom}`);
			if (!response.ok) throw new Error('Erreur serveur - Vue non disponible');

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
					Vues SQL
				</h2>
				<p className="text-muted-foreground">
					Vues précalculées pour faciliter l'accès aux données
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				{views.map((view, index) => (
					<Card
						key={view.nom}
						className={`cursor-pointer transition-all duration-300 animate-slide-up hover:shadow-md flex items-center
							${selectedView?.nom === view.nom ? 'ring-2 ring-primary' : ''}`}
						style={{ animationDelay: `${index * 40}ms` }}
						onClick={() => executeView(view)}
					>
						<CardHeader className="py-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0">
									<Database className="h-5 w-5"/>
								</div>
								<div className="min-w-0">
									<CardTitle className="text-sm truncate">{view.nom}</CardTitle>
									<CardDescription className="text-xs mt-1">
										{view.description}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
				))}
			</div>

			{/* Résultats */}
			{(loading || error || results) && (
				<Card className="overflow-hidden">
					{selectedView && (
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
									<Database className="h-4 w-4"/>
								</div>
								<div>
									<CardTitle className="text-base">{selectedView.nom}</CardTitle>
									<CardDescription>{selectedView.description}</CardDescription>
								</div>
							</div>
						</CardHeader>
					)}
					<CardContent>
						{loading && (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-primary"/>
							</div>
						)}

						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

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
														<TableHead key={key} className="whitespace-nowrap">
															{key}
														</TableHead>
													))}
												</TableRow>
											</TableHeader>
											<TableBody>
												{results.slice(0, 50).map((row, i) => (
													<TableRow
														key={i}
														className="animate-fade-in"
														style={{ animationDelay: `${i * 15}ms` }}
													>
														{Object.values(row).map((val, j) => (
															<TableCell key={j} className="whitespace-nowrap">
																{val === null ? (
																	<span className="text-muted-foreground">NULL</span>
																) : (
																	String(val)
																)}
															</TableCell>
														))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<div className="p-4 text-center text-muted-foreground">
											Aucun résultat
										</div>
									)}
								</div>
								{results.length > 50 && (
									<p className="mt-2 text-xs text-muted-foreground">
										Affichage limité aux 50 premiers résultats
									</p>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
