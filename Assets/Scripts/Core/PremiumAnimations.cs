using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

namespace MeraWorld.Core
{
    /// <summary>
    /// Centralized animations using DOTween.
    /// Har jagah reusable.
    /// </summary>
    public static class PremiumAnimations
    {
        /// <summary>Button press — scale down and pop back.</summary>
        public static void ButtonPress(RectTransform target)
        {
            if (target == null) return;
            target.DOKill();
            target.localScale = Vector3.one;
            Sequence s = DOTween.Sequence();
            s.Append(target.DOScale(0.92f, 0.08f).SetEase(Ease.OutQuad));
            s.Append(target.DOScale(1f, 0.12f).SetEase(Ease.OutBack));
        }

        /// <summary>Tile selected — bounce up.</summary>
        public static void TileSelect(Transform target)
        {
            if (target == null) return;
            target.DOKill();
            target.localScale = Vector3.one;
            Sequence s = DOTween.Sequence();
            s.Append(target.DOScale(1.10f, 0.10f).SetEase(Ease.OutQuad));
            s.Append(target.DOScale(1f, 0.15f).SetEase(Ease.OutBack));
        }

        /// <summary>Coin fly — move from world to UI position.</summary>
        public static void CoinFly(Transform coin, Vector3 start, Vector3 end,
            System.Action onComplete = null)
        {
            if (coin == null) return;
            coin.position = start;
            coin.localScale = Vector3.one * 1.2f;

            Sequence s = DOTween.Sequence();
            s.Append(coin.DOMove(end, 0.6f).SetEase(Ease.InQuad));
            s.Join(coin.DOScale(0.4f, 0.6f).SetEase(Ease.InQuad));
            s.Join(coin.DORotate(new Vector3(0, 360, 0), 0.6f, RotateMode.FastBeyond360));
            s.OnComplete(() =>
            {
                onComplete?.Invoke();
                if (coin != null) UnityEngine.Object.Destroy(coin.gameObject);
            });
        }

        /// <summary>Fade in panel.</summary>
        public static void FadeIn(CanvasGroup group, float duration = 0.3f)
        {
            if (group == null) return;
            group.DOKill();
            group.alpha = 0f;
            group.DOFade(1f, duration).SetEase(Ease.OutQuad);
        }

        /// <summary>Fade out panel.</summary>
        public static void FadeOut(CanvasGroup group, float duration = 0.3f,
            System.Action onComplete = null)
        {
            if (group == null) return;
            group.DOKill();
            group.DOFade(0f, duration).SetEase(Ease.InQuad).OnComplete(() =>
            {
                onComplete?.Invoke();
            });
        }

        /// <summary>Star pop-in one by one.</summary>
        public static void StarPopIn(Transform star, float delay = 0f)
        {
            if (star == null) return;
            star.DOKill();
            star.localScale = Vector3.zero;
            Sequence s = DOTween.Sequence();
            s.AppendInterval(delay);
            s.Append(star.DOScale(1.3f, 0.25f).SetEase(Ease.OutBack));
            s.Append(star.DOScale(1f, 0.15f).SetEase(Ease.InQuad));
        }

        /// <summary>Smooth progress bar fill.</summary>
        public static void ProgressFill(RectTransform fill, float targetWidth,
            float duration = 0.3f)
        {
            if (fill == null) return;
            fill.DOKill();
            fill.DOSizeDelta(new Vector2(targetWidth, fill.sizeDelta.y), duration)
                .SetEase(Ease.OutQuad);
        }

        /// <summary>Shake for error.</summary>
        public static void ShakeError(RectTransform target, float strength = 10f)
        {
            if (target == null) return;
            target.DOKill();
            target.DOShakeAnchorPos(0.35f, strength, 20, 90, false, true);
        }

        /// <summary>Pulse loop for glow.</summary>
        public static void PulseLoop(Transform target, float scale = 1.05f,
            float duration = 1.2f)
        {
            if (target == null) return;
            target.DOKill();
            target.localScale = Vector3.one;
            target.DOScale(scale, duration)
                .SetEase(Ease.InOutSine)
                .SetLoops(-1, LoopType.Yoyo);
        }
    }
}

