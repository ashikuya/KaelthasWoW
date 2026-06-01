-- =============================================================================
-- KAELTHAS WoW – 05_realmlist_setup.sql
-- Konfiguriert die Realm-Liste in acore_auth für den Server.
-- Ausführen als: root auf acore_auth
-- =============================================================================

USE `acore_auth`;

-- ─────────────────────────────────────────────────────────────────────────────
-- Realm aktualisieren / eintragen
-- Passe address, localAddress und port an deine Server-Konfiguration an!
-- ─────────────────────────────────────────────────────────────────────────────

-- Bestehenden Realm aktualisieren (falls ID 1 vorhanden)
UPDATE `realmlist` SET
    `name`         = 'Kaelthas',
    `address`      = 'play.kaelthas-wow.com',   -- ⚠️ Ändern: Deine öffentliche IP oder Domain
    `localAddress` = '127.0.0.1',               -- Lokale Adresse (LAN)
    `localSubnetMask` = '255.255.255.0',
    `port`         = 8085,                      -- Standard World-Server Port
    `icon`         = 1,                         -- 0=Normal, 1=PvP, 4=Normal, 6=RP, 8=RPPvP
    `flag`         = 0,                         -- 0=Online, 1=Offline, 4=Offline (show)
    `timezone`     = 2,                         -- 1=Development, 2=US, 3=Oceanic, 4=LatinAmerica, etc.
    `allowedSecurityLevel` = 0,                 -- 0=Jeder, 1=Mods+, 2=GM+, 3=Admin
    `population`   = 0.0,
    `gamebuild`    = 12340                      -- WotLK 3.3.5a Buildnummer
WHERE `id` = 1;

-- Falls kein Realm existiert, einen neuen erstellen
INSERT IGNORE INTO `realmlist`
    (`id`, `name`, `address`, `localAddress`, `localSubnetMask`, `port`,
     `icon`, `flag`, `timezone`, `allowedSecurityLevel`, `population`, `gamebuild`)
VALUES
    (1, 'Kaelthas', 'play.kaelthas-wow.com', '127.0.0.1', '255.255.255.0', 8085,
     1, 0, 2, 0, 0.0, 12340);


-- ─────────────────────────────────────────────────────────────────────────────
-- View: v_realm_status
-- Für die Web-App lesbar – gibt Status und Spieleranzahl zurück.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW `v_realm_status` AS
SELECT
    r.id,
    r.name,
    r.address,
    r.port,
    r.flag,
    CASE r.flag
        WHEN 0 THEN 'Online'
        WHEN 1 THEN 'Offline'
        WHEN 4 THEN 'Offline'
        ELSE 'Unknown'
    END AS status_text,
    (SELECT COUNT(*) FROM `account` WHERE `online` = 1) AS players_online,
    r.gamebuild
FROM `realmlist` r;


SELECT 'Realmlist erfolgreich konfiguriert!' AS Status;
SELECT * FROM `realmlist` WHERE id = 1;
