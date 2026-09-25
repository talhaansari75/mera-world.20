using UnityEngine;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class GameManager : MonoBehaviour
    {
        [Header("Grid Settings")]
        public int GridRows = 8;
        public int GridColumns = 8;

        [Header("Words")]
        public List<string> Words = new List<string>
        {
            "CAT", "DOG", "SUN", "MOON", "STAR", "FISH", "BIRD", "TREE"
        };

        [HideInInspector]
        public WordGrid LastGeneratedGrid;

        [HideInInspector]
        public int CurrentLevel = 1;

        void Start()
        {
            // Read current level from PlayerPrefs
            CurrentLevel = PlayerPrefs.GetInt("CurrentLevel", 1);

            // Generate a unique seed per level so grid changes
            int seed = CurrentLevel * 7919 + 13;

            Debug.Log($"=== Mera World: Level {CurrentLevel} ===");
            Debug.Log($"Seed: {seed}");

            var result = WordSearchGenerator.Generate(GridRows, GridColumns, Words, seed);

            LastGeneratedGrid = result.Grid;

            Debug.Log($"Placed: {result.PlacedWords.Count} / {Words.Count}");

            foreach (var w in result.PlacedWords)
                Debug.Log($"  ✅ {w}");

            if (result.FailedWords.Count > 0)
                foreach (var w in result.FailedWords)
                    Debug.LogWarning($"  ❌ {w}");

            Debug.Log("\n" + result.Grid.ToDisplayString());
        }
    }
}