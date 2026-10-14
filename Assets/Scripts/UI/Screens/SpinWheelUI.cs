using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class SpinWheelUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private RectTransform _wheelRect;
        private Text _resultText;
        private Text _spinStatusText;
        private Button _spinButton;
        private bool _isSpinning = false;

        private const string KEY_LAST_SPIN = "LastSpinDate";

        private static readonly int[] Rewards = { 50, 100, 200, 25, 500, 75, 150, 300 };
        private static readonly string[] RewardNames = { "50", "100", "200", "25", "500", "75", "150", "300" };
        private static readonly Color[] WheelColors =
        {
            new Color(1f, 0.85f, 0.30f),
            new Color(0.85f, 0.35f, 0.35f),
            new Color(0.30f, 0.65f, 0.95f),
            new Color(0.35f, 0.85f, 0.45f),
            new Color(0.95f, 0.55f, 0.20f),
            new Color(0.75f, 0.45f, 0.90f),
            new Color(0.30f, 0.85f, 0.85f),
            new Color(0.95f, 0.75f, 0.30f),
        };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;
            Invoke(nameof(Setup), 1.2f);
        }

        private void Setup() { BuildCanvas(); BuildPanel(); UpdateState(); }

        private void UpdateState()
        {
            if (CanSpinToday())
            {
                if (_spinStatusText != null) _spinStatusText.text = "FREE SPIN AVAILABLE!";
                if (_spinButton != null) _spinButton.interactable = true;
            }
            else
            {
                if (_spinStatusText != null) _spinStatusText.text = "Come back tomorrow!";
                if (_spinButton != null) _spinButton.interactable = false;
            }
        }

        private bool CanSpinToday()
        {
            string last = PlayerPrefs.GetString(KEY_LAST_SPIN, "");
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return last != today;
        }

        public void Show() { if (_panel != null) { _panel.SetActive(true); UpdateState(); } }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }
    }
}