import { useEffect, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import {
  createAdminRole,
  getAdminPermissions,
  getAdminRoles,
  getAdminSnapshot,
  getAdminUsers,
  getRolePermissions,
  setRolePermission,
  setUserRole,
} from "@/lib/v13/admin/server";

type UserRow = Awaited<ReturnType<typeof getAdminUsers>>[number];
type RoleRow = Awaited<ReturnType<typeof getAdminRoles>>[number];
type PermissionRow = Awaited<ReturnType<typeof getAdminPermissions>>[number];

export function AdminScreen({ onBack }: { onBack: () => void }) {
  const [data, setData] =
    useState<Awaited<ReturnType<typeof getAdminSnapshot>> | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<PermissionRow[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [rolePermissionIds, setRolePermissionIds] = useState<string[]>([]);
  const [newRoleId, setNewRoleId] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadAll() {
    setError("");

    try {
      const [snapshot, userRows, roleRows, permissionRows] =
        await Promise.all([
          getAdminSnapshot(),
          getAdminUsers(),
          getAdminRoles(),
          getAdminPermissions(),
        ]);

      setData(snapshot);
      setUsers(userRows);
      setRoles(roleRows);
      setPermissions(permissionRows);

      const firstRole = selectedRole || roleRows[0]?.id || "";

      if (firstRole) {
        setSelectedRole(firstRole);
        const assigned = await getRolePermissions({
          data: { roleId: firstRole },
        });
        setRolePermissionIds(assigned.map((item) => item.permissionId));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Admin access unavailable");
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  async function changeUserRole(userId: string, roleId: string) {
    setBusy(true);
    setError("");

    try {
      await setUserRole({
        data: {
          userId,
          roleId: roleId || null,
        },
      });

      setUsers(await getAdminUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to change role");
    } finally {
      setBusy(false);
    }
  }

  async function selectRole(roleId: string) {
    setSelectedRole(roleId);
    setError("");

    try {
      const assigned = await getRolePermissions({
        data: { roleId },
      });

      setRolePermissionIds(
        assigned.map((item) => item.permissionId),
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load role permissions",
      );
    }
  }

  async function togglePermission(permissionId: string) {
    if (!selectedRole) return;

    const enabled = !rolePermissionIds.includes(permissionId);

    setBusy(true);
    setError("");

    try {
      await setRolePermission({
        data: {
          roleId: selectedRole,
          permissionId,
          enabled,
        },
      });

      setRolePermissionIds((current) =>
        enabled
          ? [...current, permissionId]
          : current.filter((id) => id !== permissionId),
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to update permission",
      );
    } finally {
      setBusy(false);
    }
  }

  async function createRole() {
    if (!newRoleId.trim() || !newRoleName.trim()) {
      setError("Role ID and role name are required");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const created = await createAdminRole({
        data: {
          id: newRoleId.trim().toLowerCase(),
          name: newRoleName.trim(),
        },
      });

      const updatedRoles = await getAdminRoles();

      setRoles(updatedRoles);
      setSelectedRole(created.id);
      setRolePermissionIds([]);
      setNewRoleId("");
      setNewRoleName("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to create role",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen title="Admin Control" onBack={onBack}>
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!data ? (
        <p className="text-muted">Loading protected admin controls…</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 font-display text-lg text-fg">
              Dashboard
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {[
                ["Users seen", data.usersSeen],
                ["Events / 24h", data.events24h],
                ["Open rooms", data.openRooms],
                ["Open reports", data.openReports],
                ["Verified purchases", data.verifiedPurchases],
                ["Entitlements", data.activeEntitlements],
              ].map(([key, value]) => (
                <div
                  key={String(key)}
                  className="panel rounded-2xl p-4"
                >
                  <p className="text-xs text-muted">{key}</p>
                  <p className="mt-1 font-display text-2xl text-fg">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg text-fg">
              Users & Roles
            </h2>

            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="panel rounded-2xl p-4"
                >
                  <div className="mb-3">
                    <p className="font-medium text-fg">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="text-xs text-muted">
                      {user.username
                        ? `@${user.username}`
                        : user.email}
                    </p>
                  </div>

                  <select
                    value={user.roleId ?? ""}
                    disabled={busy}
                    onChange={(event) =>
                      void changeUserRole(
                        user.id,
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg"
                  >
                    <option value="">No role</option>

                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-sm text-muted">
                  No users found.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg text-fg">
              Roles
            </h2>

            <div className="mb-3 grid gap-2">
              <input
                value={newRoleId}
                onChange={(event) =>
                  setNewRoleId(event.target.value)
                }
                placeholder="Role ID e.g. moderator"
                className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg"
              />

              <input
                value={newRoleName}
                onChange={(event) =>
                  setNewRoleName(event.target.value)
                }
                placeholder="Role name e.g. Moderator"
                className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg"
              />

              <button
                type="button"
                disabled={busy}
                onClick={() => void createRole()}
                className="rounded-xl bg-fg px-4 py-2 text-sm font-medium text-bg disabled:opacity-50"
              >
                Create Role
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => void selectRole(role.id)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    selectedRole === role.id
                      ? "border-fg bg-fg text-bg"
                      : "border-border bg-surface text-fg"
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg text-fg">
              Permissions
            </h2>

            {!selectedRole ? (
              <p className="text-sm text-muted">
                Select a role first.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="mb-3 text-xs text-muted">
                  Editing permissions for:{" "}
                  <span className="text-fg">
                    {roles.find(
                      (role) => role.id === selectedRole,
                    )?.name ?? selectedRole}
                  </span>
                </p>

                {permissions.map((permission) => {
                  const enabled = rolePermissionIds.includes(
                    permission.id,
                  );

                  return (
                    <button
                      key={permission.id}
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void togglePermission(permission.id)
                      }
                      className="panel flex w-full items-center justify-between rounded-2xl p-4 text-left disabled:opacity-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-fg">
                          {permission.name}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {permission.description}
                        </p>
                      </div>

                      <span
                        className={`ml-3 rounded-full px-3 py-1 text-xs ${
                          enabled
                            ? "bg-fg text-bg"
                            : "bg-surface-2 text-muted"
                        }`}
                      >
                        {enabled ? "ON" : "OFF"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <button
            type="button"
            disabled={busy}
            onClick={() => void loadAll()}
            className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-fg"
          >
            Refresh Admin Data
          </button>

          <p className="text-xs text-muted">
            All role and permission changes are validated server-side.
            Admin access is not granted by the client UI.
          </p>
        </div>
      )}
    </Screen>
  );
}
