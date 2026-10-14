using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Camera ko screen aspect ke hisaab se adjust karta hai.
    /// 8x8 grid ko har phone pe fit karta hai — portrait ya landscape.
    /// </summary>
    public class CameraAspectFixer : MonoBehaviour
    {
        [Tooltip("Grid ka total world width (8 columns + padding)")]
        public float GridWorldWidth = 8.5f;

        [Tooltip("Grid ka total world height (8 rows + padding)")]
        public float GridWorldHeight = 8.5f;

        [Tooltip("Extra margin around grid (0.5 = 0.5 units each side)")]
        public float Padding = 0.4f;

        private Camera _cam;
        private float _lastAspect;

        void Start()
        {
            _cam = GetComponent<Camera>();
            if (_cam == null) _cam = Camera.main;
            Apply();
        }

        void Update()
        {
            if (_cam == null) return;
            if (Mathf.Abs(_cam.aspect - _lastAspect) > 0.01f)
                Apply();
        }

        private void Apply()
        {
            if (_cam == null) return;

            float aspect = _cam.aspect;
            _lastAspect = aspect;

            // Grid + padding
            float neededWidth  = GridWorldWidth  + (Padding * 2f);
            float neededHeight = GridWorldHeight + (Padding * 2f);

            // OrthoSize = half of vertical visible height
            // Visible width  = 2 * orthoSize * aspect
            // Visible height = 2 * orthoSize
            float orthoForHeight = neededHeight / 2f;
            float orthoForWidth  = (neededWidth / 2f) / aspect;

            // Dono fit hone chahiye — jo bada ho woh use karo
            float finalOrtho = Mathf.Max(orthoForHeight, orthoForWidth);

            _cam.orthographicSize = finalOrtho;

            Debug.Log($"[CameraAspect] Aspect={aspect:F2}, " +
                      $"OrthoSize={finalOrtho:F2} " +
                      $"(Height need={orthoForHeight:F2}, Width need={orthoForWidth:F2})");
        }
    }
}