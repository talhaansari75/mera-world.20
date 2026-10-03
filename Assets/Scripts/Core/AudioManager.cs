using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Centralized audio system. Handles music + SFX with settings.
    /// Loads clips from Resources/Audio/Music and Resources/Audio/SFX.
    /// Auto-creates itself on first use (singleton).
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        // ---- Settings keys ----
        private const string KEY_MUSIC_VOL = "Audio_MusicVolume";
        private const string KEY_SFX_VOL = "Audio_SFXVolume";
        private const string KEY_MUSIC_MUTE = "Audio_MusicMuted";
        private const string KEY_SFX_MUTE = "Audio_SFXMuted";

        // ---- Volume ----
        public float MusicVolume { get; private set; } = 0.6f;
        public float SFXVolume { get; private set; } = 0.8f;
        public bool MusicMuted { get; private set; } = false;
        public bool SFXMuted { get; private set; } = false;

        // ---- Audio Sources ----
        private AudioSource _musicSource;
        private AudioSource _sfxSource;
        private AudioSource _uiSource;

        // ---- Clip cache ----
        private readonly Dictionary<string, AudioClip> _clipCache = new Dictionary<string, AudioClip>();

        // ---- Current music ----
        private string _currentMusicName = "";

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            transform.parent = null;
            // DontDestroyOnLoad(gameObject); // Unity 6 warning fix

            LoadSettings();
            SetupSources();
        }

        private void LoadSettings()
        {
            MusicVolume = PlayerPrefs.GetFloat(KEY_MUSIC_VOL, 0.6f);
            SFXVolume = PlayerPrefs.GetFloat(KEY_SFX_VOL, 0.8f);
            MusicMuted = PlayerPrefs.GetInt(KEY_MUSIC_MUTE, 0) == 1;
            SFXMuted = PlayerPrefs.GetInt(KEY_SFX_MUTE, 0) == 1;
        }

        private void SaveSettings()
        {
            PlayerPrefs.SetFloat(KEY_MUSIC_VOL, MusicVolume);
            PlayerPrefs.SetFloat(KEY_SFX_VOL, SFXVolume);
            PlayerPrefs.SetInt(KEY_MUSIC_MUTE, MusicMuted ? 1 : 0);
            PlayerPrefs.SetInt(KEY_SFX_MUTE, SFXMuted ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void SetupSources()
        {
            _musicSource = gameObject.AddComponent<AudioSource>();
            _musicSource.loop = true;
            _musicSource.playOnAwake = false;
            _musicSource.volume = MusicMuted ? 0f : MusicVolume;
            _musicSource.priority = 0;

            _sfxSource = gameObject.AddComponent<AudioSource>();
            _sfxSource.loop = false;
            _sfxSource.playOnAwake = false;
            _sfxSource.volume = SFXMuted ? 0f : SFXVolume;
            _sfxSource.priority = 128;

            _uiSource = gameObject.AddComponent<AudioSource>();
            _uiSource.loop = false;
            _uiSource.playOnAwake = false;
            _uiSource.volume = SFXMuted ? 0f : SFXVolume;
            _uiSource.priority = 64;
        }

        // ---------------------------------------------------------------
        // Music
        // ---------------------------------------------------------------

        public void PlayMusic(string clipName, bool restart = false)
        {
            if (string.IsNullOrEmpty(clipName)) return;

            if (!restart && _currentMusicName == clipName && _musicSource.isPlaying)
                return;

            var clip = LoadClip("Audio/Music/" + clipName);
            if (clip == null)
            {
                Debug.LogWarning($"[Audio] Music clip not found: {clipName}");
                return;
            }

            _currentMusicName = clipName;
            _musicSource.clip = clip;
            _musicSource.volume = MusicMuted ? 0f : MusicVolume;
            _musicSource.Play();
        }

        public void StopMusic()
        {
            _musicSource.Stop();
            _currentMusicName = "";
        }

        public void FadeMusicTo(float targetVolume, float duration)
        {
            StartCoroutine(FadeRoutine(_musicSource, targetVolume, duration));
        }

        private System.Collections.IEnumerator FadeRoutine(AudioSource src, float target, float dur)
        {
            float start = src.volume;
            float t = 0f;
            while (t < dur)
            {
                t += Time.unscaledDeltaTime;
                src.volume = Mathf.Lerp(start, target, t / dur);
                yield return null;
            }
            src.volume = target;
        }

        // ---------------------------------------------------------------
        // SFX
        // ---------------------------------------------------------------

        public void PlaySFX(string clipName, float pitch = 1f, float volumeScale = 1f)
        {
            if (SFXMuted) return;
            var clip = LoadClip("Audio/SFX/" + clipName);
            if (clip == null) return;

            _sfxSource.pitch = pitch;
            _sfxSource.PlayOneShot(clip, SFXVolume * volumeScale);
        }

        public void PlayUI(string clipName, float volumeScale = 1f)
        {
            if (SFXMuted) return;
            var clip = LoadClip("Audio/SFX/" + clipName);
            if (clip == null) return;

            _uiSource.pitch = 1f;
            _uiSource.PlayOneShot(clip, SFXVolume * volumeScale);
        }

        // ---------------------------------------------------------------
        // Convenience methods (call these from anywhere)
        // ---------------------------------------------------------------

        public void PlayButtonClick()    => PlayUI("button-click");
        public void PlayLetterSelect()   => PlaySFX("letter-select", 1f, 0.6f);
        public void PlayWordFound()      => PlaySFX("word-found");
        public void PlayWordInvalid()    => PlaySFX("word-invalid");
        public void PlayLevelComplete()  => PlaySFX("level-complete");
        public void PlayStarEarned()     => PlaySFX("star-earned");
        public void PlayCoinCollect()    => PlaySFX("coin-collect");
        public void PlayGemCollect()     => PlaySFX("gem-collect");
        public void PlayPopupOpen()      => PlayUI("popup-open");
        public void PlayPopupClose()     => PlayUI("popup-close");
        public void PlayError()          => PlayUI("error");

        // ---------------------------------------------------------------
        // Settings API
        // ---------------------------------------------------------------

        public void SetMusicVolume(float v)
        {
            MusicVolume = Mathf.Clamp01(v);
            _musicSource.volume = MusicMuted ? 0f : MusicVolume;
            SaveSettings();
        }

        public void SetSFXVolume(float v)
        {
            SFXVolume = Mathf.Clamp01(v);
            _sfxSource.volume = SFXMuted ? 0f : SFXVolume;
            _uiSource.volume = SFXMuted ? 0f : SFXVolume;
            SaveSettings();
        }

        public void SetMusicMuted(bool m)
        {
            MusicMuted = m;
            _musicSource.volume = m ? 0f : MusicVolume;
            SaveSettings();
        }

        public void SetSFXMuted(bool m)
        {
            SFXMuted = m;
            _sfxSource.volume = m ? 0f : SFXVolume;
            _uiSource.volume = m ? 0f : SFXVolume;
            SaveSettings();
        }

        // ---------------------------------------------------------------
        // Clip loading with cache
        // ---------------------------------------------------------------

        private AudioClip LoadClip(string path)
        {
            if (_clipCache.TryGetValue(path, out var cached))
                return cached;

            var clip = Resources.Load<AudioClip>(path);
            if (clip != null) _clipCache[path] = clip;
            return clip;
        }

        void OnApplicationPause(bool paused)
        {
            if (paused && _musicSource.isPlaying) _musicSource.Pause();
            else if (!paused && _musicSource.clip != null) _musicSource.UnPause();
        }
    }
}
