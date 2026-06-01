-- =============================================================================
-- KAELTHAS WoW – 04_sync_triggers.sql
-- Trigger in acore_auth: Wenn ein Account über die Web-App erstellt wird,
-- wird automatisch ein Eintrag in einer Sync-Tabelle gesetzt,
-- die die Edge Function / das Backend auslesen kann.
-- Ausführen als: root auf acore_auth
-- =============================================================================

USE `acore_auth`;

-- ─────────────────────────────────────────────────────────────────────────────
-- Tabelle: web_account_link
-- Verknüpft AzerothCore account.id mit der Supabase user_id (UUID).
-- So weiß die Web-App, welcher Web-Account welchem Game-Account gehört.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `web_account_link` (
    `id`              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `game_account_id` INT UNSIGNED     NOT NULL,           -- account.id aus acore_auth
    `web_user_id`     VARCHAR(36)      NOT NULL,           -- UUID aus Supabase auth.users
    `web_email`       VARCHAR(255)     NOT NULL,
    `game_username`   VARCHAR(32)      NOT NULL,
    `linked_at`       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_sync`       DATETIME                  DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_game_account` (`game_account_id`),
    UNIQUE KEY `uq_web_user`     (`web_user_id`),
    FOREIGN KEY (`game_account_id`) REFERENCES `account`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Tabelle: web_vote_rewards
-- Speichert Vote-Belohnungen die der Game-Server auszahlen soll.
-- Der Game-Server prüft diese Tabelle per Event/Script und löscht ausgezahlte Einträge.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `web_vote_rewards` (
    `id`              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `game_account_id` INT UNSIGNED     NOT NULL,
    `points`          INT              NOT NULL DEFAULT 100,
    `reward_item_id`  INT UNSIGNED              DEFAULT NULL, -- optional: Item-ID
    `reward_amount`   INT                       DEFAULT 1,
    `status`          ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending',
    `created_at`      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `paid_at`         DATETIME                  DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_status` (`status`),
    KEY `idx_account` (`game_account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Tabelle: web_password_change_queue
-- Wenn ein User im UCP sein Spielpasswort ändert, landet es hier.
-- Der Passwort-Change wird direkt in account.sha_pass_hash gesetzt –
-- diese Tabelle dient als Audit-Log.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `web_password_change_queue` (
    `id`              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `game_account_id` INT UNSIGNED     NOT NULL,
    `requested_at`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `applied_at`      DATETIME                  DEFAULT NULL,
    `status`          ENUM('pending','applied') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (`id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: after_account_create
-- Wenn ein neuer Account erstellt wird, wird ein Log-Eintrag gesetzt.
-- ─────────────────────────────────────────────────────────────────────────────
DELIMITER $$

DROP TRIGGER IF EXISTS trg_after_account_create$$
CREATE TRIGGER trg_after_account_create
AFTER INSERT ON `account`
FOR EACH ROW
BEGIN
    -- Optionaler Hook: Kann hier z.B. eine Willkommens-Mail-Queue befüllen
    -- oder Statistik-Counter erhöhen.
    -- Aktuell: keine automatische Aktion, Web-App verknüpft manuell via web_account_link
    SET @new_account_id = NEW.id;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_link_account
-- Verknüpft einen Game-Account mit einem Web-User (nach erfolgreicher Registrierung).
-- Parameter:
--   p_game_username  VARCHAR(32) – Spiel-Account-Name
--   p_web_user_id    VARCHAR(36) – Supabase UUID
--   p_web_email      VARCHAR(255)
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_link_account$$
CREATE PROCEDURE web_link_account(
    IN  p_game_username VARCHAR(32),
    IN  p_web_user_id   VARCHAR(36),
    IN  p_web_email     VARCHAR(255),
    OUT p_result        VARCHAR(50)
)
BEGIN
    DECLARE v_game_account_id INT UNSIGNED DEFAULT NULL;
    DECLARE v_username_upper  VARCHAR(32);

    SET v_username_upper = UPPER(TRIM(p_game_username));

    -- Game Account ID holen
    SELECT id INTO v_game_account_id
    FROM `account`
    WHERE `username` = v_username_upper
    LIMIT 1;

    IF v_game_account_id IS NULL THEN
        SET p_result = 'ERROR_GAME_ACCOUNT_NOT_FOUND';
    ELSE
        INSERT INTO `web_account_link`
            (`game_account_id`, `web_user_id`, `web_email`, `game_username`, `linked_at`)
        VALUES
            (v_game_account_id, p_web_user_id, p_web_email, v_username_upper, NOW())
        ON DUPLICATE KEY UPDATE
            `web_user_id` = p_web_user_id,
            `web_email`   = p_web_email,
            `last_sync`   = NOW();

        SET p_result = 'OK';
    END IF;
END$$


-- ─────────────────────────────────────────────────────────────────────────────
-- Procedure: web_get_game_account_id
-- Gibt die Game Account ID für eine Supabase Web-User-ID zurück.
-- ─────────────────────────────────────────────────────────────────────────────
DROP PROCEDURE IF EXISTS web_get_game_account_id$$
CREATE PROCEDURE web_get_game_account_id(
    IN  p_web_user_id    VARCHAR(36),
    OUT p_game_account_id INT UNSIGNED
)
BEGIN
    SELECT game_account_id INTO p_game_account_id
    FROM `web_account_link`
    WHERE web_user_id = p_web_user_id
    LIMIT 1;
END$$


DELIMITER ;

SELECT 'Sync-Tabellen und Procedures erfolgreich erstellt!' AS Status;
