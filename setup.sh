#!/bin/bash

# ============================================
# FlyRadars - Script d'installation interactif
# ============================================

# Couleurs ANSI
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'
REVERSE='\033[7m'
NC='\033[0m' # No Color

# Codes de contrôle du curseur
HIDE_CURSOR='\033[?25l'
SHOW_CURSOR='\033[?25h'
SAVE_POS='\033[s'
RESTORE_POS='\033[u'

# Symboles
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
PENDING="${DIM}○${NC}"

# Configuration par défaut
DB_NAME="flyradars"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Options sélectionnées (1 = activé, 0 = désactivé)
OPT_DROP=1
OPT_CREATE=1
OPT_INSERT=1
OPT_VIEWS=1

# Position du curseur
CURSOR=0

# Nombre de lignes du menu (pour positionner le curseur)
MENU_START_LINE=8

# Fonction pour positionner le curseur
move_to() {
    echo -ne "\033[${1};${2}H"
}

# Fonction pour effacer une ligne
clear_line() {
    echo -ne "\033[2K"
}

# Fonction pour afficher l'en-tête (une seule fois)
show_header() {
    clear
    echo -e "${HIDE_CURSOR}"
    echo -e "${BOLD}${CYAN}"
    echo "  ╔═══════════════════════════════════════════════╗"
    echo "  ║        FlyRadars - Setup Database             ║"
    echo "  ╚═══════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "${DIM}  Base: ${DB_NAME} | Utilisateur: ${DB_USER} | Port: ${DB_PORT}${NC}"
    echo ""
    echo -e "${BOLD}  Opérations à effectuer :${NC}"
    echo ""
}

# Fonction pour afficher une checkbox à une position donnée
draw_checkbox() {
    local line=$1
    local checked=$2
    local label=$3
    local selected=$4

    move_to $line 1
    clear_line

    if [ "$selected" -eq 1 ]; then
        # Sélectionné : fond bleu
        echo -ne "  ${BLUE}${BOLD}"
        if [ "$checked" -eq 1 ]; then
            echo -e "[✓] $label${NC}"
        else
            echo -e "[ ] $label${NC}"
        fi
    else
        # Non sélectionné
        if [ "$checked" -eq 1 ]; then
            echo -e "  [${GREEN}✓${NC}] $label"
        else
            echo -e "  ${DIM}[ ] $label${NC}"
        fi
    fi
}

# Fonction pour dessiner tout le menu
draw_menu() {
    draw_checkbox $((MENU_START_LINE + 0)) $OPT_DROP "Supprimer les tables existantes (DROP CASCADE)" $((CURSOR == 0))
    draw_checkbox $((MENU_START_LINE + 1)) $OPT_CREATE "Créer les tables" $((CURSOR == 1))
    draw_checkbox $((MENU_START_LINE + 2)) $OPT_INSERT "Insérer les données de test" $((CURSOR == 2))
    draw_checkbox $((MENU_START_LINE + 3)) $OPT_VIEWS "Créer les vues SQL" $((CURSOR == 3))

    move_to $((MENU_START_LINE + 5)) 1
    echo -e "${DIM}  ─────────────────────────────────────────────${NC}"
    move_to $((MENU_START_LINE + 7)) 1
    echo -e "  ${DIM}Navigation: ↑/↓  |  Sélection: ESPACE  |  Exécuter: ENTRÉE  |  Quitter: q${NC}"
}

# Fonction pour basculer une option
toggle_option() {
    case $CURSOR in
        0) OPT_DROP=$((1 - OPT_DROP)) ;;
        1) OPT_CREATE=$((1 - OPT_CREATE)) ;;
        2) OPT_INSERT=$((1 - OPT_INSERT)) ;;
        3) OPT_VIEWS=$((1 - OPT_VIEWS)) ;;
    esac
}

# Fonction pour dessiner une ligne d'opération à une position
draw_operation() {
    local line=$1
    local status=$2  # pending, success, error, skipped
    local label=$3
    local error_msg=$4

    move_to $line 1
    clear_line

    case $status in
        pending)
            echo -ne "  ${DIM}○${NC} ${DIM}$label${NC}"
            ;;
        running)
            echo -ne "  ${CYAN}◉${NC} $label"
            ;;
        success)
            echo -e "  ${CHECK} $label"
            ;;
        error)
            echo -e "  ${CROSS} $label"
            if [ -n "$error_msg" ]; then
                move_to $((line + 1)) 1
                clear_line
                echo -e "     ${RED}${DIM}$error_msg${NC}"
            fi
            ;;
        skipped)
            echo -e "  ${DIM}○ $label (ignoré)${NC}"
            ;;
    esac
}

# Fonction pour exécuter un fichier SQL avec mise à jour en place
execute_sql_inline() {
    local file=$1
    local label=$2
    local line=$3

    draw_operation $line "running" "$label"

    if [ -f "$file" ]; then
        output=$(sudo -u postgres psql -d "$DB_NAME" -f "$file" 2>&1)
        exit_code=$?

        if [ $exit_code -eq 0 ]; then
            draw_operation $line "success" "$label"
            return 0
        else
            draw_operation $line "error" "$label" "$(echo "$output" | head -1)"
            return 1
        fi
    else
        draw_operation $line "error" "$label" "Fichier non trouvé: $file"
        return 1
    fi
}

# Fonction pour exécuter les opérations
execute_operations() {
    clear
    echo -e "${SHOW_CURSOR}"
    echo -e "${BOLD}${CYAN}"
    echo "  ╔═══════════════════════════════════════════════╗"
    echo "  ║        FlyRadars - Setup Database             ║"
    echo "  ╚═══════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "  ${DIM}Authentification sudo requise pour PostgreSQL${NC}"
    echo ""

    # Demander le mot de passe sudo une seule fois
    if ! sudo -v; then
        echo -e "  ${RED}Authentification sudo échouée${NC}"
        echo -e "  ${DIM}Appuyez sur une touche pour quitter...${NC}"
        read -n 1
        return 1
    fi

    clear
    echo -e "${BOLD}${CYAN}"
    echo "  ╔═══════════════════════════════════════════════╗"
    echo "  ║        FlyRadars - Setup Database             ║"
    echo "  ╚═══════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${BOLD}  Exécution en cours...${NC}"
    echo ""
    echo -e "${HIDE_CURSOR}"

    local success=0
    local failed=0
    local skipped=0
    local current_line=9
    local extra_lines=0

    # Dessiner toutes les opérations en état initial
    local ops_labels=("Suppression des tables" "Création des tables" "Insertion des données" "Création des vues")
    local ops_files=("sql/01_drop.sql" "sql/02_create.sql" "sql/03_insert.sql" "sql/04_views.sql")
    local ops_enabled=($OPT_DROP $OPT_CREATE $OPT_INSERT $OPT_VIEWS)

    for i in 0 1 2 3; do
        if [ ${ops_enabled[$i]} -eq 1 ]; then
            draw_operation $((current_line + i + extra_lines)) "pending" "${ops_labels[$i]}"
        else
            draw_operation $((current_line + i + extra_lines)) "skipped" "${ops_labels[$i]}"
            ((skipped++))
        fi
    done

    # Zone pour le résumé
    local summary_line=$((current_line + 4 + extra_lines + 2))

    # Exécuter les opérations une par une
    for i in 0 1 2 3; do
        if [ ${ops_enabled[$i]} -eq 1 ]; then
            if execute_sql_inline "${ops_files[$i]}" "${ops_labels[$i]}" $((current_line + i + extra_lines)); then
                ((success++))
            else
                ((failed++))
                ((extra_lines++))  # Ligne supplémentaire pour l'erreur
            fi
            sleep 0.1  # Petit délai pour l'effet visuel
        fi
    done

    # Afficher le résumé
    move_to $((summary_line)) 1
    echo -e "${DIM}  ─────────────────────────────────────────────${NC}"
    move_to $((summary_line + 2)) 1

    if [ $failed -eq 0 ]; then
        echo -e "  ${GREEN}${BOLD}✓ Opérations terminées avec succès${NC}"
    else
        echo -e "  ${YELLOW}${BOLD}⚠ Opérations terminées avec des erreurs${NC}"
    fi

    move_to $((summary_line + 3)) 1
    echo -e "  ${DIM}Succès: $success | Échecs: $failed | Ignorés: $skipped${NC}"

    move_to $((summary_line + 5)) 1
    echo -e "${SHOW_CURSOR}"
    echo -e "  ${DIM}Appuyez sur une touche pour quitter...${NC}"
    read -n 1
}

# Nettoyage à la sortie
cleanup() {
    echo -e "${SHOW_CURSOR}"
    clear
}
trap cleanup EXIT

# Vérifier si on est dans le bon répertoire
if [ ! -d "sql" ]; then
    echo -e "${SHOW_CURSOR}"
    echo -e "${RED}Erreur: Le dossier 'sql' n'existe pas.${NC}"
    echo -e "${DIM}Assurez-vous d'exécuter ce script depuis la racine du projet.${NC}"
    exit 1
fi

# Afficher l'en-tête initial
show_header
draw_menu

# Boucle principale du menu interactif
while true; do
    # Lire une touche (IFS= pour préserver l'espace)
    IFS= read -rsn1 key

    case "$key" in
        $'\x1b')
            # Touche escape - lire la suite pour les flèches
            read -rsn2 key
            case "$key" in
                '[A') # Flèche haut
                    CURSOR=$(( (CURSOR - 1 + 4) % 4 ))
                    draw_menu
                    ;;
                '[B') # Flèche bas
                    CURSOR=$(( (CURSOR + 1) % 4 ))
                    draw_menu
                    ;;
            esac
            ;;
        ' ')
            # Espace : basculer l'option
            toggle_option
            draw_menu
            ;;
        '')
            # Entrée : exécuter
            execute_operations
            exit 0
            ;;
        'q'|'Q')
            # Quitter
            echo -e "${SHOW_CURSOR}"
            clear
            echo -e "${DIM}Opération annulée.${NC}"
            exit 0
            ;;
    esac
done