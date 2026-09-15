import { getSql, withTransaction, type Sql } from "@/lib/db";

type Dict = Record<string, unknown>;
type Where = Dict;
type Select = Record<string, boolean>;
type OrderBy = Dict | Dict[];

type ModelCfg = {
  table: string;
  quoted?: boolean;
  jsonText?: string[];
  jsonb?: string[];
  dates?: string[];
  uniques: Record<string, string[]>;
};

const snake = (s: string) => s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
const camel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

const MODELS: Record<string, ModelCfg> = {
  user: { table: '"user"', quoted: true, dates: ["createdAt", "updatedAt"], uniques: { id: ["id"], email: ["email"] } },
  playerSave: { table: "player_saves", jsonText: ["saveJson"], dates: ["updatedAt"], uniques: { userId: ["userId"] } },
  dailyResult: { table: "daily_results", dates: ["createdAt"], uniques: { userId_dayKey: ["userId", "dayKey"] } },
  gameSessionV5: { table: "game_sessions_v5", jsonb: ["stateJson"], uniques: { id: ["id"] } },
  rewardLedgerV5: { table: "reward_ledger_v5", jsonb: ["payloadJson"], uniques: { id: ["id"], idempotencyKey: ["idempotencyKey"] } },
  idempotencyKey: { table: "idempotency_keys", jsonb: ["responseJson"], dates: ["lockedAt", "createdAt"], uniques: { userId_key: ["userId", "key"] } },
  leaderboardScore: { table: "leaderboard_scores", jsonText: ["metaJson"], dates: ["createdAt"], uniques: { id: ["id"] } },
  rateLimitBucket: { table: "rate_limit_buckets", dates: ["resetAt"], uniques: { subject_bucket: ["subject", "bucket"] } },
  auditEvent: { table: "audit_events", jsonb: ["payloadJson"], dates: ["createdAt"], uniques: { id: ["id"] } },
  gameplayEvent: { table: "gameplay_events", jsonb: ["payloadJson"], dates: ["createdAt"], uniques: { id: ["id"] } },
  multiplayerRoom: { table: "multiplayer_rooms", jsonb: ["stateJson"], dates: ["createdAt", "updatedAt"], uniques: { roomId: ["roomId"] } },
  multiplayerMember: { table: "multiplayer_members", dates: ["joinedAt", "lastSeenAt"], uniques: { roomId_userId: ["roomId", "userId"] } },
  moderationReport: { table: "moderation_reports", dates: ["createdAt"], uniques: { id: ["id"] } },
  purchaseReceipt: { table: "purchase_receipts", jsonb: ["rawJson"], dates: ["createdAt"], uniques: { id: ["id"], provider_externalId: ["provider", "externalId"] } },
  entitlement: { table: "entitlements", dates: ["updatedAt", "expiresAt"], uniques: { userId_productId: ["userId", "productId"] } },
  adminAuditNote: { table: "admin_audit_notes", dates: ["createdAt"], uniques: { id: ["id"] } },
  creatorPuzzle: { table: "creator_puzzles", jsonb: ["wordsJson"], dates: ["createdAt", "updatedAt"], uniques: { id: ["id"] } },
  creatorReview: { table: "creator_reviews", dates: ["createdAt"], uniques: { id: ["id"], puzzleId_userId: ["puzzleId", "userId"] } },
  pushSubscription: { table: "push_subscriptions", jsonb: ["subscriptionJson"], dates: ["updatedAt"], uniques: { userId_endpoint: ["userId", "endpoint"] } },
  creatorProfile: { table: "creator_profiles", dates: ["createdAt", "updatedAt"], uniques: { userId: ["userId"] } },
  userRole: { table: "user_roles", uniques: { userId_roleId: ["userId", "roleId"] } },
  role: { table: "roles", uniques: { id: ["id"], name: ["name"] } },
  permission: { table: "permissions", uniques: { id: ["id"], name: ["name"] } },
  analyticsEventV5: { table: "analytics_events_v5", jsonb: ["propertiesJson"], uniques: { id: ["id"] } },
  multiplayerRoomV5: { table: "multiplayer_rooms_v5", jsonb: ["stateJson"], uniques: { id: ["id"] } },
  paymentEventV5: { table: "payment_events_v5", jsonb: ["payloadJson"], uniques: { eventId: ["eventId"] } },
  auditEventV5: { table: "audit_events_v5", jsonb: ["metadataJson"], uniques: { id: ["id"] } },
  moderationCaseV5: { table: "moderation_cases_v5", uniques: { id: ["id"] } },
};

class PrismaError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "PrismaClientKnownRequestError";
  }
}

function wrapDbError(e: unknown): never {
  const err = e as { code?: string; message?: string };
  const msg = String(err?.message ?? e);
  if (err?.code === "23505" || /unique|duplicate/i.test(msg)) throw new PrismaError("P2002", msg);
  if (err?.code === "40001" || /could not serialize|serialization/i.test(msg)) throw new PrismaError("P2034", msg);
  throw e;
}

function col(cfg: ModelCfg, field: string) {
  if (cfg.quoted) return `"${field}"`;
  return snake(field);
}

function flattenWhere(where: Where | undefined, cfg: ModelCfg): Where {
  if (!where) return {};
  const out: Where = { ...where };
  for (const [key, fields] of Object.entries(cfg.uniques)) {
    const val = out[key];
    if (val && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date) && fields.length > 1) {
      delete out[key];
      Object.assign(out, val as Dict);
    }
  }
  return out;
}

function compileWhere(cfg: ModelCfg, where: Where | undefined, params: unknown[]): string {
  const flat = flattenWhere(where, cfg);
  const parts: string[] = [];
  for (const [key, raw] of Object.entries(flat)) {
    if (key === "OR" && Array.isArray(raw)) {
      const ors = (raw as Where[])
        .map((w) => {
          const inner = compileWhere(cfg, w, params);
          return inner ? `(${inner.replace(/^WHERE /, "")})` : "";
        })
        .filter(Boolean);
      if (ors.length) parts.push(`(${ors.join(" OR ")})`);
      continue;
    }
    if (key === "AND" && Array.isArray(raw)) {
      for (const w of raw as Where[]) {
        const inner = compileWhere(cfg, w, params);
        if (inner) parts.push(`(${inner.replace(/^WHERE /, "")})`);
      }
      continue;
    }
    const column = col(cfg, key);
    if (raw === null) {
      parts.push(`${column} IS NULL`);
      continue;
    }
    if (raw && typeof raw === "object" && !Array.isArray(raw) && !(raw instanceof Date)) {
      const op = raw as Dict;
      if ("not" in op) {
        if (op.not === null) parts.push(`${column} IS NOT NULL`);
        else {
          params.push(op.not);
          parts.push(`${column} <> $${params.length}`);
        }
        continue;
      }
      if ("gt" in op) {
        params.push(op.gt instanceof Date ? op.gt.toISOString() : op.gt);
        parts.push(`${column} > $${params.length}`);
      }
      if ("gte" in op) {
        params.push(op.gte instanceof Date ? op.gte.toISOString() : op.gte);
        parts.push(`${column} >= $${params.length}`);
      }
      if ("lt" in op) {
        params.push(op.lt instanceof Date ? op.lt.toISOString() : op.lt);
        parts.push(`${column} < $${params.length}`);
      }
      if ("lte" in op) {
        params.push(op.lte instanceof Date ? op.lte.toISOString() : op.lte);
        parts.push(`${column} <= $${params.length}`);
      }
      if ("in" in op && Array.isArray(op.in)) {
        const marks = (op.in as unknown[]).map((v) => {
          params.push(v);
          return `$${params.length}`;
        });
        parts.push(`${column} IN (${marks.join(",")})`);
      }
      continue;
    }
    params.push(raw instanceof Date ? raw.toISOString() : raw);
    parts.push(`${column} = $${params.length}`);
  }
  return parts.length ? `WHERE ${parts.join(" AND ")}` : "";
}

function compileOrder(cfg: ModelCfg, orderBy?: OrderBy): string {
  if (!orderBy) return "";
  const list = Array.isArray(orderBy) ? orderBy : [orderBy];
  const bits = list.flatMap((item) =>
    Object.entries(item).map(([k, dir]) => `${col(cfg, k)} ${String(dir).toUpperCase() === "DESC" ? "DESC" : "ASC"}`),
  );
  return bits.length ? `ORDER BY ${bits.join(", ")}` : "";
}

function encodeValue(cfg: ModelCfg, field: string, value: unknown): unknown {
  if (value === undefined) return undefined;
  if (typeof value === "bigint") return Number(value);
  const jsonText = cfg.jsonText ?? [];
  const jsonb = cfg.jsonb ?? [];
  if (jsonText.includes(field) || jsonb.includes(field)) {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value ?? {});
    } catch {
      return "{}";
    }
  }
  if (value instanceof Date) return value.toISOString();
  return value;
}

function mapRow(cfg: ModelCfg, row: Dict | undefined, select?: Select): Dict | null {
  if (!row) return null;
  const out: Dict = {};
  for (const [k, v] of Object.entries(row)) {
    const field = cfg.quoted ? k : camel(k);
    if (select && !select[field]) continue;
    if ((cfg.dates ?? []).includes(field)) {
      out[field] = v == null ? null : v instanceof Date ? v : new Date(String(v));
      continue;
    }
    if ((cfg.jsonb ?? []).includes(field)) {
      if (typeof v === "string") {
        try {
          out[field] = JSON.parse(v);
        } catch {
          out[field] = {};
        }
      } else {
        out[field] = v;
      }
      continue;
    }
    out[field] = v;
  }
  if (select) {
    for (const key of Object.keys(select)) if (select[key] && !(key in out)) out[key] = null;
  }
  return out;
}

function incrementSql(cfg: ModelCfg, field: string, amount: unknown) {
  const n = typeof amount === "bigint" ? Number(amount) : Number(amount);
  return `${col(cfg, field)} = ${col(cfg, field)} + ${Number.isFinite(n) ? n : 1}`;
}

async function runQuery<T extends Dict>(sql: Sql, text: string, params: unknown[]): Promise<T[]> {
  try {
    return await sql.query<T>(text, params);
  } catch (e) {
    wrapDbError(e);
  }
}

function modelDelegate(sql: Sql, name: string) {
  const cfg = MODELS[name]!;
  const jsonb = new Set(cfg.jsonb ?? []);

  async function findMany(args: { where?: Where; orderBy?: OrderBy; take?: number; select?: Select; distinct?: string[] } = {}) {
    const params: unknown[] = [];
    const whereSql = compileWhere(cfg, args.where, params);
    let selectSql = "*";
    if (args.distinct?.length) {
      selectSql = args.distinct.map((f) => col(cfg, f)).join(", ");
    } else if (args.select) {
      selectSql = Object.keys(args.select)
        .filter((k) => args.select![k])
        .map((k) => col(cfg, k))
        .join(", ") || "*";
    }
    const distinct = args.distinct?.length ? "DISTINCT " : "";
    const orderSql = compileOrder(cfg, args.orderBy);
    const limit = args.take != null ? `LIMIT ${Math.max(0, Math.floor(args.take))}` : "";
    const rows = await runQuery<Dict>(sql, `SELECT ${distinct}${selectSql} FROM ${cfg.table} ${whereSql} ${orderSql} ${limit}`.replace(/\s+/g, " ").trim(), params);
    return rows.map((r) => mapRow(cfg, r, args.select)).filter(Boolean);
  }

  async function findFirst(args: { where?: Where; orderBy?: OrderBy; select?: Select; take?: number } = {}) {
    const rows = await findMany({ ...args, take: args.take ?? 1 });
    return rows[0] ?? null;
  }

  async function findUnique(args: { where: Where; select?: Select }) {
    return findFirst({ where: args.where, select: args.select, take: 1 });
  }

  async function create(args: { data: Dict }) {
    const data = args.data;
    const fields = Object.keys(data).filter((k) => data[k] !== undefined);
    const params: unknown[] = [];
    const cols = fields.map((f) => col(cfg, f));
    const values = fields.map((f) => {
      params.push(encodeValue(cfg, f, data[f]));
      return jsonb.has(f) ? `$${params.length}::jsonb` : `$${params.length}`;
    });
    const rows = await runQuery<Dict>(
      sql,
      `INSERT INTO ${cfg.table} (${cols.join(",")}) VALUES (${values.join(",")}) RETURNING *`,
      params,
    );
    return mapRow(cfg, rows[0]);
  }

  async function createMany(args: { data: Dict[] }) {
    let count = 0;
    for (const row of args.data ?? []) {
      await create({ data: row });
      count += 1;
    }
    return { count };
  }

  function assignment(data: Dict, params: unknown[]) {
    const sets: string[] = [];
    for (const [field, value] of Object.entries(data)) {
      if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date) && "increment" in (value as Dict)) {
        sets.push(incrementSql(cfg, field, (value as Dict).increment));
        continue;
      }
      params.push(encodeValue(cfg, field, value));
      sets.push(`${col(cfg, field)} = ${jsonb.has(field) ? `$${params.length}::jsonb` : `$${params.length}`}`);
    }
    if (!sets.some((s) => s.includes("updated_at") || s.includes('"updatedAt"'))) {
      if ((cfg.dates ?? []).includes("updatedAt")) sets.push(`${col(cfg, "updatedAt")} = now()`);
    }
    return sets;
  }

  async function update(args: { where: Where; data: Dict }) {
    const params: unknown[] = [];
    const sets = assignment(args.data, params);
    const whereSql = compileWhere(cfg, args.where, params);
    const rows = await runQuery<Dict>(sql, `UPDATE ${cfg.table} SET ${sets.join(", ")} ${whereSql} RETURNING *`, params);
    return mapRow(cfg, rows[0]);
  }

  async function updateMany(args: { where: Where; data: Dict }) {
    const params: unknown[] = [];
    const sets = assignment(args.data, params);
    const whereSql = compileWhere(cfg, args.where, params);
    const rows = await runQuery<Dict>(sql, `UPDATE ${cfg.table} SET ${sets.join(", ")} ${whereSql} RETURNING 1`, params);
    return { count: rows.length };
  }

  async function upsert(args: { where: Where; create: Dict; update: Dict }) {
    const existing = await findUnique({ where: args.where });
    if (existing) return update({ where: args.where, data: args.update });
    return create({ data: args.create });
  }

  async function deleteMany(args: { where?: Where } = {}) {
    const params: unknown[] = [];
    const whereSql = compileWhere(cfg, args.where, params);
    const rows = await runQuery<Dict>(sql, `DELETE FROM ${cfg.table} ${whereSql} RETURNING 1`, params);
    return { count: rows.length };
  }

  async function count(args: { where?: Where } = {}) {
    const params: unknown[] = [];
    const whereSql = compileWhere(cfg, args.where, params);
    const rows = await runQuery<{ count: number }>(sql, `SELECT count(*)::int AS count FROM ${cfg.table} ${whereSql}`, params);
    return Number(rows[0]?.count ?? 0);
  }

  return { findMany, findFirst, findUnique, create, createMany, update, updateMany, upsert, deleteMany, count };
}

function taggedToSql(strings: TemplateStringsArray, values: unknown[]) {
  let text = strings[0] ?? "";
  const params: unknown[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    params.push(v instanceof Date ? v.toISOString() : typeof v === "bigint" ? Number(v) : v);
    text += `$${params.length}${strings[i + 1] ?? ""}`;
  }
  return { text, params };
}

function clientFromSql(sql: Sql) {
  const models: Dict = {};
  for (const name of Object.keys(MODELS)) models[name] = modelDelegate(sql, name);

  (models as { userRole: ReturnType<typeof modelDelegate> }).userRole.findFirst = async (args: { where?: Where; select?: Select } = {}) => {
    const where = args.where ?? {};
    const nested = where.role as Dict | undefined;
    const permName =
      nested && typeof nested === "object"
        ? (((nested.permissions as Dict | undefined)?.some as Dict | undefined)?.permission as Dict | undefined)?.name
        : undefined;
    if (typeof permName === "string" && typeof where.userId === "string") {
      const rows = await sql.query<Dict>(
        `SELECT ur.user_id AS "userId" FROM user_roles ur
         JOIN role_permissions rp ON rp.role_id = ur.role_id
         JOIN permissions p ON p.id = rp.permission_id
         WHERE ur.user_id = $1 AND p.name = $2 LIMIT 1`,
        [where.userId, permName],
      );
      return rows[0] ?? null;
    }
    return modelDelegate(sql, "userRole").findFirst(args);
  };

  async function $queryRaw<T = Dict>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
    const { text, params } = taggedToSql(strings, values);
    return runQuery<T & Dict>(sql, text, params) as Promise<T[]>;
  }
  async function $executeRaw(strings: TemplateStringsArray, ...values: unknown[]): Promise<number> {
    const { text, params } = taggedToSql(strings, values);
    const rows = await runQuery<Dict>(sql, text, params);
    return rows.length;
  }
  async function $transaction<T>(fn: (tx: ReturnType<typeof clientFromSql>) => Promise<T>, opts?: { isolationLevel?: string }): Promise<T> {
    const isolation = opts?.isolationLevel === "Serializable" ? "SERIALIZABLE" : opts?.isolationLevel === "RepeatableRead" ? "REPEATABLE READ" : undefined;
    try {
      return await withTransaction(async (txSql) => fn(clientFromSql(txSql)), isolation);
    } catch (e) {
      wrapDbError(e);
    }
  }
  return { ...models, $queryRaw, $executeRaw, $transaction } as PrismaClient;
}

export type PrismaClient = ReturnType<typeof clientFromSql>;

export function getPrisma(): PrismaClient {
  return lazyClient;
}

const lazyClient = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    if (prop === "then") return undefined;
    if (prop === "$transaction") {
      return async (
        fn: (tx: PrismaClient) => Promise<unknown>,
        opts?: { isolationLevel?: string },
      ) => {
        const isolation =
          opts?.isolationLevel === "Serializable"
            ? "SERIALIZABLE"
            : opts?.isolationLevel === "RepeatableRead"
              ? "REPEATABLE READ"
              : undefined;
        try {
          return await withTransaction(async (txSql) => fn(clientFromSql(txSql)), isolation);
        } catch (e) {
          wrapDbError(e);
        }
      };
    }
    if (prop === "$queryRaw" || prop === "$executeRaw") {
      return async (strings: TemplateStringsArray, ...values: unknown[]) => {
        const sql = await getSql();
        const client = clientFromSql(sql) as unknown as Record<string, (...a: unknown[]) => unknown>;
        return client[prop as string]!(strings, ...values);
      };
    }
    return new Proxy(
      {},
      {
        get(_t, method: string | symbol) {
          return async (...args: unknown[]) => {
            const sql = await getSql();
            const model = (clientFromSql(sql) as unknown as Record<string, Record<string, (...a: unknown[]) => unknown>>)[prop as string];
            if (!model || typeof model[String(method)] !== "function") {
              throw new Error(`Unknown prisma operation ${String(prop)}.${String(method)}`);
            }
            return model[String(method)]!(...args);
          };
        },
      },
    );
  },
});

export type { PrismaClient as default };
