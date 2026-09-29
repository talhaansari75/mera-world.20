using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ReferralSystemUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;
        private Text _codeText;
        private Text _statusText;

        private const string KEY_REFERRAL_CODE = "Ref_MyCode";
        private const string KEY_REFERRALS = "Ref_Count";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 1.3f);
        }

        private void Setup()
        {
            EnsureCode();
            BuildCanvas();
            BuildPanel();
        }

        private void EnsureCode()
        {
            string code = PlayerPrefs.GetString(KEY_REFERRAL_CODE, "");
            if (string.IsNullOrEmpty(code))
            {
                code = "MW" + UnityEngine.Random.Range(100000, 999999).ToString();
                PlayerPrefs.SetString(KEY_REFERRAL_CODE, code);
                PlayerPrefs.Save();
            }
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ReferralCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 775;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("ReferralPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "INVITE FRIENDS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            CreateText(_panel.transform, "Get 500 coins for each friend!",
                new Vector2(0f, 700f), 32, Color.white, FontStyle.Normal);

            // Code card
            var cardObj = new GameObject("CodeCard");
            cardObj.transform.SetParent(_panel.transform, false);
            var cImg = cardObj.AddComponent<Image>();
            cImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.25f, 0.45f, 0.85f), 256, 40);
            cImg.type = Image.Type.Sliced;
            cImg.color = Color.white;
            cImg.raycastTarget = false;
            var cRt = cardObj.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0.5f, 0.5f);
            cRt.anchorMax = new Vector2(0.5f, 0.5f);
            cRt.pivot = new Vector2(0.5f, 0.5f);
            cRt.anchoredPosition = new Vector2(0f, 500f);
            cRt.sizeDelta = new Vector2(800f, 200f);

            CreateText(cardObj.transform, "YOUR CODE", new Vector2(0f, 60f), 28,
                new Color(0.85f, 0.90f, 1f), FontStyle.Normal);

            _codeText = CreateText(cardObj.transform, PlayerPrefs.GetString(KEY_REFERRAL_CODE, "MW000000"),
                new Vector2(0f, -10f), 70, Color.white, FontStyle.Bold);

            // Share button
            CreateBigButton(_panel.transform, "SHARE CODE", new Vector2(0f, 250f),
                new Vector2(700f, 120f), new Color(0.25f, 0.75f, 0.35f), OnShare);

            // Enter friend's code
            CreateText(_panel.transform, "Have a friend's code?",
                new Vector2(0f, 50f), 28, Color.white, FontStyle.Normal);

            CreateBigButton(_panel.transform, "REDEEM CODE", new Vector2(0f, -80f),
                new Vector2(700f, 120f), new Color(0.85f, 0.55f, 0.20f), OnRedeem);

            // Status
            _statusText = CreateText(_panel.transform, "", new Vector2(0f, -300f), 26,
                new Color(0.75f, 1f, 0.75f), FontStyle.Italic);

            // Referral count
            int count = PlayerPrefs.GetInt(KEY_REFERRALS, 0);
            CreateText(_panel.transform, $"Friends Invited: {count}",
                new Vector2(0f, -450f), 32, new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            _panel.SetActive(false);
        }

        private void OnShare()
        {
            string code = PlayerPrefs.GetString(KEY_REFERRAL_CODE, "");
            string msg = $"Play Mera Word Search Journey! Use my code {code} for 500 bonus coins!";
            GUIUtility.systemCopyBuffer = msg;

            if (_statusText != null) _statusText.text = "Code copied! Share with friends.";

            Debug.Log($"[Referral] Copied: {msg}");
        }

        private void OnRedeem()
        {
            if (_statusText != null) _statusText.text = "Enter code feature coming soon!";
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
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
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        private void CreateBigButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
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
            txt.fontSize = 40;
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