using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace MeraWorld.Core
{
    /// <summary>
    /// Sets up post-processing effects (Bloom + Vignette) at runtime.
    /// Attach to Main Camera.
    /// </summary>
    [RequireComponent(typeof(Camera))]
    public class PostFXSetup : MonoBehaviour
    {
        [Header("Bloom")]
        public float BloomIntensity = 0.5f;
        public float BloomThreshold = 0.9f;
        public Color BloomTint = Color.white;

        [Header("Vignette")]
        public float VignetteIntensity = 0.35f;
        public float VignetteSmoothness = 0.4f;
        public Color VignetteColor = Color.black;

        private Volume _volume;

        void Start()
        {
            SetupVolume();
        }

        private void SetupVolume()
        {
            // Find or create Volume
            _volume = GetComponent<Volume>();
            if (_volume == null)
                _volume = gameObject.AddComponent<Volume>();

            _volume.isGlobal = true;
            _volume.priority = 100;

            // Create profile
            var profile = ScriptableObject.CreateInstance<VolumeProfile>();
            _volume.profile = profile;

            // Bloom
            var bloom = profile.Add<Bloom>(true);
            bloom.intensity.overrideState = true;
            bloom.intensity.value = BloomIntensity;
            bloom.threshold.overrideState = true;
            bloom.threshold.value = BloomThreshold;
            bloom.tint.overrideState = true;
            bloom.tint.value = BloomTint;

            // Vignette
            var vignette = profile.Add<Vignette>(true);
            vignette.intensity.overrideState = true;
            vignette.intensity.value = VignetteIntensity;
            vignette.smoothness.overrideState = true;
            vignette.smoothness.value = VignetteSmoothness;
            vignette.color.overrideState = true;
            vignette.color.value = VignetteColor;

            Debug.Log("[PostFX] Volume setup complete");
        }
    }
}