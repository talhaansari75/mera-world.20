using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Data
{
    /// <summary>
    /// 1 World = 1 ScriptableObject. Har World me 300-400 levels.
    /// 2000 levels = 5-7 World SO files. Build size chhota, load fast.
    /// </summary>
    [CreateAssetMenu(fileName = "World_1", menuName = "MeraWorld/World Data")]
    public class WorldData : ScriptableObject
    {
        [Header("World Info")]
        public int worldNumber = 1;
        public string worldName = "World 1";
        public string description;

        [Header("Levels (300-400 recommended)")]
        public List<LevelData> levels = new List<LevelData>();

        public int LevelCount => levels.Count;

        public LevelData GetLevel(int index)
        {
            if (index < 0 || index >= levels.Count) return null;
            return levels[index];
        }
    }
}
