using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using TMPro;

namespace MeraWorld.Core
{
    public partial class WinScreenUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        [Header("Star Rating Settings")]
        public float ThreeStarMaxSeconds = 60f;
        public float TwoStarMaxSeconds = 120f;

        [HideInInspector] public int HintsUsed = 0;

        private Canvas _canvas;
        private GameObject _panel;
        private CanvasGroup _panelGroup;
        private TextMeshProUGUI _titleText;
        private Image[] _starImages = new Image[3];
        private TextMeshProUGUI _bonusText;
        private Button[] _buttons = new Button[4];
        private TMP_FontAsset _premiumFont;
        private float _levelStartTime;
        private int _starsEarned = 0;

        private const string STARS_KEY_PREFIX = "Stars_Level_";

        void Start()
        {
            _levelStartTime = Time.time;
            Invoke(nameof(Setup), 0.3f);
        }

        private void Setup()
        {
            EnsureEventSystem();
            LoadPremiumFont();
            BuildHiddenPanel();

            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();

            if (SelectionManager != null)
            {
                MeraWorld.Core.SelectionManager.OnLevelComplete -= ShowWinScreen;
                MeraWorld.Core.SelectionManager.OnLevelComplete += ShowWinScreen;
                Debug.Log("[WinScreen] Subscribed to OnLevelComplete");
            }
        }

        private void LoadPremiumFont()
        {
            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null)
                _premiumFont = TMP_Settings.defaultFontAsset;
        }

        private void EnsureEventSystem()
        {
            if (EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<EventSystem>();
                es.AddComponent<StandaloneInputModule>();
            }
        }

        private void ShowWinScreen()
        {
            if (_panel == null) return;

            float elapsed = Time.time - _levelStartTime;
            _starsEarned = CalculateStars(elapsed, HintsUsed);

            Debug.Log("[Level Complete] Time: " + elapsed.ToString("F0") + "s, Hints: " + HintsUsed + ", Stars: " + _starsEarned);

            if (_titleText != null && GameManager != null)
                _titleText.text = "LEVEL " + GameManager.CurrentLevel + " COMPLETE!";

            for (int i = 0; i < 3; i++)
            {
                if (_starImages[i] == null) continue;
                _starImages[i].color = i < _starsEarned
                    ? new Color(1f, 0.85f, 0.25f)
                    : new Color(0.25f, 0.25f, 0.30f);
            }

            if (GameManager != null)
            {
                int levelNum = GameManager.CurrentLevel;
                int previousStars = PlayerPrefs.GetInt(STARS_KEY_PREFIX + levelNum, 0);
                if (_starsEarned > previousStars)
                {
                    PlayerPrefs.SetInt(STARS_KEY_PREFIX + levelNum, _starsEarned);
                    PlayerPrefs.Save();
                }
            }

            _panel.SetActive(true);
            PlayWinScreenIntro();

            if (AdsManager.Instance != null)
                AdsManager.Instance.OnLevelCompleted();
        }

        private int CalculateStars(float timeSeconds, int hints)
        {
            int stars = 1;
            if (timeSeconds <= ThreeStarMaxSeconds) stars = 3;
            else if (timeSeconds <= TwoStarMaxSeconds) stars = 2;

            if (hints >= 3) stars = Mathf.Min(stars, 1);
            else if (hints >= 1) stars = Mathf.Min(stars, 2);

            return Mathf.Clamp(stars, 1, 3);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                MeraWorld.Core.SelectionManager.OnLevelComplete -= ShowWinScreen;
        }
    }
}