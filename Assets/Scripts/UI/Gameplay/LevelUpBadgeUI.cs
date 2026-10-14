using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class LevelUpBadgeUI : MonoBehaviour
    {
        [Header("References")]
        public WinScreenUI WinScreen;
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _badge;
        private CanvasGroup _badgeGroup;
        private TMP_FontAsset _premiumFont;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 0.8f);
        }

        private void Setup()
        {
            if (WinScreen == null) WinScreen = FindFirstObjectByType<WinScreenUI>();

            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null) _premiumFont = TMP_Settings.defaultFontAsset;

            BuildCanvas();
            BuildBadge();

            if (SelectionManager.Instance != null)
                MeraWorld.Core.SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LevelUpBadgeCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 350;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBadge()
        {
            _badge = new GameObject("Badge");
            _badge.transform.SetParent(_canvas.transform, false);

            // Premium gold 3D sprite
            var bg = _badge.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.82f, 0.30f), 512, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            _badgeGroup = _badge.AddComponent<CanvasGroup>();
            _badgeGroup.alpha = 0f;
            _badgeGroup.blocksRaycasts = false;

            var rt = _badge.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 780f);
            rt.sizeDelta = new Vector2(520f, 140f);

            // Inner dark purple border for depth
            var innerObj = new GameObject("InnerBorder");
            innerObj.transform.SetParent(_badge.transform, false);
            var innerImg = innerObj.AddComponent<Image>();
            innerImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.55f, 0.20f, 0.10f), 512, 40);
            innerImg.type = Image.Type.Sliced;
            innerImg.raycastTarget = false;
            var irt = innerObj.GetComponent<RectTransform>();
            irt.anchorMin = Vector2.zero;
            irt.anchorMax = Vector2.one;
            irt.offsetMin = new Vector2(6f, 6f);
            irt.offsetMax = new Vector2(-6f, -6f);

            // Text with gold gradient
            var textObj = new GameObject("Text");
            textObj.transform.SetParent(_badge.transform, false);
            var txt = textObj.AddComponent<TextMeshProUGUI>();
            txt.text = "PERFECT!";
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = 72;
            txt.fontStyle = FontStyles.Bold;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;
            txt.enableVertexGradient = true;
            txt.colorGradient = new VertexGradient(
                new Color(1f, 1f, 1f),
                new Color(1f, 1f, 1f),
                new Color(1f, 0.85f, 0.35f),
                new Color(1f, 0.85f, 0.35f)
            );
            txt.outlineWidth = 0.25f;
            txt.outlineColor = new Color32(80, 30, 0, 255);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            _badge.SetActive(false);
        }

        private void OnLevelComplete()
        {
            if (WinScreen != null && WinScreen.HintsUsed == 0)
            {
                StartCoroutine(ShowBadge());
            }
        }

        private IEnumerator ShowBadge()
        {
            if (_badge == null || this == null || gameObject == null) yield break;

            yield return new WaitForSecondsRealtime(0.5f);

            _badge.SetActive(true);
            var rt = _badge.GetComponent<RectTransform>();

            // DOTween pop-in
            _badgeGroup.DOKill();
            rt.DOKill();
            _badgeGroup.alpha = 0f;
            rt.localScale = Vector3.one * 0.3f;

            Sequence seq = DOTween.Sequence();
            seq.Append(rt.DOScale(1.2f, 0.25f).SetEase(Ease.OutBack));
            seq.Join(_badgeGroup.DOFade(1f, 0.2f));
            seq.Append(rt.DOScale(1f, 0.15f).SetEase(Ease.OutQuad));

            yield return new WaitForSecondsRealtime(2.5f);

            _badgeGroup.DOFade(0f, 0.3f);
            yield return new WaitForSecondsRealtime(0.3f);
            _badge.SetActive(false);
        }

        void OnDestroy()
        {
            if (SelectionManager.Instance != null)
                MeraWorld.Core.SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}