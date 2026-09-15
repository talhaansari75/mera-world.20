import { CoachScreen } from "@/components/v31/CoachScreen";
import { AdaptiveScreen } from "@/components/v32/AdaptiveScreen";
import { JourneyPlannerScreen } from "@/components/v33/JourneyPlannerScreen";
import { useEffect } from "react";
import { useGame } from "@/lib/store";
import { refillEnergy } from "@/lib/game/economy";
import { writeSave } from "@/lib/game/persist";
import { applyVolumes, startMusic, unlockAudio } from "@/lib/game/audio";
import { isRtl } from "@/lib/game/i18n";
import { PlayScreen } from "@/components/play/PlayScreen";
import { HomeScreen, SplashScreen } from "@/components/screens/HomeScreens";
import { ModesScreen, WorldsScreen } from "@/components/screens/WorldsScreen";
import {
  AchievementsScreen,
  DailyScreen,
  InventoryScreen,
  PetsScreen,
  ProfileScreen,
  SettingsScreen,
  ShopScreen,
  SkillsScreen,
  BaseScreen,
  EquipmentScreen,
  SpinScreen,
  StatsScreen,
} from "@/components/screens/MetaScreens";
import { DictionaryScreen, LeaderboardScreen, LegalScreen, MoreScreen, StoryScreen } from "@/components/screens/MoreScreens";
import { CombatScreen } from "@/components/screens/CombatScreen";
import { WorldMapScreen } from "@/components/screens/WorldMapScreen";
import { StoryQuestScreen } from "@/components/screens/StoryQuestScreen";
import { DialogueScreen } from "@/components/screens/DialogueScreen";
import { NPCScreen } from "@/components/screens/NPCScreen";
import { MissionsScreen } from "@/components/screens/RewardsScreens";
import type { ScreenId } from "@/lib/game/types";
import { V9Status } from "@/components/v9/V9Status";
import { SocialScreen } from "@/components/v10/SocialScreen";
import { LiveOpsScreen } from "@/components/v10/LiveOpsScreen";
import { installLiveOpsBridge } from "@/lib/v10/liveops/liveOpsBridge";
import { SystemsScreen } from "@/components/v11/SystemsScreen";
import { MultiplayerScreen } from "@/components/v12/MultiplayerScreen";
import { AdminScreen } from "@/components/v13/AdminScreen";
import { PaymentsScreen } from "@/components/v13/PaymentsScreen";
import { ContentLanguagesScreen } from "@/components/v14/ContentLanguagesScreen";
import { V14LiveOpsScreen } from "@/components/v14/LiveOpsScreen";
import { SaveSlotsScreen } from "@/components/v16/SaveSlotsScreen";
import { installV14LiveOpsBridge } from "@/lib/v14/liveops/liveOpsBridge";
import { CreatorScreen } from "@/components/v24/CreatorScreen";
import { CreatorCommunityScreen } from "@/components/v26/CreatorCommunityScreen";
import { ProgressionHubScreen } from "@/components/v24/ProgressionHubScreen";
import { SeasonProgressScreen } from "@/components/v25/SeasonProgressScreen";
import { AnalyticsScreen } from "@/components/v27/AnalyticsScreen";
import { AccessibilityScreen } from "@/components/v28/AccessibilityScreen";
import { PwaScreen } from "@/components/v29/PwaScreen";
import { PushSettingsScreen } from "@/components/v30/PushSettingsScreen";
import { registerPwa } from "@/lib/v29/pwa/pwa";
import { VoiceCommandScreen } from "@/components/v34/VoiceCommandScreen";
import { AIPuzzleLabScreen } from "@/components/v35/AIPuzzleLabScreen";
import { PuzzleAuditScreen } from "@/components/v36/PuzzleAuditScreen";
import { PlayablePreviewScreen } from "@/components/v37/PlayablePreviewScreen";
import { CreatorPlaytestScreen } from "@/components/v38/CreatorPlaytestScreen";
import { ReleasePackageScreen } from "@/components/v40/ReleasePackageScreen";
import { ReleaseVerifierScreen } from "@/components/v41/ReleaseVerifierScreen";
import { ReleaseArchiveScreen } from "@/components/v42/ReleaseArchiveScreen";
import { PublishReadinessScreen } from "@/components/v39/PublishReadinessScreen";
import { JourneyLoading } from "@/components/screens/JourneyPolish";

export function GameApp() {
  const ready = useGame((s) => s.ready);
  const screen = useGame((s) => s.screen);
  const save = useGame((s) => s.save);
  const toast = useGame((s) => s.toast);

  useEffect(() => {
    useGame.getState().hydrate();
    const offV10 = installLiveOpsBridge();
    const offV14 = installV14LiveOpsBridge();
    const offPwa = registerPwa(() => {
      const id = Date.now();
      useGame.setState({ toast: { id, text: "A new app update is ready." } });
    });
    return () => { offV10(); offV14(); offPwa(); };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const cur = useGame.getState().save;
      const next = refillEnergy(cur);
      if (next.energy !== cur.energy || next.energyAt !== cur.energyAt) {
        writeSave(next);
        useGame.setState({ save: next });
      }
    }, 15000);
    const onHide = () => {
      if (document.visibilityState === "hidden") useGame.getState().persist();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", () => useGame.getState().persist());
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.theme = save.equippedTheme;
    root.dataset.contrast = save.settings.highContrast ? "high" : "";
    root.dataset.large = save.settings.largeText ? "1" : "";
    root.dir = isRtl(save.language, save.settings.rtlForce) ? "rtl" : "ltr";
    root.lang = save.language.startsWith("ur") ? "ur" : save.language;
    root.classList.toggle("no-scroll", true);
    root.dataset.dyslexia = save.settings.dyslexiaFriendly ? "1" : "";
    root.dataset.focus = save.settings.focusMode ? "1" : "";
    applyVolumes({
      master: save.settings.masterVol,
      sfx: save.settings.sfxVol,
      music: save.settings.musicVol,
      sfxOn: save.settings.sfx,
      musicOn: save.settings.music,
    });
  }, [ready, save.equippedTheme, save.settings, save.language]);

  useEffect(() => {
    const onFirst = () => {
      unlockAudio();
      if (useGame.getState().save.settings.music) startMusic();
    };
    window.addEventListener("pointerdown", onFirst, { once: true });
    return () => window.removeEventListener("pointerdown", onFirst);
  }, []);

  if (!ready) {
    return (
      <JourneyLoading />
    );
  }

  return (
    <div className="relative h-dvh overflow-hidden">
      <V9Status />
      <ScreenView screen={screen} />
      {toast && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-30 flex justify-center px-4">
          <div className="panel animate-pop rounded-full px-4 py-2 text-sm font-semibold text-fg">{toast.text}</div>
        </div>
      )}
    </div>
  );
}

function ScreenView({ screen }: { screen: ScreenId }) {
  switch (screen) {
    case "splash":
      return <SplashScreen />;
    case "home":
      return <HomeScreen />;
    case "worlds":
      return <WorldsScreen />;
    case "modes":
      return <ModesScreen />;
    case "play":
      return <PlayScreen />;
    case "shop":
      return <ShopScreen />;
    case "pets":
      return <PetsScreen />;
    case "profile":
      return <ProfileScreen />;
    case "settings":
      return <SettingsScreen />;
    case "achievements":
      return <AchievementsScreen />;
    case "stats":
      return <StatsScreen />;
    case "daily":
      return <DailyScreen />;
    case "spin":
      return <SpinScreen />;
    case "story":
      return <StoryScreen />;
    case "dictionary":
      return <DictionaryScreen />;
    case "leaderboard":
      return <LeaderboardScreen />;
    case "inventory":
      return <InventoryScreen />;
    case "skills":
      return <SkillsScreen />;
    case "base":
      return <BaseScreen />;
    case "equipment":
      return <EquipmentScreen />;
    case "combat":
      return <CombatScreen />;
    case "worldMap":
      return <WorldMapScreen />;
    case "storyQuests":
      return <StoryQuestScreen />;
    case "dialogue":
      return <DialogueScreen />;
    case "npcs":
      return <NPCScreen />;
    case "missions":
      return <MissionsScreen />;
    case "legal":
      return <LegalScreen />;
    case "social":
      return <SocialScreen />;
    case "liveOps":
      return <V14LiveOpsScreen />;
    case "systems":
      return <SystemsScreen />;
    case "multiplayer":
      return <MultiplayerScreen onBack={() => useGame.getState().setScreen("more")} />;
    case "admin":
      return <AdminScreen onBack={() => useGame.getState().setScreen("more")} />;
    case "payments":
      return <PaymentsScreen onBack={() => useGame.getState().setScreen("more")} />;
    case "content":
      return <ContentLanguagesScreen />;
    case "saveSlots":
      return <SaveSlotsScreen onBack={() => useGame.getState().setScreen("more")} />;
    case "creator":
      return <CreatorScreen />;
    case "progression":
      return <ProgressionHubScreen />;
    case "seasonProgress":
      return <SeasonProgressScreen />;
    case "analytics":
      return <AnalyticsScreen />;
    case "accessibility":
      return <AccessibilityScreen />;
    case "pwa":
      return <PwaScreen />;
    case "pushSettings":
      return <PushSettingsScreen />;
    case "coach":
      return <CoachScreen />;
    case "adaptive":
      return <AdaptiveScreen />;
    case "journeyPlanner":
      return <JourneyPlannerScreen />;
    case "voice":
      return <VoiceCommandScreen />;
    case "aiPuzzleLab":
      return <AIPuzzleLabScreen />;
    case "puzzleAudit":
      return <PuzzleAuditScreen />;
    case "playablePreview":
      return <PlayablePreviewScreen />;
    case "creatorPlaytest":
      return <CreatorPlaytestScreen />;
    case "publishReadiness":
      return <PublishReadinessScreen />;
    case "releasePackage":
      return <ReleasePackageScreen />;
    case "releaseVerifier":
      return <ReleaseVerifierScreen />;
    case "releaseArchive":
      return <ReleaseArchiveScreen />;
    case "creatorCommunity":
      return <CreatorCommunityScreen />;
    case "more":
      return <MoreScreen />;
    default:
      return <HomeScreen />;
  }
}
