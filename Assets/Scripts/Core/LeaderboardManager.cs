using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Local leaderboard simulation. Uses fake bot entries + real player score.
    /// Later: replace with real online leaderboard API.
    /// </summary>
    public static class LeaderboardManager
    {
        private const string KEY_PLAYER_HIGH_SCORE = "Leaderboard_PlayerHighScore";
        private const string KEY_WEEK_SEED = "Leaderboard_WeekSeed";

        public class Entry
        {
            public string Name;
            public int Score;
            public bool IsPlayer;
        }

        private static readonly string[] BotNames = {
            "DragonSlayer99", "ProGamer42", "WordKing", "MysticMage", "QuickFingers",
            "FastFinder", "AlphaWolf", "NightOwl", "PuzzleMaster", "WordNinja",
            "LexiconLord", "GridMaster", "LetterLegend", "PhrasePhantom", "SilentSeeker",
            "SpeedySolver", "BrainStorm", "EnigmaHunter", "CipherChief", "VowelViking",
            "ZenithZen", "PrimePlayer", "AceHunter", "StarSearcher", "TurboTypist"
        };

        public static int PlayerHighScore =>
            PlayerPrefs.GetInt(KEY_PLAYER_HIGH_SCORE, 0);

        public static void SubmitScore(int score)
        {
            if (score > PlayerHighScore)
            {
                PlayerPrefs.SetInt(KEY_PLAYER_HIGH_SCORE, score);
                PlayerPrefs.Save();
                Debug.Log($"[Leaderboard] New high score: {score}");
            }
        }

        /// <summary>
        /// Get leaderboard entries. Uses a weekly seed so bots shift each week.
        /// </summary>
        public static List<Entry> GetLeaderboard(int count = 20)
        {
            int weekSeed = GetWeekSeed();
            var rng = new System.Random(weekSeed);

            var entries = new List<Entry>();

            // Bot entries
            for (int i = 0; i < count; i++)
            {
                int nameIndex = rng.Next(BotNames.Length);
                string name = BotNames[nameIndex];

                // Score: top bots 2000-3000, decreasing
                int baseScore = 3000 - i * 100;
                int variance = rng.Next(-80, 80);
                int score = Mathf.Max(50, baseScore + variance);

                entries.Add(new Entry { Name = name, Score = score, IsPlayer = false });
            }

            // Add player
            entries.Add(new Entry { Name = "YOU", Score = PlayerHighScore, IsPlayer = true });

            // Sort by score descending
            entries.Sort((a, b) => b.Score.CompareTo(a.Score));

            // Take top N
            if (entries.Count > count)
                entries = entries.GetRange(0, count);

            return entries;
        }

        public static int GetPlayerRank()
        {
            var board = GetLeaderboard(50);
            for (int i = 0; i < board.Count; i++)
                if (board[i].IsPlayer) return i + 1;
            return -1;
        }

        private static int GetWeekSeed()
        {
            int year = DateTime.UtcNow.Year;
            int week = System.Globalization.ISOWeek.GetWeekOfYear(DateTime.UtcNow);
            return year * 100 + week;
        }
    }
}