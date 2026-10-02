using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class HomeScreenUI
    {
        private GameTheme _currentTheme;
        private Image _bgGradientImage;

        public void ApplyTheme(GameTheme theme)
        {
            if (theme == null) return;
            _currentTheme = theme;

            Debug.Log($"[ApplyTheme] Called - bgImg={(_bgGradientImage != null)}, theme={theme.themeName}");
            if (_bgGradientImage != null)
            {
                _bgGradientImage.sprite = UISpriteFactory.CreateGradientSprite(theme.bgBottom, theme.bgTop, 64, 512);
                Debug.Log($"[ApplyTheme] Background sprite updated to {theme.themeName}");
            }
            else Debug.LogWarning("[ApplyTheme] _bgGradientImage is NULL!");

            if (_titleGroup != null)
            {
                var texts = _titleGroup.GetComponentsInChildren<Text>();
                foreach (var t in texts)
                {
                    if (t.text.Contains("MERA")) t.color = theme.gold;
                }
            }

            // Rebuild bottom row with theme colors
            if (_homeCanvas != null)
            {
                var oldRows = _homeCanvas.transform.Find("BottomRow");
                if (oldRows != null) Destroy(oldRows.gameObject);
                FixBottomRowWithTheme();
            }

            BuildThemeParticles();
        }

        private void FixBottomRowWithTheme()
        {
            if (_currentTheme == null && ThemeManager.Instance != null)
                _currentTheme = ThemeManager.Instance.CurrentTheme;

            // Fallback colors if theme not loaded
            Color green = _currentTheme != null ? _currentTheme.buttonGreen : new Color(0.25f, 0.65f, 0.35f);
            Color blue = _currentTheme != null ? _currentTheme.buttonBlue : new Color(0.25f, 0.45f, 0.85f);
            Color gold = _currentTheme != null ? _currentTheme.gold : new Color(1f, 0.85f, 0.30f);
            Color bg = _currentTheme != null ? _currentTheme.bgTop : new Color(0.16f, 0.08f, 0.34f);

            float catY = -150f;
            float spacingX = 240f;
            float spacingY = 200f;

            Create3DButton(_homeCanvas.transform, "\uD83D\uDC65  SOCIAL", new Vector2(-spacingX, catY),
                new Vector2(220f, 180f), new Color(0.75f, 0.30f, 0.30f), 22, () => OpenCategory("social"));

            Create3DButton(_homeCanvas.transform, "\uD83D\uDECD  SHOP", new Vector2(spacingX, catY),
                new Vector2(220f, 180f), new Color(0.90f, 0.55f, 0.20f), 22, () => OpenCategory("shop"));

            Create3DButton(_homeCanvas.transform, "\uD83C\uDFA8  THEME", new Vector2(-spacingX, catY - spacingY),
                new Vector2(220f, 180f), new Color(0.60f, 0.40f, 0.90f), 22, OnThemeClicked);

            Create3DButton(_homeCanvas.transform, "\uD83D\uDCCA  PROGRESS", new Vector2(spacingX, catY - spacingY),
                new Vector2(220f, 180f), new Color(0.30f, 0.65f, 0.80f), 20, () => OpenCategory("progress"));
        }

        private void OnThemeClicked()
        {
            Debug.Log("[Theme] Button clicked");
            var selector = FindFirstObjectByType<ThemeSelectorUI>(FindObjectsInactive.Include);
            if (selector != null)
            {
                selector.Show();
                Debug.Log("[Theme] Selector shown");
            }
            else Debug.LogWarning("[Theme] ThemeSelectorUI scene me nahi hai!");
        }

        private void SaveBgReference(Image bgImg)
        {
            _bgGradientImage = bgImg;
            if (ThemeManager.Instance != null && ThemeManager.Instance.CurrentTheme != null)
            {
                _currentTheme = ThemeManager.Instance.CurrentTheme;
                bgImg.sprite = UISpriteFactory.CreateGradientSprite(_currentTheme.bgBottom, _currentTheme.bgTop, 64, 512);
            }
        }
    }
}