using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class HomeStatsAnimationUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Text _coinsText;
        private Text _starsText;
        private int _lastCoins = -1;
        private int _lastStars = -1;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(FindAndHook), 1.0f);
        }

        private void FindAndHook()
        {
            var allTexts = FindObjectsByType<Text>(FindObjectsSortMode.None);
            foreach (var t in allTexts)
            {
                if (t.text != null && t.text.EndsWith("coins")) _coinsText = t;
                if (t.text != null && t.text.EndsWith("stars")) _starsText = t;
            }
        }

        void Update()
        {
            if (Progress == null) return;

            if (_lastCoins < 0) _lastCoins = Progress.Coins;
            if (_lastStars < 0) _lastStars = Progress.TotalStars;

            if (Progress.Coins != _lastCoins && _coinsText != null)
            {
                _lastCoins = Progress.Coins;
                StartCoroutine(PunchText(_coinsText));
            }

            if (Progress.TotalStars != _lastStars && _starsText != null)
            {
                _lastStars = Progress.TotalStars;
                StartCoroutine(PunchText(_starsText));
            }
        }

        private IEnumerator PunchText(Text txt)
        {
            if (txt == null) yield break;
            var rt = txt.GetComponent<RectTransform>();
            if (rt == null) yield break;

            float duration = 0.35f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float scale = 1f + Mathf.Sin(t * Mathf.PI) * 0.30f;
                rt.localScale = new Vector3(scale, scale, 1f);
                yield return null;
            }
            rt.localScale = Vector3.one;
        }
    }
}