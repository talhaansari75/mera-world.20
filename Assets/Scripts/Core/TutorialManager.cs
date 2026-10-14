using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class TutorialManager : MonoBehaviour
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
                ButtonText = "LET'S GO"
            },
            new TutorialStep {
                Title = "THE GRID",
                Body = "Yeh hai word search grid.\n\n" +
                       "Har cell mein ek letter hai. Aapko chhupe hue words dhundhne hain.\n\n" +
                       "Words horizontal, vertical, ya diagonal ho sakte hain.",
                ButtonText = "NEXT"
            },
            new TutorialStep {
                Title = "HOW TO SELECT",
                Body = "Letter pe finger drag karo - pehla letter se aakhri tak.\n\n" +
                       "Agar sahi word bana, to woh highlight ho jayega aur\n" +
                       "word list mein tick aayega.",
                ButtonText = "NEXT"
            },
            new TutorialStep {
                Title = "WORDS TO FIND",
                Body = "Neeche panel mein woh saare words hain jo aapko dhundhne hain.\n\n" +
                       "Ek word milne pe woh green ho jayega.\n\n" +
                       "Sabhi words dhundh lo to LEVEL COMPLETE!",
                ButtonText = "NEXT"
            },
            new TutorialStep {
                Title = "HINT BUTTON",
                Body = "Agar phas jao to HINT button dabao.\n\n" +
                       "Ye aapko ek word ke letters reveal karega.\n\n" +
                       "Hints ke liye coins lagte hain, to soch samajh kar use karo!",
                ButtonText = "NEXT"
            },
            new TutorialStep {
                Title = "READY!",
                Body = "Bas! Ab aap khelne ke liye tayyar ho.\n\n" +
                       "Level 1 se shuru karo aur apni journey enjoy karo!\n\n" +
                       "Good luck!",
                ButtonText = "START PLAYING"
            }
        };

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
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

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current != null)
                return;

            var esObj = new GameObject("EventSystem");
            esObj.AddComponent<UnityEngine.EventSystems.EventSystem>();

            var newModuleType = System.Type.GetType(
                "UnityEngine.InputSystem.UI.InputSystemUIInputModule, Unity.InputSystem");

            if (newModuleType != null)
            {
                esObj.AddComponent(newModuleType);
                Debug.Log("[Tutorial] EventSystem created with InputSystemUIInputModule.");
            }
            else
            {
                esObj.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
                Debug.Log("[Tutorial] EventSystem created with StandaloneInputModule (legacy).");
            }
        }

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
            _stepCounter.text = (_currentStep + 1) + " / " + _steps.Length;
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
    }
}