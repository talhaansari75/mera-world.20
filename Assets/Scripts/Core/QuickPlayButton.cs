using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class QuickPlayButton : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _button;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 1.3f);
        }

        private void Setup() { BuildCanvas(); BuildButton(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("QuickPlayCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 515;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildButton()
        {
            _button = new GameObject("QuickPlayBtn");
            _button.transform.SetParent(_canvas.transform, false);

            var img = _button.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.20f, 0.65f, 0.85f), 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = _button.AddComponent<Button>();
            btn.onClick.AddListener(OnQuickPlay);

            var rt = _button.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -140f);
            rt.sizeDelta = new Vector2(700f, 100f);

            int currentLevel = Progress != null ? Progress.HighestLevelUnlocked : 1;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(_button.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = $"▶  CONTINUE  •  LEVEL {currentLevel}";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            // Hide when not home
            var checker = _button.AddComponent<HomeVisibilityCheck>();
            checker.Target = _button;
        }

        private void OnQuickPlay()
        {
            int level = Progress != null ? Progress.HighestLevelUnlocked : 1;

            if (Progress != null) Progress.SetCurrentLevel(level);
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", level);
                PlayerPrefs.Save();
            }

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayButtonClick();

            Debug.Log($"[QuickPlay] Level {level}");
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }
    }
}