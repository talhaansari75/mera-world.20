using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class BackgroundMusicUI : MonoBehaviour
    {
        private Canvas _canvas;
        private Text _musicIcon;

        private const string KEY_MUSIC = "Settings_Music";

        void Start()
        {
            Invoke(nameof(Setup), 0.8f);
        }

        private void Setup()
        {
            BuildCanvas();
            UpdateIcon();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("MusicIconCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 44;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var iconObj = new GameObject("MusicIcon");
            iconObj.transform.SetParent(_canvas.transform, false);

            _musicIcon = iconObj.AddComponent<Text>();
            _musicIcon.text = "MUSIC ON";
            _musicIcon.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _musicIcon.fontSize = 20;
            _musicIcon.fontStyle = FontStyle.Bold;
            _musicIcon.color = new Color(0.65f, 1f, 0.65f);
            _musicIcon.alignment = TextAnchor.MiddleCenter;
            _musicIcon.raycastTarget = false;

            var rt = iconObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 0f);
            rt.anchorMax = new Vector2(1f, 0f);
            rt.pivot = new Vector2(1f, 0f);
            rt.anchoredPosition = new Vector2(-20f, 20f);
            rt.sizeDelta = new Vector2(220f, 40f);
        }

        private void UpdateIcon()
        {
            bool musicOn = PlayerPrefs.GetInt(KEY_MUSIC, 1) == 1;
            if (_musicIcon != null)
            {
                _musicIcon.text = musicOn ? "MUSIC ON" : "MUSIC OFF";
                _musicIcon.color = musicOn
                    ? new Color(0.65f, 1f, 0.65f)
                    : new Color(0.6f, 0.6f, 0.6f);
            }
        }

        void Update()
        {
            UpdateIcon();
        }
    }
}