using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AccessibilityUI : MonoBehaviour
    {
        public static AccessibilityUI Instance { get; private set; }

        private const string KEY_COLOR_BLIND = "A11y_ColorBlind";
        private const string KEY_FONT_SCALE = "A11y_FontScale";
        private const string KEY_REDUCED_MOTION = "A11y_ReducedMotion";
        private const string KEY_HIGH_CONTRAST = "A11y_HighContrast";
        private const string KEY_DARK_MODE = "A11y_DarkMode";

        public bool ColorBlindMode => PlayerPrefs.GetInt(KEY_COLOR_BLIND, 0) == 1;
        public float FontScale => PlayerPrefs.GetFloat(KEY_FONT_SCALE, 1f);
        public bool ReducedMotion => PlayerPrefs.GetInt(KEY_REDUCED_MOTION, 0) == 1;
        public bool HighContrast => PlayerPrefs.GetInt(KEY_HIGH_CONTRAST, 0) == 1;
        public bool DarkMode => PlayerPrefs.GetInt(KEY_DARK_MODE, 1) == 1;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void SetColorBlindMode(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_COLOR_BLIND, enabled ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[A11y] Color blind mode: {enabled}");
        }

        public void SetFontScale(float scale)
        {
            scale = Mathf.Clamp(scale, 0.8f, 1.5f);
            PlayerPrefs.SetFloat(KEY_FONT_SCALE, scale);
            PlayerPrefs.Save();
            ApplyFontScale();
            Debug.Log($"[A11y] Font scale: {scale}");
        }

        public void SetReducedMotion(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_REDUCED_MOTION, enabled ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[A11y] Reduced motion: {enabled}");
        }

        public void SetHighContrast(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_HIGH_CONTRAST, enabled ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[A11y] High contrast: {enabled}");
        }

        public void SetDarkMode(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_DARK_MODE, enabled ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[A11y] Dark mode: {enabled}");
        }

        private void ApplyFontScale()
        {
            var allTexts = FindObjectsByType<Text>(FindObjectsSortMode.None);
            foreach (var t in allTexts)
            {
                if (t == null) continue;
                if (t.name.Contains("_Scaled")) continue;
                t.fontSize = Mathf.RoundToInt(t.fontSize * FontScale);
            }
        }

        /// <summary>
        /// Get accessible colors for selected/found states.
        /// </summary>
        public Color GetSelectedColor()
        {
            if (HighContrast) return new Color(1f, 1f, 0f, 1f);
            if (ColorBlindMode) return new Color(0.10f, 0.50f, 1f, 0.95f);
            return new Color(0.95f, 0.85f, 0.30f, 0.70f);
        }

        public Color GetFoundColor()
        {
            if (HighContrast) return new Color(0f, 1f, 0f, 1f);
            if (ColorBlindMode) return new Color(1f, 0.50f, 0f, 0.95f);
            return new Color(0.40f, 0.85f, 0.40f, 0.85f);
        }
    }
}