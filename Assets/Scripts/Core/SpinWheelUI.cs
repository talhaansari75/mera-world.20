using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SpinWheelUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private RectTransform _wheelRect;
        private Text _resultText;
        private Text _spinStatusText;
        private Button _spinButton;
        private bool _isSpinning = false;

        private const string KEY_LAST_SPIN = "LastSpinDate";

        private static readonly int[] Rewards = { 50, 100, 200, 25, 500, 75, 150, 300 };
        private static readonly string[] RewardNames = { "50", "100", "200", "25", "500", "75", "150", "300" };
        private static readonly Color[] WheelColors =
        {
            new Color(1f, 0.85f, 0.30f),
            new Color(0.85f, 0.35f, 0.35f),
            new Color(0.30f, 0.65f, 0.95f),
            new Color(0.35f, 0.85f, 0.45f),
            new Color(0.95f, 0.55f, 0.20f),
            new Color(0.75f, 0.45f, 0.90f),
            new Color(0.30f, 0.85f, 0.85f),
            new Color(0.95f, 0.75f, 0.30f),
        };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;
            Invoke(nameof(Setup), 1.2f);
        }

        private void Setup() { BuildCanvas(); BuildPanel(); UpdateState(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SpinWheelCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 760;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("SpinPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "LUCKY SPIN", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Wheel
            var wheelObj = new GameObject("Wheel");
            wheelObj.transform.SetParent(_panel.transform, false);
            _wheelRect = wheelObj.AddComponent<RectTransform>();
            _wheelRect.anchorMin = new Vector2(0.5f, 0.5f);
            _wheelRect.anchorMax = new Vector2(0.5f, 0.5f);
            _wheelRect.pivot = new Vector2(0.5f, 0.5f);
            _wheelRect.anchoredPosition = new Vector2(0f, 100f);
            _wheelRect.sizeDelta = new Vector2(700f, 700f);

            BuildWheelSlices();

            // Pointer at top
            var pointerObj = new GameObject("Pointer");
            pointerObj.transform.SetParent(_panel.transform, false);
            var pointerImg = pointerObj.AddComponent<Image>();
            pointerImg.color = new Color(1f, 0.20f, 0.20f);
            pointerImg.raycastTarget = false;
            var pRt = pointerObj.GetComponent<RectTransform>();
            pRt.anchorMin = new Vector2(0.5f, 0.5f);
            pRt.anchorMax = new Vector2(0.5f, 0.5f);
            pRt.pivot = new Vector2(0.5f, 0f);
            pRt.anchoredPosition = new Vector2(0f, 450f);
            pRt.sizeDelta = new Vector2(60f, 100f);

            // Result text
            _resultText = CreateText(_panel.transform, "", new Vector2(0f, -320f), 50,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            // Spin status
            _spinStatusText = CreateText(_panel.transform, "", new Vector2(0f, -400f), 26,
                new Color(0.85f, 0.90f, 1f), FontStyle.Normal);

            // Spin button
            _spinButton = CreateBigButton(_panel.transform, "SPIN", new Vector2(0f, -580f),
                new Vector2(400f, 130f), new Color(0.25f, 0.75f, 0.35f), OnSpin);

            _panel.SetActive(false);
        }

        private void BuildWheelSlices()
        {
            float sliceAngle = 360f / Rewards.Length;

            for (int i = 0; i < Rewards.Length; i++)
            {
                var sliceObj = new GameObject($"Slice_{i}");
                sliceObj.transform.SetParent(_wheelRect, false);

                var img = sliceObj.AddComponent<Image>();
                img.sprite = CreateSliceSprite(WheelColors[i], 256);
                img.color = Color.white;
                img.raycastTarget = false;

                var rt = sliceObj.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(0.5f, 0.5f);
                rt.anchorMax = new Vector2(0.5f, 0.5f);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = Vector2.zero;
                rt.sizeDelta = new Vector2(700f, 700f);
                rt.localRotation = Quaternion.Euler(0f, 0f, -sliceAngle * i);

                // Reward label
                var textObj = new GameObject("Label");
                textObj.transform.SetParent(sliceObj.transform, false);
                var txt = textObj.AddComponent<Text>();
                txt.text = RewardNames[i];
                txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                txt.fontSize = 36;
                txt.fontStyle = FontStyle.Bold;
                txt.color = Color.white;
                txt.alignment = TextAnchor.MiddleCenter;
                txt.raycastTarget = false;

                var shadow = textObj.AddComponent<Shadow>();
                shadow.effectColor = new Color(0f, 0f, 0f, 0.7f);
                shadow.effectDistance = new Vector2(2f, -2f);

                var trt = textObj.GetComponent<RectTransform>();
                trt.anchorMin = new Vector2(0.5f, 0.5f);
                trt.anchorMax = new Vector2(0.5f, 0.5f);
                trt.pivot = new Vector2(0.5f, 0.5f);
                trt.anchoredPosition = new Vector2(0f, 240f);
                trt.sizeDelta = new Vector2(150f, 80f);
            }
        }

        private Sprite CreateSliceSprite(Color color, int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            Vector2 center = new Vector2(size / 2f, size / 2f);
            float radius = size / 2f;
            float sliceAngle = 360f / Rewards.Length;
            float halfSlice = sliceAngle / 2f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    Vector2 p = new Vector2(x, y) - center;
                    float dist = p.magnitude;
                    if (dist > radius) { pixels[y * size + x] = new Color(0, 0, 0, 0); continue; }

                    float angle = Mathf.Atan2(p.y, p.x) * Mathf.Rad2Deg;
                    if (angle < 0) angle += 360f;

                    // Slice is from -halfSlice to +halfSlice centered at top
                    float adjusted = angle - 90f;
                    if (adjusted < -180f) adjusted += 360f;
                    if (adjusted > 180f) adjusted -= 360f;

                    if (Mathf.Abs(adjusted) <= halfSlice)
                    {
                        Color c = color;
                        if (dist > radius - 3f) c = Color.Lerp(c, Color.black, 0.3f);
                        c.a = 1f;
                        pixels[y * size + x] = c;
                    }
                    else
                    {
                        pixels[y * size + x] = new Color(0, 0, 0, 0);
                    }
                }
            }
            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        private void UpdateState()
        {
            if (CanSpinToday())
            {
                if (_spinStatusText != null) _spinStatusText.text = "FREE SPIN AVAILABLE!";
                if (_spinButton != null) _spinButton.interactable = true;
            }
            else
            {
                if (_spinStatusText != null) _spinStatusText.text = "Come back tomorrow!";
                if (_spinButton != null) _spinButton.interactable = false;
            }
        }

        private bool CanSpinToday()
        {
            string last = PlayerPrefs.GetString(KEY_LAST_SPIN, "");
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return last != today;
        }

        private void OnSpin()
        {
            if (_isSpinning || !CanSpinToday()) return;
            StartCoroutine(SpinRoutine());
        }

        private IEnumerator SpinRoutine()
        {
            _isSpinning = true;
            if (_spinButton != null) _spinButton.interactable = false;
            if (_resultText != null) _resultText.text = "";

            int rewardIndex = UnityEngine.Random.Range(0, Rewards.Length);
            float sliceAngle = 360f / Rewards.Length;
            float targetAngle = rewardIndex * sliceAngle + sliceAngle / 2f;

            // Spin for ~4 seconds with 5 full rotations
            float totalRotation = 5f * 360f + (360f - targetAngle);
            float duration = 4f;
            float elapsed = 0f;
            float startRot = _wheelRect.localRotation.eulerAngles.z;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float eased = 1f - Mathf.Pow(1f - t, 3f);
                float current = Mathf.Lerp(startRot, startRot + totalRotation, eased);
                _wheelRect.localRotation = Quaternion.Euler(0f, 0f, current);
                yield return null;
            }

            _wheelRect.localRotation = Quaternion.Euler(0f, 0f, startRot + totalRotation);

            // Grant reward
            int amount = Rewards[rewardIndex];
            if (Progress != null) Progress.AddCoins(amount);
            if (Sound != null) Sound.PlayLevelComplete();

            if (_resultText != null) _resultText.text = $"YOU WON {amount} COINS!";

            PlayerPrefs.SetString(KEY_LAST_SPIN, DateTime.UtcNow.ToString("yyyy-MM-dd"));
            PlayerPrefs.Save();

            Debug.Log($"[Spin] Won {amount} coins");

            _isSpinning = false;
            Invoke(nameof(UpdateState), 2f);
        }

        public void Show() { if (_panel != null) { _panel.SetActive(true); UpdateState(); } }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

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
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private Button CreateBigButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
            return btn;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
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
    }
}