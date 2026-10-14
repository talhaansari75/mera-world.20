using System.Collections;
using UnityEngine;

namespace MeraWorld.Core
{
    public class ScreenShakeUI : MonoBehaviour
    {
        public static ScreenShakeUI Instance { get; private set; }
        private Camera _cam;
        private Vector3 _originalPos;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            _cam = Camera.main;
            if (_cam != null) _originalPos = _cam.transform.position;
        }

        public void Shake(float duration = 0.3f, float magnitude = 0.15f)
        {
            StartCoroutine(ShakeRoutine(duration, magnitude));
        }

        private IEnumerator ShakeRoutine(float duration, float magnitude)
        {
            if (_cam == null) yield break;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float damper = 1f - (elapsed / duration);
                float x = Random.Range(-1f, 1f) * magnitude * damper;
                float y = Random.Range(-1f, 1f) * magnitude * damper;
                _cam.transform.position = _originalPos + new Vector3(x, y, 0f);
                yield return null;
            }
            _cam.transform.position = _originalPos;
        }
    }
}