using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class BossLevelUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _banner;

        void Start()
        {
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(CheckBossLevel), 1.2f);
        }

        private void CheckBossLevel()
        {
            if (GameManager == null) return;

            int level = GameManager.CurrentLevel;
            if (level % 10 != 0) return;

            BuildCanvas();
            BuildBanner(level);
            StartCoroutine(ShowBossIntro());
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("BossCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 390;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicsRaycasterProxy>(); // fallback if no GraphicsRaycaster imported
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBanner(int level)
        {
            _banner = new GameObject("BossBanner");
            _banner.transform.SetParent(_canvas.transform, false);

            var bg = _banner.AddComponent<Image>();
            bg.color = new Color(0.6f, 0.08f, 0.08f, 0.95f);

            var rt = _banner.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 0.35f);
            rt.anchorMax = new Vector2(1f, 0.65f);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Top border
            var topLine = new GameObject("TopLine");
            topLine.transform.SetParent(_banner.transform, false);
            var tli = topLine.AddComponent<Image>();
            tli.color = new Color(1f, 0.85f, 0.30f);
            var tlRt = topLine.GetComponent<RectTransform>();
            tlRt.anchorMin = new Vector2(0f, 1f);
            tlRt.anchorMax = new Vector2(1f, 1f);
            tlRt.pivot = new Vector2(0.5f, 1f);
            tlRt.anchoredPosition = Vector2.zero;
            tlRt.sizeDelta = new Vector2(0f, 8f);

            // Bottom border
            var botLine = new GameObject("BotLine");
            botLine.transform.SetParent(_banner.transform, false);
            var bli = botLine.AddComponent<Image>();
            bli.color = new Color(1f, 0.85f, 0.30f);
            var blRt = botLine.GetComponent<RectTransform>();
            blRt.anchorMin = new Vector2(0f, 0f);
            blRt.anchorMax = new Vector2(1f, 0f);
            blRt.pivot = new Vector2(0.5f, 0f);
            blRt.anchoredPosition = Vector2.zero;
            blRt.sizeDelta = new Vector2(0f, 8f);

            CreateText(_banner.transform, "BOSS LEVEL!", new Vector2(0f, 60f), 90,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateText(_banner.transform, $"Level {level} Challenge", new Vector2(0f, -30f), 45,
                Color.white, FontStyle.Bold);

            _banner.transform.localScale = new Vector3(0f, 1f, 1f);
        }

        private IEnumerator ShowBossIntro()
        {
            yield return new WaitForSecondsRealtime(0.3f);

            if (Sound != null) Sound.PlayLevelComplete();

            float duration = 0.5f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                _banner.transform.localScale = new Vector3(Mathf.SmoothStep(0f, 1f, t), 1f, 1f);
                yield return null;
            }

            yield return new WaitForSecondsRealtime(2f);

            elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                _banner.transform.localScale = new Vector3(Mathf.SmoothStep(1f, 0f, t), 1f, 1f);
                yield return null;
            }

            if (_banner != null) Destroy(_banner);
            if (_canvas != null) Destroy(_canvas.gameObject);
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = style;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 130f);
            return txt;
        }
    }

    // Tiny proxy class — prevents compile if GraphicRaycaster not yet imported
    public class GraphicsRaycasterProxy : MonoBehaviour { }
}