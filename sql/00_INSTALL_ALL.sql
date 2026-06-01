-- =============================================================================
-- KAELTHAS WoW – 00_INSTALL_ALL.sql
-- Master-Script: Führt alle SQL-Dateien in der richtigen Reihenfolge aus.
-- 
-- WICHTIG: Passe ALLE Passwörter und Adressen an bevor du dies ausführst!
-- =============================================================================

-- Schritt 1: Web-User mit Berechtigungen erstellen
--   → sql/01_web_user_permissions.sql
--   ⚠️ Ändere das Passwort in dieser Datei ZUERST!

-- Schritt 2: Account-Management Procedures
--   → sql/02_account_management.sql

-- Schritt 3: Charakter-Views
--   → sql/03_character_views.sql

-- Schritt 4: Sync-Tabellen und Triggers
--   → sql/04_sync_triggers.sql

-- Schritt 5: Realmlist konfigurieren
--   → sql/05_realmlist_setup.sql

-- ─────────────────────────────────────────────────────────────────────────────
-- Schnell-Check: Sind alle Procedures vorhanden?
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    ROUTINE_SCHEMA,
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA IN ('acore_auth', 'acore_characters')
  AND ROUTINE_NAME LIKE 'web_%'
ORDER BY ROUTINE_SCHEMA, ROUTINE_NAME;


-- ─────────────────────────────────────────────────────────────────────────────
-- Schnell-Check: Sind alle Views vorhanden?
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    TABLE_SCHEMA,
    TABLE_NAME
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA IN ('acore_auth', 'acore_characters')
  AND TABLE_NAME LIKE 'v_web_%'
ORDER BY TABLE_SCHEMA, TABLE_NAME;


SELECT '✅ Installation abgeschlossen! Alle Objekte überprüft.' AS Status;
