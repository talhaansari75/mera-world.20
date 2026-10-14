using UnityEngine;

namespace MeraWorld.Core
{
    public static class BossLevelManager
    {
        public static bool IsBossLevel(int level)
        {
            return level % 10 == 0 && level > 0;
        }

        public static string GetBossName(int level)
        {
            if (level % 50 == 0) return "OMEGA";
            if (level % 30 == 0) return "TITAN";
            if (level % 20 == 0) return "CHAMPION";
            return "GUARDIAN";
        }

        public static int GetBossReward(int level)
        {
            if (level % 50 == 0) return 500;
            if (level % 30 == 0) return 300;
            if (level % 20 == 0) return 200;
            return 100;
        }

        public static int GetBossDifficulty(int level)
        {
            if (level % 50 == 0) return 3;
            if (level % 30 == 0) return 2;
            return 1;
        }
    }
}