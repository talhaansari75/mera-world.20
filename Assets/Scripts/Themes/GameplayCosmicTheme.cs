using UnityEngine;

namespace MeraWorld.Core
{
    public class GameplayCosmicTheme : MonoBehaviour
    {
        private GameObject _bgObj;
        private GameObject _patternObj;

        // Colors come from ThemePalette (dynamic)
        private Color BgDeep { get { return ThemePalette.Get(GetCurrentThemeName()).BgDeep; } }
        private Color BgMid  { get { return ThemePalette.Get(GetCurrentThemeName()).BgMid; } }
        private Color BgTop  { get { return ThemePalette.Get(GetCurrentThemeName()).BgTop; } }
        private Color PatternColor { get { return new Color(1f, 1f, 1f, 0.15f); } }

        private string GetCurrentThemeName()
        {
            return ThemeManager.Instance != null ? ThemeManager.Instance.CurrentTheme : "Classic";
        }

        void Start() { Invoke(nameof(BuildBackground), 0.05f); }
        void OnEnable() { Invoke(nameof(BuildBackground), 0.1f); }

        public void BuildBackground()
        {
            Debug.Log("[GameplayTheme] === BuildBackground CALLED ===");
            if (_bgObj != null) Destroy(_bgObj);
            if (_patternObj != null) Destroy(_patternObj);

            var cam = Camera.main;
            if (cam == null) { Debug.LogError("[GameplayTheme] CAMERA IS NULL!"); return; }
            Debug.Log("[GameplayTheme] Camera: " + cam.name + " | clearFlags=" + cam.clearFlags);

            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = BgDeep;

            float worldHeight = cam.orthographicSize * 2.5f;
            float worldWidth = worldHeight * ((float)Screen.width / Screen.height);

            _bgObj = new GameObject("GameplayBackground");
            _bgObj.transform.SetParent(transform, false);
            var sr = _bgObj.AddComponent<SpriteRenderer>();
            
            // Try premium paisley image first
            Sprite paisley = Resources.Load<Sprite>("UI/Premium/bg_paisley");
            Debug.Log("[GameplayTheme] Paisley sprite: " + (paisley != null ? "LOADED" : "NULL"));
            if (paisley != null)
            {
                sr.sprite = paisley;
                sr.color = new Color(BgMid.r, BgMid.g, BgMid.b, 0.5f);   // theme-tinted 50% opacity
                Debug.Log("[GameplayTheme] Premium paisley bg loaded!");
            }
            else
            {
                // Fallback: gradient + procedural pattern
                sr.sprite = UISpriteFactory.CreateGradientSprite(BgMid, BgTop, 64, 512);
                sr.color = Color.white;
                Debug.Log("[GameplayTheme] Using fallback gradient");
            }
            
            sr.sortingOrder = -100;
            _bgObj.transform.localScale = new Vector3(worldWidth, worldHeight, 1f);
            _bgObj.transform.position = new Vector3(0f, 0f, 5f);
            Debug.Log("[GameplayTheme] BG created: pos=" + _bgObj.transform.position + " scale=" + _bgObj.transform.localScale + " sortingOrder=" + sr.sortingOrder + " color=" + sr.color);

            // Procedural pattern only if no premium image
            if (paisley == null)
            {
                _patternObj = new GameObject("PaisleyPattern");
                _patternObj.transform.SetParent(_bgObj.transform, false);
                BuildPaisleyPattern(worldWidth, worldHeight);
            }
        }

        private void BuildPaisleyPattern(float width, float height)
        {
            int cols = 5;
            int rows = 8;
            float spacing = width / cols;

            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    var dot = new GameObject($"P_{r}_{c}");
                    dot.transform.SetParent(_patternObj.transform, false);
                    var sr = dot.AddComponent<SpriteRenderer>();
                    sr.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 1f, 1f, 0.35f), 64);
                    sr.color = PatternColor;
                    sr.sortingOrder = -99;

                    float x = -width * 0.5f + (c + 0.5f) * spacing;
                    if (r % 2 == 1) x += spacing * 0.5f;
                    float y = -height * 0.5f + (r + 0.5f) * (height / rows);

                    dot.transform.localPosition = new Vector3(x / width, y / height, 0f);
                    dot.transform.localScale = new Vector3(0.12f, 0.12f, 1f);
                }
            }
        }
    }
}
