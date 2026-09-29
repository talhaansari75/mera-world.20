using UnityEngine;

namespace MeraWorld.Core
{
    [DefaultExecutionOrder(-100)]  // Runs before all other scripts
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
            PlayTone(880f, 0.06f, 0.3f);
            Debug.Log("[Sound] Letter select");
        }

        public void PlayWordFound()
        {
            PlayTone(1200f, 0.15f, 0.5f);
            Debug.Log("[Sound] Word found");
        }

        public void PlayWordInvalid()
        {
            PlayTone(220f, 0.15f, 0.4f);
            Debug.Log("[Sound] Invalid word");
        }

        public void PlayLevelComplete()
        {
            PlayTone(660f, 0.5f, 0.6f);
            Debug.Log("[Sound] Level complete");
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
                data[i] = Mathf.Sin(2f * Mathf.PI * frequency * t) * env * volume;
            }

            clip.SetData(data, 0);
            _source.PlayOneShot(clip, SfxVolume);
        }
    }
}