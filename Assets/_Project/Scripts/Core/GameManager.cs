using UnityEngine;
using MeraWorld.Data;

namespace MeraWorld.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Data")]
        public LevelDatabase levelDatabase;

        [Header("Runtime")]
        public int currentLevel = 1;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        void Start()
        {
            LoadLevel(currentLevel);
        }

        public void LoadLevel(int levelNumber)
        {
            var data = levelDatabase.GetLevel(levelNumber);
            if (data == null)
            {
                Debug.LogError($"Level {levelNumber} nahi mila!");
                return;
            }
            currentLevel = levelNumber;
            Debug.Log($"Loaded Level {levelNumber} | Grid: {data.gridSize} | Moves: {data.moveLimit}");
        }

        public void NextLevel()
        {
            LoadLevel(currentLevel + 1);
        }
    }
}
