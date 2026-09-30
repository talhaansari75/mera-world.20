using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Simple helper to show banner on home screen, hide during gameplay.
    /// Attach to any scene object.
    /// </summary>
    public class AdsBootstrap : MonoBehaviour
    {
        void Start()
        {
            InvokeRepeating(nameof(UpdateBannerVisibility), 1f, 2f);
        }

        private void UpdateBannerVisibility()
        {
            if (AdsManager.Instance == null) return;

            if (HomeScreenUI.IsHomeVisible)
                AdsManager.Instance.ShowBanner();
            else
                AdsManager.Instance.HideBanner();
        }
    }
}