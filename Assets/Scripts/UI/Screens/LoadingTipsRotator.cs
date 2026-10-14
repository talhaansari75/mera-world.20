using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LoadingTipsRotator : MonoBehaviour
    {
        private Canvas _canvas;
        private Text _tipText;
        private GameObject _tipObj;

        private static readonly string[] Tips = {
            "TIP: Combo bonuses multiply with fast finds!",
            "TIP: Use REVEAL power-up when stuck",
            "TIP: FREEZE pauses the timer for 5 seconds",
            "TIP: Daily streaks give bigger rewards",
            "TIP: Milestone levels give bonus coins",
            "TIP: Boss levels appear every 10 levels!",
            "TIP: Buy hints in the SHOP",
            "TIP: Each theme changes tile colors",
            "TIP: Perfect levels (no hints) give 3 stars",
            "TIP: Watch ads for free coins",
        };

        void Start() { Invoke(nameof(Setup), 0.5f); }

        private void Setup()
        {
            BuildCanvas();
            StartCoroutine(RotateTips());
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("TipsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 8;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            _tipObj = new GameObject("TipText");
            _tipObj.transform.SetParent(_canvas.transform, false);
            _tipText = _tipObj.AddComponent<Text>();
            _tipText.text = Tips[0];
            _tipText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _tipText.fontSize = 22;
            _tipText.fontStyle = FontStyle.Italic;
            _tipText.color = new Color(0.75f, 0.85f, 1f, 0.85f);
            _tipText.alignment = TextAnchor.MiddleCenter;
            _tipText.raycastTarget = false;

            var rt = _tipObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 0f);
            rt.anchorMax = new Vector2(1f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 160f);
            rt.sizeDelta = new Vector2(-40f, 40f);

            var checker = _tipObj.AddComponent<HomeVisibilityCheck>();
            checker.Target = _tipObj;
        }

        private IEnumerator RotateTips()
        {
            int idx = 0;
            while (true)
            {
                yield return new WaitForSecondsRealtime(5f);
                idx = (idx + 1) % Tips.Length;
                if (_tipText != null) _tipText.text = Tips[idx];
            }
        }
    }
}