using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public partial class LoadingScreenUI
    {
        private void PlayIntroAnimation()
        {
            if (_titleRect == null) return;

            Sequence intro = DOTween.Sequence().SetUpdate(true);
            intro.Append(_titleRect.DOPunchScale(Vector3.one * 0.15f, 0.6f, 6, 0.5f));

            if (_progressFillRect != null)
            {
                _progressFillRect.sizeDelta = new Vector2(0f, -6f);
                intro.Join(_progressFillRect.DOSizeDelta(
                    new Vector2(634f, -6f), 1.2f).SetEase(Ease.OutQuad).SetUpdate(true));
            }
        }

        void Update()
        {
            _elapsed += Time.unscaledDeltaTime;

            if (_loadingDots != null)
            {
                for (int i = 0; i < _loadingDots.Length; i++)
                {
                    if (_loadingDots[i] == null) continue;
                    float phase = _elapsed * 3f - i * 0.3f;
                    float alpha = 0.3f + (Mathf.Sin(phase) * 0.5f + 0.5f) * 0.7f;
                    var c = _loadingDots[i].color;
                    c.a = alpha;
                    _loadingDots[i].color = c;
                }
            }
        }

        private IEnumerator ShowFor(float duration)
        {
            yield return new WaitForSecondsRealtime(duration);

            if (_panelGroup != null)
            {
                _panelGroup.DOKill();
                _panelGroup.DOFade(0f, 0.35f).SetEase(Ease.InQuad).SetUpdate(true);
            }

            if (_starsRoot != null)
            {
                var starImgs = _starsRoot.GetComponentsInChildren<Image>(true);
                foreach (var img in starImgs)
                    if (img != null) DOTween.Kill(img, false);
            }

            yield return new WaitForSecondsRealtime(0.4f);

            Cleanup();

            _onComplete?.Invoke();
        }
    }
}