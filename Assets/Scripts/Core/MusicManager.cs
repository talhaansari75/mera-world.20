using UnityEngine;

namespace MeraWorld.Core
{
    public class MusicManager : MonoBehaviour
    {
        public static MusicManager Instance { get; private set; }

        [Range(0f, 1f)] public float MusicVolume = 0.25f;

        private AudioSource _musicSource;
        private const string KEY_MUSIC = "Settings_Music";

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        void Start()
        {
            _musicSource = gameObject.AddComponent<AudioSource>();
            _musicSource.loop = true;
            _musicSource.volume = MusicVolume;
            _musicSource.playOnAwake = false;

            bool musicOn = PlayerPrefs.GetInt(KEY_MUSIC, 1) == 1;
            if (musicOn)
                StartMusic();
        }

        public void StartMusic()
        {
            if (_musicSource == null) return;
            if (_musicSource.isPlaying) return;

            var clip = GenerateMusicLoop();
            _musicSource.clip = clip;
            _musicSource.Play();

            Debug.Log("[Music] Started");
        }

        public void StopMusic()
        {
            if (_musicSource != null && _musicSource.isPlaying)
            {
                _musicSource.Stop();
                Debug.Log("[Music] Stopped");
            }
        }

        public void SetMusicEnabled(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_MUSIC, enabled ? 1 : 0);
            PlayerPrefs.Save();

            if (enabled) StartMusic();
            else StopMusic();
        }

        private AudioClip GenerateMusicLoop()
        {
            int sampleRate = 22050;
            float duration = 8f;
            int totalSamples = Mathf.CeilToInt(sampleRate * duration);
            var clip = AudioClip.Create("music_loop", totalSamples, 1, sampleRate, false);
            var data = new float[totalSamples];

            // Soothing C major chord progression: C - Am - F - G
            float[][] chords = new float[][]
            {
                new float[] { 261.63f, 329.63f, 392.00f },  // C
                new float[] { 220.00f, 261.63f, 329.63f },  // Am
                new float[] { 174.61f, 220.00f, 261.63f },  // F
                new float[] { 196.00f, 246.94f, 293.66f },  // G
            };

            float chordDuration = duration / chords.Length;

            for (int i = 0; i < totalSamples; i++)
            {
                float t = (float)i / sampleRate;
                int chordIndex = Mathf.FloorToInt(t / chordDuration) % chords.Length;
                float chordT = t - chordIndex * chordDuration;

                float sample = 0f;
                foreach (float freq in chords[chordIndex])
                {
                    sample += Mathf.Sin(2f * Mathf.PI * freq * t) * 0.25f;
                }

                // Fade in/out within each chord
                float fadeIn = Mathf.Min(1f, chordT / 0.5f);
                float fadeOut = Mathf.Min(1f, (chordDuration - chordT) / 0.5f);
                float envelope = fadeIn * fadeOut;

                // Overall loop fade to prevent clicks
                float loopFade = Mathf.Min(1f, t / 0.3f, (duration - t) / 0.3f);

                data[i] = sample * envelope * loopFade * 0.5f;
            }

            clip.SetData(data, 0);
            return clip;
        }

        public void SetVolume(float volume)
        {
            MusicVolume = Mathf.Clamp01(volume);
            if (_musicSource != null)
                _musicSource.volume = MusicVolume;
        }
    }
}