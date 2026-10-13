using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class DailyRewardUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private CanvasGroup _panelGroup;
        private GameObject _card;
        private bool _built = false;
        private TMP_FontAsset _premiumFont;

        private Sprite _frameSprite;
        private Sprite _coinSprite;
        private Sprite _tileSprite;
        private Sprite _paisleySprite;

        private const string KEY_LAST_CLAIM = "Daily_LastClaim";
        private const string KEY_STREAK = "Daily_Streak";

        private static readonly int[] Rewards = { 50, 75, 100, 150, 200, 300, 500 };
        private static readonly string[] DayNames = { "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7" };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;
            Invoke(nameof(Setup), 0.8f);
        }

        private void Setup()
        {
            if (_built) return;
            _built = true;

            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null) _premiumFont = TMP_Settings.defaultFontAsset;

            _frameSprite = Resources.Load<Sprite>("UI/Premium/frame_ornate");
            _coinSprite = Resources.Load<Sprite>("UI/Premium/coin_gold");
            _tileSprite = Resources.Load<Sprite>("UI/Premium/tile_glossy");
            _paisleySprite = Resources.Load<Sprite>("UI/Premium/bg_paisley");

            BuildCanvas();
            BuildPanel();
            CheckAndShow();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("DailyRewardCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 700;

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
            _panel = new GameObject("DailyRewardPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.85f);

            _panelGroup = _panel.AddComponent<CanvasGroup>();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            _card = new GameObject("Card");
            _card.transform.SetParent(_panel.transform, false);

            var cardRt = _card.AddComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(1000f, 1550f);

            // 1) Inner parchment background (rich gradient)
            var parchment = new GameObject("Parchment");
            parchment.transform.SetParent(_card.transform, false);
            var pImg = parchment.AddComponent<Image>();
            pImg.sprite = UISpriteFactory.CreateGradientSprite(
                new Color(0.72f, 0.52f, 0.18f),
                new Color(0.98f, 0.86f, 0.55f), 32, 512);
            pImg.type = Image.Type.Simple;
            pImg.raycastTarget = false;
            var prt = parchment.GetComponent<RectTransform>();
            prt.anchorMin = Vector2.zero;
            prt.anchorMax = Vector2.one;
            prt.offsetMin = new Vector2(80f, 80f);
            prt.offsetMax = new Vector2(-80f, -80f);

            // 2) Paisley overlay (subtle pattern)
            if (_paisleySprite != null)
            {
                var overlayP = new GameObject("PaisleyOverlay");
                overlayP.transform.SetParent(_card.transform, false);
                var oImg = overlayP.AddComponent<Image>();
                oImg.sprite = _paisleySprite;
                oImg.color = new Color(1f, 1f, 1f, 0.18f);
                oImg.raycastTarget = false;
                oImg.type = Image.Type.Simple;
                var ort = overlayP.GetComponent<RectTransform>();
                ort.anchorMin = Vector2.zero;
                ort.anchorMax = Vector2.one;
                ort.offsetMin = new Vector2(80f, 80f);
                ort.offsetMax = new Vector2(-80f, -80f);
            }

            // 3) Gold trim border
            var trim = new GameObject("GoldTrim");
            trim.transform.SetParent(_card.transform, false);
            var tImg = trim.AddComponent<Image>();
            tImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.85f, 0.55f, 0.15f), 512, 40);
            tImg.type = Image.Type.Sliced;
            tImg.raycastTarget = false;
            var trt = trim.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = new Vector2(70f, 70f);
            trt.offsetMax = new Vector2(-70f, -70f);

            // 4) Ornate frame ON TOP of everything (outer)
            if (_frameSprite != null)
            {
                var frameObj = new GameObject("OrnateFrame");
                frameObj.transform.SetParent(_card.transform, false);
                var frameImg = frameObj.AddComponent<Image>();
                frameImg.sprite = _frameSprite;
                frameImg.type = Image.Type.Sliced;
                frameImg.color = Color.white;
                frameImg.raycastTarget = false;
                var frt = frameObj.GetComponent<RectTransform>();
                frt.anchorMin = Vector2.zero;
                frt.anchorMax = Vector2.one;
                frt.offsetMin = Vector2.zero;
                frt.offsetMax = Vector2.zero;
            }

            // Title
            CreateTMPText(_card.transform, "DAILY REWARDS", new Vector2(0f, 630f), 76, true);

            var sub = CreateTMPText(_card.transform, "Come back every day for bigger rewards!",
                new Vector2(0f, 545f), 26, false);
            sub.color = new Color(0.32f, 0.15f, 0.05f);

            // Day cards
            int currentStreak = PlayerPrefs.GetInt(KEY_STREAK, 0);
            bool canClaim = CanClaimToday();

            for (int i = 0; i < 4; i++)
            {
                bool claimed = i < currentStreak;
                bool isToday = (i == currentStreak && canClaim);
                CreateDayCard(i, DayNames[i], Rewards[i],
                    new Vector2(-300f + i * 200f, 320f), claimed, isToday);
            }

            for (int i = 4; i < 7; i++)
            {
                bool claimed = i < currentStreak;
                bool isToday = (i == currentStreak && canClaim);
                CreateDayCard(i, DayNames[i], Rewards[i],
                    new Vector2(-200f + (i - 4) * 200f, 80f), claimed, isToday);
            }

            // Claim / Message
            if (canClaim)
            {
                int amount = Rewards[Mathf.Clamp(currentStreak, 0, Rewards.Length - 1)];
                CreatePremiumButton(_card.transform, "CLAIM " + amount + " COINS",
                    new Vector2(0f, -230f), new Vector2(720f, 155f),
                    new Color(0.10f, 0.42f, 0.15f), OnClaim);
            }
            else
            {
                var msg = CreateTMPText(_card.transform, "Come back tomorrow!",
                    new Vector2(0f, -230f), 38, false);
                msg.fontStyle = FontStyles.Italic;
                msg.color = new Color(0.35f, 0.20f, 0.05f);
            }

            // Close button
            CreatePremiumButton(_card.transform, "CLOSE", new Vector2(0f, -490f),
                new Vector2(440f, 125f), new Color(0.12f, 0.16f, 0.30f), OnClose);

            _panel.SetActive(false);
        }

        private TextMeshProUGUI CreateTMPText(Transform parent, string content, Vector2 pos, int size, bool goldGradient)
        {
            var obj = new GameObject("Text_" + content);
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<TextMeshProUGUI>();
            txt.text = content;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = size;
            txt.fontStyle = FontStyles.Bold;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;

            if (goldGradient)
            {
                txt.enableVertexGradient = true;
                txt.colorGradient = new VertexGradient(
                    new Color(1.0f, 0.98f, 0.55f),
                    new Color(1.0f, 0.98f, 0.55f),
                    new Color(0.75f, 0.35f, 0.02f),
                    new Color(0.75f, 0.35f, 0.02f)
                );
                txt.outlineWidth = 0.32f;
                txt.outlineColor = new Color32(80, 25, 0, 255);
                txt.characterSpacing = 5f;
            }
            else
            {
                txt.color = Color.white;
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private void CreateDayCard(int index, string dayLabel, int coinAmount, Vector2 pos, bool claimed, bool isToday)
        {
            var cardObj = new GameObject("Day_" + index);
            cardObj.transform.SetParent(_card.transform, false);

            var rt = cardObj.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(185f, 220f);

            // Card body (deep purple tile)
            var bodyObj = new GameObject("CardBody");
            bodyObj.transform.SetParent(cardObj.transform, false);
            var bodyImg = bodyObj.AddComponent<Image>();
            Color bodyTop = claimed ? new Color(0.20f, 0.65f, 0.30f) :
                (isToday ? new Color(0.85f, 0.55f, 0.10f) : new Color(0.45f, 0.20f, 0.75f));
            Color bodyBottom = claimed ? new Color(0.10f, 0.40f, 0.18f) :
                (isToday ? new Color(0.55f, 0.30f, 0.05f) : new Color(0.28f, 0.10f, 0.55f));
            bodyImg.sprite = UISpriteFactory.CreateGradientSprite(bodyBottom, bodyTop, 32, 256);
            bodyImg.type = Image.Type.Simple;
            bodyImg.raycastTarget = false;
            var brt = bodyObj.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            // Gold inner border
            var trimObj = new GameObject("CardTrim");
            trimObj.transform.SetParent(cardObj.transform, false);
            var trimImg = trimObj.AddComponent<Image>();
            trimImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.82f, 0.30f), 256, 30);
            trimImg.type = Image.Type.Sliced;
            trimImg.raycastTarget = false;
            var trt = trimObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = new Vector2(-6f, -6f);
            trt.offsetMax = new Vector2(6f, 6f);
            trimObj.transform.SetAsFirstSibling();

            // Big gold coin (uses real sprite)
            var coinObj = new GameObject("BigCoin");
            coinObj.transform.SetParent(cardObj.transform, false);
            var coinImg = coinObj.AddComponent<Image>();
            if (_coinSprite != null)
            {
                coinImg.sprite = _coinSprite;
                coinImg.color = claimed ? new Color(0.55f, 0.55f, 0.55f, 0.85f) : Color.white;
            }
            else
            {
                coinImg.sprite = UISpriteFactory.Create3DSphereSprite(
                    claimed ? new Color(0.5f, 0.5f, 0.5f) : new Color(1f, 0.82f, 0.25f), 128);
                coinImg.color = Color.white;
            }
            coinImg.preserveAspect = true;
            coinImg.raycastTarget = false;
            var crt = coinObj.GetComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 1f);
            crt.anchorMax = new Vector2(0.5f, 1f);
            crt.pivot = new Vector2(0.5f, 1f);
            crt.anchoredPosition = new Vector2(0f, 8f);
            crt.sizeDelta = new Vector2(150f, 150f);

            // Day number INSIDE coin
            var dayNumObj = new GameObject("DayNum");
            dayNumObj.transform.SetParent(coinObj.transform, false);
            var dayNumTxt = dayNumObj.AddComponent<TextMeshProUGUI>();
            dayNumTxt.text = (index + 1).ToString();
            if (_premiumFont != null) dayNumTxt.font = _premiumFont;
            dayNumTxt.fontSize = 52;
            dayNumTxt.fontStyle = FontStyles.Bold;
            dayNumTxt.color = claimed ? new Color(0.85f, 0.85f, 0.85f) :
                new Color(0.45f, 0.22f, 0f);
            dayNumTxt.alignment = TextAlignmentOptions.Center;
            dayNumTxt.raycastTarget = false;
            dayNumTxt.outlineWidth = 0.15f;
            dayNumTxt.outlineColor = new Color32(255, 240, 200, 180);
            var dnrt = dayNumObj.GetComponent<RectTransform>();
            dnrt.anchorMin = Vector2.zero;
            dnrt.anchorMax = Vector2.one;
            dnrt.offsetMin = new Vector2(0f, -6f);
            dnrt.offsetMax = new Vector2(0f, 6f);

            // Day label
            var dayObj = new GameObject("DayLabel");
            dayObj.transform.SetParent(cardObj.transform, false);
            var dayTxt = dayObj.AddComponent<TextMeshProUGUI>();
            dayTxt.text = dayLabel;
            if (_premiumFont != null) dayTxt.font = _premiumFont;
            dayTxt.fontSize = 22;
            dayTxt.fontStyle = FontStyles.Bold;
            dayTxt.color = Color.white;
            dayTxt.alignment = TextAlignmentOptions.Center;
            dayTxt.raycastTarget = false;
            dayTxt.outlineWidth = 0.2f;
            dayTxt.outlineColor = new Color32(0, 0, 0, 200);
            var dayRt = dayObj.GetComponent<RectTransform>();
            dayRt.anchorMin = new Vector2(0f, 0.35f);
            dayRt.anchorMax = new Vector2(1f, 0.55f);
            dayRt.offsetMin = Vector2.zero;
            dayRt.offsetMax = Vector2.zero;

            // Coin amount at bottom
            var amtObj = new GameObject("Amount");
            amtObj.transform.SetParent(cardObj.transform, false);
            var amtTxt = amtObj.AddComponent<TextMeshProUGUI>();
            amtTxt.text = claimed ? "OK" : coinAmount.ToString();
            if (_premiumFont != null) amtTxt.font = _premiumFont;
            amtTxt.fontSize = 44;
            amtTxt.fontStyle = FontStyles.Bold;
            amtTxt.alignment = TextAlignmentOptions.Center;
            amtTxt.raycastTarget = false;

            if (claimed)
            {
                amtTxt.color = new Color(0.85f, 1f, 0.9f);
            }
            else
            {
                amtTxt.enableVertexGradient = true;
                amtTxt.colorGradient = new VertexGradient(
                    new Color(1f, 1f, 0.85f), new Color(1f, 1f, 0.85f),
                    new Color(1f, 0.75f, 0.20f), new Color(1f, 0.75f, 0.20f));
            }
            amtTxt.outlineWidth = 0.25f;
            amtTxt.outlineColor = new Color32(60, 20, 0, 220);

            var amtRt = amtObj.GetComponent<RectTransform>();
            amtRt.anchorMin = new Vector2(0f, 0f);
            amtRt.anchorMax = new Vector2(1f, 0.35f);
            amtRt.offsetMin = Vector2.zero;
            amtRt.offsetMax = Vector2.zero;

            // Today glow pulse
            if (isToday)
            {
                rt.localScale = Vector3.one * 0.6f;
                rt.DOScale(1f, 0.5f).SetEase(Ease.OutBack).SetDelay(0.4f);

                var glowObj = new GameObject("TodayGlow");
                glowObj.transform.SetParent(cardObj.transform, false);
                glowObj.transform.SetAsFirstSibling();
                var glowImg = glowObj.AddComponent<Image>();
                glowImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.85f, 0.30f), 256, 35);
                glowImg.type = Image.Type.Sliced;
                glowImg.color = new Color(1f, 0.85f, 0.30f, 0.65f);
                glowImg.raycastTarget = false;
                var grt = glowObj.GetComponent<RectTransform>();
                grt.anchorMin = Vector2.zero;
                grt.anchorMax = Vector2.one;
                grt.offsetMin = new Vector2(-16f, -16f);
                grt.offsetMax = new Vector2(16f, 16f);
                glowImg.DOFade(0.15f, 0.9f).SetLoops(-1, LoopType.Yoyo);
            }
        }

        private void CreatePremiumButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color baseColor, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject("Btn_" + label);
            obj.transform.SetParent(parent, false);

            // Outer gold frame
            var outerObj = new GameObject("OuterGold");
            outerObj.transform.SetParent(obj.transform, false);
            var outerImg = outerObj.AddComponent<Image>();
            outerImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.82f, 0.30f), 256, 32);
            outerImg.type = Image.Type.Sliced;
            outerImg.raycastTarget = false;
            var ort = outerObj.GetComponent<RectTransform>();
            ort.anchorMin = Vector2.zero;
            ort.anchorMax = Vector2.one;
            ort.offsetMin = new Vector2(-10f, -10f);
            ort.offsetMax = new Vector2(10f, 10f);

            // Bottom shadow
            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(obj.transform, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(baseColor.r * 0.2f, baseColor.g * 0.2f, baseColor.b * 0.2f), 256, 32);
            shadowImg.type = Image.Type.Sliced;
            shadowImg.raycastTarget = false;
            var shr = shadowObj.GetComponent<RectTransform>();
            shr.anchorMin = Vector2.zero;
            shr.anchorMax = Vector2.one;
            shr.offsetMin = new Vector2(0f, -16f);
            shr.offsetMax = new Vector2(0f, -16f);

            // Main button
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(baseColor, 256, 32);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            // Top highlight (glossy)
            var hlObj = new GameObject("Highlight");
            hlObj.transform.SetParent(obj.transform, false);
            var hlImg = hlObj.AddComponent<Image>();
            hlImg.color = new Color(1f, 1f, 1f, 0.28f);
            hlImg.raycastTarget = false;
            var hrt = hlObj.GetComponent<RectTransform>();
            hrt.anchorMin = new Vector2(0.06f, 0.60f);
            hrt.anchorMax = new Vector2(0.94f, 0.90f);
            hrt.offsetMin = Vector2.zero;
            hrt.offsetMax = Vector2.zero;

            // Label
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<TextMeshProUGUI>();
            txt.text = label;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = 54;
            txt.fontStyle = FontStyles.Bold;
            txt.color = Color.white;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;
            txt.outlineWidth = 0.3f;
            txt.outlineColor = new Color32(0, 0, 0, 230);
            txt.characterSpacing = 3f;
            var txtRt = textObj.GetComponent<RectTransform>();
            txtRt.anchorMin = Vector2.zero;
            txtRt.anchorMax = Vector2.one;
            txtRt.offsetMin = Vector2.zero;
            txtRt.offsetMax = Vector2.zero;
        }

        private bool CanClaimToday()
        {
            string lastClaimStr = PlayerPrefs.GetString(KEY_LAST_CLAIM, "");
            if (string.IsNullOrEmpty(lastClaimStr)) return true;
            long lastClaim;
            if (!long.TryParse(lastClaimStr, out lastClaim)) return true;
            long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            long daysSince = (now - lastClaim) / 86400;
            return daysSince >= 1;
        }

        private void OnClaim()
        {
            int streak = PlayerPrefs.GetInt(KEY_STREAK, 0);

            string lastClaimStr = PlayerPrefs.GetString(KEY_LAST_CLAIM, "");
            if (!string.IsNullOrEmpty(lastClaimStr))
            {
                long lastClaim;
                if (long.TryParse(lastClaimStr, out lastClaim))
                {
                    long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                    long daysSince = (now - lastClaim) / 86400;
                    if (daysSince > 1) streak = 0;
                }
            }

            int dayIndex = Mathf.Clamp(streak, 0, Rewards.Length - 1);
            int amount = Rewards[dayIndex];

            if (Progress != null) Progress.AddCoins(amount);
            if (Sound != null) Sound.PlayWordFound();

            streak++;
            if (streak >= Rewards.Length) streak = 0;

            PlayerPrefs.SetInt(KEY_STREAK, streak);
            PlayerPrefs.SetString(KEY_LAST_CLAIM, System.DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString());
            PlayerPrefs.Save();

            Debug.Log("[Daily] Claimed " + amount + " coins");
            StartCoroutine(ClaimRoutine());
        }

        private IEnumerator ClaimRoutine()
        {
            yield return new WaitForSecondsRealtime(0.3f);
            OnClose();
        }

        private void CheckAndShow()
        {
            if (CanClaimToday())
            {
                _panel.SetActive(true);
                PlayIntro();
            }
        }

        private void PlayIntro()
        {
            if (_panelGroup == null) return;
            _panelGroup.DOKill();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            if (_card != null)
            {
                var crt = _card.GetComponent<RectTransform>();
                crt.DOKill();
                crt.localScale = Vector3.one * 0.75f;
                crt.DOScale(1f, 0.45f).SetEase(Ease.OutBack).SetDelay(0.1f);
            }

            _panelGroup.DOFade(1f, 0.3f).SetEase(Ease.OutQuad)
                .OnComplete(() => _panelGroup.blocksRaycasts = true);
        }

        private void OnClose()
        {
            if (_panel == null) return;
            if (_panelGroup != null)
            {
                _panelGroup.DOKill();
                _panelGroup.blocksRaycasts = false;
                _panelGroup.DOFade(0f, 0.25f).OnComplete(() => _panel.SetActive(false));
            }
            else
            {
                _panel.SetActive(false);
            }
        }
    }
}