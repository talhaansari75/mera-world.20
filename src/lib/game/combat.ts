import { journeyBossForLevel, bossPhase } from "./bossJourney.ts";
import type { PetAbility } from "./types.ts";

export type Enemy = {
  id: string; name: string; title: string; level: number; hp: number; maxHp: number;
  attack: number; defense: number; reward: number; phase: 1|2|3;
};

export type CombatState = {
  enemy: Enemy; playerHp: number; maxPlayerHp: number; turn: number;
  victory: boolean; defeated: boolean; lastAction: "word" | "guard" | "power";
  lastEvent: string; petAbilityUsed: boolean;
};

export function bossForLevel(level: number): Enemy {
  const boss = journeyBossForLevel(level);
  const tier = Math.max(1, Math.floor(level / 25));
  const maxHp = 120 + tier * 40 + level * 5;
  return {
    id: boss.id, name: boss.name, title: boss.title, level: boss.level,
    hp:maxHp, maxHp, attack:10+tier*2+Math.floor(level/20),
    defense:6+tier+Math.floor(level/30), reward:120+level*7, phase:1,
  };
}

export function startCombat(level:number, playerPower:number):CombatState {
  const enemy=bossForLevel(level), maxPlayerHp=100+Math.floor(playerPower*2);
  return {enemy,playerHp:maxPlayerHp,maxPlayerHp,turn:0,victory:false,defeated:false,lastAction:"word",lastEvent:"The guardian awakens.",petAbilityUsed:false};
}

export function combatTurn(state:CombatState,playerPower:number,action:"word"|"guard"|"power",perfect=false, petAbility?:PetAbility):CombatState {
  if(state.victory||state.defeated) return state;
  const phase = state.enemy.phase;
  const abilityBoost = petAbility === "extra_xp" ? 2 : 0;
  const raw=action==="power"?playerPower+22+abilityBoost:action==="word"?playerPower+(perfect?12:5)+abilityBoost:0;
  const dealt=action==="guard"?0:Math.max(1,raw-state.enemy.defense-(phase===3?Math.max(1,Math.floor(state.enemy.defense*.15)):0));
  const hp=Math.max(0,state.enemy.hp-dealt);
  if(hp===0) return {...state,enemy:{...state.enemy,hp:0,phase:3},turn:state.turn+1,victory:true,lastAction:action,lastEvent:"FINAL WORD! Guardian defeated.",petAbilityUsed:state.petAbilityUsed};
  const nextPhase=bossPhase(hp,state.enemy.maxHp);
  const phaseChanged=nextPhase!==phase;
  const incoming=Math.max(1,state.enemy.attack+(phase-1)*3-Math.floor(playerPower/8));
  const guardReduction=action==="guard"?Math.max(1,Math.floor(incoming/2)):incoming;
  const comboGuard=petAbility === "combo_guard" && !state.petAbilityUsed ? Math.max(1,Math.floor(guardReduction*.35)) : guardReduction;
  const playerHp=Math.max(0,state.playerHp-comboGuard);
  return {
    ...state,
    enemy:{...state.enemy,hp,phase:nextPhase}, playerHp,turn:state.turn+1,defeated:playerHp===0,lastAction:action,
    lastEvent:phaseChanged?`Phase ${nextPhase} unlocked: ${nextPhase===2?"Enraged":"Final Stand"}!`:petAbility === "combo_guard" && !state.petAbilityUsed?"Pet protected your strike.":"The guardian strikes back.",
    petAbilityUsed: state.petAbilityUsed || (petAbility === "combo_guard" && action === "guard"),
  };
}

export function playerCombatPower(equipmentPower:number,skillLevel:number,petPower:number) {
  return Math.max(1,10+equipmentPower+skillLevel*3+petPower);
}
