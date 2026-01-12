-- ============================================
-- FlyRadars - Vues SQL
-- ============================================

-- Vue personnel public (sans données sensibles)
CREATE OR REPLACE VIEW v_personnel_public AS
SELECT
    personnel_id,
    nom,
    prenom
FROM personnel;

-- Vue des vols avec détails complets
CREATE OR REPLACE VIEW v_vols_details AS
SELECT
    v.vol_id,
    v.numero,
    v.date_vol,
    v.heure_depart,
    v.heure_arrivee,
    c.nom AS compagnie,
    av.modele AS avion,
    cons.nom AS constructeur,
    aer_dep.nom_aeroport AS aeroport_depart,
    vil_dep.nom_ville AS ville_depart,
    vil_dep.pays AS pays_depart,
    aer_arr.nom_aeroport AS aeroport_arrivee,
    vil_arr.nom_ville AS ville_arrivee,
    vil_arr.pays AS pays_arrivee
FROM vol v
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN avion av ON v.avion_id = av.avion_id
JOIN constructeur cons ON av.constructeur_id = cons.constructeur_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN ville vil_dep ON aer_dep.ville_id = vil_dep.ville_id
JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
JOIN ville vil_arr ON aer_arr.ville_id = vil_arr.ville_id;

-- Vue statistiques par compagnie
CREATE OR REPLACE VIEW v_stats_compagnies AS
SELECT
    c.compagnie_id,
    c.nom AS compagnie,
    COUNT(v.vol_id) AS nombre_vols,
    COUNT(DISTINCT v.avion_id) AS avions_utilises,
    COUNT(DISTINCT v.aeroport_depart) AS aeroports_depart,
    COUNT(DISTINCT v.aeroport_arrivee) AS aeroports_arrivee
FROM compagnie c
LEFT JOIN vol v ON c.compagnie_id = v.compagnie_id
GROUP BY c.compagnie_id, c.nom
ORDER BY nombre_vols DESC;

-- Vue navigants avec compagnie
CREATE OR REPLACE VIEW v_navigants AS
SELECT
    p.personnel_id,
    p.nom,
    p.prenom,
    n.date_entree_compagnie,
    c.nom AS compagnie,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, n.date_entree_compagnie)) AS annees_anciennete
FROM navigant n
JOIN personnel p ON n.personnel_id = p.personnel_id
JOIN compagnie c ON n.compagnie_id = c.compagnie_id
ORDER BY n.date_entree_compagnie;

-- Vue pilotes avec statistiques
CREATE OR REPLACE VIEW v_pilotes_stats AS
SELECT
    p.personnel_id,
    p.nom,
    p.prenom,
    pi.date_obtention_licence,
    COUNT(op.vol_id) AS nombre_vols,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, pi.date_obtention_licence)) AS annees_experience
FROM pilote pi
JOIN personnel p ON pi.personnel_id = p.personnel_id
LEFT JOIN operation op ON p.personnel_id = op.personnel_id
GROUP BY p.personnel_id, p.nom, p.prenom, pi.date_obtention_licence
ORDER BY nombre_vols DESC;

-- Vue copilotes avec statistiques
CREATE OR REPLACE VIEW v_copilotes_stats AS
SELECT
    p.personnel_id,
    p.nom,
    p.prenom,
    co.date_capacite_ligne,
    COUNT(op.vol_id) AS nombre_vols,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, co.date_capacite_ligne)) AS annees_experience
FROM copilote co
JOIN personnel p ON co.personnel_id = p.personnel_id
LEFT JOIN operation op ON p.personnel_id = op.personnel_id
GROUP BY p.personnel_id, p.nom, p.prenom, co.date_capacite_ligne
ORDER BY nombre_vols DESC;

-- Vue vols passagers avec détails
CREATE OR REPLACE VIEW v_vols_passagers AS
SELECT
    v.numero,
    v.date_vol,
    c.nom AS compagnie,
    vp.nb_passagers,
    av.capacite AS capacite_avion,
    ROUND((vp.nb_passagers::DECIMAL / av.capacite) * 100, 1) AS taux_remplissage
FROM vol_passager vp
JOIN vol v ON vp.vol_id = v.vol_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN avion av ON v.avion_id = av.avion_id
ORDER BY taux_remplissage DESC;

-- Vue vols fret avec détails
CREATE OR REPLACE VIEW v_vols_fret AS
SELECT
    v.numero,
    v.date_vol,
    c.nom AS compagnie,
    vf.poids_kg,
    aer_dep.nom_aeroport AS depart,
    aer_arr.nom_aeroport AS arrivee
FROM vol_fret vf
JOIN vol v ON vf.vol_id = v.vol_id
JOIN compagnie c ON v.compagnie_id = c.compagnie_id
JOIN aeroport aer_dep ON v.aeroport_depart = aer_dep.aeroport_id
JOIN aeroport aer_arr ON v.aeroport_arrivee = aer_arr.aeroport_id
ORDER BY vf.poids_kg DESC;

-- Vue avions par constructeur
CREATE OR REPLACE VIEW v_avions_constructeurs AS
SELECT
    cons.nom AS constructeur,
    av.modele,
    av.capacite,
    av.date_mise_service,
    COUNT(v.vol_id) AS nombre_vols
FROM avion av
JOIN constructeur cons ON av.constructeur_id = cons.constructeur_id
LEFT JOIN vol v ON av.avion_id = v.avion_id
GROUP BY cons.nom, av.avion_id, av.modele, av.capacite, av.date_mise_service
ORDER BY cons.nom, av.modele;

-- Vue aéroports avec statistiques
CREATE OR REPLACE VIEW v_aeroports_stats AS
SELECT
    a.aeroport_id,
    a.nom_aeroport,
    vil.nom_ville,
    vil.pays,
    COUNT(DISTINCT v_dep.vol_id) AS vols_depart,
    COUNT(DISTINCT v_arr.vol_id) AS vols_arrivee,
    COUNT(DISTINCT v_dep.vol_id) + COUNT(DISTINCT v_arr.vol_id) AS total_mouvements
FROM aeroport a
JOIN ville vil ON a.ville_id = vil.ville_id
LEFT JOIN vol v_dep ON a.aeroport_id = v_dep.aeroport_depart
LEFT JOIN vol v_arr ON a.aeroport_id = v_arr.aeroport_arrivee
GROUP BY a.aeroport_id, a.nom_aeroport, vil.nom_ville, vil.pays
ORDER BY total_mouvements DESC;