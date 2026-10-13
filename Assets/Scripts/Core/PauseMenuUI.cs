using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class PauseMenuUI : MonoBehaviour
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

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("PauseCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 250;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPauseButton()
        {
            _pauseButton = new GameObject("PauseButton");
            _pauseButton.transform.SetParent(_canvas.transform, false);

            var img = _pauseButton.AddComponent<Image>();

            Sprite premiumPause = Resources.Load<Sprite>("UI/Premium/btn_pause");
            if (premiumPause != null)
            {
                img.sprite = premiumPause;
                img.color = Color.white;
                Debug.Log("[Pause] Premium pause button loaded!");
            }
            else
            {
                // 3D bevel button
                img.sprite = UISpriteFactory.Create3DButtonSprite(
                    new Color(1f, 0.85f, 0.30f), 256, 20);
                img.type = Image.Type.Sliced;
                img.color = Color.white;
            }

            var btn = _pauseButton.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(Pause);

            var rt = _pauseButton.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 1f);
            rt.anchoredPosition = new Vector2(-30f, -130f);
            rt.sizeDelta = new Vector2(120f, 120f);

            // Pause icon (two vertical bars)
            var bar1 = new GameObject("Bar1");
            bar1.transform.SetParent(_pauseButton.transform, false);
            var img1 = bar1.AddComponent<Image>();
            img1.color = new Color(0.95f, 0.75f, 0.25f);
            img1.raycastTarget = false;
            var rt1 = bar1.GetComponent<RectTransform>();
            rt1.anchorMin = new Vector2(0.5f, 0.5f);
            rt1.anchorMax = new Vector2(0.5f, 0.5f);
            rt1.pivot = new Vector2(0.5f, 0.5f);
            rt1.anchoredPosition = new Vector2(-18f, 0f);
            rt1.sizeDelta = new Vector2(16f, 60f);

            var bar2 = new GameObject("Bar2");
            bar2.transform.SetParent(_pauseButton.transform, false);
            var img2 = bar2.AddComponent<Image>();
            img2.color = new Color(0.95f, 0.75f, 0.25f);
            img2.raycastTarget = false;
            var rt2 = bar2.GetComponent<RectTransform>();
            rt2.anchorMin = new Vector2(0.5f, 0.5f);
            rt2.anchorMax = new Vector2(0.5f, 0.5f);
            rt2.pivot = new Vector2(0.5f, 0.5f);
            rt2.anchoredPosition = new Vector2(18f, 0f);
            rt2.sizeDelta = new Vector2(16f, 60f);
        }

        private void BuildPausePanel()
        {
            _panel = new GameObject("PausePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.88f);
            bg.raycastTarget = true;

            _panelGroup = _panel.AddComponent<CanvasGroup>();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // === Center 3D panel with gold frame ===
            BuildCenterPanel(_panel.transform);

            _panel.SetActive(false);
        }

        private void BuildCenterPanel(Transform parent)
        {
            var centerPanel = new GameObject("CenterPanel");
            centerPanel.transform.SetParent(parent, false);

            // Gold border (behind)
            var borderObj = new GameObject("GoldBorder");
            borderObj.transform.SetParent(centerPanel.transform, false);
            var borderImg = borderObj.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.85f, 0.55f, 0.10f), 512, 30);
            borderImg.type = Image.Type.Sliced;
            borderImg.raycastTarget = false;

            var brt = borderObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(720f, 960f);

            // Dark purple panel (on top)
            var panelObj = new GameObject("PanelBG");
            panelObj.transform.SetParent(centerPanel.transform, false);
            var panelImg = panelObj.AddComponent<Image>();
            panelImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.10f, 0.04f, 0.20f), 512, 30);
            panelImg.type = Image.Type.Sliced;
            panelImg.raycastTarget = false;

            var prt = panelObj.GetComponent<RectTransform>();
            prt.anchorMin = new Vector2(0.5f, 0.5f);
            prt.anchorMax = new Vector2(0.5f, 0.5f);
            prt.pivot = new Vector2(0.5f, 0.5f);
            prt.anchoredPosition = Vector2.zero;
            prt.sizeDelta = new Vector2(700f, 940f);

            // === PAUSED TITLE (TMP + gold gradient) ===
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(centerPanel.transform, false);

            var titleTxt = titleObj.AddComponent<TextMeshProUGUI>();
            titleTxt.text = "PAUSED";
            if (_premiumFont != null) titleTxt.font = _premiumFont;
            titleTxt.fontSize = 100;
            titleTxt.fontStyle = FontStyles.Bold;
            titleTxt.alignment = TextAlignmentOptions.Center;
            titleTxt.raycastTarget = false;
            titleTxt.enableVertexGradient = true;
            titleTxt.colorGradient = new VertexGradient(
                new Color(1.0f, 0.98f, 0.60f),
                new Color(1.0f, 0.98f, 0.60f),
                new Color(0.95f, 0.55f, 0.08f),
                new Color(0.95f, 0.55f, 0.08f)
            );
            titleTxt.outlineWidth = 0.28f;
            titleTxt.outlineColor = new Color32(70, 25, 0, 255);

            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 0.5f);
            trt.anchorMax = new Vector2(0.5f, 0.5f);
            trt.pivot = new Vector2(0.5f, 0.5f);
            trt.anchoredPosition = new Vector2(0f, 360f);
            trt.sizeDelta = new Vector2(600f, 160f);

            // === 3D BUTTONS (no emojis â€” clean text) ===
            _buttons[0] = Create3DButton(centerPanel.transform, "RESUME",
                new Vector2(0f, 160f), new Vector2(560f, 130f),
                new Color(0.20f, 0.65f, 0.25f), Resume);

            _buttons[1] = Create3DButton(centerPanel.transform, "RESTART",
                new Vector2(0f, 0f), new Vector2(560f, 130f),
                new Color(0.20f, 0.45f, 0.80f), Restart);

            _buttons[2] = Create3DButton(centerPanel.transform, "SETTINGS",
                new Vector2(0f, -160f), new Vector2(560f, 130f),
                new Color(0.50f, 0.30f, 0.70f), OpenSettings);

            _buttons[3] = Create3DButton(centerPanel.transform, "HOME",
                new Vector2(0f, -320f), new Vector2(560f, 130f),
                new Color(0.35f, 0.35f, 0.42f), GoHome);
        }

        // === 3D Bevel Button with shadow + highlight ===
        private Button Create3DButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color baseColor, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Button_{label}");
            obj.transform.SetParent(parent, false);

            // Shadow (behind)
            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(obj.transform, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(baseColor.r * 0.3f, baseColor.g * 0.3f, baseColor.b * 0.3f), 256, 20);
            shadowImg.type = Image.Type.Sliced;
            shadowImg.raycastTarget = false;
            var shr = shadowObj.GetComponent<RectTransform>();
            shr.anchorMin = Vector2.zero;
            shr.anchorMax = Vector2.one;
            shr.offsetMin = new Vector2(0f, -12f);
            shr.offsetMax = new Vector2(0f, -12f);

            // Main button
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(baseColor, 256, 20);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            // Label (TMP)
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);

            var txt = textObj.AddComponent<TextMeshProUGUI>();
            txt.text = label;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = 55;
            txt.fontStyle = FontStyles.Bold;
            txt.color = Color.white;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;
            txt.outlineWidth = 0.2f;
            txt.outlineColor = new Color32(0, 0, 0, 200);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            // Top glossy highlight
            var highlightObj = new GameObject("Highlight");
            highlightObj.transform.SetParent(obj.transform, false);
            var highlightImg = highlightObj.AddComponent<Image>();
            highlightImg.color = new Color(1f, 1f, 1f, 0.15f);
            highlightImg.raycastTarget = false;
            var hrt = highlightObj.GetComponent<RectTransform>();
            hrt.anchorMin = new Vector2(0.05f, 0.65f);
            hrt.anchorMax = new Vector2(0.95f, 0.92f);
            hrt.offsetMin = Vector2.zero;
            hrt.offsetMax = Vector2.zero;

            return btn;
        }

        // ===================== ACTIONS =====================

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

            // Use unscaled time (Time.timeScale = 0)
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

        private void Restart()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();
            Debug.Log("[Pause] Restarting level");
            // SceneManager.LoadScene(...) DISABLED - in-place restart
            // In-place restart: regenerate grid, reset UI
            var gm = FindFirstObjectByType<GameManager>();
            if (gm != null) gm.ReloadFromProgress();
            var gv = FindFirstObjectByType<GridVisualizer>();
            if (gv != null) gv.BuildVisuals();
            var wl = FindFirstObjectByType<WordListUI>();
            if (wl != null) wl.ForceRebuild();
            // Reset SelectionManager state (found words, grid ref, tiles)
            var sm = FindFirstObjectByType<SelectionManager>();
            if (sm != null) sm.ResetProgress();
            Debug.Log("[Pause] In-place restart complete");
            if (_pauseButton != null && _pauseButton.scene.IsValid())
            {
                _pauseButton.SetActive(true);
                Debug.Log("[Pause] Pause button restored (cached ref)");
            }
            else
            {
                // Fallback: dhoondh ke restore karo
                var found = GameObject.Find("PauseButton");
                if (found != null)
                {
                    _pauseButton = found;
                    found.SetActive(true);
                    Debug.Log("[Pause] Pause button re-found and enabled");
                }
                else
                {
                    Debug.LogError("[Pause] Pause button COMPLETELY GONE - cannot restore");
                }
            }
            if (_panel != null) _panel.SetActive(false);
            _isPaused = false;
        }

        private void OpenSettings()
        {
            Time.timeScale = 1f;
            var settings = FindFirstObjectByType<SettingsScreenUI>();
            if (settings != null)
            {
                settings.Show();
                _panel.SetActive(false);
            }
            else
            {
                Debug.LogWarning("[Pause] SettingsScreenUI not found");
            }
        }

        private void GoHome()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();
            Debug.Log("[Pause] Returning to home");
            HomeScreenUI.ForceShowHome();
            // SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex); // DISABLED - blank screen fix
            if (_panel != null) _panel.SetActive(false);
            if (_pauseButton != null) _pauseButton.SetActive(true);  // restore button
            _isPaused = false;  // reset pause state - CRITICAL
            _isPaused = false;  // reset pause state
        }

        void OnDestroy()
        {
            Time.timeScale = 1f;
        }
    }
}

