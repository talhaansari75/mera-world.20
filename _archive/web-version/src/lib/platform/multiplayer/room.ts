export type RoomStatus = 'open'|'playing'|'finished';
export type Room = { id: string; hostId: string; players: string[]; status: RoomStatus; maxPlayers: number; createdAt: number };
export function createRoom(id: string, hostId: string, maxPlayers = 4): Room { if (!id || !hostId || maxPlayers < 2 || maxPlayers > 16) throw new Error('invalid_room'); return { id, hostId, players: [hostId], status: 'open', maxPlayers, createdAt: Date.now() }; }
export function joinRoom(room: Room, playerId: string): Room { if (room.status !== 'open') throw new Error('room_closed'); if (room.players.includes(playerId)) return room; if (room.players.length >= room.maxPlayers) throw new Error('room_full'); return { ...room, players: [...room.players, playerId] }; }
export function startRoom(room: Room, hostId: string): Room { if (room.hostId !== hostId) throw new Error('not_host'); if (room.players.length < 2) throw new Error('not_enough_players'); return { ...room, status: 'playing' }; }
