using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

namespace MeraWorld.Core
{
    [RequireComponent(typeof(Button))]
    public class ButtonJuice : MonoBehaviour
    {
        [Tooltip("Press pe kitna chhota ho")]
        public float PressScale = 0.82f;

        [Tooltip("Press duration (seconds)")]
        public float PressDuration = 0.07f;

        [Tooltip("Pop back duration (seconds)")]
        public float PopDuration = 0.22f;

        [Tooltip("Rotation wobble angle (degrees)")]
        public float WobbleAngle = 3f;

        private RectTransform _rt;
        private Button _btn;
        private Vector3 _originalScale;
        private Vector3 _originalRotation;

        void Awake()
        {
            _rt = GetComponent<RectTransform>();
            _btn = GetComponent<Button>();

            if (_rt != null)
            {
                _originalScale = _rt.localScale;
                _originalRotation = _rt.localEulerAngles;
            }

            if (_btn != null)
                _btn.onClick.AddListener(PlayPress);
        }

        void OnDestroy()
        {
            if (_btn != null) _btn.onClick.RemoveListener(PlayPress);
        }

        public void PlayPress()
        {
            if (_rt == null) return;

            _rt.DOKill();
            _rt.localScale = _originalScale;
            _rt.localEulerAngles = _originalRotation;

            Sequence s = DOTween.Sequence();

            // 1. Press down — scale chhota + slight rotation
            s.Append(_rt.DOScale(_originalScale * PressScale, PressDuration)
                .SetEase(Ease.OutQuad));
            s.Join(_rt.DOLocalRotate(
                _originalRotation + new Vector3(0, 0, WobbleAngle),
                PressDuration).SetEase(Ease.OutQuad));

            // 2. Pop back OVERSHOOT — bada hoga pehle
            s.Append(_rt.DOScale(_originalScale * 1.08f, PopDuration * 0.4f)
                .SetEase(Ease.OutQuad));

            // 3. Normalize
            s.Append(_rt.DOScale(_originalScale, PopDuration * 0.6f)
                .SetEase(Ease.OutBack));

            // 4. Rotation reset
            s.Join(_rt.DOLocalRotate(_originalRotation, PopDuration)
                .SetEase(Ease.OutBack));

            // 5. Sound (agar SoundManager hai to)
            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayButtonClick();
        }
    }
}