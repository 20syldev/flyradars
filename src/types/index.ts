// Entites de base
export interface Ville {
	ville_id: number;
	nom_ville: string;
	pays: string;
}

export interface Aeroport {
	aeroport_id: number;
	nom_aeroport: string;
	ville_id: number;
}

export interface Compagnie {
	compagnie_id: number;
	nom: string;
}

export interface Constructeur {
	constructeur_id: number;
	nom: string;
}

export interface Avion {
	avion_id: number;
	modele: string;
	capacite: number;
	date_mise_service: string;
	constructeur_id: number;
}

// Personnel et heritage
export interface Personnel {
	personnel_id: number;
	nom: string;
	prenom: string;
	numero_licence: string;
}

export interface Pilote {
	personnel_id: number;
	date_obtention_licence: string;
}

export interface Copilote {
	personnel_id: number;
	date_capacite_ligne: string;
}

export interface Navigant {
	personnel_id: number;
	date_entree_compagnie: string;
	compagnie_id: number;
}

// Vol et heritage
export interface Vol {
	vol_id: number;
	date_vol: string;
	numero: string;
	heure_depart: string;
	heure_arrivee: string;
	compagnie_id: number;
	avion_id: number;
	aeroport_depart: number;
	aeroport_arrivee: number;
}

export interface Operation {
	vol_id: number;
	personnel_id: number;
}

export interface VolPassager {
	vol_id: number;
	nb_passagers: number;
}

export interface VolFret {
	vol_id: number;
	poids_kg: number;
}

// Types pour les resultats de requetes
export interface VolAvecDetails {
	numero_vol: string;
	compagnie: string;
	modele: string;
}

export interface PersonnelAvecCompagnie {
	nom: string;
	prenom: string;
	nom_compagnie: string;
}

// Interface pour les requetes de l'interface
export interface Requete {
	id: number;
	titre: string;
	sql: string;
	endpoint: string;
	colonnes: string[];
}
