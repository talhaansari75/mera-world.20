import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getPrisma } from "@/lib/db";
import { defaultSave } from "@/lib/game/persist";
import { puzzleForDaily, puzzleForLevel, specFor, modeMods, targetTimeMs, todayKey, isBoss } from "@/lib/game/levels";
import { rewardCoins, xpForClear } from "@/lib/game/core/progression";
import { HINT_COST } from "@/lib/game/constants";
import { starsFor } from "@/lib/game/economy";
import { modeRules } from "@/lib/game/core/modeRules";
import { MAX_ENERGY, ENERGY_REFILL_MS } from "@/lib/game/constants";
import type { GameMode, LangCode } from "@/lib/game/types";
import { dailyChallengeFor, dailyChallengeObjective, dailyChallengeRewardMultiplier } from "@/lib/game/dailyChallenges";
import { specialTilesForPuzzle, specialKindsAt, clipAtLocked } from "@/lib/game/specialTiles";
import { isJourneyBoss } from "@/lib/game/journeyWorlds";
import { startCombat, combatTurn, playerCombatPower, type CombatState } from "@/lib/game/combat";
import { petProfile, petPower, petEffect } from "@/lib/game/rpg";
import { petXpEarned } from "@/lib/game/engagement";
import { intelligenceAdaptivePlan } from "@/lib/intelligence/adaptiveDifficulty";
import { personalizedRewardMultiplier } from "@/lib/intelligence/rewardPersonalization";
import { observeCompletion } from "@/lib/game/behavior";
import { isWord } from "@/lib/game/words";

const modes = new Set<GameMode>(["classic","timed","survival","blitz","zen","daily","endless","fog","mirror","category","boss","rush","precision","hardcore","double_reward","no_hints","small_grid","giant_grid","reverse_only","diagonal","orthogonal","chaos","streak","treasure","nightmare","focus","speedrun","marathon","random_rules"]);
const langs = new Set<LangCode>(["en","ur","ur-Latn","hi","ar","bn","pa","sd","ps","tr","es","fr","de","zh","ja"]);
const cleanWords = (v: unknown) => Array.isArray(v) ? [...new Set(v.map(x => String(x).toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean))].slice(0, 32) : [];
type Cell = [number, number];
type Action = { id?: string; type: "found" | "bonus" | "miss" | "hint" | "pause" | "resume"; word?: string; cells?: Cell[]; specialKinds?: string[]; at?: number; hintKind?: "first" | "letter" | "word" };
type SessionState = { kind:"level"|"daily"; level:number; day:string; mode:GameMode; language:LangCode; dailyChallengeId?: string; words:string[]; grid:string[][]; placements:Array<{word:string;cells:Cell[]}>; actions:Action[]; timeLimitMs:number; adaptiveTier?: "assist"|"steady"|"expert"; adaptiveBonusTarget?: number; startingReveals?: number };
const safeJson = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
const sameCells = (a: Cell[], b: Cell[]) => JSON.stringify(a) === JSON.stringify(b) || JSON.stringify(a) === JSON.stringify([...b].reverse());
const canonicalCells = (cells: Cell[]) => {
  const forward = JSON.stringify(cells);
  const reverse = JSON.stringify([...cells].reverse());
  return forward <= reverse ? forward : reverse;
};
const bonusActionKey = (word: string, cells: Cell[]) => `${word.toUpperCase()}:${canonicalCells(cells)}`;
const isFree = (mode: GameMode) => modeRules(mode).free;

export const startGameplaySession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { kind: "level" | "daily"; level: number; day?: string; mode: string; language: string; dailyChallengeId?: string }) => ({
    kind: d.kind === "daily" ? "daily" as const : "level" as const,
    level: Math.max(1, Math.min(2000, Math.floor(Number(d.level) || 1))),
    day: String(d.day ?? "").slice(0, 10),
    mode: modes.has(d.mode as GameMode) ? d.mode as GameMode : "classic" as GameMode,
    language: langs.has(d.language as LangCode) ? d.language as LangCode : "en" as LangCode,
    dailyChallengeId: d.dailyChallengeId ? String(d.dailyChallengeId).slice(0, 20) : undefined,
  }))
  .handler(async ({ context, data }) => {
    if (data.kind === "daily" && data.day !== todayKey()) return { ok:false as const, error:"Daily challenge is not for today." };
    if (data.kind === "daily" && data.dailyChallengeId !== dailyChallengeFor(data.day).id) return { ok:false as const, error:"Daily challenge variant mismatch." };
    const db = getPrisma();
    if (data.kind === "daily") {
      const claimed = await db.dailyResult.findUnique({ where: { userId_dayKey: { userId: context.userId, dayKey: data.day } }, select: { userId: true } });
      if (claimed) return { ok:false as const, error:"Today's daily challenge has already been claimed." };
    }
    const row = await db.playerSave.findUnique({ where:{userId:context.userId} });
    const save = row?.saveJson ? safeJson(JSON.parse(row.saveJson)) : safeJson(defaultSave());
    const unlocked = Number(save.unlockedLevel ?? 1);
    if (data.kind === "level" && data.level > unlocked) return { ok:false as const, error:"Level is locked on the server." };
    const rules = modeRules(data.mode);
    const equippedPet = typeof save.equippedPet === "string" ? save.equippedPet : null;
    const equippedPetLevel = Number(save.petLevels?.[equippedPet ?? ""] ?? 1);
    const effects = petEffect(equippedPet, equippedPetLevel);
    const adaptive = data.kind === "level" ? intelligenceAdaptivePlan(save as unknown as import("@/lib/game/types").PlayerSave, data.level) : { tier: "steady" as const, timeMultiplier: 1, startingReveals: 0, bonusTarget: 0, surprise: false };
    const energyCost = Math.max(1, Math.ceil(1 * rules.energyMultiplier * (1 - Number(effects.energyReductionPercent ?? 0) / 100)));
    const energy = Number(save.energy ?? 20);
    if (data.kind === "level" && !rules.free && energy < energyCost) return { ok:false as const, error:"Not enough energy." };
    const puzzle = data.kind === "daily" ? puzzleForDaily(data.day, data.language, data.dailyChallengeId) : puzzleForLevel(data.level, data.mode, data.language);
    const daily = data.kind === "daily" ? dailyChallengeFor(data.day) : undefined;
    const spec = data.kind === "daily" ? { timeLimit: daily?.id === "speed" ? 90 : 150 } : modeMods(data.mode, specFor(data.level));
    const timeLimitMs = Math.max(20_000, Math.floor((spec.timeLimit ?? 10 * 60) * 1000 * (1 + Number(effects.timeBonusPercent ?? 0) / 100) * adaptive.timeMultiplier));
    const sessionId = randomUUID();
    const now = Date.now();
    const state: SessionState = { kind:data.kind, level:data.level, day:data.day, mode:data.mode, language:data.language, dailyChallengeId:data.dailyChallengeId, words:puzzle.words.map(w=>w.toUpperCase()), grid:puzzle.grid, placements:puzzle.placements.map(p=>({word:p.word.toUpperCase(),cells:p.cells})), actions:[], timeLimitMs, adaptiveTier: adaptive.tier, adaptiveBonusTarget: adaptive.bonusTarget, startingReveals: adaptive.startingReveals };
    await db.$transaction(async tx => {
      if (data.kind === "daily") {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`daily-session:${context.userId}:${data.day}`}))`;
        const claimedInsideTx = await tx.dailyResult.findUnique({ where: { userId_dayKey: { userId: context.userId, dayKey: data.day } }, select: { userId: true } });
        if (claimedInsideTx) throw new Error("Today's daily challenge has already been claimed.");
        const activeDaily = await tx.gameSessionV5.findMany({ where:{userId:context.userId,levelId:0,status:"open"}, select:{stateJson:true}, take:10 });
        if (activeDaily.some((session) => String((safeJson(session.stateJson)).day ?? "") === data.day)) {
          throw new Error("Today's daily challenge is already active.");
        }
      }
      const currentRow = await tx.playerSave.findUnique({ where:{userId:context.userId} });
      const currentSave = currentRow?.saveJson ? safeJson(JSON.parse(currentRow.saveJson)) : safeJson(defaultSave());
      const currentUnlocked = Number(currentSave.unlockedLevel ?? 1);
      const energyAt = Number(currentSave.energyAt ?? now);
      const refills = Math.max(0, Math.floor((now - energyAt) / ENERGY_REFILL_MS));
      const currentEnergy = Math.min(MAX_ENERGY, Number(currentSave.energy ?? MAX_ENERGY) + refills);
      const nextEnergyAt = currentEnergy >= MAX_ENERGY ? now : energyAt + refills * ENERGY_REFILL_MS;
      if (data.kind === "level" && data.level > currentUnlocked) throw new Error("Level is locked on the server.");
      if (data.kind === "level" && !rules.free && currentEnergy < energyCost) throw new Error("Not enough energy.");
      if (data.kind === "level" && !rules.free) {
        const nextSave = {...currentSave, energy:currentEnergy-energyCost, energyAt:nextEnergyAt};
        if (currentRow) await tx.playerSave.update({ where:{userId:context.userId}, data:{ saveJson:JSON.stringify(nextSave), version:{increment:1}, revision:{increment:1n} } });
        else await tx.playerSave.create({ data:{userId:context.userId,saveJson:JSON.stringify(nextSave),version:1,revision:1n} });
      } else if (!currentRow) {
        await tx.playerSave.create({ data:{userId:context.userId,saveJson:JSON.stringify({...currentSave,energy:currentEnergy,energyAt:nextEnergyAt}),version:1,revision:1n} });
      } else if (currentEnergy !== Number(currentSave.energy ?? MAX_ENERGY) || nextEnergyAt !== energyAt) {
        await tx.playerSave.update({ where:{userId:context.userId}, data:{saveJson:JSON.stringify({...currentSave,energy:currentEnergy,energyAt:nextEnergyAt}),version:{increment:1},revision:{increment:1n}} });
      }
      await tx.gameSessionV5.create({ data:{id:sessionId,userId:context.userId,levelId:data.level,seed:String(puzzle.seed),status:"open",startedAt:BigInt(now),updatedAt:BigInt(now),score:0,stateJson:state as any} });
    }, { isolationLevel: "Serializable" });
    const authoritativeRow = await db.playerSave.findUnique({ where:{userId:context.userId}, select:{saveJson:true} });
    const authoritativeSave = authoritativeRow?.saveJson ? JSON.parse(authoritativeRow.saveJson) : defaultSave();
    return { ok:true as const, sessionId, startedAt:now, timeLimitMs, seed:puzzle.seed, adaptiveTier: adaptive.tier, startingReveals: adaptive.startingReveals, save: authoritativeSave };
  });

export const recordGameplayAction = createServerFn({ method:"POST" })
  .middleware([authMiddleware])
  .validator((d:{sessionId:string; actionId?:string; type:string; word?:string; cells?:Cell[]; hintKind?:string})=>{
    const allowed = new Set(["found","bonus","miss","hint","pause","resume"]);
    if (!allowed.has(d.type)) throw new Error("Invalid gameplay action type.");
    if (d.type === "hint" && d.hintKind !== "first" && d.hintKind !== "letter" && d.hintKind !== "word") throw new Error("Invalid hint kind.");
    return {
      sessionId:String(d.sessionId??"").trim().slice(0,64),
      actionId:String(d.actionId??"").trim(),
      type:d.type as Action["type"],
      word:d.word ? String(d.word).toUpperCase().slice(0,32):undefined,
      cells:Array.isArray(d.cells)?d.cells.slice(0,32).map(c=>[Number(c[0]),Number(c[1])] as Cell):undefined,
      hintKind:d.hintKind === "first" || d.hintKind === "letter" || d.hintKind === "word" ? d.hintKind : undefined,
    };
  })
  .handler(async({context,data})=>{
    if (!/^.{8,64}$/.test(data.sessionId) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.actionId)) {
      return {ok:false as const,error:"Invalid gameplay action identity."};
    }
    const db=getPrisma();
    return db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM game_sessions_v5 WHERE id=${data.sessionId} AND user_id=${context.userId} FOR UPDATE`;
      const row=await tx.gameSessionV5.findUnique({where:{id:data.sessionId}});
      if(!row || row.userId!==context.userId || row.status!=="open") return {ok:false as const,error:"Gameplay session is not active."};
      const state=JSON.parse(JSON.stringify(row.stateJson)) as SessionState;
      if (data.actionId) {
        const hasDuplicateAction = state.actions.some(a => a.id === data.actionId);
        const duplicateAction = hasDuplicateAction ? state.actions.find(a => a.id === data.actionId) : undefined;
        if (duplicateAction) {
          if (duplicateAction.type === "hint") {
            const hintSaveRow = await tx.playerSave.findUnique({where:{userId:context.userId},select:{saveJson:true}});
            const hintSave = safeJson(hintSaveRow?.saveJson ? JSON.parse(hintSaveRow.saveJson) : defaultSave());
            return {ok:true as const,duplicate:true,hintEconomy:{coins:Number(hintSave.coins ?? 0),hintsUsed:Number(safeJson(hintSave.stats).hintsUsed ?? 0)}};
          }
          return {ok:true as const,duplicate:true};
        }
      }
      if(state.actions.length>=500) return {ok:false as const,error:"Too many gameplay actions."};
      const lastAction = state.actions[state.actions.length - 1];
      const currentlyPaused = lastAction?.type === "pause";
      if(data.type === "pause" && currentlyPaused) return {ok:false as const,error:"Gameplay session is already paused."};
      if(data.type === "resume" && !currentlyPaused) return {ok:false as const,error:"Gameplay session is not paused."};
      if(data.type === "pause" && state.kind === "daily" && state.dailyChallengeId === "speed") return {ok:false as const,error:"Speed Day cannot be paused."};
      let specialKinds: string[] | undefined;
      const puzzle = state.kind === "daily" ? puzzleForDaily(state.day, state.language, state.dailyChallengeId) : puzzleForLevel(state.level, state.mode, state.language);
      const specialMap = new Map(specialTilesForPuzzle(puzzle).map(tile => [`${tile.cell[0]},${tile.cell[1]}`, tile.kind] as const));
      if(data.type === "found") {
        const p=state.placements.find(x=>x.word===data.word);
        if(!p || !data.cells || !sameCells(data.cells,p.cells)) return {ok:false as const,error:"Invalid word path."};
        if(state.actions.some(a=>a.type==="found" && a.word===data.word)) return {ok:true as const,duplicate:true};
        specialKinds = [...specialKindsAt(data.cells, specialMap)];
      }
      if ((data.type === "found" || data.type === "bonus") && data.cells) {
        const rows = state.grid.length;
        const cols = rows > 0 ? state.grid[0]!.length : 0;
        if (data.cells.some(([r,c]) => !Number.isInteger(r) || !Number.isInteger(c) || r < 0 || c < 0 || r >= rows || c >= cols)) {
          return {ok:false as const,error:"Gameplay path contains an out-of-bounds cell."};
        }
      }
      if(data.type === "bonus") {
        if(!data.word || !data.cells || data.cells.length < 2 || data.cells.length !== data.word.length) return {ok:false as const,error:"Invalid bonus word."};
        const bonusKey = bonusActionKey(data.word, data.cells);
        if (state.actions.some(a => a.type === "bonus" && bonusActionKey(a.word ?? "", a.cells ?? []) === bonusKey)) return {ok:true as const,duplicate:true};
        const letters = data.cells.map(([r,c]) => state.grid[r]?.[c] ?? "").join("").toUpperCase();
        const reverse = [...letters].reverse().join("");
        const word = data.word.toUpperCase();
        if (letters !== word && reverse !== word) return {ok:false as const,error:"Bonus path does not match the grid."};
        if (!isWord(word)) return {ok:false as const,error:"Bonus word is not in the verified word bank."};
        specialKinds = [...specialKindsAt(data.cells, specialMap)];
        for (let i=1;i<data.cells.length;i++) {
          const [r1,c1]=data.cells[i-1]!, [r2,c2]=data.cells[i]!;
          if (Math.abs(r2-r1)>1 || Math.abs(c2-c1)>1 || (r1===r2 && c1===c2)) return {ok:false as const,error:"Bonus path is not contiguous."};
        }
      }
      if ((data.type === "found" || data.type === "bonus") && data.cells) {
        const clipped = clipAtLocked(data.cells, specialMap);
        if (clipped.length !== data.cells.length) return {ok:false as const,error:"Locked tile blocks this path."};
        // Moving hazards are server-evaluated against a deterministic session tick.
        const tick = Math.floor((Date.now() - Number(row.startedAt)) / 1400);
        const movingTiles = specialTilesForPuzzle(puzzle).filter(t => t.kind === "moving");
        if (movingTiles.length) {
          const movingMap = new Map(movingTiles.map((t,i) => [`${t.cell[0]},${t.cell[1]}`, i]));
          if (data.cells.some(c => movingMap.has(`${c[0]},${c[1]}`) && ((tick + (movingMap.get(`${c[0]},${c[1]}`) ?? 0)) % movingTiles.length === 0))) return {ok:false as const,error:"A moving obstacle blocked that path."};
        }
      }
      let hintEconomy: { coins: number; hintsUsed: number } | undefined;
      if (data.type === "hint") {
        const hintKind = data.hintKind!;
        // Serialize economy mutations across every gameplay session for this user.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`hint-economy:${context.userId}`}))`;
        const saveRow = await tx.playerSave.findUnique({where:{userId:context.userId}});
        const save = safeJson(saveRow?.saveJson ? JSON.parse(saveRow.saveJson) : defaultSave());
        const equippedPet = typeof save.equippedPet === "string" ? save.equippedPet : null;
        const petLevel = Number(save.petLevels?.[equippedPet ?? ""] ?? 1);
        if (modeRules(state.mode).noHints) return {ok:false as const,error:"Hints are disabled in this mode."};
        const cost = Math.max(5, HINT_COST[hintKind] - (equippedPet === "fox" && hintKind !== "word" ? 8 : 0));
        const coins = Number(save.coins ?? 0);
        if (coins < cost) return {ok:false as const,error:"Not enough coins for that hint."};
        const stats = safeJson(save.stats);
        const nextSave = {...save,coins:coins-cost,stats:{...stats,hintsUsed:Number(stats.hintsUsed ?? 0)+1}};
        if (saveRow) await tx.playerSave.update({where:{userId:context.userId},data:{saveJson:JSON.stringify(nextSave),version:{increment:1},revision:{increment:1n}}});
        else await tx.playerSave.create({data:{userId:context.userId,saveJson:JSON.stringify(nextSave),version:1,revision:1n}});
        hintEconomy = { coins: coins - cost, hintsUsed: Number((nextSave.stats as Record<string, unknown>).hintsUsed ?? 0) };
      }
      state.actions.push({id:data.actionId || undefined,type:data.type,word:data.word,cells:data.cells,specialKinds,at:Date.now(),hintKind:data.hintKind});
      await tx.gameSessionV5.update({where:{id:data.sessionId},data:{stateJson:state as any,updatedAt:BigInt(Date.now())}});
      return {ok:true as const, ...(hintEconomy ? {hintEconomy} : {})};
    }, { isolationLevel: "Serializable" });
  });


export const startBossSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { level: number }) => ({ level: Math.max(1, Math.min(2000, Math.floor(Number(d.level) || 1))) }))
  .handler(async ({ context, data }) => {
    if (!isJourneyBoss(data.level)) return { ok:false as const, error:"That level is not a World Boss Gate." };
    const db = getPrisma();
    const permanentRewardKey = `boss-reward:${context.userId}:${data.level}`;
    const alreadyDefeated = await db.rewardLedgerV5.findUnique({ where:{idempotencyKey:permanentRewardKey}, select:{id:true} });
    if (alreadyDefeated) return { ok:false as const, error:"This World Boss has already been defeated." };
    const row = await db.playerSave.findUnique({ where:{userId:context.userId} });
    const save = safeJson(row?.saveJson ? JSON.parse(row.saveJson) : defaultSave());
    if (data.level > Number(save.unlockedLevel ?? 1)) return { ok:false as const, error:"Boss Gate is locked." };
    return db.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`boss-session:${context.userId}:${data.level}`}))`;
      const existing = await tx.gameSessionV5.findFirst({ where:{userId:context.userId,levelId:data.level,status:"boss_open"}, select:{id:true,stateJson:true} });
      if (existing) return { ok:true as const, sessionId:existing.id, combat:existing.stateJson as CombatState };
    const gear = Array.isArray(save.equipment) ? save.equipment.reduce((n:any,e:any) => n + ((save.equippedEquipment?.[e.slot] === e.id) ? Number(e.power||0) : 0),0) : 0;
    const petId = typeof save.equippedPet === "string" ? save.equippedPet : null;
    const petLevel = Number(save.petLevels?.[petId ?? ""] ?? 1);
    const power = playerCombatPower(gear, Number(save.skills?.speed ?? 0), petPower(petId, petLevel));
    const combat = startCombat(data.level, power);
    const id = randomUUID(), now=Date.now();
      await tx.gameSessionV5.create({data:{id,userId:context.userId,levelId:data.level,seed:`boss:${data.level}`,status:"boss_open",startedAt:BigInt(now),updatedAt:BigInt(now),score:0,stateJson:{...combat,playerPower:power,petAbility:petProfile(petId)?.ability ?? null} as any}});
      return {ok:true as const,sessionId:id,combat};
    }, { isolationLevel:"Serializable" });
  });

export const bossCombatAction = createServerFn({ method:"POST" })
  .middleware([authMiddleware])
  .validator((d:{sessionId:string;action:string;perfect?:boolean})=>({sessionId:String(d.sessionId??"").slice(0,64),action:(d.action==="word"||d.action==="guard"||d.action==="power")?d.action:"word",perfect:Boolean(d.perfect)}))
  .handler(async ({context,data}) => {
    const db=getPrisma();
    return db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM game_sessions_v5 WHERE id=${data.sessionId} AND user_id=${context.userId} FOR UPDATE`;
      const row=await tx.gameSessionV5.findUnique({where:{id:data.sessionId}});
      if(!row || row.userId!==context.userId || row.status!=="boss_open") return {ok:false as const,error:"Boss session is not active."};
      const state=safeJson(row.stateJson) as any as CombatState & {playerPower:number;petAbility?:string|null;rewardClaimed?:boolean};
      if(state.victory || state.defeated) return {ok:true as const,combat:state};
      const next=combatTurn(state,state.playerPower,data.action as "word"|"guard"|"power",data.perfect,state.petAbility as any);
      if(next.victory){
        const ledgerKey=`boss-reward:${context.userId}:${row.levelId}`;
        const existing=await tx.rewardLedgerV5.findUnique({where:{idempotencyKey:ledgerKey}});
        let rewardSave: Record<string, unknown> | undefined;
        if(!existing){
          const saveRow=await tx.playerSave.findUnique({where:{userId:context.userId}});
          const save=safeJson(saveRow?.saveJson ? JSON.parse(saveRow.saveJson) : defaultSave());
          const reward=Number(next.enemy.reward);
          const xp=40+next.enemy.level*3;
          const stats=safeJson(save.stats);
          rewardSave={...save,coins:Number(save.coins??0)+reward,xp:Number(save.xp??0)+xp,stats:{...stats,bossesDefeated:Number(stats.bossesDefeated??0)+1,coinsEarned:Number(stats.coinsEarned??0)+reward}};
          if(saveRow) await tx.playerSave.update({where:{userId:context.userId},data:{saveJson:JSON.stringify(rewardSave),version:{increment:1},revision:{increment:1n}}});
          else await tx.playerSave.create({data:{userId:context.userId,saveJson:JSON.stringify(rewardSave),version:1,revision:1n}});
          await tx.rewardLedgerV5.create({data:{id:randomUUID(),userId:context.userId,idempotencyKey:ledgerKey,payloadJson:{coins:reward,xp,bossLevel:row.levelId,sessionId:row.id},createdAt:BigInt(Date.now())}});
        }
        await tx.gameSessionV5.update({where:{id:row.id},data:{status:"completed",score:next.enemy.maxHp,updatedAt:BigInt(Date.now()),stateJson:{...next,rewardClaimed:true} as any}});
        return {ok:true as const,combat:next,save:rewardSave};
      } else {
        await tx.gameSessionV5.update({where:{id:row.id},data:{stateJson:{...next,playerPower:state.playerPower,petAbility:state.petAbility} as any,updatedAt:BigInt(Date.now())}});
      }
      return {ok:true as const,combat:next};
    },{isolationLevel:"Serializable"});
  });

export const verifyGameplayCompletion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { sessionId: string; found: string[]; paths: Array<{word:string;cells:Cell[]}> }) => ({
    sessionId:String(d.sessionId??"").slice(0,64),
    found:cleanWords(d.found),
    paths:Array.isArray(d.paths)?d.paths.slice(0,32).map(p=>({word:String(p.word??"").toUpperCase().slice(0,32),cells:Array.isArray(p.cells)?p.cells.slice(0,32).map(c=>[Number(c[0]),Number(c[1])] as Cell):[]})):[],
  }))
  .handler(async ({ context, data }) => {
    const db=getPrisma();
    const result = await db.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM game_sessions_v5 WHERE id=${data.sessionId} AND user_id=${context.userId} FOR UPDATE`;
      const row=await tx.gameSessionV5.findUnique({where:{id:data.sessionId}});
      if(!row || row.userId!==context.userId) return {ok:false as const,error:"Gameplay session not found."};
      const state=JSON.parse(JSON.stringify(row.stateJson)) as SessionState;
      if(row.status==="completed") {
        const settlementKey = `gameplay:${row.id}`;
        const ledger = await tx.rewardLedgerV5.findUnique({where:{idempotencyKey:settlementKey},select:{payloadJson:true}});
        const payload = safeJson(ledger?.payloadJson);
        const saveRow = await tx.playerSave.findUnique({where:{userId:context.userId},select:{saveJson:true}});
        const currentSave = saveRow?.saveJson ? JSON.parse(saveRow.saveJson) : undefined;
        return {
          ok:true as const,
          duplicate:true,
          stars:Number(payload.stars ?? state.actions.filter(a=>a.type==="found").length),
          coins:Number(payload.coins ?? 0),
          xp:Number(payload.xp ?? 0),
          ...(currentSave ? {save:currentSave} : {}),
        };
      }
      if(row.status!=="open") return {ok:false as const,error:"Gameplay session is closed."};
      const now = Date.now();
      let pausedMs = 0;
      let pauseAt: number | null = null;
      for (const action of state.actions) {
        if (action.type === "pause" && pauseAt === null) pauseAt = Number(action.at ?? now);
        if (action.type === "resume" && pauseAt !== null) { pausedMs += Math.max(0, Number(action.at ?? now) - pauseAt); pauseAt = null; }
      }
      if (pauseAt !== null) pausedMs += Math.min(120_000, Math.max(0, now - pauseAt));
      const elapsed=now-Number(row.startedAt)-Math.min(pausedMs, 120_000);
      if(elapsed < Math.min(1200, state.words.length*120)) return {ok:false as const,error:"Completion was too fast to verify."};
      if(elapsed > state.timeLimitMs + 5000) return {ok:false as const,error:"Gameplay session expired."};
      const foundActions=state.actions.filter(a=>a.type==="found");
      const validWords=new Set<string>();
      for(const a of foundActions){
        const expected=a.word ? state.placements.find(x=>x.word===a.word) : undefined;
        if(expected && a.cells && sameCells(a.cells,expected.cells)) validWords.add(a.word!);
      }
      if(validWords.size!==state.words.length || state.words.some(w=>!validWords.has(w))) return {ok:false as const,error:"All puzzle words must be solved through verified server actions."};
      const hints=state.actions.filter(a=>a.type==="hint").length;
      let combo=0, bestCombo=0;
      for (const a of state.actions) { if (a.type === "found") { combo++; bestCombo=Math.max(bestCombo, combo); } else if (a.type === "miss") combo=0; }
      const mistakes=state.actions.filter(a=>a.type==="miss").length;
      const bonusWords=state.actions.filter(a=>a.type==="bonus").length;
      if (state.adaptiveTier === "expert" && Number(state.adaptiveBonusTarget ?? 0) > bonusWords) return {ok:false as const,error:"Expert mastery objective not completed: find a bonus word."};
      const puzzle=state.kind==="daily" ? puzzleForDaily(state.day,state.language,state.dailyChallengeId) : puzzleForLevel(state.level,state.mode,state.language);
      if (state.kind === "daily") {
        const challenge = dailyChallengeFor(state.day);
        const specialHits = new Set(state.actions.flatMap(a => a.specialKinds ?? []));
        const objective = dailyChallengeObjective(challenge, {
          perfect: hints === 0 && mistakes === 0,
          combo: bestCombo,
          bonusWords,
          specialHits,
          elapsedMs: elapsed,
        });
        if (!objective.met) return {ok:false as const,error:`Daily challenge objective not completed: ${objective.label}`};
      }
      const target=targetTimeMs(state.level||1,state.words.length,puzzle.size);
      const stars=starsFor({hints,timeMs:elapsed,targetMs:target,mistakes});
      const boss=state.kind==="level" && isBoss(state.level);
      const saveRow=await tx.playerSave.findUnique({where:{userId:context.userId}});
      const save=safeJson(saveRow?.saveJson ? JSON.parse(saveRow.saveJson) : defaultSave());
      if (state.kind === "daily") {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`daily-result:${context.userId}:${state.day}`}))`;
        const alreadyClaimed = await tx.dailyResult.findUnique({ where: { userId_dayKey: { userId: context.userId, dayKey: state.day } }, select: { userId: true } });
        if (alreadyClaimed) {
          await tx.gameSessionV5.update({ where: { id: row.id }, data: { status: "completed", updatedAt: BigInt(Date.now()) } });
          return { ok:true as const, duplicate:true, stars:0, coins:0, xp:0 };
        }
      }
      const resultKey=state.kind==="daily"?`daily-${state.day}`:String(state.level);
      const results=(save.results&&typeof save.results==="object")?save.results as Record<string,unknown>:{};
      if(results[resultKey]) { await tx.gameSessionV5.update({where:{id:row.id},data:{status:"completed",updatedAt:BigInt(Date.now())}}); return {ok:true as const,duplicate:true,stars:Number((results[resultKey] as any).stars??0),coins:0,xp:0}; }
      const firstClear=state.kind==="level";
      const dailyMultiplier=state.kind==="daily" ? dailyChallengeRewardMultiplier(dailyChallengeFor(state.day), {perfect:hints===0 && mistakes===0, combo:bestCombo, bonusWords}) : 1;
      const equippedPet = typeof save.equippedPet === "string" ? save.equippedPet : null;
      const equippedPetLevel = Number(save.petLevels?.[equippedPet ?? ""] ?? 1);
      const effects = petEffect(equippedPet, equippedPetLevel);
      const rewardKind = state.kind === "daily" ? "challenge" : bestCombo >= 5 ? "speed" : equippedPet ? "pet" : state.level % 25 === 0 ? "collection" : "standard";
      const personalizationMultiplier = personalizedRewardMultiplier(save as unknown as import("@/lib/game/types").PlayerSave, rewardKind);
      const coins=Math.floor(rewardCoins({mode:state.mode,stars,combo:bestCombo,hints,mistakes,wordCount:state.words.length,firstClear,boss}) * dailyMultiplier * personalizationMultiplier * (1 + Number(effects.coinBonusPercent ?? 0) / 100));
      const xp=Math.floor(xpForClear({size:puzzle.size,stars,boss}) * (1 + Number(effects.xpBonusPercent ?? 0) / 100));
      const earnedPetXp = equippedPet ? petXpEarned({perfect:hints===0 && mistakes===0,boss}) : 0;
      const stats=safeJson(save.stats);
      const previousDaily = typeof save.lastDaily === "string" ? save.lastDaily : null;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
      const nextDailyStreak = state.kind === "daily" ? (previousDaily === yesterday ? Number(save.dailyStreak ?? 0) + 1 : 1) : Number(save.dailyStreak ?? 0);
      const nextPetXp = { ...(save.petXp && typeof save.petXp === "object" ? save.petXp : {}) } as Record<string, number>;
      if (equippedPet && earnedPetXp > 0) nextPetXp[equippedPet] = Number(nextPetXp[equippedPet] ?? 0) + earnedPetXp;
      const behaviorized = observeCompletion(save as any, { level: state.level, world: state.kind === "daily" ? 1 : journeyWorldForLevel(Math.max(1, state.level)).world, category: puzzle.category, mode: state.mode, timeMs: elapsed, hints, combo: bestCombo, perfect: hints === 0 && mistakes === 0, stars, pet: equippedPet as any, rewardCoins: coins, daily: state.kind === "daily" });
      const next={...behaviorized,_serverVerified:true,xp:Number(behaviorized.xp??0)+xp,coins:Number(behaviorized.coins??0)+coins,stars:Number(behaviorized.stars??0)+stars,petXp:nextPetXp,lastDaily:state.kind==="daily"?state.day:behaviorized.lastDaily,dailyStreak:nextDailyStreak,unlockedLevel:state.kind==="level"?Math.max(Number(save.unlockedLevel??1),Math.min(2000,state.level+1)):Number(save.unlockedLevel??1),results:{...results,...(state.kind==="level"?{[resultKey]:{stars,timeMs:elapsed,found:state.words.length,hints,perfect:hints===0&&mistakes===0}}:{})},stats:{...stats,gamesPlayed:Number(stats.gamesPlayed??0)+1,gamesWon:Number(stats.gamesWon??0)+1,wordsFound:Number(stats.wordsFound??0)+state.words.length,hintsUsed:Number(stats.hintsUsed??0),playTimeMs:Number(stats.playTimeMs??0)+elapsed,coinsEarned:Number(stats.coinsEarned??0)+coins,levelsCompleted:Number(stats.levelsCompleted??0)+(state.kind==="level"?1:0),perfectClears:Number(stats.perfectClears??0)+(hints===0&&mistakes===0?1:0),bossesDefeated:Number(stats.bossesDefeated??0)+(boss?1:0),currentStreak:Number(stats.currentStreak??0)+1,bestStreak:Math.max(Number(stats.bestStreak??0),Number(stats.currentStreak??0)+1),dailyCompleted:Number(stats.dailyCompleted??0)+(state.kind==="daily"?1:0)}};
      if (firstClear) {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`level-clear:${context.userId}:${state.level}`}))`;
        const levelLedgerKey = `level-clear:${context.userId}:${state.level}`;
        const existingLevelLedger = await tx.rewardLedgerV5.findUnique({where:{idempotencyKey:levelLedgerKey},select:{id:true}});
        if (existingLevelLedger) {
          await tx.gameSessionV5.update({where:{id:row.id},data:{status:"completed",updatedAt:BigInt(Date.now())}});
          return {ok:true as const,duplicate:true,stars,coins:0,xp:0};
        }
        await tx.rewardLedgerV5.create({data:{id:randomUUID(),userId:context.userId,idempotencyKey:levelLedgerKey,payloadJson:{coins,xp,stars,sessionId:row.id,level:state.level},createdAt:BigInt(Date.now())}});
      }
      if(saveRow) await tx.playerSave.update({where:{userId:context.userId},data:{saveJson:JSON.stringify(next),version:{increment:1},revision:{increment:1n}}}); else await tx.playerSave.create({data:{userId:context.userId,saveJson:JSON.stringify(next),version:1,revision:1n}});
      await tx.rewardLedgerV5.create({data:{id:randomUUID(),userId:context.userId,idempotencyKey:`gameplay:${row.id}`,payloadJson:{coins,xp,stars,sessionId:row.id},createdAt:BigInt(Date.now())}}).catch((e:any)=>{if(e?.code!=="P2002")throw e;});
      await tx.gameSessionV5.update({where:{id:row.id},data:{status:"completed",score:state.words.length*100+stars*100,updatedAt:BigInt(Date.now()),stateJson:{...state,verifiedAt:Date.now(),verifiedElapsedMs:elapsed,hints,mistakes,stars,coins,xp} as any}});
      const user=await tx.user.findUnique({where:{id:context.userId},select:{name:true}});
      const name=String(user?.name??"Traveler").slice(0,24);
      if(state.kind==="daily") await tx.dailyResult.create({data:{userId:context.userId,dayKey:state.day,score:state.words.length*100+stars*100,timeMs:elapsed,stars,displayName:name}});
      return {ok:true as const,duplicate:false,stars,coins,xp,save:next,leaderboard:{name,starsScore:Number(next.stars??0),wordsScore:Number(next.stats?.wordsFound??0),sessionId:row.id}};
    }, { isolationLevel: "Serializable" });
    if (result.ok && !("duplicate" in result && result.duplicate) && "leaderboard" in result && result.leaderboard) {
      try {
        const board = result.leaderboard;
        await db.$transaction(async tx => {
          await tx.leaderboardScore.create({data:{userId:context.userId,board:"stars",score:board.starsScore,displayName:board.name,metaJson:JSON.stringify({sessionId:board.sessionId})}});
          await tx.leaderboardScore.create({data:{userId:context.userId,board:"words",score:board.wordsScore,displayName:board.name,metaJson:JSON.stringify({sessionId:board.sessionId})}});
        });
      } catch { /* leaderboard is non-critical and must never roll back a settled completion */ }
    }
    return result;
  });
