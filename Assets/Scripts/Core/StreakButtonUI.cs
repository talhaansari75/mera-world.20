using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class StreakButtonUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _btnObj;
        private Text _streakText;
        private Image _btnImage;
        private int _lastCombo = 0;

        void Start() { Invoke(nameof(Setup), 1.2f); }

        private void Setup()
        {
            BuildCanvas();
            BuildButton();
            Debug.Log("[StreakButton] Setup done");
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("StreakCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 96;
            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildButton()
        {
            _btnObj = new GameObject("StreakButton");
            _btnObj.transform.SetParent(_canvas.transform, false);

            _btnImage = _btnObj.AddComponent<Image>();
            Sprite premiumStreak = Resources.Load<Sprite>("UI/Premium/btn_streak");
            if (premiumStreak != null)
            {
                _btnImage.sprite = premiumStreak;
                _btnImage.color = Color.white;
            }
            else
            {
                _btnImage.sprite = UISpriteFactory.Create3DButtonSprite(
                    new Color(1f, 0.45f, 0.15f), 128, 30);
                _btnImage.type = Image.Type.Sliced;
                _btnImage.color = Color.white;
            }

            var rt = _btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 1f);
            rt.anchoredPosition = new Vector2(-20f, -240f);
            rt.sizeDelta = new Vector2(240f, 75f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(_btnObj.transform, false);
            _streakText = textObj.AddComponent<Text>();
            _streakText.text = "STREAK x2";
            _streakText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _streakText.fontSize = 32;
            _streakText.fontStyle = FontStyle.Bold;
            _streakText.color = Color.white;
            _streakText.alignment = TextAnchor.MiddleCenter;
            _streakText.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            // Initially hidden
            _btnObj.SetActive(false);
        }

        void Update()
        {
            if (_btnObj == null) return;

            // Check ComboSystem
            int currentCombo = 0;
            if (ComboSystem.Instance != null)
            {
                var field = ComboSystem.Instance.GetType().GetField("_currentCombo",
                    System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                if (field != null)
                    currentCombo = (int)field.GetValue(ComboSystem.Instance);
            }

            if (currentCombo != _lastCombo)
            {
                _lastCombo = currentCombo;
                if (currentCombo >= 2)
                {
                    _btnObj.SetActive(true);
                    if (_streakText != null)
                        _streakText.text = $"STREAK x{currentCombo}";
                }
                else
                {
                    _btnObj.SetActive(false);
                }
            }
        }
    }
}
