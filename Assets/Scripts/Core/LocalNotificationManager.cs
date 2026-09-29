using System;
using UnityEngine;

namespace MeraWorld.Core
{
    public class LocalNotificationManager : MonoBehaviour
    {
        public static LocalNotificationManager Instance { get; private set; }

        private const string KEY_NOTIF_ENABLED = "Notif_Enabled";
        private const string KEY_LAST_SCHEDULE = "Notif_LastSchedule";

        public bool NotificationsEnabled => PlayerPrefs.GetInt(KEY_NOTIF_ENABLED, 1) == 1;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            ScheduleDailyReminder();
        }

        public void SetNotificationsEnabled(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_NOTIF_ENABLED, enabled ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[Notif] Notifications: {enabled}");

            if (enabled) ScheduleDailyReminder();
            else CancelAll();
        }

        public void ScheduleDailyReminder()
        {
            if (!NotificationsEnabled) return;

            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string last = PlayerPrefs.GetString(KEY_LAST_SCHEDULE, "");
            if (last == today) return;

            PlayerPrefs.SetString(KEY_LAST_SCHEDULE, today);
            PlayerPrefs.Save();

            ScheduleNotification("Mera Word Search Journey", "New daily rewards are ready! Claim your coins.", 20 * 3600);
            Debug.Log("[Notif] Daily reminder scheduled");
        }

        public void ScheduleStreakReminder()
        {
            if (!NotificationsEnabled) return;

            int streak = PlayerPrefs.GetInt("Stats_DayStreak", 0);
            if (streak < 2) return;

            ScheduleNotification("Don't break your streak!", $"You're on a {streak}-day streak. Play now!", 12 * 3600);
            Debug.Log($"[Notif] Streak reminder scheduled ({streak} days)");
        }

        public void ScheduleMilestoneNotification(int nextLevel)
        {
            if (!NotificationsEnabled) return;
            ScheduleNotification("Almost there!", $"Just {nextLevel} more level to unlock a milestone reward.", 6 * 3600);
        }

        private void ScheduleNotification(string title, string body, int secondsFromNow)
        {
            // Placeholder — real implementation needs Unity Mobile Notifications package
            Debug.Log($"[Notif] Would schedule: '{title}' in {secondsFromNow}s");
        }

        private void CancelAll()
        {
            Debug.Log("[Notif] All notifications cancelled");
        }
    }
}