-- =============================================================================
-- KAELTHAS WoW – 02_account_management.sql
-- Stored Procedures für Account-Verwaltung im acore_auth Datenbankschema.
-- Ausführen als: root auf acore_auth
-- =============================================================================

USE `acore_auth`;

DELIMITER $$

-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_create_account
-- Erstellt einen neuen Game-Account.
-- Das Passwort wird als SHA1('BENUTZERNAME:PASSWORT') gehasht (AzerothCore-Standard).
-- Parameter:
--   p_username  VARCHAR(32)  – Game-Account-Name (wird UPPERCASE gespeichert)
--   p_password  VARCHAR(255) – Klartext-Passwort (wird serverseitig gehasht)
--   p_email     VARCHAR(255) – E-Mail-Adresse
--   p_expansion TINYINT      – 0=Vanilla, 1=TBC, 2=WotLK (Standard: 2)
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_create_account$$
CREATE PROCEDURE web_create_account(
    IN  p_username  VARCHAR(32),
    IN  p_password  VARCHAR(255),
    IN  p_email     VARCHAR(255),
    IN  p_expansion TINYINT,
    OUT p_result    VARCHAR(50)
)
BEGIN
    DECLARE v_username_upper VARCHAR(32);
    DECLARE v_password_upper VARCHAR(255);
    DECLARE v_sha_hash       VARCHAR(40);
    DECLARE v_exists         INT DEFAULT 0;

    -- AzerothCore erwartet alles in UPPERCASE
    SET v_username_upper = UPPER(TRIM(p_username));
    SET v_password_upper = UPPER(TRIM(p_password));

    -- SHA1-Hash: SHA1('USERNAME:PASSWORD')
    SET v_sha_hash = SHA1(CONCAT(v_username_upper, ':', v_password_upper));

    -- Prüfen ob Account bereits existiert
    SELECT COUNT(*) INTO v_exists
    FROM `account`
    WHERE `username` = v_username_upper;

    IF v_exists > 0 THEN
        SET p_result = 'ERROR_ACCOUNT_EXISTS';
    ELSEIF LENGTH(v_username_upper) < 3 THEN
        SET p_result = 'ERROR_USERNAME_TOO_SHORT';
    ELSEIF LENGTH(v_username_upper) > 16 THEN
        SET p_result = 'ERROR_USERNAME_TOO_LONG';
    ELSE
        INSERT INTO `account`
            (`username`, `sha_pass_hash`, `email`, `joindate`, `expansion`)
        VALUES
            (v_username_upper, v_sha_hash, p_email, NOW(), IFNULL(p_expansion, 2));

        SET p_result = 'OK';
    END IF;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_change_password
-- Ändert das Passwort eines bestehenden Game-Accounts.
-- Parameter:
--   p_username     VARCHAR(32)  – Game-Account-Name
--   p_new_password VARCHAR(255) – Neues Klartext-Passwort
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_change_password$$
CREATE PROCEDURE web_change_password(
    IN  p_username     VARCHAR(32),
    IN  p_new_password VARCHAR(255),
    OUT p_result       VARCHAR(50)
)
BEGIN
    DECLARE v_username_upper VARCHAR(32);
    DECLARE v_password_upper VARCHAR(255);
    DECLARE v_sha_hash       VARCHAR(40);
    DECLARE v_exists         INT DEFAULT 0;

    SET v_username_upper = UPPER(TRIM(p_username));
    SET v_password_upper = UPPER(TRIM(p_new_password));
    SET v_sha_hash = SHA1(CONCAT(v_username_upper, ':', v_password_upper));

    SELECT COUNT(*) INTO v_exists FROM `account` WHERE `username` = v_username_upper;

    IF v_exists = 0 THEN
        SET p_result = 'ERROR_ACCOUNT_NOT_FOUND';
    ELSE
        -- Passwort + Session zurücksetzen (erzwingt Re-Login im Spiel)
        UPDATE `account`
        SET
            `sha_pass_hash` = v_sha_hash,
            `sessionkey`    = '',
            `v`             = '',
            `s`             = ''
        WHERE `username` = v_username_upper;

        SET p_result = 'OK';
    END IF;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_get_account_info
-- Gibt Account-Infos für die UCP-Anzeige zurück (kein Passwort-Hash!).
-- Parameter:
--   p_username  VARCHAR(32) – Game-Account-Name
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_get_account_info$$
CREATE PROCEDURE web_get_account_info(
    IN p_username VARCHAR(32)
)
BEGIN
    SELECT
        a.id,
        a.username,
        a.email,
        a.joindate,
        a.last_ip,
        a.last_login,
        a.online,
        a.expansion,
        a.locked,
        CASE
            WHEN ab.id IS NOT NULL AND (ab.unbandate = 0 OR ab.unbandate > UNIX_TIMESTAMP())
            THEN 1 ELSE 0
        END AS is_banned,
        ab.banreason,
        ab.unbandate,
        aa.gmlevel
    FROM `account` a
    LEFT JOIN `account_banned` ab ON ab.id = a.id AND ab.active = 1
    LEFT JOIN `account_access` aa ON aa.id = a.id
    WHERE a.username = UPPER(TRIM(p_username))
    LIMIT 1;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_check_account_exists
-- Prüft ob ein Username bereits vergeben ist (für Registrierung).
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_check_account_exists$$
CREATE PROCEDURE web_check_account_exists(
    IN  p_username VARCHAR(32),
    OUT p_exists   TINYINT
)
BEGIN
    SELECT COUNT(*) INTO p_exists
    FROM `account`
    WHERE `username` = UPPER(TRIM(p_username));
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_get_online_count
-- Gibt die aktuelle Anzahl online spielender Accounts zurück.
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_get_online_count$$
CREATE PROCEDURE web_get_online_count()
BEGIN
    SELECT
        COUNT(*) AS total_online,
        (SELECT COUNT(*) FROM `account`) AS total_accounts
    FROM `account`
    WHERE `online` = 1;
END$$


DELIMITER ;

SELECT 'Account-Management Procedures erfolgreich erstellt!' AS Status;
