using UnityEngine;

namespace MeraWorld.Data
{
    /// <summary>
    /// Ek single level ka data. Ye ScriptableObject ke andar list me store hoga.
    /// </summary>
    [System.Serializable]
    public class LevelData
    {
        public int levelNumber;
        public int gridSize = 5;
        public int moveLimit = 20;
        public string hint;
        public int[] solution;
        public int starThreshold1 = 10;
        public int starThreshold2 = 15;
        public int starThreshold3 = 18;
    }
}
