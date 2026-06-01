# 🗄️ Kaelthas WoW – SQL Dateien für AzerothCore MySQL

Alle SQL-Dateien die du auf deinem **WoW-Server MySQL** ausführen musst, um die Website mit dem Spielserver zu verbinden.

---

## 📁 Dateiübersicht

| Datei | Datenbank | Beschreibung |
|-------|-----------|--------------|
| `00_INSTALL_ALL.sql` | beide | Installations-Check & Übersicht |
| `01_web_user_permissions.sql` | `acore_auth` | MySQL-User `kaelthas_web` mit Minimal-Rechten |
| `02_account_management.sql` | `acore_auth` | Stored Procedures für Account-Verwaltung |
| `03_character_views.sql` | `acore_characters` | Views & Procedures für Charakterdaten |
| `04_sync_triggers.sql` | `acore_auth` | Sync-Tabellen (Web↔Game), Vote-Rewards |
| `05_realmlist_setup.sql` | `acore_auth` | Realm-Konfiguration & Status-View |
| `06_admin_queries.sql` | beide | Admin-Abfragen (Ban, GM-Level, Stats) |

---

## ⚡ Schnellstart – Reihenfolge

```bash
# 1. Mit MySQL als root verbinden
mysql -u root -p

# 2. In dieser Reihenfolge ausführen:
source /pfad/zu/sql/01_web_user_permissions.sql
source /pfad/zu/sql/02_account_management.sql
source /pfad/zu/sql/03_character_views.sql
source /pfad/zu/sql/04_sync_triggers.sql
source /pfad/zu/sql/05_realmlist_setup.sql

# 3. Installation prüfen:
source /pfad/zu/sql/00_INSTALL_ALL.sql
```

---

## ⚠️ VOR der Installation anpassen

### In `01_web_user_permissions.sql`:
```sql
SET @web_password = 'AENDERE_DIESES_PASSWORT_123!';
-- Starkes Passwort wählen! Mindestens 16 Zeichen, Sonderzeichen!
```

### In `05_realmlist_setup.sql`:
```sql
'address' = 'play.kaelthas-wow.com'  -- Deine öffentliche IP oder Domain
'port'     = 8085                     -- Dein World-Server Port
```

---

## 🔌 Wie die Website sich verbindet

```
Web-Browser (React)
      ↓
 OnSpace Supabase (PostgreSQL)
      ↓
 Edge Function (Deno)
      ↓  ← MySQL Verbindung mit kaelthas_web User
 AzerothCore MySQL
   ├── acore_auth       (Accounts, Login, Ban)
   └── acore_characters (Charaktere, Gilden)
```

### Verbindungs-String für die Edge Function:
```
mysql://kaelthas_web:DEIN_PASSWORT@localhost:3306/acore_auth
```

---

## 📋 Was welche Datei macht

### `02_account_management.sql` – Procedures in `acore_auth`

| Procedure | Funktion |
|-----------|----------|
| `web_create_account(username, password, email, expansion)` | Neuen Game-Account erstellen |
| `web_change_password(username, new_password)` | Passwort ändern (SHA1-Hash) |
| `web_get_account_info(username)` | Account-Info für UCP anzeigen |
| `web_check_account_exists(username)` | Prüfen ob Username frei ist |
| `web_get_online_count()` | Aktuelle Spielerzahl |

**Passwort-Hashing:** AzerothCore nutzt `SHA1('USERNAME:PASSWORD')` in UPPERCASE. Die Procedures erledigen das automatisch.

### `03_character_views.sql` – Views & Procedures in `acore_characters`

| Objekt | Typ | Funktion |
|--------|-----|----------|
| `v_web_characters` | View | Alle Charaktere mit lesbaren Namen (Race, Class, Fraktion) |
| `v_web_guild_overview` | View | Gilden mit Mitgliederanzahl |
| `web_get_characters_by_account(account_id)` | Procedure | Charaktere eines Accounts |
| `web_get_top_characters(limit)` | Procedure | Highscore-Liste |
| `web_get_server_stats()` | Procedure | Gesamt-Statistiken |

### `04_sync_triggers.sql` – Sync-Tabellen in `acore_auth`

| Tabelle | Funktion |
|---------|----------|
| `web_account_link` | Verbindet Supabase-UUID ↔ Game-Account-ID |
| `web_vote_rewards` | Vote-Belohnungen die der Game-Server auszahlen soll |
| `web_password_change_queue` | Audit-Log für Passwortänderungen |

---

## 🔒 Sicherheitshinweise

1. **Passwort** für `kaelthas_web` User: Mindestens 16 Zeichen, Sonderzeichen, nie im Git committen
2. **Firewall:** MySQL Port 3306 darf **nicht** öffentlich erreichbar sein. Nur localhost oder VPN.
3. **Rechte:** Der `kaelthas_web` User hat nur die minimal nötigen Rechte (kein DELETE, kein DROP)
4. **Backup:** Vor der Installation ein Backup der Datenbanken erstellen!

---

## 🧪 Testen nach der Installation

```sql
-- Game-Account erstellen testen:
CALL acore_auth.web_create_account('TESTUSER', 'testpass123', 'test@test.com', 2, @result);
SELECT @result;  -- Erwartete Ausgabe: OK

-- Account prüfen:
CALL acore_auth.web_get_account_info('TESTUSER');

-- Server-Stats:
CALL acore_characters.web_get_server_stats();

-- Online-Spieler:
CALL acore_auth.web_get_online_count();
```

---

## 🔗 Nächster Schritt: Edge Function

Nach der MySQL-Einrichtung musst du eine **Edge Function** in OnSpace erstellen, die:
1. MySQL-Verbindung zu `kaelthas_web` aufbaut
2. Die Procedures aufruft  
3. Ergebnisse an die React-App zurückgibt

Sage dem AI-Assistenten: *"Erstelle eine Edge Function die sich mit dem AzerothCore MySQL verbindet"*

---

*Erstellt für Kaelthas WoW – AzerothCore 3.3.5a*
