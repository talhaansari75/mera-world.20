using UnityEngine;

namespace MeraWorld.Data
{
    /// <summary>
    /// Sab World SO files ko hold karta hai. Game me isi se level fetch hoga.
    /// Inspector me saray WorldData drag karo.
    /// </summary>
    [CreateAssetMenu(fileName = "LevelDatabase", menuName = "MeraWorld/Level Database")]
    public class LevelDatabase : ScriptableObject
    {
        public WorldData[] worlds;

        /// <summary>
        /// Global level number (1, 2, 3...) se level nikaalo.
        /// </summary>
        public LevelData GetLevel(int globalLevelNumber)
        {
            if (globalLevelNumber < 1) return null;

            int remaining = globalLevelNumber;
            foreach (var world in worlds)
            {
                if (world == null) continue;
                if (remaining <= world.LevelCount)
                    return world.GetLevel(remaining - 1);
                remaining -= world.LevelCount;
            }
            return null;
        }

        public int TotalLevels
        {
            get
            {
                int total = 0;
                foreach (var w in worlds) if (w != null) total += w.LevelCount;
                return total;
            }
        }
    }
}
