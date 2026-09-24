using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    /// <summary>
    /// Temporary bootstrap script to verify Unity setup works.
    /// Will be replaced with the real game manager later.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        [Header("Grid Settings")]
        public int GridRows = 5;
        public int GridColumns = 5;

        void Start()
        {
            Debug.Log("=== Mera World: Word Search ===");

            var grid = new WordGrid(GridRows, GridColumns);
            var rng = new System.Random(12345);
            grid.FillWithRandomLetters(rng);

            Debug.Log($"Created {GridRows}x{GridColumns} grid:");
            Debug.Log("\n" + grid.ToDisplayString());
        }
    }
}