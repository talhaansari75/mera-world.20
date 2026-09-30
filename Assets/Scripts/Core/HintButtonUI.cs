using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class HintButtonUI : MonoBehaviour
    {
        private Canvas _canvas;
        private Text _hintCountText;
        private Button _hintBtn;
        private const int HINT_COST = 50;

        void Start() { Invoke(nameof(Setup), 1.0f); }

        private void Setup() { BuildCanvas(); BuildButton(); RefreshUI(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("HintCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 90;

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
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.75f, 0.20f), 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            _hintBtn = btn;
            btn.onClick.AddListener(OnHintClicked);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0f);
            rt.anchorMax = new Vector2(0.5f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 40f);
            rt.sizeDelta = new Vector2(700f, 120f);

            var txtObj = new GameObject("Label");
            txtObj.transform.SetParent(btnObj.transform, false);
            _hintCountText = txtObj.AddComponent<Text>();
            _hintCountText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _hintCountText.fontSize = 40;
            _hintCountText.fontStyle = FontStyle.Bold;
            _hintCountText.color = Color.white;
            _hintCountText.alignment = TextAnchor.MiddleCenter;
            _hintCountText.raycastTarget = false;

            var shadow = txtObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void OnHintClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();

            // Try inventory hint first
            if (ShopManager.Hints > 0)
            {
                if (!ShopManager.UseHint())
                {
                    Debug.LogWarning("[Hint] Failed to use inventory hint.");
                    return;
                }
                GiveHint();
                RefreshUI();
                return;
            }

            // Otherwise buy with coins
            int coins = PlayerProgressManager.Instance != null ? PlayerProgressManager.Instance.Coins : 0;
            if (coins < HINT_COST)
            {
                Debug.Log($"[Hint] Not enough coins ({coins}/{HINT_COST})");
                return;
            }

            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(-HINT_COST);

            GiveHint();
            RefreshUI();
        }

        private void GiveHint()
        {
            var sel = SelectionManager.Instance;
            if (sel == null) return;

            string word = sel.GetRandomUnfoundWord();
            if (string.IsNullOrEmpty(word))
            {
                Debug.Log("[Hint] No unfound words left.");
                return;
            }

            sel.HintWord(word);
            Debug.Log($"[Hint] Revealed: {word}");

            if (SoundManager.Instance != null) SoundManager.Instance.PlayWordFound();
        }

        private void RefreshUI()
        {
            if (_hintCountText == null) return;
            int invHints = ShopManager.Hints;
            _hintCountText.text = invHints > 0
                ? $"HINT ({invHints} left)"
                : $"HINT ({HINT_COST} coins)";
        }

        void OnEnable()
        {
            ShopManager.OnInventoryChanged += RefreshUI;
        }

        void OnDisable()
        {
            ShopManager.OnInventoryChanged -= RefreshUI;
        }
    }
}