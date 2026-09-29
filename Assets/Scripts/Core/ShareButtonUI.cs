using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ShareButtonUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _toast;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            Invoke(nameof(Setup), 0.7f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildShareButton();
            BuildToast();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ShareCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 650;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildShareButton()
        {
            var btnObj = new GameObject("ShareButton");
            btnObj.transform.SetParent(_canvas.transform, false);

            var img = btnObj.AddComponent<Image>();
            img.color = new Color(0.30f, 0.55f, 0.85f);

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(OnShareClicked);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(0f, 1f);
            rt.pivot = new Vector2(0f, 1f);
            rt.anchoredPosition = new Vector2(30f, -130f);
            rt.sizeDelta = new Vector2(120f, 120f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "SHARE";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 24;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void BuildToast()
        {
            _toast = new GameObject("Toast");
            _toast.transform.SetParent(_canvas.transform, false);

            var bg = _toast.AddComponent<Image>();
            bg.color = new Color(0.10f, 0.55f, 0.25f, 0.95f);

            var rt = _toast.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(600f, 150f);

            var textObj = new GameObject("ToastText");
            textObj.transform.SetParent(_toast.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "Copied! Share with friends";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 36;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            _toast.SetActive(false);
        }

        private void OnShareClicked()
        {
            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            int level = Progress != null ? Progress.HighestLevelUnlocked : 1;

            string message = $"I'm playing Mera Word Search Journey!\n" +
                             $"Level {level}  |  {coins} coins  |  {stars} stars\n" +
                             $"Can you beat my score?";

            GUIUtility.systemCopyBuffer = message;
            Debug.Log($"[Share] Copied");

            ShowToast();
        }

        private void ShowToast()
        {
            if (_toast == null) return;
            StopAllCoroutines();
            StartCoroutine(ToastRoutine());
        }

        private System.Collections.IEnumerator ToastRoutine()
        {
            _toast.SetActive(true);

            float duration = 1.5f;
            float elapsed = 0f;

            var rt = _toast.GetComponent<RectTransform>();
            var img = _toast.GetComponent<Image>();
            var text = _toast.GetComponentInChildren<Text>();

            Color startBg = img.color;
            Color startTxt = text.color;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                float scale = 1f;
                if (t < 0.2f) scale = Mathf.Lerp(0.3f, 1f, t / 0.2f);

                rt.localScale = new Vector3(scale, scale, 1f);

                if (t > 0.6f)
                {
                    float fadeT = (t - 0.6f) / 0.4f;
                    var bg = startBg; bg.a = 0.95f * (1f - fadeT); img.color = bg;
                    var tc = startTxt; tc.a = 1f - fadeT; text.color = tc;
                }

                yield return null;
            }

            img.color = startBg;
            text.color = startTxt;
            rt.localScale = Vector3.one;
            _toast.SetActive(false);
        }
    }
}