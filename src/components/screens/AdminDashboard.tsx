import React, { useEffect, useState } from "react";
import { Screen } from "./chrome";
import { loadAdminDashboard, apiAdminBlock, apiAdminUnblock } from "@/lib/game/adminApi";

type User = {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  blocked?: boolean;
  totalPlayTimeMs?: number;
  lastActiveAt?: string;
};

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await loadAdminDashboard();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleBlock = async (user: User) => {
    try {
      if (user.blocked) {
        await apiAdminUnblock(user.id);
      } else {
        await apiAdminBlock(user.id);
      }
      await load();
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  const formatPlayTime = (ms = 0) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return `${hours}h ${rem}m`;
  };

  return (
    <Screen title="Admin Dashboard" onBack={onBack}>
      {loading && <p className="text-muted">Loading players...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div className="panel rounded-xl p-3">
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted">Total</p>
            </div>
            <div className="panel rounded-xl p-3">
              <p className="text-2xl font-bold">
                {users.filter((u) => !u.blocked).length}
              </p>
              <p className="text-xs text-muted">Active</p>
            </div>
            <div className="panel rounded-xl p-3">
              <p className="text-2xl font-bold text-red-400">
                {users.filter((u) => u.blocked).length}
              </p>
              <p className="text-xs text-muted">Blocked</p>
            </div>
          </div>

          {users.map((user) => (
            <div key={user.id} className="panel rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-fg">{user.name || "—"}</p>
                  <p className="text-sm text-muted">@{user.username || "no-username"}</p>
                  <p className="text-sm text-muted">{user.email}</p>
                  <p className="mt-1 text-xs text-muted">
                    Play Time: {formatPlayTime(user.totalPlayTimeMs)}
                  </p>
                </div>

                <button
                  onClick={() => toggleBlock(user)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    user.blocked
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Screen>
  );
}
