using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class HomeScreenUI
    {
        private GameObject _particlesParent;
        private readonly List<RectTransform> _activeParticles = new List<RectTransform>();
        private Coroutine _particleAnimCoroutine;
        private int _particleStyle = 0;

        private void BuildThemeParticles()
        {
            if (_currentTheme == null && ThemeManager.Instance != null)
                _currentTheme = ThemeManager.Instance.CurrentTheme;

            if (_particlesParent != null) Destroy(_particlesParent);
            if (_particleAnimCoroutine != null) StopCoroutine(_particleAnimCoroutine);

            _particlesParent = new GameObject("ThemeParticles");
            _particlesParent.transform.SetParent(_homeCanvas.transform, false);
            _particlesParent.transform.SetAsFirstSibling();
            var prt = _particlesParent.AddComponent<RectTransform>();
            prt.anchorMin = Vector2.zero;
            prt.anchorMax = Vector2.one;
            prt.offsetMin = Vector2.zero;
            prt.offsetMax = Vector2.zero;

            _activeParticles.Clear();

            string themeName = (_currentTheme != null && !string.IsNullOrEmpty(_currentTheme.themeName))
                ? _currentTheme.themeName : "Ink";

            int count;
            Color particleColor;
            if (themeName.Contains("Ocean"))
            {
                count = 20; particleColor = new Color(0.75f, 0.95f, 1f); _particleStyle = 1;
            }
            else if (themeName.Contains("Sunset"))
            {
                count = 15; particleColor = new Color(1f, 0.85f, 0.4f); _particleStyle = 2;
            }
            else
            {
                count = 30; particleColor = new Color(1f, 0.95f, 0.75f); _particleStyle = 0;
            }

            var rng = new System.Random(1234);
            for (int i = 0; i < count; i++)
            {
                var pObj = new GameObject($"P_{i}");
                pObj.transform.SetParent(_particlesParent.transform, false);
                var img = pObj.AddComponent<Image>();
                img.sprite = UISpriteFactory.CreateGlowSprite(particleColor, 64);
                img.raycastTarget = false;
                img.color = new Color(particleColor.r, particleColor.g, particleColor.b, 0f);

                var rt = pObj.GetComponent<RectTransform>();
                float ax = (float)rng.NextDouble();
                float ay = (float)rng.NextDouble();
                rt.anchorMin = new Vector2(ax, ay);
                rt.anchorMax = new Vector2(ax, ay);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = Vector2.zero;
                float size = 15f + (float)rng.NextDouble() * 25f;
                rt.sizeDelta = new Vector2(size, size);

                _activeParticles.Add(rt);
            }

            _particleAnimCoroutine = StartCoroutine(AnimateParticles());
        }

        private IEnumerator AnimateParticles()
        {
            var phases = new float[_activeParticles.Count];
            var speeds = new float[_activeParticles.Count];
            var rng = new System.Random(777);
            for (int i = 0; i < _activeParticles.Count; i++)
            {
                phases[i] = (float)rng.NextDouble() * 6.283f;
                speeds[i] = 0.5f + (float)rng.NextDouble() * 1.5f;
            }

            while (true)
            {
                float t = Time.unscaledTime;
                float dt = Time.unscaledDeltaTime;

                for (int i = 0; i < _activeParticles.Count; i++)
                {
                    var rt = _activeParticles[i];
                    if (rt == null) continue;
                    var img = rt.GetComponent<Image>();
                    if (img == null) continue;

                    float alpha = 0.25f + 0.55f * (0.5f + 0.5f * Mathf.Sin(t * speeds[i] + phases[i]));
                    var c = img.color;
                    c.a = alpha;
                    img.color = c;

                    if (_particleStyle == 1)
                    {
                        var ap = rt.anchoredPosition;
                        ap.y += 25f * dt;
                        if (ap.y > 1100f) ap.y = -1100f;
                        rt.anchoredPosition = ap;
                    }
                    else if (_particleStyle == 2)
                    {
                        var ap = rt.anchoredPosition;
                        ap.y = Mathf.Sin(t * 0.4f + phases[i]) * 25f;
                        rt.anchoredPosition = ap;
                    }
                }
                yield return null;
            }
        }
    }
}