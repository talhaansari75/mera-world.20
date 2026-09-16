import { i as withTransaction, r as getSql } from "./db-CggFAWqk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prisma-6RpAAqVw.js
var snake = (s) => s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
var camel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
var MODELS = {
	user: {
		table: "\"user\"",
		quoted: true,
		dates: ["createdAt", "updatedAt"],
		uniques: {
			id: ["id"],
			email: ["email"]
		}
	},
	playerSave: {
		table: "player_saves",
		jsonText: ["saveJson"],
		dates: ["updatedAt"],
		uniques: { userId: ["userId"] }
	},
	dailyResult: {
		table: "daily_results",
		dates: ["createdAt"],
		uniques: { userId_dayKey: ["userId", "dayKey"] }
	},
	gameSessionV5: {
		table: "game_sessions_v5",
		jsonb: ["stateJson"],
		uniques: { id: ["id"] }
	},
	rewardLedgerV5: {
		table: "reward_ledger_v5",
		jsonb: ["payloadJson"],
		uniques: {
			id: ["id"],
			idempotencyKey: ["idempotencyKey"]
		}
	},
	idempotencyKey: {
		table: "idempotency_keys",
		jsonb: ["responseJson"],
		dates: ["lockedAt", "createdAt"],
		uniques: { userId_key: ["userId", "key"] }
	},
	leaderboardScore: {
		table: "leaderboard_scores",
		jsonText: ["metaJson"],
		dates: ["createdAt"],
		uniques: { id: ["id"] }
	},
	rateLimitBucket: {
		table: "rate_limit_buckets",
		dates: ["resetAt"],
		uniques: { subject_bucket: ["subject", "bucket"] }
	},
	auditEvent: {
		table: "audit_events",
		jsonb: ["payloadJson"],
		dates: ["createdAt"],
		uniques: { id: ["id"] }
	},
	gameplayEvent: {
		table: "gameplay_events",
		jsonb: ["payloadJson"],
		dates: ["createdAt"],
		uniques: { id: ["id"] }
	},
	multiplayerRoom: {
		table: "multiplayer_rooms",
		jsonb: ["stateJson"],
		dates: ["createdAt", "updatedAt"],
		uniques: { roomId: ["roomId"] }
	},
	multiplayerMember: {
		table: "multiplayer_members",
		dates: ["joinedAt", "lastSeenAt"],
		uniques: { roomId_userId: ["roomId", "userId"] }
	},
	moderationReport: {
		table: "moderation_reports",
		dates: ["createdAt"],
		uniques: { id: ["id"] }
	},
	purchaseReceipt: {
		table: "purchase_receipts",
		jsonb: ["rawJson"],
		dates: ["createdAt"],
		uniques: {
			id: ["id"],
			provider_externalId: ["provider", "externalId"]
		}
	},
	entitlement: {
		table: "entitlements",
		dates: ["updatedAt", "expiresAt"],
		uniques: { userId_productId: ["userId", "productId"] }
	},
	adminAuditNote: {
		table: "admin_audit_notes",
		dates: ["createdAt"],
		uniques: { id: ["id"] }
	},
	creatorPuzzle: {
		table: "creator_puzzles",
		jsonb: ["wordsJson"],
		dates: ["createdAt", "updatedAt"],
		uniques: { id: ["id"] }
	},
	creatorReview: {
		table: "creator_reviews",
		dates: ["createdAt"],
		uniques: {
			id: ["id"],
			puzzleId_userId: ["puzzleId", "userId"]
		}
	},
	pushSubscription: {
		table: "push_subscriptions",
		jsonb: ["subscriptionJson"],
		dates: ["updatedAt"],
		uniques: { userId_endpoint: ["userId", "endpoint"] }
	},
	creatorProfile: {
		table: "creator_profiles",
		dates: ["createdAt", "updatedAt"],
		uniques: { userId: ["userId"] }
	},
	userRole: {
		table: "user_roles",
		uniques: { userId_roleId: ["userId", "roleId"] }
	},
	role: {
		table: "roles",
		uniques: {
			id: ["id"],
			name: ["name"]
		}
	},
	permission: {
		table: "permissions",
		uniques: {
			id: ["id"],
			name: ["name"]
		}
	},
	analyticsEventV5: {
		table: "analytics_events_v5",
		jsonb: ["propertiesJson"],
		uniques: { id: ["id"] }
	},
	multiplayerRoomV5: {
		table: "multiplayer_rooms_v5",
		jsonb: ["stateJson"],
		uniques: { id: ["id"] }
	},
	paymentEventV5: {
		table: "payment_events_v5",
		jsonb: ["payloadJson"],
		uniques: { eventId: ["eventId"] }
	},
	auditEventV5: {
		table: "audit_events_v5",
		jsonb: ["metadataJson"],
		uniques: { id: ["id"] }
	},
	moderationCaseV5: {
		table: "moderation_cases_v5",
		uniques: { id: ["id"] }
	}
};
var PrismaError = class extends Error {
	code;
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "PrismaClientKnownRequestError";
	}
};
function wrapDbError(e) {
	const err = e;
	const msg = String(err?.message ?? e);
	if (err?.code === "23505" || /unique|duplicate/i.test(msg)) throw new PrismaError("P2002", msg);
	if (err?.code === "40001" || /could not serialize|serialization/i.test(msg)) throw new PrismaError("P2034", msg);
	throw e;
}
function col(cfg, field) {
	if (cfg.quoted) return `"${field}"`;
	return snake(field);
}
function flattenWhere(where, cfg) {
	if (!where) return {};
	const out = { ...where };
	for (const [key, fields] of Object.entries(cfg.uniques)) {
		const val = out[key];
		if (val && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date) && fields.length > 1) {
			delete out[key];
			Object.assign(out, val);
		}
	}
	return out;
}
function compileWhere(cfg, where, params) {
	const flat = flattenWhere(where, cfg);
	const parts = [];
	for (const [key, raw] of Object.entries(flat)) {
		if (key === "OR" && Array.isArray(raw)) {
			const ors = raw.map((w) => {
				const inner = compileWhere(cfg, w, params);
				return inner ? `(${inner.replace(/^WHERE /, "")})` : "";
			}).filter(Boolean);
			if (ors.length) parts.push(`(${ors.join(" OR ")})`);
			continue;
		}
		if (key === "AND" && Array.isArray(raw)) {
			for (const w of raw) {
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
			const op = raw;
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
				const marks = op.in.map((v) => {
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
function compileOrder(cfg, orderBy) {
	if (!orderBy) return "";
	const bits = (Array.isArray(orderBy) ? orderBy : [orderBy]).flatMap((item) => Object.entries(item).map(([k, dir]) => `${col(cfg, k)} ${String(dir).toUpperCase() === "DESC" ? "DESC" : "ASC"}`));
	return bits.length ? `ORDER BY ${bits.join(", ")}` : "";
}
function encodeValue(cfg, field, value) {
	if (value === void 0) return void 0;
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
function mapRow(cfg, row, select) {
	if (!row) return null;
	const out = {};
	for (const [k, v] of Object.entries(row)) {
		const field = cfg.quoted ? k : camel(k);
		if (select && !select[field]) continue;
		if ((cfg.dates ?? []).includes(field)) {
			out[field] = v == null ? null : v instanceof Date ? v : new Date(String(v));
			continue;
		}
		if ((cfg.jsonb ?? []).includes(field)) {
			if (typeof v === "string") try {
				out[field] = JSON.parse(v);
			} catch {
				out[field] = {};
			}
			else out[field] = v;
			continue;
		}
		out[field] = v;
	}
	if (select) {
		for (const key of Object.keys(select)) if (select[key] && !(key in out)) out[key] = null;
	}
	return out;
}
function incrementSql(cfg, field, amount) {
	const n = typeof amount === "bigint" ? Number(amount) : Number(amount);
	return `${col(cfg, field)} = ${col(cfg, field)} + ${Number.isFinite(n) ? n : 1}`;
}
async function runQuery(sql, text, params) {
	try {
		return await sql.query(text, params);
	} catch (e) {
		wrapDbError(e);
	}
}
function modelDelegate(sql, name) {
	const cfg = MODELS[name];
	const jsonb = new Set(cfg.jsonb ?? []);
	async function findMany(args = {}) {
		const params = [];
		const whereSql = compileWhere(cfg, args.where, params);
		let selectSql = "*";
		if (args.distinct?.length) selectSql = args.distinct.map((f) => col(cfg, f)).join(", ");
		else if (args.select) selectSql = Object.keys(args.select).filter((k) => args.select[k]).map((k) => col(cfg, k)).join(", ") || "*";
		const distinct = args.distinct?.length ? "DISTINCT " : "";
		const orderSql = compileOrder(cfg, args.orderBy);
		const limit = args.take != null ? `LIMIT ${Math.max(0, Math.floor(args.take))}` : "";
		return (await runQuery(sql, `SELECT ${distinct}${selectSql} FROM ${cfg.table} ${whereSql} ${orderSql} ${limit}`.replace(/\s+/g, " ").trim(), params)).map((r) => mapRow(cfg, r, args.select)).filter(Boolean);
	}
	async function findFirst(args = {}) {
		return (await findMany({
			...args,
			take: args.take ?? 1
		}))[0] ?? null;
	}
	async function findUnique(args) {
		return findFirst({
			where: args.where,
			select: args.select,
			take: 1
		});
	}
	async function create(args) {
		const data = args.data;
		const fields = Object.keys(data).filter((k) => data[k] !== void 0);
		const params = [];
		const cols = fields.map((f) => col(cfg, f));
		const values = fields.map((f) => {
			params.push(encodeValue(cfg, f, data[f]));
			return jsonb.has(f) ? `$${params.length}::jsonb` : `$${params.length}`;
		});
		const rows = await runQuery(sql, `INSERT INTO ${cfg.table} (${cols.join(",")}) VALUES (${values.join(",")}) RETURNING *`, params);
		return mapRow(cfg, rows[0]);
	}
	async function createMany(args) {
		let count = 0;
		for (const row of args.data ?? []) {
			await create({ data: row });
			count += 1;
		}
		return { count };
	}
	function assignment(data, params) {
		const sets = [];
		for (const [field, value] of Object.entries(data)) {
			if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date) && "increment" in value) {
				sets.push(incrementSql(cfg, field, value.increment));
				continue;
			}
			params.push(encodeValue(cfg, field, value));
			sets.push(`${col(cfg, field)} = ${jsonb.has(field) ? `$${params.length}::jsonb` : `$${params.length}`}`);
		}
		if (!sets.some((s) => s.includes("updated_at") || s.includes("\"updatedAt\""))) {
			if ((cfg.dates ?? []).includes("updatedAt")) sets.push(`${col(cfg, "updatedAt")} = now()`);
		}
		return sets;
	}
	async function update(args) {
		const params = [];
		const sets = assignment(args.data, params);
		const whereSql = compileWhere(cfg, args.where, params);
		const rows = await runQuery(sql, `UPDATE ${cfg.table} SET ${sets.join(", ")} ${whereSql} RETURNING *`, params);
		return mapRow(cfg, rows[0]);
	}
	async function updateMany(args) {
		const params = [];
		const sets = assignment(args.data, params);
		const whereSql = compileWhere(cfg, args.where, params);
		return { count: (await runQuery(sql, `UPDATE ${cfg.table} SET ${sets.join(", ")} ${whereSql} RETURNING 1`, params)).length };
	}
	async function upsert(args) {
		if (await findUnique({ where: args.where })) return update({
			where: args.where,
			data: args.update
		});
		return create({ data: args.create });
	}
	async function deleteMany(args = {}) {
		const params = [];
		const whereSql = compileWhere(cfg, args.where, params);
		return { count: (await runQuery(sql, `DELETE FROM ${cfg.table} ${whereSql} RETURNING 1`, params)).length };
	}
	async function count(args = {}) {
		const params = [];
		const whereSql = compileWhere(cfg, args.where, params);
		const rows = await runQuery(sql, `SELECT count(*)::int AS count FROM ${cfg.table} ${whereSql}`, params);
		return Number(rows[0]?.count ?? 0);
	}
	return {
		findMany,
		findFirst,
		findUnique,
		create,
		createMany,
		update,
		updateMany,
		upsert,
		deleteMany,
		count
	};
}
function taggedToSql(strings, values) {
	let text = strings[0] ?? "";
	const params = [];
	for (let i = 0; i < values.length; i++) {
		const v = values[i];
		params.push(v instanceof Date ? v.toISOString() : typeof v === "bigint" ? Number(v) : v);
		text += `$${params.length}${strings[i + 1] ?? ""}`;
	}
	return {
		text,
		params
	};
}
function clientFromSql(sql) {
	const models = {};
	for (const name of Object.keys(MODELS)) models[name] = modelDelegate(sql, name);
	models.userRole.findFirst = async (args = {}) => {
		const where = args.where ?? {};
		const nested = where.role;
		const permName = nested && typeof nested === "object" ? ((nested.permissions?.some)?.permission)?.name : void 0;
		if (typeof permName === "string" && typeof where.userId === "string") return (await sql.query(`SELECT ur.user_id AS "userId" FROM user_roles ur
         JOIN role_permissions rp ON rp.role_id = ur.role_id
         JOIN permissions p ON p.id = rp.permission_id
         WHERE ur.user_id = $1 AND p.name = $2 LIMIT 1`, [where.userId, permName]))[0] ?? null;
		return modelDelegate(sql, "userRole").findFirst(args);
	};
	async function $queryRaw(strings, ...values) {
		const { text, params } = taggedToSql(strings, values);
		return runQuery(sql, text, params);
	}
	async function $executeRaw(strings, ...values) {
		const { text, params } = taggedToSql(strings, values);
		return (await runQuery(sql, text, params)).length;
	}
	async function $transaction(fn, opts) {
		const isolation = opts?.isolationLevel === "Serializable" ? "SERIALIZABLE" : opts?.isolationLevel === "RepeatableRead" ? "REPEATABLE READ" : void 0;
		try {
			return await withTransaction(async (txSql) => fn(clientFromSql(txSql)), isolation);
		} catch (e) {
			wrapDbError(e);
		}
	}
	return {
		...models,
		$queryRaw,
		$executeRaw,
		$transaction
	};
}
function getPrisma() {
	return lazyClient;
}
var lazyClient = new Proxy({}, { get(_target, prop) {
	if (prop === "then") return void 0;
	if (prop === "$transaction") return async (fn, opts) => {
		const isolation = opts?.isolationLevel === "Serializable" ? "SERIALIZABLE" : opts?.isolationLevel === "RepeatableRead" ? "REPEATABLE READ" : void 0;
		try {
			return await withTransaction(async (txSql) => fn(clientFromSql(txSql)), isolation);
		} catch (e) {
			wrapDbError(e);
		}
	};
	if (prop === "$queryRaw" || prop === "$executeRaw") return async (strings, ...values) => {
		return clientFromSql(await getSql())[prop](strings, ...values);
	};
	return new Proxy({}, { get(_t, method) {
		return async (...args) => {
			const model = clientFromSql(await getSql())[prop];
			if (!model || typeof model[String(method)] !== "function") throw new Error(`Unknown prisma operation ${String(prop)}.${String(method)}`);
			return model[String(method)](...args);
		};
	} });
} });
//#endregion
export { getPrisma as t };
