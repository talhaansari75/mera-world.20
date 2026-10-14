using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Shows a small toast when an achievement is unlocked.
    /// Auto-creates itself and listens to AchievementManager events.
    /// </summary>
    public class AchievementToastUI : MonoBehaviour
    {
        public static AchievementToastUI Instance { get; private set; }

        private Canvas _canvas;
        private readonly Queue<AchievementDefinitions.Achievement> _queue =
            new Queue<AchievementDefinitions.Achievement>();
        private bool _isShowing = false;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            BuildCanvas();

            // Subscribe to achievement unlocks
            if (AchievementManager.Instance != null)
                AchievementManager.Instance.OnAchievementUnlocked += EnqueueToast;

            // If AchievementManager spawns later, poll for it
            InvokeRepeating(nameof(EnsureSubscribed), 0.5f, 1f);
        }

        private bool _subscribed = false;

        private void EnsureSubscribed()
        {
            if (_subscribed) return;
            if (AchievementManager.Instance == null) return;

            AchievementManager.Instance.OnAchievementUnlocked += EnqueueToast;
            _subscribed = true;
            CancelInvoke(nameof(EnsureSubscribed));
            Debug.Log("[Toast] Subscribed to AchievementManager.");
        }

        void OnDestroy()
        {
            if (AchievementManager.Instance != null)
                AchievementManager.Instance.OnAchievementUnlocked -= EnqueueToast;
        }

        // ---------------------------------------------------------------
        // Canvas
        // ---------------------------------------------------------------

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AchievementToastCanvas");
            canvasObj.transform.SetParent(transform, false);

            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 5000;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        // ---------------------------------------------------------------
        // Toast logic
        // ---------------------------------------------------------------

        private void EnqueueToast(AchievementDefinitions.Achievement ach)
        {
            _queue.Enqueue(ach);
            if (!_isShowing) StartCoroutine(ShowToasts());
        }

        private IEnumerator ShowToasts()
        {
            _isShowing = true;
            while (_queue.Count > 0)
            {
                var ach = _queue.Dequeue();
                yield return StartCoroutine(ShowOne(ach));
                yield return new WaitForSeconds(0.3f);
            }
            _isShowing = false;
        }

        private IEnumerator ShowOne(AchievementDefinitions.Achievement ach)
        {
            // Build toast
            var toast = new GameObject("Toast");
            toast.transform.SetParent(_canvas.transform, false);

            var bg = toast.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.15f, 0.45f, 0.75f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var rt = toast.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, 100f); // start above screen
            rt.sizeDelta = new Vector2(900f, 220f);

            // Title
            CreateLabel(toast.transform, "🏆 ACHIEVEMENT UNLOCKED!",
                new Vector2(0f, 55f), 28, new Color(1f, 0.85f, 0.30f));
            CreateLabel(toast.transform, ach.Title,
                new Vector2(0f, 0f), 44, Color.white);
            CreateLabel(toast.transform, ach.Description,
                new Vector2(0f, -50f), 22, new Color(0.85f, 0.90f, 1f));

            // Slide down animation
            float t = 0f;
            float dur = 0.35f;
            Vector2 startPos = new Vector2(0f, 100f);
            Vector2 endPos = new Vector2(0f, -40f);

            while (t < dur)
            {
                t += Time.unscaledDeltaTime;
                float p = t / dur;
                rt.anchoredPosition = Vector2.Lerp(startPos, endPos, EaseOutCubic(p));
                yield return null;
            }
            rt.anchoredPosition = endPos;

            // Wait
            yield return new WaitForSeconds(2.5f);

            // Slide up animation
            t = 0f;
            while (t < dur)
            {
                t += Time.unscaledDeltaTime;
                float p = t / dur;
                rt.anchoredPosition = Vector2.Lerp(endPos, startPos, EaseInCubic(p));
                yield return null;
            }

            Destroy(toast);
        }

        private float EaseOutCubic(float x) => 1f - Mathf.Pow(1f - x, 3f);
        private float EaseInCubic(float x) => x * x * x;

        private void CreateLabel(Transform parent, string text, Vector2 pos, int size, Color color)
        {
            var obj = new GameObject("Label");
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var shadow = obj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(800f, 60f);
        }
    }
}