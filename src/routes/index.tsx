import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/app/GameApp";
import { GameErrorBoundary } from "@/components/app/GameErrorBoundary";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <GameErrorBoundary>
      <GameApp />
    </GameErrorBoundary>
  );
}
