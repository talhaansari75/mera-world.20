using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

namespace MeraWorld.Core
{
    public static class JuiceEffects
    {
        // 1. UI Particle Burst (Golden Stars)
        public static void PlayWordBurst(Vector3 worldPos, Color color)
        {

            // Create a temporary canvas for particles if it doesn't exist
            var canvas = GameObject.Find("ParticleCanvas")?.GetComponent<Canvas>();
            if (canvas == null)
            {
                var cObj = new GameObject("ParticleCanvas");
                canvas = cObj.AddComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                canvas.sortingOrder = 100;
                cObj.AddComponent<CanvasScaler>();
                cObj.AddComponent<GraphicRaycaster>();
            }

            // Spawn 8 little stars
            for (int i = 0; i < 8; i++)
            {
                var starObj = new GameObject("Star");
                starObj.transform.SetParent(canvas.transform, false);
                var img = starObj.AddComponent<Image>();
                img.sprite = UISpriteFactory.Create3DSphereSprite(color, 32);
                img.raycastTarget = false;

                var rt = starObj.GetComponent<RectTransform>();
                Vector2 screenPos = Camera.main.WorldToScreenPoint(worldPos);
                RectTransformUtility.ScreenPointToLocalPointInRectangle(canvas.GetComponent<RectTransform>(), screenPos, canvas.worldCamera, out Vector2 localPos);
                rt.anchoredPosition = localPos;
                rt.sizeDelta = new Vector2(30f, 30f);

                // Random direction
                Vector2 randomDir = Random.insideUnitCircle.normalized * 150f;
                Vector3 targetPos = rt.anchoredPosition + randomDir;

                // Animate
                float duration = Random.Range(0.4f, 0.8f);
                rt.DOAnchorPos(targetPos, duration).SetEase(Ease.OutQuad);
                img.DOFade(0f, duration).SetEase(Ease.InQuad).OnComplete(() => GameObject.Destroy(starObj));
                starObj.transform.DOScale(0f, duration).SetEase(Ease.InBack);
            }
        }

        // 2. Camera Shake
        public static void ShakeCamera(float duration = 0.3f, float strength = 0.3f)
        {
            var cam = Camera.main;
            if (cam == null) return;

            // Simple shake using DOTween
            cam.transform.DOShakePosition(duration, strength, 20, 90, false, true);
        }
    }
}
