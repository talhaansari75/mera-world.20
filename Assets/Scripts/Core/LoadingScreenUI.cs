using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LoadingScreenUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private Image _spinner;
        private Text _tipText;

        private static readonly string[] Tips = new string[]
        {
            "TIP: Fast finds earn combo bonuses!",
            "TIP: Use HINT when stuck — costs 50 coins",
            "TIP: Complete levels without hints for 3 stars",
            "TIP: Daily rewards give up to 500 coins!",
            "TIP: Watch rewarded ads for FREE coins",
            "TIP: Longer words are easier to spot first",
            "TIP: Diagonal words can go both directions",
            "TIP: Milestones unlock every 5 levels",
            "TIP: Skip button unlocks if you're stuck",
            "TIP: Collect pets to boost your coins!",
        };

        void Start()
        {
            Invoke(nameof(Setup), 0.1f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
            StartCoroutine(ShowBriefly());
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LoadingCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 950;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("LoadingPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.04f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_panel.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = "MERA WORD";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 90;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = new Color(1f, 0.85f, 0.30f);
            titleTxt.alignment = TextAnchor.MiddleCenter;
            titleTxt.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0.5f, 0.5f);
            titleRt.anchorMax = new Vector2(0.5f, 0.5f);
            titleRt.pivot = new Vector2(0.5f, 0.5f);
            titleRt.anchoredPosition = new Vector2(0f, 300f);
            titleRt.sizeDelta = new Vector2(900f, 120f);

            // Spinner
            var spinObj = new GameObject("Spinner");
            spinObj.transform.SetParent(_panel.transform, false);
            _spinner = spinObj.AddComponent<Image>();
            _spinner.color = new Color(0.85f, 0.90f, 1f);
            _spinner.raycastTarget = false;

            var srt = spinObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 0.5f);
            srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, 0f);
            srt.sizeDelta = new Vector2(100f, 100f);

            // Tip
            var tipObj = new GameObject("Tip");
            tipObj.transform.SetParent(_panel.transform, false);
            _tipText = tipObj.AddComponent<Text>();
            _tipText.text = Tips[Random.Range(0, Tips.Length)];
            _tipText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _tipText.fontSize = 32;
            _tipText.fontStyle = FontStyle.Italic;
            _tipText.color = new Color(0.70f, 0.80f, 1f);
            _tipText.alignment = TextAnchor.MiddleCenter;
            _tipText.raycastTarget = false;
            var tipRt = tipObj.GetComponent<RectTransform>();
            tipRt.anchorMin = new Vector2(0.5f, 0.5f);
            tipRt.anchorMax = new Vector2(0.5f, 0.5f);
            tipRt.pivot = new Vector2(0.5f, 0.5f);
            tipRt.anchoredPosition = new Vector2(0f, -300f);
            tipRt.sizeDelta = new Vector2(900f, 100f);
        }

        void Update()
        {
            if (_spinner != null)
                _spinner.rectTransform.Rotate(0f, 0f, -360f * Time.unscaledDeltaTime);
        }

        private IEnumerator ShowBriefly()
        {
            yield return new WaitForSecondsRealtime(1.5f);

            float duration = 0.4f;
            float elapsed = 0f;
            var bg = _panel.GetComponent<Image>();
            var titleTxt = _panel.transform.Find("Title")?.GetComponent<Text>();

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                var c = bg.color; c.a = 1f - t; bg.color = c;
                if (titleTxt != null) { var tc = titleTxt.color; tc.a = 1f - t; titleTxt.color = tc; }
                if (_spinner != null) { var sc = _spinner.color; sc.a = 1f - t; _spinner.color = sc; }
                if (_tipText != null) { var tt = _tipText.color; tt.a = 1f - t; _tipText.color = tt; }

                yield return null;
            }

            if (_panel != null) Destroy(_panel);
            if (_canvas != null) Destroy(_canvas.gameObject);
        }
    }
}