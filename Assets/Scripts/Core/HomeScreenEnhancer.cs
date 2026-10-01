using UnityEngine;
using UnityEngine.UI;
using System.Collections;

namespace MeraWorld.Core
{
    public class HomeScreenEnhancer : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _dailyBadge;

        void Start() { Invoke(nameof(Setup), 2f); }

        private void Setup()
        {
            var c = new GameObject("HomeEnhancerCanvas", typeof(RectTransform));
            c.transform.SetParent(transform, false);
            _canvas = c.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 510;
            var s = c.AddComponent<CanvasScaler>();
            s.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            s.referenceResolution = new Vector2(1080, 1920);
            s.matchWidthOrHeight = 0f;
            c.AddComponent<GraphicRaycaster>();

            BuildProfileCard();
            BuildDailyBadge();
            BuildQuickToggles();
        }

        private void BuildProfileCard()
        {
            var o = new GameObject("ProfileCard", typeof(RectTransform));
            o.transform.SetParent(_canvas.transform, false);
            var i = o.AddComponent<Image>();
            i.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.22f, 0.40f), 256, 40);
            i.type = Image.Type.Sliced; i.color = Color.white;
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0f, 1f); r.anchorMax = new Vector2(0f, 1f);
            r.pivot = new Vector2(0f, 1f);
            r.anchoredPosition = new Vector2(15f, -10f);
            r.sizeDelta = new Vector2(160f, 70f);

            var avatar = new GameObject("Avatar", typeof(RectTransform));
            avatar.transform.SetParent(o.transform, false);
            var ai = avatar.AddComponent<Image>();
            ai.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.75f, 0.20f), 128);
            ai.raycastTarget = false;
            var ar = avatar.GetComponent<RectTransform>();
            ar.anchorMin = new Vector2(0f, 0.5f); ar.anchorMax = new Vector2(0f, 0.5f);
            ar.pivot = new Vector2(0f, 0.5f);
            ar.anchoredPosition = new Vector2(8f, 0f);
            ar.sizeDelta = new Vector2(40f, 40f);

            var nameTxt = MakeText(o.transform, "PLAYER", new Vector2(55f, 14f), 18, Color.white, TextAnchor.MiddleLeft);
            var lvlTxt = MakeText(o.transform, "LV 1", new Vector2(55f, -10f), 14, new Color(0.85f, 0.90f, 1f), TextAnchor.MiddleLeft);
        }

        private void BuildDailyBadge()
        {
            _dailyBadge = new GameObject("DailyBadge", typeof(RectTransform));
            _dailyBadge.transform.SetParent(_canvas.transform, false);
            var i = _dailyBadge.AddComponent<Image>();
            i.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.35f, 0.35f), 128, 30);
            i.type = Image.Type.Sliced; i.color = Color.white;
            var b = _dailyBadge.AddComponent<Button>();
            b.onClick.AddListener(OnDailyClick);
            var r = _dailyBadge.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(1f, 1f); r.anchorMax = new Vector2(1f, 1f);
            r.pivot = new Vector2(1f, 1f);
            r.anchoredPosition = new Vector2(-20f, -220f);
            r.sizeDelta = new Vector2(70f, 70f);

            MakeText(_dailyBadge.transform, "!", Vector2.zero, 50, Color.white, TextAnchor.MiddleCenter);

            StartCoroutine(Pulse());
        }

        private IEnumerator Pulse()
        {
            var rt = _dailyBadge.GetComponent<RectTransform>();
            while (true)
            {
                float s = 1f + Mathf.Sin(Time.unscaledTime * 3f) * 0.08f;
                if (rt != null) rt.localScale = Vector3.one * s;
                yield return null;
            }
        }

        private void BuildQuickToggles()
        {
            var musicBtn = MakeToggle("MUSIC", new Vector2(-180f, 200f), new Color(0.30f, 0.65f, 0.85f));
            musicBtn.onClick.AddListener(() => { if (AudioManager.Instance != null) AudioManager.Instance.SetMusicMuted(!AudioManager.Instance.MusicMuted); });

            var sfxBtn = MakeToggle("SOUND", new Vector2(-320f, 200f), new Color(0.55f, 0.75f, 0.35f));
            sfxBtn.onClick.AddListener(() => { if (AudioManager.Instance != null) AudioManager.Instance.SetSFXMuted(!AudioManager.Instance.SFXMuted); });
        }

        private Button MakeToggle(string label, Vector2 pos, Color color)
        {
            var o = new GameObject("Btn_" + label, typeof(RectTransform));
            o.transform.SetParent(_canvas.transform, false);
            var i = o.AddComponent<Image>();
            i.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 30);
            i.type = Image.Type.Sliced; i.color = Color.white;
            var b = o.AddComponent<Button>();
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0f); r.anchorMax = new Vector2(0.5f, 0f);
            r.pivot = new Vector2(0.5f, 0f);
            r.anchoredPosition = pos;
            r.sizeDelta = new Vector2(130f, 80f);
            MakeText(o.transform, label, Vector2.zero, 20, Color.white, TextAnchor.MiddleCenter);
            return b;
        }

        private Text MakeText(Transform p, string s, Vector2 pos, int size, Color c, TextAnchor a)
        {
            var o = new GameObject("T", typeof(RectTransform));
            o.transform.SetParent(p, false);
            var t = o.AddComponent<Text>();
            t.text = s; t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            t.fontSize = size; t.fontStyle = FontStyle.Bold; t.color = c;
            t.alignment = a; t.raycastTarget = false;
            var r = o.GetComponent<RectTransform>();
            if (a == TextAnchor.MiddleLeft)
            {
                r.anchorMin = new Vector2(0f, 0.5f); r.anchorMax = new Vector2(1f, 0.5f);
                r.pivot = new Vector2(0f, 0.5f);
                r.anchoredPosition = pos;
                r.sizeDelta = new Vector2(-70f, 40f);
            }
            else
            {
                r.anchorMin = new Vector2(0.5f, 0.5f); r.anchorMax = new Vector2(0.5f, 0.5f);
                r.pivot = new Vector2(0.5f, 0.5f);
                r.anchoredPosition = pos;
                r.sizeDelta = new Vector2(200f, 60f);
            }
            return t;
        }

        private void OnDailyClick()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            var d = FindFirstObjectByType<DailyRewardUI>();
            Debug.Log("[Home] Daily badge clicked"); if (d != null) d.gameObject.SetActive(true);
        }
    }
}






















