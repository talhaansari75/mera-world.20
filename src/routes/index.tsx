import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/app/GameApp";
import { GameErrorBoundary } from "@/components/app/GameErrorBoundary";
import { AgreementGate } from "@/components/app/AgreementGate";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <GameErrorBoundary>
      <AgreementGate>
        <GameApp />
      </AgreementGate>
    </GameErrorBoundary>
  );
}
