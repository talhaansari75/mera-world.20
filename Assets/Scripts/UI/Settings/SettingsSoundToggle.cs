using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SettingsSoundToggle : MonoBehaviour
    {
        private Canvas _canvas;

        void Start()
        {
            Invoke(nameof(Setup), 0.7f);
        }

        private void Setup()
        {
            BuildCanvas();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SettingsSoundCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 750;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        public void PlayTestSound()
        {
            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayWordFound();
        }
    }
}