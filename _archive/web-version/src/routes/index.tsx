import { createFileRoute } from "@tanstack/react-router";
import { GameApp } from "@/components/app/GameApp";
import { GameErrorBoundary } from "@/components/app/GameErrorBoundary";
import { AgreementGate } from "@/components/app/AgreementGate";
import { RedirectToSignIn, SignInGate } from "@/lib/auth/gates";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <GameErrorBoundary>
      <SignInGate fallback={<RedirectToSignIn />}>
        <AgreementGate>
          <GameApp />
        </AgreementGate>
      </SignInGate>
    </GameErrorBoundary>
  );
}
