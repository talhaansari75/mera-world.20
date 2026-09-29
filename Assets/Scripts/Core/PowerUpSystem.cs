using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class PowerUpSystem : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private readonly Dictionary<string, int> _counts = new Dictionary<string, int>();

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();

            LoadCounts();
            Invoke(nameof(Setup), 0.8f);
        }

        private void LoadCounts()
        {
            _counts["reveal"] = PlayerPrefs.GetInt("PU_Reveal", 3);
            _counts["freeze"] = PlayerPrefs.GetInt("PU_Freeze", 3);
            _counts["shuffle"] = PlayerPrefs.GetInt("PU_Shuffle", 3);
        }

        private void SaveCounts()
        {
            PlayerPrefs.SetInt("PU_Reveal", _counts["reveal"]);
            PlayerPrefs.SetInt("PU_Freeze", _counts["freeze"]);
            PlayerPrefs.SetInt("PU_Shuffle", _counts["shuffle"]);
            PlayerPrefs.Save();
        }

        private void Setup()
        {
            BuildCanvas();
            BuildButtons();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("PowerUpCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 63;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildButtons()
        {
            float y = 350f;
            float spacing = 130f;

            CreatePowerUpButton("REVEAL", "reveal", new Vector2(0f, y), new Color(0.30f, 0.65f, 0.90f), "Show a word");
            CreatePowerUpButton("FREEZE", "freeze", new Vector2(0f, y - spacing), new Color(0.45f, 0.75f, 0.95f), "Pause timer");
            CreatePowerUpButton("SHUFFLE", "shuffle", new Vector2(0f, y - spacing * 2), new Color(0.85f, 0.55f, 0.90f), "Reshuffle grid");
        }

        private void CreatePowerUpButton(string label, string key, Vector2 pos, Color color, string tooltip)
        {
            var btnObj = new GameObject($"PU_{label}");
            btnObj.transform.SetParent(_canvas.transform, false);

            var img = btnObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(() => UsePowerUp(key));

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 110f);

            // Icon circle
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(btnObj.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.sprite = UISpriteFactory.Create3DSphereSprite(color, 64);
            iconImg.raycastTarget = false;
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(15f, 0f);
            iconRt.sizeDelta = new Vector2(70f, 70f);

            // Label
            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(btnObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 26;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = Color.white;
            labelTxt.alignment = TextAnchor.MiddleCenter;
            labelTxt.raycastTarget = false;
            var labelRt = labelObj.GetComponent<RectTransform>();
            labelRt.anchorMin = new Vector2(0f, 0.5f);
            labelRt.anchorMax = new Vector2(1f, 1f);
            labelRt.offsetMin = new Vector2(95f, 0f);
            labelRt.offsetMax = Vector2.zero;

            // Count
            var countObj = new GameObject("Count");
            countObj.transform.SetParent(btnObj.transform, false);
            var countTxt = countObj.AddComponent<Text>();
            countTxt.text = $"x{_counts[key]}";
            countTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            countTxt.fontSize = 30;
            countTxt.fontStyle = FontStyle.Bold;
            countTxt.color = new Color(1f, 0.95f, 0.55f);
            countTxt.alignment = TextAnchor.MiddleCenter;
            countTxt.raycastTarget = false;
            var countRt = countObj.GetComponent<RectTransform>();
            countRt.anchorMin = new Vector2(0f, 0f);
            countRt.anchorMax = new Vector2(1f, 0.5f);
            countRt.offsetMin = new Vector2(95f, 0f);
            countRt.offsetMax = Vector2.zero;

            // Store for updates
            btnObj.name = $"PU_{key}_{_counts[key]}";
        }

        public void UsePowerUp(string key)
        {
            if (_counts[key] <= 0)
            {
                Debug.Log($"[PowerUp] No {key} left");
                if (Sound != null) Sound.PlayWordInvalid();
                return;
            }

            _counts[key]--;
            SaveCounts();

            if (Sound != null) Sound.PlayWordFound();

            switch (key)
            {
                case "reveal":
                    RevealRandomWord();
                    break;
                case "freeze":
                    FreezeTimer();
                    break;
                case "shuffle":
                    ShuffleGrid();
                    break;
            }

            Debug.Log($"[PowerUp] Used {key}, {_counts[key]} remaining");

            // Refresh button
            RefreshButtons();
        }

        private void RevealRandomWord()
        {
            if (SelectionManager == null) return;
            var word = SelectionManager.GetRandomUnfoundWord();
            if (!string.IsNullOrEmpty(word))
                SelectionManager.HintWord(word);
        }

        private void FreezeTimer()
        {
            StartCoroutine(FreezeRoutine());
        }

        private IEnumerator FreezeRoutine()
        {
            var timers = FindObjectsByType<LevelTimerUI>(FindObjectsSortMode.None);
            foreach (var t in timers) t.enabled = false;

            ShowBanner("TIMER FROZEN!", new Color(0.30f, 0.65f, 0.90f));
            yield return new WaitForSecondsRealtime(5f);

            foreach (var t in timers) t.enabled = true;
        }

        private void ShuffleGrid()
        {
            ShowBanner("SHUFFLE!", new Color(0.85f, 0.55f, 0.90f));

            // Visual flash effect
            var tiles = FindObjectsByType<LetterTile>(FindObjectsSortMode.None);
            foreach (var t in tiles)
            {
                var sr = t.GetComponent<SpriteRenderer>();
                if (sr != null) StartCoroutine(FlashTile(sr));
            }
        }

        private IEnumerator FlashTile(SpriteRenderer sr)
        {
            Color original = sr.color;
            sr.color = Color.white;
            yield return new WaitForSeconds(0.15f);
            sr.color = original;
        }

        private void ShowBanner(string text, Color color)
        {
            var bannerObj = new GameObject("PU_Banner");
            bannerObj.transform.SetParent(_canvas.transform, false);

            var img = bannerObj.AddComponent<Image>();
            img.color = new Color(color.r, color.g, color.b, 0.95f);

            var rt = bannerObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(700f, 180f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(bannerObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 60;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            StartCoroutine(FadeBanner(bannerObj));
        }

        private IEnumerator FadeBanner(GameObject banner)
        {
            yield return new WaitForSecondsRealtime(1.5f);

            float duration = 0.4f;
            float elapsed = 0f;
            var img = banner.GetComponent<Image>();

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                var c = img.color; c.a = 0.95f * (1f - t); img.color = c;
                yield return null;
            }

            if (banner != null) Destroy(banner);
        }

        private void RefreshButtons()
        {
            // Destroy and rebuild
            foreach (Transform child in _canvas.transform)
            {
                if (child.name.StartsWith("PU_") && child.GetComponent<Button>() != null)
                    Destroy(child.gameObject);
            }
            Invoke(nameof(BuildButtons), 0.1f);
        }

        public void AddPowerUp(string key, int amount)
        {
            if (!_counts.ContainsKey(key)) _counts[key] = 0;
            _counts[key] += amount;
            SaveCounts();
            RefreshButtons();
        }
    }
}