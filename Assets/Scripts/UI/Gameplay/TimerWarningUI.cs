using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class TimerWarningUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;

        private Text _timerText;
        private float _startTime;
        private bool _stopped = false;

        void Start()
        {
            _startTime = Time.time;
            Invoke(nameof(Setup), 0.5f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            // Find existing timer text
            var allTexts = FindObjectsByType<Text>(FindObjectsSortMode.None);
            foreach (var t in allTexts)
            {
                if (t.name == "TimerText" && t.text.Contains(":"))
                {
                    _timerText = t;
                    break;
                }
            }

            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        void Update()
        {
            if (_stopped || _timerText == null) return;

            float elapsed = Time.time - _startTime;

            if (elapsed >= 90f)
            {
                // Pulse effect
                float pulse = 1f + Mathf.Sin(Time.time * 8f) * 0.10f;
                _timerText.transform.localScale = new Vector3(pulse, pulse, 1f);
                _timerText.color = new Color(1f, 0.35f, 0.35f);
            }
            else if (elapsed >= 60f)
            {
                _timerText.transform.localScale = Vector3.one;
                _timerText.color = new Color(1f, 0.75f, 0.30f);
            }
            else
            {
                _timerText.transform.localScale = Vector3.one;
                _timerText.color = new Color(0.85f, 0.90f, 1f);
            }
        }

        private void OnLevelComplete()
        {
            _stopped = true;
            if (_timerText != null)
                _timerText.transform.localScale = Vector3.one;
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}