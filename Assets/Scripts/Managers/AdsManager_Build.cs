using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class AdsManager
    {
        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AdsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 900;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildInterstitialPanel()
        {
            _interstitialPanel = new GameObject("InterstitialPanel");
            _interstitialPanel.transform.SetParent(_canvas.transform, false);

            var bg = _interstitialPanel.AddComponent<Image>();
            bg.color = new Color(0.05f, 0.05f, 0.10f, 1f);

            var rt = _interstitialPanel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_interstitialPanel.transform, "ADVERTISEMENT",
                new Vector2(0f, 700f), 40, new Color(0.70f, 0.70f, 0.80f), FontStyle.Bold);

            var boxObj = new GameObject("AdBox");
            boxObj.transform.SetParent(_interstitialPanel.transform, false);
            var boxImg = boxObj.AddComponent<Image>();
            boxImg.color = new Color(0.15f, 0.18f, 0.28f);
            var boxRt = boxObj.GetComponent<RectTransform>();
            boxRt.anchorMin = new Vector2(0.5f, 0.5f);
            boxRt.anchorMax = new Vector2(0.5f, 0.5f);
            boxRt.pivot = new Vector2(0.5f, 0.5f);
            boxRt.anchoredPosition = new Vector2(0f, 100f);
            boxRt.sizeDelta = new Vector2(800f, 900f);

            var boxTextObj = new GameObject("BoxText");
            boxTextObj.transform.SetParent(boxObj.transform, false);
            var boxText = boxTextObj.AddComponent<Text>();
            boxText.text = "YOUR AD\nHERE";
            boxText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            boxText.fontSize = 80;
            boxText.fontStyle = FontStyle.Bold;
            boxText.color = new Color(0.4f, 0.5f, 0.7f);
            boxText.alignment = TextAnchor.MiddleCenter;
            boxText.raycastTarget = false;
            var btRt = boxTextObj.GetComponent<RectTransform>();
            btRt.anchorMin = Vector2.zero;
            btRt.anchorMax = Vector2.one;
            btRt.offsetMin = Vector2.zero;
            btRt.offsetMax = Vector2.zero;

            _interstitialCountdown = CreateText(_interstitialPanel.transform, "5",
                new Vector2(0f, -420f), 60, new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            var closeBtnObj = new GameObject("CloseBtn");
            closeBtnObj.transform.SetParent(_interstitialPanel.transform, false);
            var closeImg = closeBtnObj.AddComponent<Image>();
            closeImg.color = new Color(0.5f, 0.5f, 0.5f, 0.7f);
            var closeBtn = closeBtnObj.AddComponent<Button>();
            closeBtn.interactable = false;
            closeBtn.onClick.AddListener(() =>
            {
                if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                _interstitialPanel.SetActive(false);
                Time.timeScale = 1f;
            });
            var closeRt = closeBtnObj.GetComponent<RectTransform>();
            closeRt.anchorMin = new Vector2(0.5f, 0f);
            closeRt.anchorMax = new Vector2(0.5f, 0f);
            closeRt.pivot = new Vector2(0.5f, 0f);
            closeRt.anchoredPosition = new Vector2(0f, 100f);
            closeRt.sizeDelta = new Vector2(500f, 120f);

            var closeLabelObj = new GameObject("Label");
            closeLabelObj.transform.SetParent(closeBtnObj.transform, false);
            var closeLabel = closeLabelObj.AddComponent<Text>();
            closeLabel.text = "CLOSE AD (5)";
            closeLabel.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            closeLabel.fontSize = 40;
            closeLabel.fontStyle = FontStyle.Bold;
            closeLabel.color = Color.white;
            closeLabel.alignment = TextAnchor.MiddleCenter;
            closeLabel.raycastTarget = false;
            var clRt = closeLabelObj.GetComponent<RectTransform>();
            clRt.anchorMin = Vector2.zero;
            clRt.anchorMax = Vector2.one;
            clRt.offsetMin = Vector2.zero;
            clRt.offsetMax = Vector2.zero;

            _interstitialPanel.SetActive(false);
        }

        private void BuildRewardedPanel()
        {
            _rewardedPanel = new GameObject("RewardedPanel");
            _rewardedPanel.transform.SetParent(_canvas.transform, false);

            var bg = _rewardedPanel.AddComponent<Image>();
            bg.color = new Color(0.05f, 0.05f, 0.10f, 1f);

            var rt = _rewardedPanel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_rewardedPanel.transform, "REWARDED AD",
                new Vector2(0f, 700f), 50, new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateText(_rewardedPanel.transform, "Watch to earn " + RewardedCoinsAmount + " coins",
                new Vector2(0f, 580f), 32, new Color(0.80f, 0.85f, 1f), FontStyle.Normal);

            var boxObj = new GameObject("RewardedBox");
            boxObj.transform.SetParent(_rewardedPanel.transform, false);
            var boxImg = boxObj.AddComponent<Image>();
            boxImg.color = new Color(0.20f, 0.15f, 0.25f);
            var boxRt = boxObj.GetComponent<RectTransform>();
            boxRt.anchorMin = new Vector2(0.5f, 0.5f);
            boxRt.anchorMax = new Vector2(0.5f, 0.5f);
            boxRt.pivot = new Vector2(0.5f, 0.5f);
            boxRt.anchoredPosition = new Vector2(0f, 50f);
            boxRt.sizeDelta = new Vector2(800f, 800f);

            var boxTextObj = new GameObject("BoxText");
            boxTextObj.transform.SetParent(boxObj.transform, false);
            var boxText = boxTextObj.AddComponent<Text>();
            boxText.text = "VIDEO\nPLAYS HERE";
            boxText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            boxText.fontSize = 70;
            boxText.fontStyle = FontStyle.Bold;
            boxText.color = new Color(0.5f, 0.4f, 0.7f);
            boxText.alignment = TextAnchor.MiddleCenter;
            boxText.raycastTarget = false;
            var btRt = boxTextObj.GetComponent<RectTransform>();
            btRt.anchorMin = Vector2.zero;
            btRt.anchorMax = Vector2.one;
            btRt.offsetMin = Vector2.zero;
            btRt.offsetMax = Vector2.zero;

            CreateText(_rewardedPanel.transform, "Simulating 5-second ad...",
                new Vector2(0f, -450f), 28, new Color(0.65f, 0.70f, 0.85f), FontStyle.Italic);

            _rewardedPanel.SetActive(false);
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = style;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.supportRichText = true;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }
    }
}