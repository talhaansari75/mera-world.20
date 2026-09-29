using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LevelIntroUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _banner;

        void Start()
        {
            Invoke(nameof(Setup), 0.4f);
        }

        private void Setup()
        {
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (Sound == null) Sound = SoundManager.Instance;

            BuildCanvas();
            BuildBanner();
            StartCoroutine(ShowIntro());
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LevelIntroCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 400;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBanner()
        {
            _banner = new GameObject("Banner");
            _banner.transform.SetParent(_canvas.transform, false);

            var bg = _banner.AddComponent<Image>();
            bg.color = new Color(0.05f, 0.10f, 0.25f, 0.95f);

            var rt = _banner.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 0.42f);
            rt.anchorMax = new Vector2(1f, 0.58f);
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var topLine = new GameObject("TopLine");
            topLine.transform.SetParent(_banner.transform, false);
            var tlImg = topLine.AddComponent<Image>();
            tlImg.color = new Color(1f, 0.85f, 0.30f);
            var tlRt = topLine.GetComponent<RectTransform>();
            tlRt.anchorMin = new Vector2(0f, 1f);
            tlRt.anchorMax = new Vector2(1f, 1f);
            tlRt.pivot = new Vector2(0.5f, 1f);
            tlRt.anchoredPosition = Vector2.zero;
            tlRt.sizeDelta = new Vector2(0f, 6f);

            var bottomLine = new GameObject("BottomLine");
            bottomLine.transform.SetParent(_banner.transform, false);
            var blImg = bottomLine.AddComponent<Image>();
            blImg.color = new Color(1f, 0.85f, 0.30f);
            var blRt = bottomLine.GetComponent<RectTransform>();
            blRt.anchorMin = new Vector2(0f, 0f);
            blRt.anchorMax = new Vector2(1f, 0f);
            blRt.pivot = new Vector2(0.5f, 0f);
            blRt.anchoredPosition = Vector2.zero;
            blRt.sizeDelta = new Vector2(0f, 6f);

            int level = GameManager != null ? GameManager.CurrentLevel : 1;

            var lvlObj = new GameObject("LevelText");
            lvlObj.transform.SetParent(_banner.transform, false);
            var lvlTxt = lvlObj.AddComponent<Text>();
            lvlTxt.text = $"LEVEL {level}";
            lvlTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            lvlTxt.fontSize = 100;
            lvlTxt.fontStyle = FontStyle.Bold;
            lvlTxt.color = new Color(1f, 0.85f, 0.30f);
            lvlTxt.alignment = TextAnchor.MiddleCenter;
            lvlTxt.raycastTarget = false;

            var lvlRt = lvlObj.GetComponent<RectTransform>();
            lvlRt.anchorMin = Vector2.zero;
            lvlRt.anchorMax = Vector2.one;
            lvlRt.offsetMin = Vector2.zero;
            lvlRt.offsetMax = Vector2.zero;

            _banner.transform.localScale = new Vector3(0f, 1f, 1f);
        }

        private IEnumerator ShowIntro()
        {
            yield return new WaitForSecondsRealtime(0.2f);

            if (Sound != null) Sound.PlayButtonClick();

            float duration = 0.4f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                _banner.transform.localScale = new Vector3(Mathf.SmoothStep(0f, 1f, t), 1f, 1f);
                yield return null;
            }

            yield return new WaitForSecondsRealtime(1.2f);

            elapsed = 0f;
            duration = 0.5f;
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
    }
}