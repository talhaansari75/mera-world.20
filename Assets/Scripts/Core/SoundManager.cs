using UnityEngine;

namespace MeraWorld.Core
{
    [DefaultExecutionOrder(-100)]
    public class SoundManager : MonoBehaviour
    {
        public static SoundManager Instance { get; private set; }

        [Range(0f, 1f)] public float SfxVolume = 0.5f;

        private AudioSource _source;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            _source = gameObject.AddComponent<AudioSource>();
            _source.playOnAwake = false;
            _source.volume = SfxVolume;
            _source.spatialBlend = 0f;

            Debug.Log("[SoundManager] Initialized");
        }

        public void PlayLetterSelect()
        {
            PlayTone(1200f, 0.05f, 0.25f);
        }

        public void PlayWordFound()
        {
            // Two-tone chime
            PlayTone(880f, 0.10f, 0.35f);
            Invoke(nameof(PlayWordFoundSecond), 0.10f);
        }

        private void PlayWordFoundSecond()
        {
            PlayTone(1320f, 0.15f, 0.35f);
        }

        public void PlayWordInvalid()
        {
            PlayTone(220f, 0.20f, 0.30f);
        }

        public void PlayLevelComplete()
        {
            // Three-tone fanfare
            PlayTone(523f, 0.12f, 0.40f);
            Invoke(nameof(PlayLevelCompleteSecond), 0.12f);
            Invoke(nameof(PlayLevelCompleteThird), 0.24f);
        }

        private void PlayLevelCompleteSecond()
        {
            PlayTone(659f, 0.12f, 0.40f);
        }

        private void PlayLevelCompleteThird()
        {
            PlayTone(784f, 0.30f, 0.40f);
        }

        public void PlayButtonClick()
        {
            PlayTone(600f, 0.04f, 0.20f);
        }

        public void PlayCoinCollect()
        {
            PlayTone(1600f, 0.08f, 0.30f);
            Invoke(nameof(PlayCoinCollectSecond), 0.06f);
        }

        private void PlayCoinCollectSecond()
        {
            PlayTone(2000f, 0.10f, 0.30f);
        }

        public void PlayStarEarned()
        {
            PlayTone(1046f, 0.15f, 0.35f);
            Invoke(nameof(PlayStarSecond), 0.10f);
        }

        private void PlayStarSecond()
        {
            PlayTone(1568f, 0.20f, 0.35f);
        }

        private void PlayTone(float frequency, float duration, float volume)
        {
            int sampleRate = 44100;
            int sampleCount = Mathf.CeilToInt(sampleRate * duration);
            var clip = AudioClip.Create("tone", sampleCount, 1, sampleRate, false);
            var data = new float[sampleCount];

            for (int i = 0; i < sampleCount; i++)
            {
                float t = (float)i / sampleRate;
                float env = 1f - (float)i / sampleCount;
                // Fade in/out for cleaner sound
                float fadeIn = Mathf.Min(1f, i / (sampleRate * 0.005f));
                data[i] = Mathf.Sin(2f * Mathf.PI * frequency * t) * env * volume * fadeIn;
            }

            clip.SetData(data, 0);
            _source.PlayOneShot(clip, SfxVolume);
        }
    }
}