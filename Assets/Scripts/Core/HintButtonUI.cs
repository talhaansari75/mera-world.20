using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class HintButtonUI : MonoBehaviour
    {
        private Canvas _canvas;
        private Text _hintCountText;
        private Sprite _lightbulbSprite;
        private const int HINT_COST = 50;

        void Start() { Invoke(nameof(Setup), 1.0f); }

        private void Setup()
        {
            _lightbulbSprite = Resources.Load<Sprite>("Icons/hint-lightbulb");
            if (_lightbulbSprite == null)
            {
                var tex = Resources.Load<Texture2D>("Icons/hint-lightbulb");
                if (tex != null)
                    _lightbulbSprite = Sprite.Create(tex,
                        new Rect(0, 0, tex.width, tex.height), new Vector2(0.5f, 0.5f));
            }

            BuildCanvas();
            BuildButton();
            RefreshUI();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("HintCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 95;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildButton()
        {
            var btnObj = new GameObject("HintButton");
            btnObj.transform.SetParent(_canvas.transform, false);

            var img = btnObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.95f, 0.75f, 0.25f), 256, 60);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(OnHintClicked);

            // ═══════════════════════════════════════════════════════
            // POSITION: Just ABOVE the "WORDS TO FIND" panel
            // Words panel is at y=220 to y=440 (from bottom)
            // So bulb sits at y=490, right side
            // ═══════════════════════════════════════════════════════
            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 0f);   // bottom-right
            rt.anchorMax = new Vector2(1f, 0f);
            rt.pivot = new Vector2(1f, 0f);
            rt.anchoredPosition = new Vector2(-40f, 480f);  // just above words panel
            rt.sizeDelta = new Vector2(150f, 150f);

            // Lightbulb icon
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(btnObj.transform, false);
            var iconImg = iconObj.AddComponent<Image>();

            if (_lightbulbSprite != null)
            {
                iconImg.sprite = _lightbulbSprite;
                iconImg.preserveAspect = true;
            }
            else
            {
                iconImg.sprite = UISpriteFactory.Create3DSphereSprite(
                    new Color(1f, 0.85f, 0.20f), 64);
            }

            iconImg.raycastTarget = false;
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0.5f, 0.5f);
            iconRt.anchorMax = new Vector2(0.5f, 0.5f);
            iconRt.pivot = new Vector2(0.5f, 0.5f);
            iconRt.anchoredPosition = new Vector2(0f, 15f);
            iconRt.sizeDelta = new Vector2(100f, 100f);

            // Coin cost badge at bottom
            var badgeObj = new GameObject("Badge");
            badgeObj.transform.SetParent(btnObj.transform, false);
            var badgeImg = badgeObj.AddComponent<Image>();
            badgeImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(0.85f, 0.25f, 0.25f), 64);
            badgeImg.raycastTarget = false;

            var badgeRt = badgeObj.GetComponent<RectTransform>();
            badgeRt.anchorMin = new Vector2(0.5f, 0f);
            badgeRt.anchorMax = new Vector2(0.5f, 0f);
            badgeRt.pivot = new Vector2(0.5f, 0f);
            badgeRt.anchoredPosition = new Vector2(0f, -15f);
            badgeRt.sizeDelta = new Vector2(70f, 45f);

            var badgeTextObj = new GameObject("BadgeText");
            badgeTextObj.transform.SetParent(badgeObj.transform, false);
            _hintCountText = badgeTextObj.AddComponent<Text>();
            _hintCountText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _hintCountText.fontSize = 26;
            _hintCountText.fontStyle = FontStyle.Bold;
            _hintCountText.color = Color.white;
            _hintCountText.alignment = TextAnchor.MiddleCenter;
            _hintCountText.raycastTarget = false;
            var btRt = badgeTextObj.GetComponent<RectTransform>();
            btRt.anchorMin = Vector2.zero;
            btRt.anchorMax = Vector2.one;
            btRt.offsetMin = Vector2.zero;
            btRt.offsetMax = Vector2.zero;

            var shadow = badgeTextObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.7f);
            shadow.effectDistance = new Vector2(1f, -1f);
        }

        private void OnHintClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();

            int coins = PlayerProgressManager.Instance != null
                ? PlayerProgressManager.Instance.Coins : 0;

            if (coins < HINT_COST)
            {
                Debug.Log($"[Hint] Not enough coins ({coins}/{HINT_COST})");
                return;
            }

            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(-HINT_COST);

            var sel = SelectionManager.Instance;
            if (sel == null) return;

            string word = sel.GetRandomUnfoundWord();
            if (string.IsNullOrEmpty(word)) return;

            sel.HintWord(word);
            if (SoundManager.Instance != null) SoundManager.Instance.PlayWordFound();

            RefreshUI();
        }

        private void RefreshUI()
        {
            if (_hintCountText == null) return;
            _hintCountText.text = HINT_COST.ToString();
        }
    }
}