using UnityEngine;
using DG.Tweening;

namespace MeraWorld.Core
{
    /// <summary>
    /// Screen shake on important events — word found pe strong shake.
    /// </summary>
    public class ScreenShake : MonoBehaviour
    {
        public static ScreenShake Instance { get; private set; }

        [Header("Word Found Shake")]
        public float WordFoundDuration = 0.5f;
        public float WordFoundStrength = 0.6f;
        public int WordFoundVibrato = 30;

        private Camera _cam;
        private Vector3 _originalPos;
        private SelectionManager _selectionManager;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        void Start()
        {
            _cam = Camera.main;
            if (_cam != null) _originalPos = _cam.transform.localPosition;

            // Find the SelectionManager INSTANCE
            _selectionManager = FindFirstObjectByType<SelectionManager>();
            if (_selectionManager != null)
            {
                _selectionManager.OnWordFound -= OnWordFound;
                _selectionManager.OnWordFound += OnWordFound;
                Debug.Log("[ScreenShake] Subscribed to OnWordFound");
            }
            else
            {
                Debug.LogWarning("[ScreenShake] SelectionManager not found");
            }
        }

        private void OnWordFound(string word)
        {
            Debug.Log($"[ScreenShake] Word found: {word} — shaking!");
            Shake(WordFoundDuration, WordFoundStrength, WordFoundVibrato);
        }

        public void Shake(float duration = 0.3f, float strength = 0.3f, int vibrato = 20)
        {
            if (_cam == null)
            {
                _cam = Camera.main;
                if (_cam == null) return;
                _originalPos = _cam.transform.localPosition;
            }

            _cam.transform.DOKill();
            _cam.transform.localPosition = _originalPos;

            _cam.transform.DOShakePosition(
                duration: duration,
                strength: strength,
                vibrato: vibrato,
                randomness: 90,
                snapping: false,
                fadeOut: true
            ).OnComplete(() =>
            {
                if (_cam != null) _cam.transform.localPosition = _originalPos;
            });
        }

        void OnDestroy()
        {
            if (_selectionManager != null)
                _selectionManager.OnWordFound -= OnWordFound;
            if (Instance == this) Instance = null;
        }
    }
}