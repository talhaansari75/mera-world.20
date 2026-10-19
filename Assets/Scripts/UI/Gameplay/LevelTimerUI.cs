using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LevelTimerUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private Text _timerText;
        private float _startTime;
        private bool _stopped = false;

        private bool _isZen = false;
        private bool _isCountdown = false;
        private float _timeLimit = -1f;
        private string _lastMode = "";

        void Start()
        {
            _startTime = Time.time;
            Invoke(nameof(Setup), 0.35f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            _lastMode = GameModeManager.CurrentMode;
            _isZen = GameModeManager.IsZen;
            _isCountdown = GameModeManager.IsCountdown;
            _timeLimit = GameModeManager.GetTimeLimit();

            if (_isZen)
            {
                Debug.Log("[Timer] ZEN mode - timer hidden");
                if (SelectionManager != null) SelectionManager.OnLevelComplete += OnLevelComplete;
                return;
            }

            BuildCanvas();
            if (SelectionManager != null) SelectionManager.OnLevelComplete += OnLevelComplete;
            Debug.Log($"[Timer] Mode: {GameModeManager.GetDisplayName()} | Countdown: {_isCountdown}");
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LevelTimerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 56;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;
            canvasObj.AddComponent<GraphicRaycaster>();

            var container = new GameObject("TimerContainer");
            container.transform.SetParent(_canvas.transform, false);
            var containerImg = container.AddComponent<Image>();
            containerImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.20f, 0.08f, 0.38f), 128, 20);
            containerImg.type = Image.Type.Sliced;
            containerImg.color = Color.white;
            containerImg.raycastTarget = false;

            var cRt = container.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0.5f, 1f);
            cRt.anchorMax = new Vector2(0.5f, 1f);
            cRt.pivot = new Vector2(0.5f, 1f);
            cRt.anchoredPosition = new Vector2(0f, -195f);
            cRt.sizeDelta = new Vector2(260f, 55f);

            var textObj = new GameObject("TimerText");
            textObj.transform.SetParent(container.transform, false);
            _timerText = textObj.AddComponent<Text>();
            _timerText.text = "0:00";
            _timerText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _timerText.fontSize = 36;
            _timerText.fontStyle = FontStyle.Bold;
            _timerText.color = new Color(1f, 0.90f, 0.55f);
            _timerText.alignment = TextAnchor.MiddleCenter;
            _timerText.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.65f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var rt = textObj.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
        }

        void Update()
        {
            string curMode = GameModeManager.CurrentMode;
            if (_lastMode != curMode)
            {
                _lastMode = curMode;
                _startTime = Time.time;
                _stopped = false;
                _isZen = GameModeManager.IsZen;
                _isCountdown = GameModeManager.IsCountdown;
                _timeLimit = GameModeManager.GetTimeLimit();
                if (_canvas != null) _canvas.gameObject.SetActive(!_isZen);
                Debug.Log($"[Timer] Mode switched to {curMode}");
            }

            if (_isZen) return;
            if (_stopped || _timerText == null) return;

            float elapsed = Time.time - _startTime;

            if (_isCountdown)
            {
                float remaining = _timeLimit - elapsed;
                if (remaining < 0f) remaining = 0f;
                int m = Mathf.FloorToInt(remaining / 60f);
                int s = Mathf.FloorToInt(remaining % 60f);
                _timerText.text = $"{m}:{s:00}";

                if (remaining > 30f) _timerText.color = new Color(0.55f, 1f, 0.65f);
                else if (remaining > 10f) _timerText.color = new Color(1f, 0.85f, 0.35f);
                else _timerText.color = new Color(1f, 0.35f, 0.35f);

                if (remaining <= 0f && !_stopped)
                {
                    _stopped = true;
                    Debug.Log("[Timer] TIME UP - time attack failed");
                    OnTimeAttackFail();
                }
            }
            else
            {
                int minutes = Mathf.FloorToInt(elapsed / 60f);
                int seconds = Mathf.FloorToInt(elapsed % 60f);
                _timerText.text = $"{minutes}:{seconds:00}";
                if (elapsed < 60f) _timerText.color = new Color(1f, 0.90f, 0.55f);
                else if (elapsed < 120f) _timerText.color = new Color(1f, 0.85f, 0.35f);
                else _timerText.color = new Color(1f, 0.5f, 0.4f);
            }
        }

        private void OnLevelComplete() { _stopped = true; }

        private void OnTimeAttackFail()
        {
            GameModeManager.ResetToClassic();
            var home = FindFirstObjectByType<HomeScreenUI>();
            var gm = FindFirstObjectByType<GameManager>();
            int lvl = gm != null ? gm.CurrentLevel : 1;
            if (home != null)
            {
                home.StartLevel(lvl);
                Debug.Log("[Timer] Time attack failed — reset to Classic");
            }
            else
            {
                UnityEngine.SceneManagement.SceneManager.LoadScene(
                    UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
            }
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}