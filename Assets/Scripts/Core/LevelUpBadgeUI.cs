using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LevelUpBadgeUI : MonoBehaviour
    {
        [Header("References")]
        public WinScreenUI WinScreen;
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _badge;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 0.8f);
        }

        private void Setup()
        {
            if (WinScreen == null) WinScreen = FindFirstObjectByType<WinScreenUI>();

            BuildCanvas();
            BuildBadge();

            // Hook after win screen shows
            if (SelectionManager.Instance != null)
                MeraWorld.Core.SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LevelUpBadgeCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 350;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBadge()
        {
            _badge = new GameObject("Badge");
            _badge.transform.SetParent(_canvas.transform, false);

            var bg = _badge.AddComponent<Image>();
            bg.color = new Color(1f, 0.75f, 0.20f, 0.98f);

            var rt = _badge.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 550f);
            rt.sizeDelta = new Vector2(500f, 130f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(_badge.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "PERFECT!";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 60;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(0.20f, 0.10f, 0.05f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            _badge.SetActive(false);
        }

        private void OnLevelComplete()
        {
            // Show only if no hints
            if (WinScreen != null && WinScreen.HintsUsed == 0)
            {
                StartCoroutine(ShowBadge());
            }
        }

        private IEnumerator ShowBadge()
        {
            yield return new WaitForSecondsRealtime(0.5f);

            _badge.SetActive(true);
            var rt = _badge.GetComponent<RectTransform>();

            float duration = 0.5f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float scale = 1f + Mathf.Sin(t * Mathf.PI) * 0.35f;
                rt.localScale = new Vector3(scale, scale, 1f);
                yield return null;
            }
            rt.localScale = Vector3.one;

            yield return new WaitForSecondsRealtime(2.5f);
            _badge.SetActive(false);
        }

        void OnDestroy()
        {
            if (SelectionManager.Instance != null)
                MeraWorld.Core.SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}
