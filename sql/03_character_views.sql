-- =============================================================================
-- KAELTHAS WoW – 03_character_views.sql
-- Views und Procedures zum Lesen von Charakterdaten aus acore_characters.
-- Die Web-App liest nur – niemals direktes Schreiben in Charakterdaten!
-- Ausführen als: root auf acore_characters
-- =============================================================================

USE `acore_characters`;

-- ─────────────────────────────────────────────────────────────────────────────
-- Hilfstabellen / Lookup-Daten für Race & Class Namen
-- ─────────────────────────────────────────────────────────────────────────────

-- Rassen-Namen (WotLK 3.3.5)
-- race: 1=Human, 2=Orc, 3=Dwarf, 4=NightElf, 5=Undead, 6=Tauren,
--       7=Gnome, 8=Troll, 10=BloodElf, 11=Draenei

-- Klassen-Namen (WotLK 3.3.5)
-- class: 1=Warrior, 2=Paladin, 3=Hunter, 4=Rogue, 5=Priest,
--        6=DeathKnight, 7=Shaman, 8=Mage, 9=Warlock, 11=Druid


-- ─────────────────────────────────────────────────────────────────────────────
-- View: v_web_characters
-- Lesbarer Überblick aller Charaktere mit übersetzten Race/Class-Namen.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW `v_web_characters` AS
SELECT
    c.guid,
    c.account,
    c.name,
    c.level,
    c.race                                  AS race_id,
    c.class                                 AS class_id,
    c.gender,
    c.zone,
    c.totaltime                             AS playtime_seconds,
    SEC_TO_TIME(c.totaltime)               AS playtime_formatted,
    c.online,
    -- Fraktion: Alliance = 1,3,4,7,11 | Horde = 2,5,6,8,10
    CASE
        WHEN c.race IN (1, 3, 4, 7, 11) THEN 'Alliance'
        WHEN c.race IN (2, 5, 6, 8, 10) THEN 'Horde'
        ELSE 'Unknown'
    END AS faction,
    -- Race Name
    CASE c.race
        WHEN 1  THEN 'Human'
        WHEN 2  THEN 'Orc'
        WHEN 3  THEN 'Dwarf'
        WHEN 4  THEN 'Night Elf'
        WHEN 5  THEN 'Undead'
        WHEN 6  THEN 'Tauren'
        WHEN 7  THEN 'Gnome'
        WHEN 8  THEN 'Troll'
        WHEN 10 THEN 'Blood Elf'
        WHEN 11 THEN 'Draenei'
        ELSE CONCAT('Race#', c.race)
    END AS race_name,
    -- Class Name
    CASE c.class
        WHEN 1  THEN 'Warrior'
        WHEN 2  THEN 'Paladin'
        WHEN 3  THEN 'Hunter'
        WHEN 4  THEN 'Rogue'
        WHEN 5  THEN 'Priest'
        WHEN 6  THEN 'Death Knight'
        WHEN 7  THEN 'Shaman'
        WHEN 8  THEN 'Mage'
        WHEN 9  THEN 'Warlock'
        WHEN 11 THEN 'Druid'
        ELSE CONCAT('Class#', c.class)
    END AS class_name,
    -- Gender
    CASE c.gender WHEN 0 THEN 'Male' WHEN 1 THEN 'Female' ELSE 'Unknown' END AS gender_name
FROM
    `characters` c
WHERE
    c.deleteDate IS NULL   -- Nur aktive, nicht gelöschte Charaktere
    OR c.deleteDate = 0;


-- ─────────────────────────────────────────────────────────────────────────────
-- View: v_web_guild_overview
-- Zeigt alle Gilden mit Mitgliederanzahl und Gildenleiter.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW `v_web_guild_overview` AS
SELECT
    g.guildid,
    g.name                          AS guild_name,
    g.motd                          AS motd,
    g.info                          AS info,
    g.createdate,
    c.name                          AS leader_name,
    c.level                         AS leader_level,
    COUNT(gm.guid)                  AS member_count
FROM
    `guild` g
    JOIN `characters` c ON c.guid = g.leaderguid
    LEFT JOIN `guild_member` gm ON gm.guildid = g.guildid
GROUP BY
    g.guildid, g.name, g.motd, g.info, g.createdate, c.name, c.level;


-- ─────────────────────────────────────────────────────────────────────────────
-- Stored Procedure: web_get_characters_by_account
-- Gibt alle Charaktere eines bestimmten Account-IDs zurück.
-- Parameter:
--   p_account_id  INT – Die account.id aus acore_auth
-- ─────────────────────────────────────────────────────────────────────────────
DELIMITER $$

DROP PROCEDURE IF EXISTS web_get_characters_by_account$$
CREATE PROCEDURE web_get_characters_by_account(
    IN p_account_id INT
)
BEGIN
    SELECT
        guid,
        name,
        level,
        race_id,
        race_name,
        class_id,
        class_name,
        faction,
        gender_name,
        playtime_seconds,
        playtime_formatted,
        online,
        zone
    FROM `v_web_characters`
    WHERE account = p_account_id
    ORDER BY level DESC, name ASC;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Stored Procedure: web_get_top_characters
-- Top 10 Charaktere nach Level (für Highscore/Homepage).
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_get_top_characters$$
CREATE PROCEDURE web_get_top_characters(
    IN p_limit INT
)
BEGIN
    SET p_limit = IFNULL(p_limit, 10);
    SELECT
        name,
        level,
        race_name,
        class_name,
        faction,
        playtime_formatted,
        online
    FROM `v_web_characters`
    ORDER BY level DESC, playtime_seconds DESC
    LIMIT p_limit;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Stored Procedure: web_get_server_stats
-- Gibt allgemeine Server-Statistiken zurück.
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_get_server_stats$$
CREATE PROCEDURE web_get_server_stats()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM `characters` WHERE deleteDate IS NULL OR deleteDate = 0) AS total_characters,
        (SELECT COUNT(*) FROM `characters` WHERE online = 1)                            AS online_characters,
        (SELECT COUNT(*) FROM `guild`)                                                  AS total_guilds,
        (SELECT MAX(level) FROM `characters` WHERE deleteDate IS NULL OR deleteDate = 0) AS max_level_reached;
END$$


DELIMITER ;

SELECT 'Charakter-Views und Procedures erfolgreich erstellt!' AS Status;
