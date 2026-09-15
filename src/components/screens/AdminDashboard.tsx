import { Screen } from "./chrome";

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  return (
    <Screen title="Admin" onBack={onBack}>
      <div className="panel rounded-2xl p-5">
        <p className="font-semibold text-fg">Player tools live on the signed-in profile.</p>
        <p className="mt-2 text-sm text-muted">
          Moderation, bans, and payment controls require the production admin API. This atlas stays fully
          playable as a guest with local saves.
        </p>
      </div>
    </Screen>
  );
}
