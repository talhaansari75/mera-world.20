using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace MeraWorld.Core
{
    public class SpeedBonusUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private float _lastWordTime = -10f;
        private TMP_FontAsset _premiumFont;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null) _premiumFont = TMP_Settings.defaultFontAsset;

            BuildCanvas();

            if (SelectionManager != null)
                SelectionManager.OnWordFound += OnWordFound;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SpeedBonusCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 287;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnWordFound(string word)
        {
            float now = Time.time;
            float delta = now - _lastWordTime;
            _lastWordTime = now;

            if (delta < 4f && delta > 0.5f)
            {
                int bonus = 3;
                if (Progress != null) Progress.AddCoins(bonus);
                ShowBonus("PERFECT!  +" + bonus);
            }
        }

        private void ShowBonus(string text)
        {
            if (_canvas == null) return;
            StartCoroutine(BonusRoutine(text));
        }

        private IEnumerator BonusRoutine(string message)
        {
            var obj = new GameObject("SpeedBonusPopup");
            obj.transform.SetParent(_canvas.transform, false);

            // Premium 3D gold button sprite as background
            var bg = obj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.82f, 0.30f), 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 200f);
            rt.sizeDelta = new Vector2(700f, 140f);

            // Text
            var txtObj = new GameObject("Label");
            txtObj.transform.SetParent(obj.transform, false);
            var txt = txtObj.AddComponent<TextMeshProUGUI>();
            txt.text = message;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = 72;
            txt.fontStyle = FontStyles.Bold;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;
            txt.enableVertexGradient = true;
            txt.colorGradient = new VertexGradient(
                new Color(1f, 1f, 1f),
                new Color(1f, 1f, 1f),
                new Color(1f, 0.85f, 0.4f),
                new Color(1f, 0.85f, 0.4f)
            );
            txt.outlineWidth = 0.25f;
            txt.outlineColor = new Color32(80, 30, 0, 255);

            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            // Fade in with bounce
            var cg = obj.AddComponent<CanvasGroup>();
            cg.alpha = 0f;

            float duration = 1.4f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                // Pop in
                if (t < 0.15f)
                {
                    float pop = t / 0.15f;
                    cg.alpha = pop;
                    rt.localScale = Vector3.Lerp(Vector3.one * 0.5f, Vector3.one * 1.15f, pop);
                }
                else if (t < 0.25f)
                {
                    float settle = (t - 0.15f) / 0.10f;
                    rt.localScale = Vector3.Lerp(Vector3.one * 1.15f, Vector3.one, settle);
                }
                else if (t > 0.7f)
                {
                    float fade = (t - 0.7f) / 0.3f;
                    cg.alpha = 1f - fade;
                    rt.anchoredPosition = new Vector2(0f, Mathf.Lerp(200f, 350f, fade));
                }

                yield return null;
            }

            if (obj != null) Destroy(obj);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}