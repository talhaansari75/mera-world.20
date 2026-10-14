using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

namespace MeraWorld.Core
{
    public partial class WinScreenUI
    {
        private void PlayWinScreenIntro()
        {
            if (_panelGroup == null) return;

            _panelGroup.DOKill();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            Sequence intro = DOTween.Sequence();
            intro.Append(_panelGroup.DOFade(1f, 0.25f).SetEase(Ease.OutQuad));

            if (_titleText != null)
            {
                var titleRt = _titleText.rectTransform;
                titleRt.DOKill();
                titleRt.localScale = Vector3.one * 0.5f;
                intro.Join(titleRt.DOScale(1f, 0.4f).SetEase(Ease.OutBack));
            }

            for (int i = 0; i < 3; i++)
            {
                if (_starImages[i] == null) continue;
                _starImages[i].rectTransform.DOKill();
                _starImages[i].rectTransform.localScale = Vector3.zero;
            }

            float starStart = 0.35f;
            float starGap = 0.18f;

            for (int i = 0; i < 3; i++)
            {
                if (_starImages[i] == null) continue;
                var starRt = _starImages[i].rectTransform;

                if (i < _starsEarned)
                {
                    starRt.localScale = Vector3.zero;
                    starRt.localRotation = Quaternion.Euler(0, 0, -60f);
                    Sequence ss = DOTween.Sequence();
                    ss.AppendInterval(starStart + i * starGap);
                    ss.Append(starRt.DOScale(1.5f, 0.25f).SetEase(Ease.OutBack));
                    ss.Join(starRt.DORotate(Vector3.zero, 0.4f).SetEase(Ease.OutBack));
                    ss.Append(starRt.DOScale(1f, 0.15f).SetEase(Ease.OutQuad));
                }
                else
                {
                    starRt.localScale = Vector3.one * 0.7f;
                    Sequence ss = DOTween.Sequence();
                    ss.AppendInterval(starStart + i * starGap);
                    ss.Append(starRt.DOScale(1f, 0.25f).SetEase(Ease.OutQuad));
                }
            }

            if (_bonusText != null)
            {
                var brt = _bonusText.rectTransform;
                var bcg = _bonusText.GetComponent<CanvasGroup>();
                if (bcg == null) bcg = _bonusText.gameObject.AddComponent<CanvasGroup>();
                bcg.DOKill();
                bcg.alpha = 0f;
                Sequence bs = DOTween.Sequence();
                bs.AppendInterval(starStart + 3 * starGap);
                bs.Append(bcg.DOFade(1f, 0.3f));
                bs.Join(brt.DOPunchScale(Vector3.one * 0.15f, 0.4f, 8, 0.5f));
            }

            float btnStart = starStart + 3 * starGap + 0.2f;
            for (int i = 0; i < _buttons.Length; i++)
            {
                if (_buttons[i] == null) continue;
                var brt = _buttons[i].GetComponent<RectTransform>();
                var bcg = _buttons[i].GetComponent<CanvasGroup>();
                if (bcg == null) bcg = _buttons[i].gameObject.AddComponent<CanvasGroup>();
                bcg.DOKill();
                bcg.alpha = 0f;

                Vector2 target = brt.anchoredPosition;
                brt.anchoredPosition = target + new Vector2(0, -50f);

                Sequence bs = DOTween.Sequence();
                bs.AppendInterval(btnStart + i * 0.1f);
                bs.Append(bcg.DOFade(1f, 0.25f));
                bs.Join(brt.DOAnchorPos(target, 0.35f).SetEase(Ease.OutBack));
            }

            intro.OnComplete(() =>
            {
                if (_panelGroup != null) _panelGroup.blocksRaycasts = true;
            });
        }

        private void OnNextLevel()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);

            if (LoadingScreenUI.Instance != null)
            {
                LoadingScreenUI.Instance.Show(0.8f, DoNextLevelTransition);
            }
            else
            {
                DoNextLevelTransition();
            }
        }

        private void DoNextLevelTransition()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);

            int currentLevel = GameManager != null ? GameManager.CurrentLevel : 1;
            int nextLevel = currentLevel + 1;

            if (PlayerProgressManager.Instance != null)
            {
                PlayerProgressManager.Instance.AddCoins(100);
                PlayerProgressManager.Instance.AddStars(_starsEarned);
                PlayerProgressManager.Instance.SetCurrentLevel(nextLevel);
            }
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", nextLevel);
                PlayerPrefs.Save();
            }

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            var gm = FindFirstObjectByType<GameManager>();
            if (gm != null) gm.ReloadFromProgress();
            var gv = FindFirstObjectByType<GridVisualizer>();
            if (gv != null) gv.BuildVisuals();
            var wl = FindFirstObjectByType<WordListUI>();
            if (wl != null) wl.ForceRebuild();
            var sm = FindFirstObjectByType<SelectionManager>();
            if (sm != null) sm.ResetProgress();
            Debug.Log("[WinScreen] Next level loaded in-place");
        }

        private void OnReplay()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            var gm = FindFirstObjectByType<GameManager>();
            if (gm != null) gm.ReloadFromProgress();
            var gv = FindFirstObjectByType<GridVisualizer>();
            if (gv != null) gv.BuildVisuals();
            var wl = FindFirstObjectByType<WordListUI>();
            if (wl != null) wl.ForceRebuild();
            var sm = FindFirstObjectByType<SelectionManager>();
            if (sm != null) sm.ResetProgress();
            Debug.Log("[WinScreen] Replay in-place");
        }

        private void OnHome()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();

            var hs = FindFirstObjectByType<HomeScreenUI>();
            if (hs != null) HomeScreenUI.ForceShowHome();
            Debug.Log("[WinScreen] Home shown in-place");
        }
    }
}