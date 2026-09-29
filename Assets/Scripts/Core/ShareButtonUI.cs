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
        private GameObject _buttonRoot;

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
            _canvas.sortingOrder = 655;

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
            _buttonRoot = new GameObject("ShareButtonRoot");
            _buttonRoot.transform.SetParent(_canvas.transform, false);

            // Bottom shadow layer
            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(_buttonRoot.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.20f, 0.40f, 0.70f), 256, 60);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = Vector2.zero;
            shRt.anchorMax = Vector2.one;
            shRt.offsetMin = Vector2.zero;
            shRt.offsetMax = Vector2.zero;
            shRt.anchoredPosition = new Vector2(0f, -6f);

            // Main button (3D)
            var btnObj = new GameObject("ShareBtn");
            btnObj.transform.SetParent(_buttonRoot.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.30f, 0.55f, 0.85f), 256, 60);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(OnShareClicked);

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 6f);

            // "Share" icon (arrow)
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(btnObj.transform, false);
            var iconTxt = iconObj.AddComponent<Text>();
            iconTxt.text = "↑";
            iconTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            iconTxt.fontSize = 48;
            iconTxt.fontStyle = FontStyle.Bold;
            iconTxt.color = Color.white;
            iconTxt.alignment = TextAnchor.MiddleCenter;
            iconTxt.raycastTarget = false;
            var iconShadow = iconObj.AddComponent<Shadow>();
            iconShadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            iconShadow.effectDistance = new Vector2(2f, -2f);
            var irt = iconObj.GetComponent<RectTransform>();
            irt.anchorMin = Vector2.zero;
            irt.anchorMax = Vector2.one;
            irt.offsetMin = Vector2.zero;
            irt.offsetMax = Vector2.zero;

            // Position: top-right corner (side pe, grid ke bahar)
            var rootRt = _buttonRoot.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(1f, 1f);
            rootRt.anchorMax = new Vector2(1f, 1f);
            rootRt.pivot = new Vector2(1f, 1f);
            rootRt.anchoredPosition = new Vector2(-30f, -280f);
            rootRt.sizeDelta = new Vector2(110f, 110f);

            // Only show during gameplay (not home)
            var checker = _buttonRoot.AddComponent<PauseButtonVisibility>();
            checker.Target = _buttonRoot;
        }

        private void BuildToast()
        {
            _toast = new GameObject("Toast");
            _toast.transform.SetParent(_canvas.transform, false);

            var bg = _toast.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.10f, 0.55f, 0.25f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var rt = _toast.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(700f, 150f);

            var textObj = new GameObject("ToastText");
            textObj.transform.SetParent(_toast.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "Copied! Share with friends";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 38;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            shadow.effectDistance = new Vector2(2f, -2f);
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

            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayWordFound();

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