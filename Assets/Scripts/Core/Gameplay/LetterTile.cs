using UnityEngine;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class LetterTile : MonoBehaviour
    {
        public int Row;
        public int Column;
        public char Letter;

        public enum TileType { Normal, Golden, Bomb }
        public TileType Type = TileType.Normal;

        [HideInInspector] public SelectionManager Manager;

        public bool IsSelected { get; private set; }
        public bool IsFound { get; private set; }
        public Color FoundColor { get; private set; }

        [Header("Animation - DRAMATIC")]
        public float SelectScale = 1.8f;
        public float PersistentSelectScale = 1.7f;
        public float PersistentFoundScale = 1.35f;
        public float BounceDuration = 0.3f;

        [Header("Glow Colors")]
        public Color SelectedTint = new Color(1.0f, 0.95f, 0.35f);
        public Color SelectedGlow = new Color(1.0f, 0.85f, 0.15f);

        private SpriteRenderer _renderer;
        private Color _defaultColor;
        private Color _selectedColor;
        private Vector3 _originalScale;
        private bool _scaleCaptured;
        private SpriteRenderer _glowRenderer;

        void Awake()
        {
            _renderer = GetComponent<SpriteRenderer>();
        }

        void Start()
        {
            Invoke(nameof(CaptureOriginalScale), 0.1f);
        }

        private void CaptureOriginalScale()
        {
            _originalScale = transform.localScale;
            _scaleCaptured = true;
            CreateGlowIfNeeded();
        }

        // === Halo glow sprite behind selected tiles ===
        private void CreateGlowIfNeeded()
        {
            if (_glowRenderer != null) return;
            if (_renderer == null || _renderer.sprite == null) return;

            var glowObj = new GameObject("Glow");
            glowObj.transform.SetParent(transform, false);
            glowObj.transform.localPosition = Vector3.zero;
            glowObj.transform.localScale = Vector3.one * 1.35f;

            _glowRenderer = glowObj.AddComponent<SpriteRenderer>();
            _glowRenderer.sprite = _renderer.sprite;
            _glowRenderer.color = new Color(1f, 0.85f, 0.15f, 0f);
            _glowRenderer.sortingLayerName = _renderer.sortingLayerName;
            _glowRenderer.sortingOrder = _renderer.sortingOrder - 1;
        }

        public void SetColors(Color defaultCol, Color selectedCol, Color foundCol)
        {
            _defaultColor = defaultCol;
            _selectedColor = selectedCol;
            FoundColor = foundCol;
            Refresh();
        }

        public void SetSelected(bool selected)
        {
            if (IsFound) return;
            bool wasSelected = IsSelected;
            IsSelected = selected;
            Refresh();

            if (selected && !wasSelected)
                PlaySelectBounce();
            else if (!selected && wasSelected)
                PlayDeselectBounce();
        }

        private void PlaySelectBounce()
        {
            if (!_scaleCaptured) _originalScale = transform.localScale;
            if (_renderer == null) return;

            transform.DOKill();
            transform.localScale = _originalScale;
            transform.localRotation = Quaternion.identity;

            // Bright golden color — VISIBLE
            _renderer.DOKill();
            _renderer.color = SelectedTint;
            _renderer.DOColor(SelectedGlow, 0.5f)
                .SetLoops(-1, LoopType.Yoyo)
                .SetEase(Ease.InOutSine);

            // Halo glow ON
            if (_glowRenderer != null)
            {
                _glowRenderer.DOKill();
                _glowRenderer.DOColor(new Color(1f, 0.85f, 0.15f, 0.7f), 0.2f);
                _glowRenderer.DOColor(new Color(1f, 0.9f, 0.4f, 0.9f), 0.6f)
                    .SetLoops(-1, LoopType.Yoyo)
                    .SetEase(Ease.InOutSine)
                    .SetDelay(0.2f);
            }

            Vector3 persistentScale = _originalScale * PersistentSelectScale;

            Sequence s = DOTween.Sequence();
            s.Append(transform.DOScale(_originalScale * 0.75f, 0.08f)
                .SetEase(Ease.OutQuad));
            s.Append(transform.DOScale(_originalScale * SelectScale, 0.15f)
                .SetEase(Ease.OutBack));
            s.Join(transform.DORotate(new Vector3(0, 0, 15f), 0.15f));
            s.Append(transform.DOScale(persistentScale, 0.25f)
                .SetEase(Ease.OutElastic, 0.5f, 0.3f));
            s.Join(transform.DORotate(Vector3.zero, 0.25f).SetEase(Ease.OutBack));
        }

        private void PlayDeselectBounce()
        {
            if (!_scaleCaptured) _originalScale = transform.localScale;

            if (_renderer != null) _renderer.DOKill();
            if (_glowRenderer != null)
            {
                _glowRenderer.DOKill();
                _glowRenderer.DOColor(new Color(1f, 0.85f, 0.15f, 0f), 0.15f);
            }

            transform.DOKill();
            transform.localScale = _originalScale;
            transform.localRotation = Quaternion.identity;
        }

        public void SetFound(Color color)
        {
            IsFound = true;
            IsSelected = false;
            FoundColor = color;
            Refresh();

            if (_scaleCaptured)
            {
                if (_renderer != null) _renderer.DOKill();
                if (_glowRenderer != null)
                {
                    _glowRenderer.DOKill();
                    _glowRenderer.DOColor(new Color(1f, 0.85f, 0.15f, 0f), 0.15f);
                }

                transform.DOKill();
                transform.localScale = _originalScale;
                transform.localRotation = Quaternion.identity;

                Vector3 persistentScale = _originalScale * PersistentFoundScale;

                Sequence s = DOTween.Sequence();
                s.Append(transform.DOScale(_originalScale * 1.9f, 0.18f)
                    .SetEase(Ease.OutBack));
                s.Join(transform.DORotate(new Vector3(0, 0, -30f), 0.18f));
                s.Append(transform.DOScale(persistentScale, 0.4f)
                    .SetEase(Ease.OutElastic, 0.4f, 0.3f));
                s.Join(transform.DORotate(Vector3.zero, 0.4f).SetEase(Ease.OutBack));

                if (_renderer != null)
                {
                    _renderer.DOKill();
                    _renderer.color = Color.white;
                    _renderer.DOColor(FoundColor, 0.35f).SetDelay(0.15f)
                        .OnComplete(StartFoundGlow);
                }
            }
        }

        private void StartFoundGlow()
        {
            if (_renderer == null) return;

            Color baseColor = FoundColor;
            Color brighter = new Color(
                Mathf.Min(1f, baseColor.r * 1.4f),
                Mathf.Min(1f, baseColor.g * 1.4f),
                Mathf.Min(1f, baseColor.b * 1.4f),
                baseColor.a);

            _renderer.DOColor(brighter, 0.6f)
                .SetLoops(-1, LoopType.Yoyo)
                .SetEase(Ease.InOutSine);
        }

        private void Refresh()
        {
            if (_renderer == null) return;

            if (IsFound) _renderer.color = FoundColor;
            else if (IsSelected) _renderer.color = _selectedColor;
            else _renderer.color = _defaultColor;
        }

        void OnDestroy()
        {
            // STACK TRACE: shows WHO destroyed this cell
            if (Application.isPlaying)
            {
                // (destroy log removed)
            }
            if (transform != null) transform.DOKill();
            if (_renderer != null) _renderer.DOKill();
            if (_glowRenderer != null) _glowRenderer.DOKill();
        }

        public void SetSpecialType(TileType type)
        {
            Type = type;
            if (_renderer == null) _renderer = GetComponent<SpriteRenderer>();
            if (_renderer == null) return;

            if (type == TileType.Golden)
            {
                _renderer.color = new Color(1f, 0.90f, 0.40f); // Bright Gold
            }
            else if (type == TileType.Bomb)
            {
                _renderer.color = new Color(1f, 0.40f, 0.40f); // Danger Red
            }
        }    }
}
