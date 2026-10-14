using System;
using System.Collections;
using UnityEngine;

namespace MeraWorld.Core
{
    public partial class SpinWheelUI
    {
        private void OnSpin()
        {
            if (_isSpinning || !CanSpinToday()) return;
            StartCoroutine(SpinRoutine());
        }

        private IEnumerator SpinRoutine()
        {
            _isSpinning = true;
            if (_spinButton != null) _spinButton.interactable = false;
            if (_resultText != null) _resultText.text = "";

            int rewardIndex = UnityEngine.Random.Range(0, Rewards.Length);
            float sliceAngle = 360f / Rewards.Length;
            float targetAngle = rewardIndex * sliceAngle + sliceAngle / 2f;

            float totalRotation = 5f * 360f + (360f - targetAngle);
            float duration = 4f;
            float elapsed = 0f;
            float startRot = _wheelRect.localRotation.eulerAngles.z;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float eased = 1f - Mathf.Pow(1f - t, 3f);
                float current = Mathf.Lerp(startRot, startRot + totalRotation, eased);
                _wheelRect.localRotation = Quaternion.Euler(0f, 0f, current);
                yield return null;
            }

            _wheelRect.localRotation = Quaternion.Euler(0f, 0f, startRot + totalRotation);

            int amount = Rewards[rewardIndex];
            if (Progress != null) Progress.AddCoins(amount);
            if (Sound != null) Sound.PlayLevelComplete();

            if (_resultText != null) _resultText.text = "YOU WON " + amount + " COINS!";

            PlayerPrefs.SetString(KEY_LAST_SPIN, DateTime.UtcNow.ToString("yyyy-MM-dd"));
            PlayerPrefs.Save();

            Debug.Log("[Spin] Won " + amount + " coins");

            _isSpinning = false;
            Invoke(nameof(UpdateState), 2f);
        }
    }
}