using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class HintButtonUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;
        public WinScreenUI WinScreen;

        [Header("Settings")]
        public int HintCost = 50;

        private Canvas _canvas;
        private GameObject _buttonRoot;
        private Button _button;
        private Text _label;

        void Start()
        {
            Invoke(nameof(BuildUI), 0.3f);
        }

        private void BuildUI()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
            if (WinScreen == null) WinScreen = FindFirstObjectByType<WinScreenUI>();

            BuildCanvas();
            BuildHintButton();
            UpdateButtonState();

            if (Progress != null)
                Progress.OnCoinsChanged += OnCoinsChanged;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("HintCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 60;

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

        private void BuildHintButton()
        {
            _buttonRoot = new GameObject("HintBtnRoot");
            _buttonRoot.transform.SetParent(_canvas.transform, false);

            var rootRt = _buttonRoot.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(0.5f, 0f);
            rootRt.anchorMax = new Vector2(0.5f, 0f);
            rootRt.pivot = new Vector2(0.5f, 0f);
            rootRt.anchoredPosition = new Vector2(0f, 40f);
            rootRt.sizeDelta = new Vector2(500f, 120f);

            // Bottom shadow
            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(_buttonRoot.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.60f, 0.42f, 0.08f), 256, 50);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = Vector2.zero;
            shRt.anchorMax = Vector2.one;
            shRt.offsetMin = Vector2.zero;
            shRt.offsetMax = Vector2.zero;
            shRt.anchoredPosition = new Vector2(0f, -8f);

            // Main button
            var btnObj = new GameObject("Button");
            btnObj.transform.SetParent(_buttonRoot.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.82f, 0.25f), 256, 50);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            _button = btnObj.AddComponent<Button>();
            _button.onClick.AddListener(OnHintClicked);

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 8f);

            // Label
            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(btnObj.transform, false);
            _label = labelObj.AddComponent<Text>();
            _label.text = $"HINT ({HintCost})";
            _label.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _label.fontSize = 48;
            _label.fontStyle = FontStyle.Bold;
            _label.color = new Color(0.15f, 0.10f, 0.05f);
            _label.alignment = TextAnchor.MiddleCenter;
            _label.raycastTarget = false;

            var shadow = labelObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(1f, 1f, 1f, 0.35f);
            shadow.effectDistance = new Vector2(1f, 1f);

            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = Vector2.zero;
            lrt.anchorMax = Vector2.one;
            lrt.offsetMin = Vector2.zero;
            lrt.offsetMax = Vector2.zero;
        }

        private void UpdateButtonState()
        {
            if (_button == null || Progress == null) return;

            bool canAfford = Progress.Coins >= HintCost;
            _button.interactable = canAfford;

            var img = _button.GetComponent<Image>();
            if (img != null)
            {
                img.sprite = UISpriteFactory.Create3DButtonSprite(
                    canAfford ? new Color(1f, 0.82f, 0.25f) : new Color(0.40f, 0.35f, 0.25f),
                    256, 50);
                img.type = Image.Type.Sliced;
            }
        }

        private void OnCoinsChanged(int amount) { UpdateButtonState(); }

        private void OnHintClicked()
        {
            if (Progress == null || SelectionManager == null) return;

            if (!Progress.SpendCoins(HintCost))
            {
                Debug.Log("[Hint] Not enough coins!");
                return;
            }

            var word = SelectionManager.GetRandomUnfoundWord();
            if (string.IsNullOrEmpty(word))
            {
                Progress.AddCoins(HintCost);
                return;
            }

            Debug.Log($"[Hint] Showing hint for: {word}");
            SelectionManager.HintWord(word);

            if (WinScreen != null) WinScreen.HintsUsed++;
            if (SoundManager.Instance != null) SoundManager.Instance.PlayWordFound();

            UpdateButtonState();
        }

        void OnDestroy()
        {
            if (Progress != null)
                Progress.OnCoinsChanged -= OnCoinsChanged;
        }
    }
}