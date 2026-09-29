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
        private Button _button;
        private Text _label;
        private Image _buttonImage;

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
            var btnObj = new GameObject("HintButton");
            btnObj.transform.SetParent(_canvas.transform, false);

            _buttonImage = btnObj.AddComponent<Image>();
            _buttonImage.color = new Color(1f, 0.82f, 0.25f);

            _button = btnObj.AddComponent<Button>();
            _button.onClick.AddListener(OnHintClicked);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0f);
            rt.anchorMax = new Vector2(0.5f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 40f);
            rt.sizeDelta = new Vector2(500f, 130f);

            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(btnObj.transform, false);

            _label = labelObj.AddComponent<Text>();
            _label.text = $"HINT ({HintCost})";
            _label.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _label.fontSize = 52;
            _label.fontStyle = FontStyle.Bold;
            _label.color = new Color(0.15f, 0.10f, 0.05f);
            _label.alignment = TextAnchor.MiddleCenter;

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
            _buttonImage.color = canAfford
                ? new Color(1f, 0.82f, 0.25f)
                : new Color(0.4f, 0.4f, 0.4f);
        }

        private void OnCoinsChanged(int amount)
        {
            UpdateButtonState();
        }

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
                Debug.Log("[Hint] All words already found!");
                Progress.AddCoins(HintCost);
                return;
            }

            Debug.Log($"[Hint] Showing hint for: {word}");
            SelectionManager.HintWord(word);

            // Track hint count for star rating
            if (WinScreen != null)
                WinScreen.HintsUsed++;

            UpdateButtonState();
        }

        void OnDestroy()
        {
            if (Progress != null)
                Progress.OnCoinsChanged -= OnCoinsChanged;
        }
    }
}