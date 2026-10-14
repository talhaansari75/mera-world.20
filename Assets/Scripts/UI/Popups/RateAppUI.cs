using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class RateAppUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private int _selectedStars = 0;
        private Image[] _starImages = new Image[5];

        private const string KEY_RATED = "HasRated";
        private const string KEY_SHOWN_COUNT = "RateShownCount";
        private const string STORE_URL = "https://play.google.com/store/apps/details?id=com.talhaansari.meraworld";

        void Start()
        {
            Invoke(nameof(Setup), 3f);
        }

        private void Setup()
        {
            if (PlayerPrefs.GetInt(KEY_RATED, 0) == 1) return;

            int shown = PlayerPrefs.GetInt(KEY_SHOWN_COUNT, 0);
            if (shown >= 3) return;

            int sessions = PlayerPrefs.GetInt("Stats_Sessions", 0);
            if (sessions < 3) return;

            BuildCanvas();
            BuildPanel();
            _panel.SetActive(true);

            PlayerPrefs.SetInt(KEY_SHOWN_COUNT, shown + 1);
            PlayerPrefs.Save();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("RateAppCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 850;

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

        private void BuildPanel()
        {
            _panel = new GameObject("RatePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.92f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var cardObj = new GameObject("Card");
            cardObj.transform.SetParent(_panel.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.color = new Color(0.12f, 0.18f, 0.32f);

            var cardRt = cardObj.GetComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(820f, 900f);

            CreateText(cardObj.transform, "ENJOYING THE GAME?", new Vector2(0f, 340f), 55,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateText(cardObj.transform, "Tap a star to rate us!",
                new Vector2(0f, 250f), 32, Color.white, FontStyle.Normal);

            // Stars row
            for (int i = 0; i < 5; i++)
            {
                var starObj = new GameObject($"Star_{i}");
                starObj.transform.SetParent(cardObj.transform, false);

                var img = starObj.AddComponent<Image>();
                img.color = new Color(0.35f, 0.35f, 0.40f);
                img.sprite = CreateStarSprite();

                var srt = starObj.GetComponent<RectTransform>();
                srt.anchorMin = new Vector2(0.5f, 0.5f);
                srt.anchorMax = new Vector2(0.5f, 0.5f);
                srt.pivot = new Vector2(0.5f, 0.5f);
                srt.anchoredPosition = new Vector2(-200f + i * 100f, 100f);
                srt.sizeDelta = new Vector2(90f, 90f);

                int starIndex = i;
                var btn = starObj.AddComponent<Button>();
                btn.onClick.AddListener(() => OnStarClicked(starIndex));

                _starImages[i] = img;
            }

            CreateButton(cardObj.transform, "NOT NOW", new Vector2(-200f, -250f),
                new Vector2(320f, 100f), new Color(0.4f, 0.4f, 0.5f), OnDismiss);

            CreateButton(cardObj.transform, "SUBMIT", new Vector2(200f, -250f),
                new Vector2(320f, 100f), new Color(0.25f, 0.70f, 0.35f), OnSubmit);

            _panel.SetActive(false);
        }

        private void OnStarClicked(int index)
        {
            _selectedStars = index + 1;
            for (int i = 0; i < 5; i++)
            {
                _starImages[i].color = i <= index
                    ? new Color(1f, 0.85f, 0.25f)
                    : new Color(0.35f, 0.35f, 0.40f);
            }
        }

        private void OnSubmit()
        {
            PlayerPrefs.SetInt(KEY_RATED, 1);
            PlayerPrefs.Save();

            if (_selectedStars >= 4)
            {
                Application.OpenURL(STORE_URL);
                Debug.Log("[Rate] Opening Play Store");
            }
            else
            {
                Debug.Log($"[Rate] User rated {_selectedStars} stars - feedback noted");
            }

            _panel.SetActive(false);
        }

        private void OnDismiss()
        {
            _panel.SetActive(false);
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
            rt.sizeDelta = new Vector2(800f, 100f);
            return txt;
        }

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.color = color;
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
            txt.fontSize = 38;
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

        private Sprite CreateStarSprite()
        {
            int size = 128;
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            Vector2 center = new Vector2(size / 2f, size / 2f);
            float outerR = size * 0.48f;
            float innerR = size * 0.20f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    Vector2 dir = new Vector2(x, y) - center;
                    float dist = dir.magnitude;
                    float angle = Mathf.Atan2(dir.y, dir.x) + Mathf.PI / 2f;
                    if (angle < 0) angle += 2f * Mathf.PI;
                    float seg = (2f * Mathf.PI) / 5f;
                    float halfSeg = seg / 2f;
                    float localAngle = angle % seg;
                    float targetR = (localAngle < halfSeg)
                        ? Mathf.Lerp(outerR, innerR, localAngle / halfSeg)
                        : Mathf.Lerp(innerR, outerR, (localAngle - halfSeg) / halfSeg);
                    float alpha = dist < targetR ? 1f : 0f;
                    if (dist > targetR - 2f && dist < targetR + 1f)
                        alpha = Mathf.Clamp01(targetR - dist + 1f);
                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }
    }
}