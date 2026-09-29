using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class BannerAdsUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _banner;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildBanner();
            CheckAdsRemoved();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("BannerAdsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 40;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBanner()
        {
            _banner = new GameObject("BannerAd");
            _banner.transform.SetParent(_canvas.transform, false);

            var bg = _banner.AddComponent<Image>();
            bg.color = new Color(0.15f, 0.15f, 0.20f, 0.95f);

            var rt = _banner.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 0f);
            rt.anchorMax = new Vector2(1f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(0f, 120f);

            // Label
            var textObj = new GameObject("AdText");
            textObj.transform.SetParent(_banner.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "AD SPACE  •  Remove with SHOP";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 28;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(0.7f, 0.7f, 0.8f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void CheckAdsRemoved()
        {
            if (PlayerPrefs.GetInt("RemoveAds", 0) == 1)
            {
                _banner.SetActive(false);
                Debug.Log("[Ads] Removed - hidden");
            }
            else
            {
                _banner.SetActive(true);
            }
        }
    }
}