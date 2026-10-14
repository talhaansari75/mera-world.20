using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class AdsManager
    {
        private IEnumerator InterstitialCountdownRoutine()
        {
            float duration = 5f;
            float elapsed = 0f;

            var closeBtn = _interstitialPanel.transform.Find("CloseBtn")?.GetComponent<Button>();
            var closeLabel = closeBtn?.GetComponentInChildren<Text>();

            if (closeBtn != null)
            {
                closeBtn.interactable = false;
                var img = closeBtn.GetComponent<Image>();
                if (img != null) img.color = new Color(0.5f, 0.5f, 0.5f, 0.7f);
            }

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                int remaining = Mathf.CeilToInt(duration - elapsed);

                if (_interstitialCountdown != null)
                    _interstitialCountdown.text = remaining.ToString();

                if (closeLabel != null)
                    closeLabel.text = "CLOSE AD (" + remaining + ")";

                yield return null;
            }

            if (_interstitialCountdown != null) _interstitialCountdown.text = "0";
            if (closeBtn != null)
            {
                closeBtn.interactable = true;
                var img = closeBtn.GetComponent<Image>();
                if (img != null) img.color = new Color(0.25f, 0.70f, 0.35f);
            }
            if (closeLabel != null) closeLabel.text = "CLOSE AD";
        }

        private IEnumerator RewardedRoutine()
        {
            float duration = 5f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                yield return null;
            }

            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(_pendingRewardAmount);

            _lastRewardedTime = Time.unscaledTime;
            OnRewardedCoinsEarned?.Invoke(_pendingRewardAmount);

            Debug.Log("[Ads] Rewarded +" + _pendingRewardAmount + " coins");

            _rewardedPanel.SetActive(false);
        }
    }
}