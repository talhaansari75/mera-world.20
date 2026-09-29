using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class GameplayPausePanel : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _pauseButton;
        private GameObject _panel;
        private bool _isPaused = false;

        void Start() { Invoke(nameof(Setup), 1.2f); }

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
            BuildCanvas();
            BuildPauseButton();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("PauseCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 800;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPauseButton()
        {
            _pauseButton = new GameObject("PauseBtnRoot");
            _pauseButton.transform.SetParent(_canvas.transform, false);

            var rootRt = _pauseButton.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(1f, 1f);
            rootRt.anchorMax = new Vector2(1f, 1f);
            rootRt.pivot = new Vector2(1f, 1f);
            rootRt.anchoredPosition = new Vector2(-30f, -160f);
            rootRt.sizeDelta = new Vector2(120f, 120f);

            // Bottom shadow
            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(_pauseButton.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.60f, 0.45f, 0.10f), 256, 60);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = Vector2.zero;
            shRt.anchorMax = Vector2.one;
            shRt.offsetMin = Vector2.zero;
            shRt.offsetMax = Vector2.zero;
            shRt.anchoredPosition = new Vector2(0f, -8f);

            // Main button
            var btnObj = new GameObject("PauseBtn");
            btnObj.transform.SetParent(_pauseButton.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.85f, 0.30f), 256, 60);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(Pause);

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 8f);

            // "II" pause icon
            var txtObj = new GameObject("Icon");
            txtObj.transform.SetParent(btnObj.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = "II";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 60;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(0.15f, 0.10f, 0.05f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            var inv = _pauseButton.AddComponent<PauseButtonVisibility>();
            inv.Target = _pauseButton;
        }

        private void BuildPanel()
        {
            _panel = new GameObject("PausePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.92f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title with 3D style
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_panel.transform, false);
            var titleBg = titleObj.AddComponent<Image>();
            titleBg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.70f, 0.50f, 0.15f), 256, 40);
            titleBg.type = Image.Type.Sliced;
            titleBg.color = Color.white;
            titleBg.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0.5f, 0.5f);
            titleRt.anchorMax = new Vector2(0.5f, 0.5f);
            titleRt.pivot = new Vector2(0.5f, 0.5f);
            titleRt.anchoredPosition = new Vector2(0f, 480f);
            titleRt.sizeDelta = new Vector2(500f, 130f);

            var titleTxtObj = new GameObject("Label");
            titleTxtObj.transform.SetParent(titleObj.transform, false);
            var titleTxt = titleTxtObj.AddComponent<Text>();
            titleTxt.text = "PAUSED";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 70;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleCenter;
            titleTxt.raycastTarget = false;
            var titleTxtShadow = titleTxtObj.AddComponent<Shadow>();
            titleTxtShadow.effectColor = new Color(0f, 0f, 0f, 0.65f);
            titleTxtShadow.effectDistance = new Vector2(3f, -3f);
            var ttrt = titleTxtObj.GetComponent<RectTransform>();
            ttrt.anchorMin = Vector2.zero;
            ttrt.anchorMax = Vector2.one;
            ttrt.offsetMin = Vector2.zero;
            ttrt.offsetMax = Vector2.zero;

            CreateBigButton(_panel.transform, "▶  RESUME", new Vector2(0f, 250f),
                new Vector2(600f, 130f), new Color(0.25f, 0.70f, 0.35f), Resume);
            CreateBigButton(_panel.transform, "↻  RESTART", new Vector2(0f, 90f),
                new Vector2(600f, 130f), new Color(0.30f, 0.50f, 0.80f), Restart);
            CreateBigButton(_panel.transform, "⚙  SETTINGS", new Vector2(0f, -70f),
                new Vector2(600f, 130f), new Color(0.45f, 0.35f, 0.65f), OpenSettings);
            CreateBigButton(_panel.transform, "🏠  HOME", new Vector2(0f, -230f),
                new Vector2(600f, 130f), new Color(0.50f, 0.50f, 0.55f), GoHome);

            _panel.SetActive(false);
        }

        public void Pause()
        {
            if (_isPaused) return;
            _isPaused = true;
            _panel.SetActive(true);
            if (_pauseButton != null) _pauseButton.SetActive(false);
            Time.timeScale = 0f;
        }

        public void Resume()
        {
            if (!_isPaused) return;
            _isPaused = false;
            _panel.SetActive(false);
            if (_pauseButton != null) _pauseButton.SetActive(true);
            Time.timeScale = 1f;
        }

        private void Restart()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void OpenSettings()
        {
            Time.timeScale = 1f;
            var s = FindFirstObjectByType<SettingsScreenUI>();
            if (s != null) { s.Show(); _panel.SetActive(false); }
        }

        private void GoHome()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        void OnDestroy() { Time.timeScale = 1f; }

        private void CreateBigButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var rootObj = new GameObject($"Btn_{label}");
            rootObj.transform.SetParent(parent, false);
            var rootRt = rootObj.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(0.5f, 0.5f);
            rootRt.anchorMax = new Vector2(0.5f, 0.5f);
            rootRt.pivot = new Vector2(0.5f, 0.5f);
            rootRt.anchoredPosition = pos;
            rootRt.sizeDelta = size;

            // Shadow layer
            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(rootObj.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(Color.Lerp(color, Color.black, 0.55f), 256, 40);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = Vector2.zero;
            shRt.anchorMax = Vector2.one;
            shRt.offsetMin = Vector2.zero;
            shRt.offsetMax = Vector2.zero;
            shRt.anchoredPosition = new Vector2(0f, -8f);

            // Main button
            var buttonObj = new GameObject("Button");
            buttonObj.transform.SetParent(rootObj.transform, false);
            var btnImg = buttonObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var button = buttonObj.AddComponent<Button>();
            button.onClick.AddListener(onClick);

            var btnRt = buttonObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 8f);

            // Label
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(buttonObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 44;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var outline = textObj.AddComponent<Shadow>();
            outline.effectColor = new Color(0f, 0f, 0f, 0.55f);
            outline.effectDistance = new Vector2(2f, -2f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }

    public class PauseButtonVisibility : MonoBehaviour
    {
        public GameObject Target;
        void Update()
        {
            if (Target != null)
            {
                bool shouldShow = !HomeScreenUI.IsHomeVisible;
                if (Target.activeSelf != shouldShow)
                    Target.SetActive(shouldShow);
            }
        }
    }
}