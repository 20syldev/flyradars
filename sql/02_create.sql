-- ============================================
-- FlyRadars - Création des tables
-- ============================================

-- 1. Ville
CREATE TABLE ville (
    ville_id SERIAL PRIMARY KEY,
    nom_ville VARCHAR(100) NOT NULL,
    pays VARCHAR(100) NOT NULL
);

-- 2. Aeroport
CREATE TABLE aeroport (
    aeroport_id SERIAL PRIMARY KEY,
    nom_aeroport VARCHAR(100) NOT NULL,
    ville_id INT NOT NULL REFERENCES ville(ville_id)
);

-- 3. Compagnie
CREATE TABLE compagnie (
    compagnie_id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- 4. Constructeur
CREATE TABLE constructeur (
    constructeur_id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- 5. Avion
CREATE TABLE avion (
    avion_id SERIAL PRIMARY KEY,
    modele VARCHAR(50) NOT NULL,
    capacite INT NOT NULL,
    date_mise_service DATE,
    constructeur_id INT NOT NULL REFERENCES constructeur(constructeur_id)
);

-- 6. Personnel
CREATE TABLE personnel (
    personnel_id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    numero_licence VARCHAR(50) UNIQUE NOT NULL
);

-- 7. Pilote (héritage de Personnel)
CREATE TABLE pilote (
    personnel_id INT PRIMARY KEY REFERENCES personnel(personnel_id),
    date_obtention_licence DATE NOT NULL
);

-- 8. Copilote (héritage de Personnel)
CREATE TABLE copilote (
    personnel_id INT PRIMARY KEY REFERENCES personnel(personnel_id),
    date_capacite_ligne DATE NOT NULL
);

-- 9. Navigant (héritage de Personnel - personnel de cabine)
CREATE TABLE navigant (
    personnel_id INT PRIMARY KEY REFERENCES personnel(personnel_id),
    date_entree_compagnie DATE NOT NULL,
    compagnie_id INT NOT NULL REFERENCES compagnie(compagnie_id)
);

-- 10. Vol
CREATE TABLE vol (
    vol_id SERIAL PRIMARY KEY,
    date_vol DATE NOT NULL,
    numero VARCHAR(20) NOT NULL,
    heure_depart TIME NOT NULL,
    heure_arrivee TIME NOT NULL,
    compagnie_id INT NOT NULL REFERENCES compagnie(compagnie_id),
    avion_id INT NOT NULL REFERENCES avion(avion_id),
    aeroport_depart INT NOT NULL REFERENCES aeroport(aeroport_id),
    aeroport_arrivee INT NOT NULL REFERENCES aeroport(aeroport_id)
);

-- 11. Operation (relation n-n entre Vol et Personnel)
CREATE TABLE operation (
    vol_id INT NOT NULL REFERENCES vol(vol_id),
    personnel_id INT NOT NULL REFERENCES personnel(personnel_id),
    PRIMARY KEY (vol_id, personnel_id)
);

-- 12. Vol Passager (héritage de Vol)
CREATE TABLE vol_passager (
    vol_id INT PRIMARY KEY REFERENCES vol(vol_id),
    nb_passagers INT NOT NULL
);

-- 13. Vol Fret (héritage de Vol)
CREATE TABLE vol_fret (
    vol_id INT PRIMARY KEY REFERENCES vol(vol_id),
    poids_kg DECIMAL(10,2) NOT NULL
);
