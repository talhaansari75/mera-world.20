using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class LeaderboardUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public XPManager XP;

        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_LEADERBOARD = "LocalLeaderboard";
        private const int MAX_ENTRIES = 10;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (XP == null) XP = XPManager.Instance;
            Invoke(nameof(Setup), 1f);
        }

        public List<string> GetEntries()
        {
            var result = new List<string>();
            string raw = PlayerPrefs.GetString(KEY_LEADERBOARD, "");

            if (string.IsNullOrEmpty(raw))
            {
                result.Add("Player|" + (Progress != null ? Progress.TotalStars * 100 + Progress.HighestLevelUnlocked * 50 : 100));
                return result;
            }

            var entries = raw.Split(';');
            foreach (var e in entries)
                if (!string.IsNullOrEmpty(e)) result.Add(e);

            return result;
        }

        public void AddScore(string playerName, int score)
        {
            var entries = GetEntries();
            entries.Add(playerName + "|" + score);

            entries.Sort((a, b) =>
            {
                int sa = ParseScore(a);
                int sb = ParseScore(b);
                return sb.CompareTo(sa);
            });

            if (entries.Count > MAX_ENTRIES)
                entries.RemoveRange(MAX_ENTRIES, entries.Count - MAX_ENTRIES);

            PlayerPrefs.SetString(KEY_LEADERBOARD, string.Join(";", entries));
            PlayerPrefs.Save();
        }

        private int ParseScore(string entry)
        {
            var parts = entry.Split('|');
            if (parts.Length < 2) return 0;
            int s;
            return int.TryParse(parts[1], out s) ? s : 0;
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }
    }
}