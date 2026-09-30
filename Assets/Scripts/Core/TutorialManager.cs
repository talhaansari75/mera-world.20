using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// First-time tutorial. Shows step-by-step overlay on first launch.
    /// Auto-creates EventSystem if missing (works with both input systems).
    /// </summary>
    public class TutorialManager : MonoBehaviour
    {
        public static TutorialManager Instance { get; private set; }

        private const string KEY_TUTORIAL_DONE = "Tutorial_Completed";
        private const string KEY_TUTORIAL_STEP = "Tutorial_CurrentStep";

        private Canvas _canvas;
        private GameObject _overlay;
        private Image _darkPanel;
        private Text _titleText;
        private Text _bodyText;
        private Text _nextButtonText;
        private Text _stepCounter;

        private int _currentStep = 0;

        private class TutorialStep
        {
            public string Title;
            public string Body;
            public string ButtonText;
        }

        private readonly TutorialStep[] _steps = new TutorialStep[]
        {
            new TutorialStep {
                Title = "WELCOME!",
                Body = "Mera Word Search Journey mein aapka swagat hai!\n\n" +
                       "Ye game aapko sikhayega ke kaise khelna hai.\n" +
                       "Sirf 4 aasan steps hain!",
                ButtonText = "LET'S GO ▶"
            },
            new TutorialStep {
                Title = "THE GRID",
                Body = "Yeh hai word search grid.\n\n" +
                       "Har cell mein ek letter hai. Aapko chhupe hue words dhundhne hain.\n\n" +
                       "Words horizontal, vertical, ya diagonal ho sakte hain.",
                ButtonText = "NEXT ▶"
            },
            new TutorialStep {
                Title = "HOW TO SELECT",
                Body = "Letter pe finger drag karo — pehla letter se aakhri tak.\n\n" +
                       "Agar sahi word bana, to woh highlight ho jayega aur\n" +
                       "word list mein ✅ aayega.",
                ButtonText = "NEXT ▶"
            },
            new TutorialStep {
                Title = "WORDS TO FIND",
                Body = "Neeche panel mein woh saare words hain jo aapko dhundhne hain.\n\n" +
                       "Ek word milne pe woh green ho jayega.\n\n" +
                       "Sabhi words dhundh lo to LEVEL COMPLETE!",
                ButtonText = "NEXT ▶"
            },
            new TutorialStep {
                Title = "HINT BUTTON",
                Body = "Agar phas jao to HINT button dabao.\n\n" +
                       "Ye aapko ek word ke letters reveal karega.\n\n" +
                       "Hints ke liye coins lagte hain, to soch samajh kar use karo!",
                ButtonText = "NEXT ▶"
            },
            new TutorialStep {
                Title = "READY!",
                Body = "Bas! Ab aap khelne ke liye tayyar ho.\n\n" +
                       "Level 1 se shuru karo aur apni journey enjoy karo!\n\n" +
                       "Good luck! 🎮",
                ButtonText = "START PLAYING ▶"
            }
        };

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            // Make sure EventSystem exists BEFORE tutorial UI is built
            EnsureEventSystem();

            if (IsTutorialDone())
            {
                Debug.Log("[Tutorial] Already completed. Skipping.");
                return;
            }

            Invoke(nameof(ShowTutorial), 0.5f);
        }

        public static bool IsTutorialDone()
        {
            return PlayerPrefs.GetInt(KEY_TUTORIAL_DONE, 0) == 1;
        }

        public static void ResetTutorial()
        {
            PlayerPrefs.DeleteKey(KEY_TUTORIAL_DONE);
            PlayerPrefs.DeleteKey(KEY_TUTORIAL_STEP);
            PlayerPrefs.Save();
        }

        // ---------------------------------------------------------------
        // EventSystem — auto-detect input system
        // ---------------------------------------------------------------

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current != null)
                return;

            var esObj = new GameObject("EventSystem");
            esObj.AddComponent<UnityEngine.EventSystems.EventSystem>();

            // Try new Input System first (InputSystemUIInputModule)
            var newModuleType = System.Type.GetType(
                "UnityEngine.InputSystem.UI.InputSystemUIInputModule, Unity.InputSystem");

            if (newModuleType != null)
            {
                esObj.AddComponent(newModuleType);
                Debug.Log("[Tutorial] EventSystem created with InputSystemUIInputModule.");
            }
            else
            {
                // Fall back to legacy StandaloneInputModule
                esObj.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
                Debug.Log("[Tutorial] EventSystem created with StandaloneInputModule (legacy).");
            }
        }

        // ---------------------------------------------------------------
        // Main flow
        // ---------------------------------------------------------------

        private void ShowTutorial()
        {
            _currentStep = PlayerPrefs.GetInt(KEY_TUTORIAL_STEP, 0);
            if (_currentStep < 0 || _currentStep >= _steps.Length)
                _currentStep = 0;

            BuildUI();
            RenderStep();
        }

        private void RenderStep()
        {
            var step = _steps[_currentStep];
            _titleText.text = step.Title;
            _bodyText.text = step.Body;
            _nextButtonText.text = step.ButtonText;
            _stepCounter.text = $"{_currentStep + 1} / {_steps.Length}";
        }

        private void OnNextClicked()
        {
            if (AudioManager.Instance != null)
                AudioManager.Instance.PlayButtonClick();

            _currentStep++;

            if (_currentStep >= _steps.Length)
            {
                CompleteTutorial();
                return;
            }

            PlayerPrefs.SetInt(KEY_TUTORIAL_STEP, _currentStep);
            PlayerPrefs.Save();

            StartCoroutine(FadeStep());
        }

        private IEnumerator FadeStep()
        {
            _overlay.transform.localScale = Vector3.one * 0.95f;
            float t = 0f;
            while (t < 0.15f)
            {
                t += Time.unscaledDeltaTime;
                _overlay.transform.localScale = Vector3.Lerp(
                    Vector3.one * 0.95f, Vector3.one, t / 0.15f);
                yield return null;
            }
            _overlay.transform.localScale = Vector3.one;

            RenderStep();
        }

        private void CompleteTutorial()
        {
            PlayerPrefs.SetInt(KEY_TUTORIAL_DONE, 1);
            PlayerPrefs.DeleteKey(KEY_TUTORIAL_STEP);
            PlayerPrefs.Save();

            Debug.Log("[Tutorial] Completed!");

            if (_canvas != null) Destroy(_canvas.gameObject);
        }

        // ---------------------------------------------------------------
        // UI Construction
        // ---------------------------------------------------------------

        private void BuildUI()
        {
            var canvasObj = new GameObject("TutorialCanvas");
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 2000;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // Dark overlay
            var darkObj = new GameObject("DarkOverlay");
            darkObj.transform.SetParent(_canvas.transform, false);
            _darkPanel = darkObj.AddComponent<Image>();
            _darkPanel.color = new Color(0f, 0f, 0f, 0.85f);
            var drt = darkObj.GetComponent<RectTransform>();
            drt.anchorMin = Vector2.zero;
            drt.anchorMax = Vector2.one;
            drt.offsetMin = Vector2.zero;
            drt.offsetMax = Vector2.zero;

            // Main card
            _overlay = new GameObject("Card");
            _overlay.transform.SetParent(_canvas.transform, false);
            var cardImg = _overlay.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.12f, 0.18f, 0.32f), 256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;

            var crt = _overlay.GetComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 0.5f);
            crt.anchorMax = new Vector2(0.5f, 0.5f);
            crt.pivot = new Vector2(0.5f, 0.5f);
            crt.anchoredPosition = Vector2.zero;
            crt.sizeDelta = new Vector2(920f, 1100f);

            // Step counter (top)
            var stepObj = new GameObject("StepCounter");
            stepObj.transform.SetParent(_overlay.transform, false);
            _stepCounter = stepObj.AddComponent<Text>();
            _stepCounter.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _stepCounter.fontSize = 28;
            _stepCounter.fontStyle = FontStyle.Bold;
            _stepCounter.color = new Color(0.70f, 0.80f, 1f);
            _stepCounter.alignment = TextAnchor.MiddleCenter;
            _stepCounter.raycastTarget = false;
            var srt = stepObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 1f);
            srt.anchorMax = new Vector2(0.5f, 1f);
            srt.pivot = new Vector2(0.5f, 1f);
            srt.anchoredPosition = new Vector2(0f, -30f);
            srt.sizeDelta = new Vector2(200f, 40f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_overlay.transform, false);
            _titleText = titleObj.AddComponent<Text>();
            _titleText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _titleText.fontSize = 68;
            _titleText.fontStyle = FontStyle.Bold;
            _titleText.color = new Color(1f, 0.85f, 0.30f);
            _titleText.alignment = TextAnchor.MiddleCenter;
            _titleText.raycastTarget = false;
            var titrt = titleObj.GetComponent<RectTransform>();
            titrt.anchorMin = new Vector2(0.5f, 1f);
            titrt.anchorMax = new Vector2(0.5f, 1f);
            titrt.pivot = new Vector2(0.5f, 1f);
            titrt.anchoredPosition = new Vector2(0f, -100f);
            titrt.sizeDelta = new Vector2(860f, 100f);

            // Divider
            var divObj = new GameObject("Divider");
            divObj.transform.SetParent(_overlay.transform, false);
            var divImg = divObj.AddComponent<Image>();
            divImg.color = new Color(1f, 0.85f, 0.30f, 0.6f);
            var divrt = divObj.GetComponent<RectTransform>();
            divrt.anchorMin = new Vector2(0.5f, 1f);
            divrt.anchorMax = new Vector2(0.5f, 1f);
            divrt.pivot = new Vector2(0.5f, 1f);
            divrt.anchoredPosition = new Vector2(0f, -220f);
            divrt.sizeDelta = new Vector2(500f, 4f);

            // Body
            var bodyObj = new GameObject("Body");
            bodyObj.transform.SetParent(_overlay.transform, false);
            _bodyText = bodyObj.AddComponent<Text>();
            _bodyText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _bodyText.fontSize = 34;
            _bodyText.color = new Color(0.95f, 0.95f, 1f);
            _bodyText.alignment = TextAnchor.UpperCenter;
            _bodyText.horizontalOverflow = HorizontalWrapMode.Wrap;
            _bodyText.verticalOverflow = VerticalWrapMode.Overflow;
            _bodyText.raycastTarget = false;
            _bodyText.lineSpacing = 1.3f;

            var brt = bodyObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = new Vector2(0f, 60f);
            brt.sizeDelta = new Vector2(820f, 500f);

            // Next button
            var btnObj = new GameObject("NextButton");
            btnObj.transform.SetParent(_overlay.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.25f, 0.65f, 0.35f), 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(OnNextClicked);

            var btnrt = btnObj.GetComponent<RectTransform>();
            btnrt.anchorMin = new Vector2(0.5f, 0f);
            btnrt.anchorMax = new Vector2(0.5f, 0f);
            btnrt.pivot = new Vector2(0.5f, 0f);
            btnrt.anchoredPosition = new Vector2(0f, 40f);
            btnrt.sizeDelta = new Vector2(720f, 130f);

            var btnTextObj = new GameObject("Label");
            btnTextObj.transform.SetParent(btnObj.transform, false);
            _nextButtonText = btnTextObj.AddComponent<Text>();
            _nextButtonText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _nextButtonText.fontSize = 44;
            _nextButtonText.fontStyle = FontStyle.Bold;
            _nextButtonText.color = Color.white;
            _nextButtonText.alignment = TextAnchor.MiddleCenter;
            _nextButtonText.raycastTarget = false;
            var btrt = btnTextObj.GetComponent<RectTransform>();
            btrt.anchorMin = Vector2.zero;
            btrt.anchorMax = Vector2.one;
            btrt.offsetMin = Vector2.zero;
            btrt.offsetMax = Vector2.zero;

            var btnShadow = btnTextObj.AddComponent<Shadow>();
            btnShadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            btnShadow.effectDistance = new Vector2(2f, -2f);

            // Skip button (top-right)
            var skipObj = new GameObject("SkipButton");
            skipObj.transform.SetParent(_overlay.transform, false);
            var skipImg = skipObj.AddComponent<Image>();
            skipImg.color = new Color(0.4f, 0.4f, 0.5f, 0.6f);
            var skipBtn = skipObj.AddComponent<Button>();
            skipBtn.onClick.AddListener(CompleteTutorial);

            var skipRt = skipObj.GetComponent<RectTransform>();
            skipRt.anchorMin = new Vector2(1f, 1f);
            skipRt.anchorMax = new Vector2(1f, 1f);
            skipRt.pivot = new Vector2(1f, 1f);
            skipRt.anchoredPosition = new Vector2(-20f, -20f);
            skipRt.sizeDelta = new Vector2(140f, 60f);

            var skipTextObj = new GameObject("Label");
            skipTextObj.transform.SetParent(skipObj.transform, false);
            var skipTxt = skipTextObj.AddComponent<Text>();
            skipTxt.text = "SKIP";
            skipTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            skipTxt.fontSize = 26;
            skipTxt.fontStyle = FontStyle.Bold;
            skipTxt.color = Color.white;
            skipTxt.alignment = TextAnchor.MiddleCenter;
            skipTxt.raycastTarget = false;
            var stxtrt = skipTextObj.GetComponent<RectTransform>();
            stxtrt.anchorMin = Vector2.zero;
            stxtrt.anchorMax = Vector2.one;
            stxtrt.offsetMin = Vector2.zero;
            stxtrt.offsetMax = Vector2.zero;
        }
    }
}