using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class MultiplayerMenuUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private Text _statusText;
        private Text _timerText;
        private Button _findMatchButton;
        private GameObject _searchingPanel;
        private bool _isOnline = false;

        void Start()
        {
            Invoke(nameof(Setup), 1f);
        }

        private void OnEnable()
        {
            InternetChecker.OnStatusChanged += HandleOnlineStatusChanged;
        }

        private void OnDisable()
        {
            InternetChecker.OnStatusChanged -= HandleOnlineStatusChanged;
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
            RefreshOnlineState();
        }

        private void RefreshOnlineState()
        {
            _isOnline = InternetChecker.QuickCheck();

            if (!_isOnline)
            {
                if (_statusText != null)
                    _statusText.text = "You are OFFLINE.\nMultiplayer requires internet.";

                if (_findMatchButton != null)
                {
                    _findMatchButton.interactable = false;
                    var img = _findMatchButton.GetComponent<Image>();
                    if (img != null)
                    {
                        img.sprite = UISpriteFactory.Create3DButtonSprite(
                            new Color(0.30f, 0.30f, 0.35f), 256, 40);
                        img.type = Image.Type.Sliced;
                    }
                }
            }
            else
            {
                if (_statusText != null)
                    _statusText.text = "You are ONLINE.";

                if (_findMatchButton != null)
                {
                    _findMatchButton.interactable = true;
                    var img = _findMatchButton.GetComponent<Image>();
                    if (img != null)
                    {
                        img.sprite = UISpriteFactory.Create3DButtonSprite(
                            new Color(0.55f, 0.25f, 0.85f), 256, 40);
                        img.type = Image.Type.Sliced;
                    }
                }
            }

            StartCoroutine(VerifyInBackground());
        }

        public void Show()
        {
            if (_panel != null) _panel.SetActive(true);
            RefreshOnlineState();
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
            if (MatchmakingManager.Instance != null)
                MatchmakingManager.Instance.CancelMatchmaking();
        }
    }
}