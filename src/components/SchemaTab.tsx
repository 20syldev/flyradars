import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TableInfo {
	nom: string;
	colonnes: string[];
	description: string;
}

const tables: TableInfo[] = [
	{ nom: 'ville', colonnes: ['ville_id', 'nom_ville', 'pays'], description: 'Villes avec pays' },
	{ nom: 'aeroport', colonnes: ['aeroport_id', 'nom_aeroport', 'ville_id'], description: 'Aéroports liés aux villes' },
	{ nom: 'compagnie', colonnes: ['compagnie_id', 'nom'], description: 'Compagnies aériennes' },
	{ nom: 'constructeur', colonnes: ['constructeur_id', 'nom'], description: 'Constructeurs d\'avions' },
	{ nom: 'avion', colonnes: ['avion_id', 'modele', 'capacite', 'date_mise_service', 'constructeur_id'], description: 'Avions avec caractéristiques' },
	{ nom: 'personnel', colonnes: ['personnel_id', 'nom', 'prenom', 'numero_licence'], description: 'Personnel navigant' },
	{ nom: 'pilote', colonnes: ['personnel_id', 'date_obtention_licence'], description: 'Pilotes (hérite de personnel)' },
	{ nom: 'copilote', colonnes: ['personnel_id', 'date_capacite_ligne'], description: 'Copilotes (hérite de personnel)' },
	{ nom: 'navigant', colonnes: ['personnel_id', 'date_entree_compagnie', 'compagnie_id'], description: 'Personnel de cabine' },
	{ nom: 'vol', colonnes: ['vol_id', 'date_vol', 'numero', 'heure_depart', 'heure_arrivee', 'compagnie_id', 'avion_id', 'aeroport_depart', 'aeroport_arrivee'], description: 'Vols programmés' },
	{ nom: 'operation', colonnes: ['vol_id', 'personnel_id'], description: 'Relation vol-personnel' },
	{ nom: 'vol_passager', colonnes: ['vol_id', 'nb_passagers'], description: 'Vols de passagers' },
	{ nom: 'vol_fret', colonnes: ['vol_id', 'poids_kg'], description: 'Vols de fret' },
];

export function SchemaTab() {
	return (
		<div className="space-y-6 animate-fade-in">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-foreground mb-2">
					Modélisation & Schéma
				</h2>
				<p className="text-muted-foreground">
					Structure de la base de données FlyRadars - 13 tables
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{tables.map((table, index) => (
					<Card
						key={table.nom}
						className="transition-all duration-300 hover:shadow-md animate-slide-up"
						style={{ animationDelay: `${index * 50}ms` }}
					>
						<CardHeader className="p-4 pb-2">
							<div className="flex items-center gap-2">
								<CardTitle className="text-base">{table.nom}</CardTitle>
							</div>
							<CardDescription className="text-xs">
								{table.description}
							</CardDescription>
						</CardHeader>
						<CardContent className="p-4 pt-0">
							<div className="flex flex-wrap gap-1.5">
								{table.colonnes.map(col => (
									<Badge key={col} variant="secondary" className="text-xs">
										{col}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
