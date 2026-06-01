-- =============================================================================
-- KAELTHAS WoW – 01_web_user_permissions.sql
-- Erstellt einen dedizierten MySQL-User für die Web-App mit minimalen Rechten.
-- Ausführen als: root / Admin-User auf dem AzerothCore MySQL-Server
-- =============================================================================

-- ⚠️  PASSWORT UNBEDINGT ÄNDERN bevor du dieses Script ausführst!
SET @web_password = 'AENDERE_DIESES_PASSWORT_123!';
SET @web_host     = 'localhost';   -- oder '%' wenn Web auf anderem Host

-- User erstellen (falls noch nicht vorhanden)
CREATE USER IF NOT EXISTS 'kaelthas_web'@'localhost' IDENTIFIED BY 'AENDERE_DIESES_PASSWORT_123!';

-- ─── acore_auth – Rechte ──────────────────────────────────────────────────────
-- SELECT: Accounts lesen / Login-Check
-- INSERT: Neue Game-Accounts erstellen
-- UPDATE: Passwort ändern, Online-Status
GRANT SELECT, INSERT, UPDATE ON `acore_auth`.`account`          TO 'kaelthas_web'@'localhost';
GRANT SELECT                  ON `acore_auth`.`account_access`   TO 'kaelthas_web'@'localhost';
GRANT SELECT, INSERT          ON `acore_auth`.`account_banned`   TO 'kaelthas_web'@'localhost';
GRANT SELECT                  ON `acore_auth`.`realmlist`        TO 'kaelthas_web'@'localhost';
GRANT EXECUTE                 ON `acore_auth`.*                  TO 'kaelthas_web'@'localhost';

-- ─── acore_characters – Rechte ───────────────────────────────────────────────
-- Nur SELECT – die Web-App liest Charakterdaten, schreibt sie NIE direkt
GRANT SELECT ON `acore_characters`.`characters`        TO 'kaelthas_web'@'localhost';
GRANT SELECT ON `acore_characters`.`character_stats`   TO 'kaelthas_web'@'localhost';
GRANT SELECT ON `acore_characters`.`guild`             TO 'kaelthas_web'@'localhost';
GRANT SELECT ON `acore_characters`.`guild_member`      TO 'kaelthas_web'@'localhost';
GRANT EXECUTE ON `acore_characters`.*                  TO 'kaelthas_web'@'localhost';

-- Rechte anwenden
FLUSH PRIVILEGES;

SELECT 'Web-User "kaelthas_web" erfolgreich erstellt!' AS Status;
