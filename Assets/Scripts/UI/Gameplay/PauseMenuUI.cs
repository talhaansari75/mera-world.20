using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public partial class PauseMenuUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private CanvasGroup _panelGroup;
        private GameObject _pauseButton;
        private bool _isPaused = false;
        private TMP_FontAsset _premiumFont;
        private Button[] _buttons = new Button[4];

        void Start()
        {
            Invoke(nameof(Setup), 0.4f);
        }

        void Update()
        {
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                if (_isPaused) Resume();
                else Pause();
            }
        }

        private void Setup()
        {
            EnsureEventSystem();
            LoadPremiumFont();
            BuildCanvas();
            BuildPauseButton();
            BuildPausePanel();
        }

        private void LoadPremiumFont()
        {
            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null)
                _premiumFont = TMP_Settings.defaultFontAsset;
        }

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        public void Pause()
        {
            if (_isPaused) return;
            _isPaused = true;

            _panel.SetActive(true);
            _pauseButton.SetActive(false);
            PlayPauseIntro();

            Time.timeScale = 0f;
            Debug.Log("[Pause] Game paused");
        }

        public void Resume()
        {
            if (!_isPaused) return;
            _isPaused = false;

            _panel.SetActive(false);
            _pauseButton.SetActive(true);

            Time.timeScale = 1f;
            Debug.Log("[Pause] Game resumed");
        }

        private void PlayPauseIntro()
        {
            if (_panelGroup == null) return;

            _panelGroup.DOKill();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            Sequence intro = DOTween.Sequence().SetUpdate(true);
            intro.Append(_panelGroup.DOFade(1f, 0.25f).SetEase(Ease.OutQuad));

            for (int i = 0; i < _buttons.Length; i++)
            {
                if (_buttons[i] == null) continue;
                var brt = _buttons[i].GetComponent<RectTransform>();
                var bcg = _buttons[i].GetComponent<CanvasGroup>();
                if (bcg == null) bcg = _buttons[i].gameObject.AddComponent<CanvasGroup>();
                bcg.DOKill();
                bcg.alpha = 0f;

                Vector2 target = brt.anchoredPosition;
                brt.anchoredPosition = target + new Vector2(0, -40f);

                Sequence bs = DOTween.Sequence().SetUpdate(true);
                bs.AppendInterval(0.15f + i * 0.08f);
                bs.Append(bcg.DOFade(1f, 0.25f));
                bs.Join(brt.DOAnchorPos(target, 0.3f).SetEase(Ease.OutBack));
            }

            intro.OnComplete(() =>
            {
                if (_panelGroup != null) _panelGroup.blocksRaycasts = true;
            });
        }

        void OnDestroy()
        {
            Time.timeScale = 1f;
        }
    }
}