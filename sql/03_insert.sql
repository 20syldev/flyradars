-- ============================================
-- FlyRadars - Insertion des données
-- ============================================

-- Ville (avec pays)
INSERT INTO ville (nom_ville, pays) VALUES
    ('Paris', 'France'),
    ('New-York', 'États-Unis'),
    ('London', 'Royaume-Uni'),
    ('Tokyo', 'Japon'),
    ('Dubai', 'Émirats Arabes Unis'),
    ('Los Angeles', 'États-Unis'),
    ('Berlin', 'Allemagne'),
    ('Madrid', 'Espagne'),
    ('Rome', 'Italie'),
    ('Amsterdam', 'Pays-Bas'),
    ('Sydney', 'Australie'),
    ('Singapore', 'Singapour'),
    ('Hong Kong', 'Chine'),
    ('Toronto', 'Canada'),
    ('Miami', 'États-Unis');

-- Aeroport
INSERT INTO aeroport (nom_aeroport, ville_id) VALUES
    ('Roissy Charles de Gaulle', 1),
    ('Orly', 1),
    ('JFK Airport', 2),
    ('La Guardia', 2),
    ('Newark', 2),
    ('Heathrow', 3),
    ('Gatwick', 3),
    ('Narita', 4),
    ('Haneda', 4),
    ('Dubai International', 5),
    ('Al Maktoum', 5),
    ('LAX', 6),
    ('Berlin Brandenburg', 7),
    ('Madrid Barajas', 8),
    ('Rome Fiumicino', 9),
    ('Schiphol', 10),
    ('Sydney Kingsford Smith', 11),
    ('Singapore Changi', 12),
    ('Hong Kong International', 13),
    ('Toronto Pearson', 14),
    ('Miami International', 15);

-- Compagnie
INSERT INTO compagnie (nom) VALUES
    ('Air France'),
    ('Delta Airlines'),
    ('FedEx'),
    ('Lufthansa'),
    ('British Airways'),
    ('Emirates'),
    ('Japan Airlines'),
    ('Qantas'),
    ('KLM'),
    ('Singapore Airlines'),
    ('American Airlines'),
    ('United Airlines'),
    ('Iberia'),
    ('Alitalia'),
    ('Air Canada'),
    ('DHL Aviation');

-- Constructeur
INSERT INTO constructeur (nom) VALUES
    ('Airbus'),
    ('Boeing'),
    ('Cessna');

-- Avion (constructeur_id: 1=Airbus, 2=Boeing, 3=Cessna)
INSERT INTO avion (modele, capacite, date_mise_service, constructeur_id) VALUES
    ('A380', 500, '2015-05-20', 1),
    ('B747', 400, '2010-03-15', 2),
    ('A320', 180, '2018-01-10', 1),
    ('Cessna Cargo', 4, '2020-01-01', 3),
    ('A350', 350, '2019-06-15', 1),
    ('B777', 396, '2012-09-01', 2),
    ('B787 Dreamliner', 330, '2017-04-20', 2),
    ('A380', 517, '2016-11-10', 1),
    ('B767', 290, '2014-02-28', 2),
    ('A330', 277, '2013-08-15', 1),
    ('B777-300ER', 365, '2018-12-01', 2),
    ('A350-900', 325, '2020-03-10', 1),
    ('B737 MAX', 178, '2021-07-01', 2),
    ('B757', 200, '2008-05-15', 2),
    ('A321neo', 220, '2022-01-20', 1),
    ('A320', 174, '2016-06-30', 1),
    ('B787', 296, '2019-11-05', 2),
    ('B767-300F', 0, '2015-03-22', 2),
    ('A330-200F', 0, '2017-09-18', 1),
    ('B747-8F', 0, '2018-04-12', 2);

-- Personnel
INSERT INTO personnel (prenom, nom, numero_licence) VALUES
    ('Jean', 'Dupont', 'LIC-001'),
    ('Sylvain', 'Lambert', 'LIC-002'),
    ('John', 'Smith', 'LIC-003'),
    ('Jane', 'Doe', 'LIC-004'),
    ('Pierre', 'Martin', 'LIC-005'),
    ('Sophie', 'Bernard', 'LIC-006'),
    ('Hans', 'Mueller', 'LIC-007'),
    ('Maria', 'Garcia', 'LIC-008'),
    ('Takeshi', 'Yamamoto', 'LIC-009'),
    ('Emily', 'Johnson', 'LIC-010'),
    ('Ahmed', 'Hassan', 'LIC-011'),
    ('Luca', 'Rossi', 'LIC-012'),
    ('Sarah', 'Williams', 'LIC-013'),
    ('Chen', 'Wei', 'LIC-014'),
    ('Anna', 'Kowalski', 'LIC-015'),
    ('James', 'Brown', 'LIC-016'),
    ('Yuki', 'Tanaka', 'LIC-017'),
    ('Michael', 'Davis', 'LIC-018'),
    ('Karl', 'Piolin', 'LIC-019'),
    ('David', 'Wilson', 'LIC-020');

-- Pilote (ceux avec date_licence_commandant dans les données originales)
INSERT INTO pilote (personnel_id, date_obtention_licence) VALUES
    (1, '2010-01-01'),   -- Jean Dupont
    (3, '2012-06-15'),   -- John Smith
    (5, '2008-03-20'),   -- Pierre Martin
    (6, '2015-07-10'),   -- Sophie Bernard
    (7, '2011-11-30'),   -- Hans Mueller
    (9, '2009-05-25'),   -- Takeshi Yamamoto
    (10, '2014-09-12'),  -- Emily Johnson
    (11, '2013-01-08'),  -- Ahmed Hassan
    (13, '2016-04-18'),  -- Sarah Williams
    (14, '2010-08-22'),  -- Chen Wei
    (16, '2007-12-05'),  -- James Brown
    (18, '2012-02-28'),  -- Michael Davis
    (19, '2018-06-14');  -- Karl Piolin

-- Copilote (ceux avec date_licence_copilote dans les données originales)
INSERT INTO copilote (personnel_id, date_capacite_ligne) VALUES
    (2, '2020-05-01'),   -- Sylvain Lambert
    (4, '2019-09-10'),   -- Jane Doe
    (6, '2010-04-22'),   -- Sophie Bernard (aussi pilote)
    (8, '2021-02-14'),   -- Maria Garcia
    (12, '2022-06-05'),  -- Luca Rossi
    (15, '2020-11-30'),  -- Anna Kowalski
    (17, '2023-01-20'),  -- Yuki Tanaka
    (20, '2019-04-08');  -- David Wilson

-- Personnel navigant (ajout)
INSERT INTO personnel (prenom, nom, numero_licence) VALUES
    ('Claire', 'Dubois', 'NAV-001'),
    ('Marc', 'Leroy', 'NAV-002'),
    ('Laura', 'Schmidt', 'NAV-003'),
    ('Thomas', 'Anderson', 'NAV-004'),
    ('Isabelle', 'Moreau', 'NAV-005'),
    ('Kevin', 'Martinez', 'NAV-006'),
    ('Nadia', 'Petit', 'NAV-007'),
    ('Oliver', 'Taylor', 'NAV-008');

-- Navigant (personnel de cabine)
INSERT INTO navigant (personnel_id, date_entree_compagnie, compagnie_id) VALUES
    (21, '2018-03-15', 1),   -- Claire Dubois - Air France
    (22, '2019-06-01', 1),   -- Marc Leroy - Air France
    (23, '2017-09-10', 4),   -- Laura Schmidt - Lufthansa
    (24, '2020-01-20', 5),   -- Thomas Anderson - British Airways
    (25, '2016-11-05', 6),   -- Isabelle Moreau - Emirates
    (26, '2021-04-12', 2),   -- Kevin Martinez - Delta Airlines
    (27, '2019-08-22', 1),   -- Nadia Petit - Air France
    (28, '2022-02-28', 5);   -- Oliver Taylor - British Airways

-- Vol
INSERT INTO vol (date_vol, numero, heure_depart, heure_arrivee, aeroport_depart, aeroport_arrivee, avion_id, compagnie_id) VALUES
    -- Vols Air France
    ('2023-10-01', 'AF001', '08:00', '16:00', 1, 3, 1, 1),
    ('2023-10-01', 'AF102', '10:30', '12:45', 1, 6, 3, 1),
    ('2023-10-02', 'AF205', '14:00', '16:15', 2, 10, 5, 1),
    ('2023-10-03', 'AF308', '07:45', '20:30', 1, 8, 1, 1),

    -- Vols Delta Airlines
    ('2023-10-02', 'DL100', '09:00', '11:00', 4, 1, 2, 2),
    ('2023-10-02', 'DL205', '15:30', '18:45', 3, 12, 2, 2),
    ('2023-10-03', 'DL410', '06:00', '09:30', 5, 4, 2, 2),

    -- Vols FedEx (Fret)
    ('2023-10-03', 'FX999', '23:00', '05:00', 3, 6, 4, 3),
    ('2023-10-04', 'FX101', '02:00', '08:30', 12, 1, 19, 3),
    ('2023-10-05', 'FX202', '01:15', '07:45', 10, 17, 19, 3),

    -- Vols Lufthansa
    ('2023-10-01', 'LH400', '09:00', '17:30', 13, 3, 6, 4),
    ('2023-10-02', 'LH502', '11:45', '13:30', 13, 1, 6, 4),
    ('2023-10-03', 'LH789', '16:20', '23:45', 13, 10, 6, 4),

    -- Vols British Airways
    ('2023-10-01', 'BA115', '08:30', '16:45', 6, 3, 7, 5),
    ('2023-10-02', 'BA216', '12:00', '14:15', 6, 1, 7, 5),
    ('2023-10-03', 'BA789', '19:00', '07:30', 6, 11, 7, 5),

    -- Vols Emirates
    ('2023-10-01', 'EK201', '02:00', '14:30', 10, 17, 8, 6),
    ('2023-10-02', 'EK302', '08:45', '20:15', 10, 3, 8, 6),
    ('2023-10-03', 'EK505', '23:30', '06:00', 10, 18, 8, 6),

    -- Vols Japan Airlines
    ('2023-10-01', 'JL001', '10:00', '06:30', 9, 12, 9, 7),
    ('2023-10-02', 'JL412', '14:30', '18:00', 8, 19, 9, 7),

    -- Vols Qantas
    ('2023-10-01', 'QF001', '21:00', '05:30', 17, 18, 10, 8),
    ('2023-10-02', 'QF094', '09:15', '17:45', 17, 10, 10, 8),

    -- Vols KLM
    ('2023-10-01', 'KL601', '07:00', '15:30', 16, 3, 11, 9),
    ('2023-10-02', 'KL755', '13:45', '21:00', 16, 20, 11, 9),

    -- Vols Singapore Airlines
    ('2023-10-01', 'SQ321', '01:00', '07:30', 18, 6, 12, 10),
    ('2023-10-02', 'SQ025', '23:55', '06:45', 18, 17, 12, 10),

    -- Vols American Airlines
    ('2023-10-01', 'AA100', '08:00', '11:30', 3, 21, 13, 11),
    ('2023-10-02', 'AA205', '14:00', '17:45', 12, 3, 13, 11),
    ('2023-10-03', 'AA789', '10:15', '13:30', 21, 4, 13, 11),

    -- Vols United Airlines
    ('2023-10-01', 'UA901', '06:30', '09:00', 5, 12, 14, 12),
    ('2023-10-02', 'UA456', '17:00', '05:30', 3, 8, 14, 12),

    -- Vols Iberia
    ('2023-10-01', 'IB3456', '09:30', '11:45', 14, 1, 15, 13),
    ('2023-10-02', 'IB6789', '15:00', '23:30', 14, 21, 15, 13),

    -- Vols Alitalia
    ('2023-10-01', 'AZ610', '08:15', '10:30', 15, 1, 16, 14),
    ('2023-10-02', 'AZ825', '12:45', '21:00', 15, 3, 16, 14),

    -- Vols Air Canada
    ('2023-10-01', 'AC855', '16:00', '06:30', 20, 6, 17, 15),
    ('2023-10-02', 'AC124', '09:45', '12:15', 20, 3, 17, 15),

    -- Vols DHL Aviation (Fret)
    ('2023-10-01', 'DH501', '03:00', '09:30', 13, 10, 18, 16),
    ('2023-10-02', 'DH702', '04:30', '12:00', 16, 19, 20, 16),
    ('2023-10-03', 'DH903', '02:15', '08:45', 6, 18, 18, 16);

-- Operation (relation vol-personnel)
INSERT INTO operation (vol_id, personnel_id) VALUES
    -- AF001: pilote=1, copilote=2
    (1, 1), (1, 2),
    -- AF102: pilote=5, copilote=6
    (2, 5), (2, 6),
    -- AF205: pilote=1, copilote=8
    (3, 1), (3, 8),
    -- AF308: pilote=5, copilote=2
    (4, 5), (4, 2),
    -- DL100: pilote=3, copilote=4
    (5, 3), (5, 4),
    -- DL205: pilote=3, copilote=20
    (6, 3), (6, 20),
    -- DL410: pilote=16, copilote=4
    (7, 16), (7, 4),
    -- FX999: pilote=3, copilote=2
    (8, 3), (8, 2),
    -- FX101: pilote=11, copilote=12
    (9, 11), (9, 12),
    -- FX202: pilote=9, copilote=15
    (10, 9), (10, 15),
    -- LH400: pilote=7, copilote=8
    (11, 7), (11, 8),
    -- LH502: pilote=7, copilote=15
    (12, 7), (12, 15),
    -- LH789: pilote=18, copilote=8
    (13, 18), (13, 8),
    -- BA115: pilote=10, copilote=4
    (14, 10), (14, 4),
    -- BA216: pilote=13, copilote=20
    (15, 13), (15, 20),
    -- BA789: pilote=10, copilote=17
    (16, 10), (16, 17),
    -- EK201: pilote=11, copilote=12
    (17, 11), (17, 12),
    -- EK302: pilote=11, copilote=8
    (18, 11), (18, 8),
    -- EK505: pilote=19, copilote=12
    (19, 19), (19, 12),
    -- JL001: pilote=9, copilote=17
    (20, 9), (20, 17),
    -- JL412: pilote=9, copilote=4
    (21, 9), (21, 4),
    -- QF001: pilote=14, copilote=15
    (22, 14), (22, 15),
    -- QF094: pilote=14, copilote=2
    (23, 14), (23, 2),
    -- KL601: pilote=5, copilote=6
    (24, 5), (24, 6),
    -- KL755: pilote=18, copilote=6
    (25, 18), (25, 6),
    -- SQ321: pilote=14, copilote=17
    (26, 14), (26, 17),
    -- SQ025: pilote=14, copilote=12
    (27, 14), (27, 12),
    -- AA100: pilote=16, copilote=4
    (28, 16), (28, 4),
    -- AA205: pilote=3, copilote=20
    (29, 3), (29, 20),
    -- AA789: pilote=16, copilote=2
    (30, 16), (30, 2),
    -- UA901: pilote=18, copilote=4
    (31, 18), (31, 4),
    -- UA456: pilote=3, copilote=17
    (32, 3), (32, 17),
    -- IB3456: pilote=6, copilote=8
    (33, 6), (33, 8),
    -- IB6789: pilote=19, copilote=12
    (34, 19), (34, 12),
    -- AZ610: pilote=5, copilote=12
    (35, 5), (35, 12),
    -- AZ825: pilote=5, copilote=2
    (36, 5), (36, 2),
    -- AC855: pilote=10, copilote=15
    (37, 10), (37, 15),
    -- AC124: pilote=13, copilote=20
    (38, 13), (38, 20),
    -- DH501: pilote=7, copilote=8
    (39, 7), (39, 8),
    -- DH702: pilote=18, copilote=15
    (40, 18), (40, 15),
    -- DH903: pilote=16, copilote=17
    (41, 16), (41, 17);

-- Vol Passager
INSERT INTO vol_passager (vol_id, nb_passagers) VALUES
    (1, 350),   -- AF001
    (2, 165),   -- AF102
    (3, 320),   -- AF205
    (4, 480),   -- AF308
    (5, 250),   -- DL100
    (6, 380),   -- DL205
    (7, 290),   -- DL410
    (11, 380),  -- LH400
    (12, 350),  -- LH502
    (13, 390),  -- LH789
    (14, 310),  -- BA115
    (15, 295),  -- BA216
    (16, 320),  -- BA789
    (17, 495),  -- EK201
    (18, 510),  -- EK302
    (19, 480),  -- EK505
    (20, 275),  -- JL001
    (21, 260),  -- JL412
    (22, 265),  -- QF001
    (23, 250),  -- QF094
    (24, 340),  -- KL601
    (25, 355),  -- KL755
    (26, 310),  -- SQ321
    (27, 320),  -- SQ025
    (28, 170),  -- AA100
    (29, 165),  -- AA205
    (30, 172),  -- AA789
    (31, 188),  -- UA901
    (32, 195),  -- UA456
    (33, 205),  -- IB3456
    (34, 210),  -- IB6789
    (35, 168),  -- AZ610
    (36, 170),  -- AZ825
    (37, 280),  -- AC855
    (38, 290);  -- AC124

-- Vol Fret
INSERT INTO vol_fret (vol_id, poids_kg) VALUES
    (8, 5000.00),    -- FX999
    (9, 45000.00),   -- FX101
    (10, 38500.00),  -- FX202
    (39, 52000.00),  -- DH501
    (40, 85000.00),  -- DH702
    (41, 48500.00);  -- DH903
