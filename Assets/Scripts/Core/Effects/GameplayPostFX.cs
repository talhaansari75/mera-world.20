using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace MeraWorld.Core
{
    /// <summary>
    /// URP ke liye premium post-processing effects:
    /// - Bloom (gold elements glow)
    /// - Vignette (cinematic dark corners)
    /// - Color Adjustments (richer purple)
    /// - Tonemapping (ACES cinematic look)
    /// 
    /// Ye URP Volume system use karta hai, Post Processing v2 nahi.
    /// </summary>
    public class GameplayPostFX : MonoBehaviour
    {
        private static GameplayPostFX _instance;
        public static GameplayPostFX Instance => _instance;

        private Volume _volume;
        private VolumeProfile _profile;
        private Bloom _bloom;
        private Vignette _vignette;
        private ColorAdjustments _colorAdjustments;
        private Tonemapping _tonemapping;

        void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Debug.LogWarning("[GameplayPostFX] Duplicate killed");
                Destroy(gameObject);
                return;
            }
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        void Start()
        {
            // Camera ready hone ka wait
            Invoke(nameof(Setup), 0.3f);
        }

        public void Setup()
        {
            var cam = Camera.main;
            if (cam == null)
            {
                Debug.LogWarning("[PostFX] No main camera found");
                return;
            }

            // === 1. Camera pe URP post-processing ON karo ===
            var camData = cam.GetComponent<UniversalAdditionalCameraData>();
            if (camData == null)
                camData = cam.gameObject.AddComponent<UniversalAdditionalCameraData>();

            camData.renderPostProcessing = true;
            camData.antialiasing = AntialiasingMode.SubpixelMorphologicalAntiAliasing;
            camData.antialiasingQuality = AntialiasingQuality.High;

            // === 2. Runtime VolumeProfile banao (koi asset nahi chahiye) ===
            _profile = ScriptableObject.CreateInstance<VolumeProfile>();

            // === 3. Global Volume GameObject ===
            var go = new GameObject("GlobalPostFXVolume");
            go.transform.SetParent(transform, false);
            _volume = go.AddComponent<Volume>();
            _volume.isGlobal = true;
            _volume.priority = 1f;
            _volume.profile = _profile;

            // === 4. Bloom — gold elements glow ===
            _bloom = _profile.Add<Bloom>(true);
            _bloom.intensity.value = 0.85f;
            _bloom.threshold.value = 0.85f;
            _bloom.scatter.value = 0.75f;
            _bloom.tint.value = new Color(1f, 0.92f, 0.75f); // Warm gold tint
            _bloom.highQualityFiltering.value = true;

            // === 5. Vignette — cinematic dark corners ===
            _vignette = _profile.Add<Vignette>(true);
            _vignette.intensity.value = 0.35f;
            _vignette.smoothness.value = 0.5f;
            _vignette.color.value = new Color(0.05f, 0f, 0.15f);
            _vignette.rounded.value = false;

            // === 6. Color Adjustments — richer purple ===
            _colorAdjustments = _profile.Add<ColorAdjustments>(true);
            _colorAdjustments.saturation.value = 15f;
            _colorAdjustments.contrast.value = 8f;
            _colorAdjustments.postExposure.value = 0.1f;

            // === 7. Tonemapping — ACES cinematic ===
            _tonemapping = _profile.Add<Tonemapping>(true);
            _tonemapping.mode.value = TonemappingMode.ACES;

            Debug.Log("[PostFX] URP premium effects applied! (Bloom + Vignette + ColorGrading + ACES)");
        }

        public static void Enable()
        {
            if (_instance != null && _instance._volume != null)
                _instance._volume.enabled = true;
        }

        public static void Disable()
        {
            if (_instance != null && _instance._volume != null)
                _instance._volume.enabled = false;
        }

        void OnDestroy()
        {
            if (_profile != null) Destroy(_profile);
        }
    }
}
