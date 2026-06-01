-- =============================================================================
-- KAELTHAS WoW – 06_gm_commands_reference.sql
-- Nützliche Admin-Abfragen für den Server-Betrieb über das Web.
-- Nur lesende Queries – kein direktes Schreiben in Spieltabellen!
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Alle aktiven Game-Accounts mit verknüpftem Web-Account anzeigen
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    a.id          AS game_id,
    a.username    AS game_username,
    a.email       AS game_email,
    a.online,
    a.last_login,
    a.last_ip,
    wal.web_user_id,
    wal.linked_at,
    aa.gmlevel
FROM `acore_auth`.`account` a
LEFT JOIN `acore_auth`.`web_account_link` wal ON wal.game_account_id = a.id
LEFT JOIN `acore_auth`.`account_access`   aa  ON aa.id = a.id
ORDER BY a.id DESC
LIMIT 50;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Alle Charaktere eines Accounts anzeigen (nach Game-Account-Name)
-- ─────────────────────────────────────────────────────────────────────────────
-- Ersetze 'ACCOUNTNAME' mit dem tatsächlichen Account-Namen (UPPERCASE)
SELECT *
FROM `acore_characters`.`v_web_characters`
WHERE account = (
    SELECT id FROM `acore_auth`.`account`
    WHERE username = 'ACCOUNTNAME'
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Ausstehende Vote-Belohnungen anzeigen
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    vr.id,
    a.username,
    vr.points,
    vr.status,
    vr.created_at
FROM `acore_auth`.`web_vote_rewards` vr
JOIN `acore_auth`.`account` a ON a.id = vr.game_account_id
WHERE vr.status = 'pending'
ORDER BY vr.created_at ASC;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Server-Statistiken Gesamtübersicht
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
    (SELECT COUNT(*) FROM `acore_auth`.`account`)                                        AS gesamt_accounts,
    (SELECT COUNT(*) FROM `acore_auth`.`account` WHERE online = 1)                       AS aktuell_online,
    (SELECT COUNT(*) FROM `acore_auth`.`account_banned` WHERE active = 1)                AS gebannte_accounts,
    (SELECT COUNT(*) FROM `acore_characters`.`characters` WHERE deleteDate IS NULL OR deleteDate = 0) AS gesamt_charaktere,
    (SELECT COUNT(*) FROM `acore_characters`.`guild`)                                     AS gilden_gesamt,
    (SELECT COUNT(*) FROM `acore_auth`.`web_account_link`)                                AS verknuepfte_web_accounts;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Top 10 Spieler nach Level
-- ─────────────────────────────────────────────────────────────────────────────
CALL `acore_characters`.web_get_top_characters(10);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Account sperren (Ban)
-- ─────────────────────────────────────────────────────────────────────────────
-- Dauerhafter Ban: unbandate = 0
-- Zeitlich begrenzter Ban: unbandate = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 7 DAY))
/*
INSERT INTO `acore_auth`.`account_banned`
    (`id`, `bandate`, `unbandate`, `bannedby`, `banreason`, `active`)
SELECT
    id,
    UNIX_TIMESTAMP(),
    0,                        -- 0 = permanent
    'Kaelthas-WebAdmin',
    'Cheating / Exploit',
    1
FROM `acore_auth`.`account`
WHERE username = 'SPIELER_NAME';
*/


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Account-Ban aufheben
-- ─────────────────────────────────────────────────────────────────────────────
/*
UPDATE `acore_auth`.`account_banned` ab
JOIN `acore_auth`.`account` a ON a.id = ab.id
SET ab.active = 0
WHERE a.username = 'SPIELER_NAME' AND ab.active = 1;
*/


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. GM-Level setzen
-- GM Levels: 0=Spieler, 1=Moderator, 2=GameMaster, 3=Administrator
-- ─────────────────────────────────────────────────────────────────────────────
/*
INSERT INTO `acore_auth`.`account_access` (`id`, `gmlevel`, `RealmID`)
SELECT id, 3, -1 FROM `acore_auth`.`account` WHERE username = 'ADMIN_NAME'
ON DUPLICATE KEY UPDATE `gmlevel` = 3;
*/


SELECT 'Referenz-Queries geladen. Bitte nur mit Vorsicht ausführen!' AS Hinweis;
