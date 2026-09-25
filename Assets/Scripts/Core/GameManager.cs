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
        public int Seed = 12345;

        [Header("Words")]
        public List<string> Words = new List<string>
        {
            "CAT", "DOG", "SUN", "MOON", "STAR", "FISH", "BIRD", "TREE"
        };

        [HideInInspector]
        public WordGrid LastGeneratedGrid;

        void Start()
        {
            Debug.Log("=== Mera World: Word Search ===");

            var result = WordSearchGenerator.Generate(GridRows, GridColumns, Words, Seed);

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