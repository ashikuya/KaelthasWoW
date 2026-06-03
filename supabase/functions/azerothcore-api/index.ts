import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
// @deno-types="npm:@types/mysql"
import mysql from "npm:mysql2/promise";

const RACE_MAP: Record<number, string> = {
  1: "Mensch", 2: "Orc", 3: "Zwerg", 4: "Nachtelf", 5: "Untoter",
  6: "Tauren", 7: "Gnom", 8: "Troll", 10: "Blutelf", 11: "Draenei",
};
const CLASS_MAP: Record<number, string> = {
  1: "Krieger", 2: "Paladin", 3: "Jäger", 4: "Schurke", 5: "Priester",
  6: "Todesritter", 7: "Schamane", 8: "Magier", 9: "Hexenmeister", 11: "Druide",
};
const FACTION_BY_RACE: Record<number, string> = {
  1: "alliance", 3: "alliance", 4: "alliance", 7: "alliance", 11: "alliance",
  2: "horde", 5: "horde", 6: "horde", 8: "horde", 10: "horde",
};

async function getConnection() {
  return mysql.createConnection({
    host: Deno.env.get("MYSQL_HOST") ?? "127.0.0.1",
    port: parseInt(Deno.env.get("MYSQL_PORT") ?? "3306"),
    user: Deno.env.get("MYSQL_USER") ?? "root",
    password: Deno.env.get("MYSQL_PASSWORD") ?? "",
    database: Deno.env.get("MYSQL_CHARS_DB") ?? "acore_characters",
    connectTimeout: 8000,
  });
}

async function getAuthConnection() {
  return mysql.createConnection({
    host: Deno.env.get("MYSQL_HOST") ?? "127.0.0.1",
    port: parseInt(Deno.env.get("MYSQL_PORT") ?? "3306"),
    user: Deno.env.get("MYSQL_USER") ?? "root",
    password: Deno.env.get("MYSQL_PASSWORD") ?? "",
    database: Deno.env.get("MYSQL_AUTH_DB") ?? "acore_auth",
    connectTimeout: 8000,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action } = body;

    console.log(`[azerothcore-api] action=${action}`);

    // ─── Public action: no auth required ────────────────────────────────────
    if (action === "get_online_count") {
      const charsConn = await getConnection();
      try {
        const [rows]: any = await charsConn.execute(
          "SELECT COUNT(*) as count FROM characters WHERE online = 1"
        );
        await charsConn.end();
        return new Response(JSON.stringify({ count: rows[0]?.count ?? 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        await charsConn.end().catch(() => {});
        throw e;
      }
    }

    // ─── All other actions require JWT ───────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = user.email?.toLowerCase() ?? "";

    console.log(`[azerothcore-api] action=${action} email=${userEmail}`);

    // ─── Get AzerothCore Account ID by email ─────────────────────────────────
    if (action === "get_account") {
      const authConn = await getAuthConnection();
      try {
        const [rows]: any = await authConn.execute(
          "SELECT id, username, email, joindate FROM account WHERE LOWER(email) = ? OR LOWER(reg_mail) = ? LIMIT 1",
          [userEmail, userEmail]
        );
        await authConn.end();
        if (!rows || rows.length === 0) {
          return new Response(JSON.stringify({ account: null, message: "Kein AzerothCore-Account mit dieser E-Mail gefunden." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ account: rows[0] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        await authConn.end().catch(() => {});
        throw e;
      }
    }

    // ─── Get characters by email → account id ────────────────────────────────
    if (action === "get_characters") {
      // First get account ID from auth DB
      const authConn = await getAuthConnection();
      let accountId: number | null = null;
      try {
        const [rows]: any = await authConn.execute(
          "SELECT id FROM account WHERE LOWER(email) = ? OR LOWER(reg_mail) = ? LIMIT 1",
          [userEmail, userEmail]
        );
        await authConn.end();
        if (rows && rows.length > 0) accountId = rows[0].id;
      } catch (e) {
        await authConn.end().catch(() => {});
        throw e;
      }

      if (accountId === null) {
        return new Response(JSON.stringify({ characters: [], message: "Kein AzerothCore-Account mit dieser E-Mail." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Now get characters
      const charsConn = await getConnection();
      try {
        const [rows]: any = await charsConn.execute(
          `SELECT guid, name, race, class, gender, level, money, totaltime, online
           FROM characters WHERE account = ? ORDER BY level DESC LIMIT 20`,
          [accountId]
        );
        await charsConn.end();
        const characters = (rows ?? []).map((c: any) => ({
          guid: c.guid,
          name: c.name,
          race: RACE_MAP[c.race] ?? `Rasse ${c.race}`,
          raceId: c.race,
          class: CLASS_MAP[c.class] ?? `Klasse ${c.class}`,
          classId: c.class,
          gender: c.gender === 0 ? "Männlich" : "Weiblich",
          level: c.level,
          money: c.money, // in copper
          totaltime: c.totaltime, // in seconds
          online: c.online === 1,
          faction: FACTION_BY_RACE[c.race] ?? "unknown",
        }));
        return new Response(JSON.stringify({ characters, accountId }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (e) {
        await charsConn.end().catch(() => {});
        throw e;
      }
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("[azerothcore-api] Error:", err);
    return new Response(JSON.stringify({ error: `Server Error: ${err.message}` }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
