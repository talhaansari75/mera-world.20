using UnityEngine;
using UnityEngine.UI;
using System.Collections;

namespace MeraWorld.Core
{
    public class BossLevelUI : MonoBehaviour
    {
        public static BossLevelUI Instance { get; private set; }
        private Canvas _canvas;
        private GameObject _panel;
        private Text _bossNameText;
        private Text _rewardText;
        private Image _bossAvatar;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup()
        {
            var c = new GameObject("BossCanvas", typeof(RectTransform));
            c.transform.SetParent(transform, false);
            _canvas = c.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 950;
            var s = c.AddComponent<CanvasScaler>();
            s.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            s.referenceResolution = new Vector2(1080, 1920);
            s.matchWidthOrHeight = 0f;
            c.AddComponent<GraphicRaycaster>();

            _panel = new GameObject("Panel", typeof(RectTransform));
            _panel.transform.SetParent(c.transform, false);
            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.05f, 0.02f, 0.10f, 0.98f);
            var prt = _panel.GetComponent<RectTransform>();
            prt.anchorMin = Vector2.zero;
            prt.anchorMax = Vector2.one;
            prt.offsetMin = Vector2.zero;
            prt.offsetMax = Vector2.zero;
            _panel.SetActive(false);

            MakeText("BOSS BATTLE", new Vector2(0f, 700f), 70, new Color(1f, 0.30f, 0.30f));

            var avatar = new GameObject("BossAvatar", typeof(RectTransform));
            avatar.transform.SetParent(_panel.transform, false);
            _bossAvatar = avatar.AddComponent<Image>();
            _bossAvatar.sprite = UISpriteFactory.Create3DSphereSprite(new Color(0.85f, 0.20f, 0.25f), 256);
            _bossAvatar.raycastTarget = false;
            var art = avatar.GetComponent<RectTransform>();
            art.anchorMin = new Vector2(0.5f, 0.5f);
            art.anchorMax = new Vector2(0.5f, 0.5f);
            art.pivot = new Vector2(0.5f, 0.5f);
            art.anchoredPosition = new Vector2(0f, 300f);
            art.sizeDelta = new Vector2(300f, 300f);

            _bossNameText = MakeText("GUARDIAN", new Vector2(0f, 80f), 60, new Color(1f, 0.85f, 0.30f));
            _rewardText = MakeText("REWARD: 100 COINS", new Vector2(0f, 0f), 32, Color.white);

            MakeText("Defeat the boss to earn extra coins!", new Vector2(0f, -80f), 24, new Color(0.85f, 0.85f, 0.95f));

            var fightBtn = MakeButton("FIGHT!", new Vector2(0f, -250f), new Color(0.85f, 0.25f, 0.25f));
            fightBtn.onClick.AddListener(OnFightClicked);

            MakeButton("RETREAT", new Vector2(0f, -380f), new Color(0.4f, 0.4f, 0.45f)).onClick.AddListener(Hide);
        }

        public void ShowBossLevel(int level)
        {
            if (_panel == null) return;
            string name = BossLevelManager.GetBossName(level);
            int reward = BossLevelManager.GetBossReward(level);
            int diff = BossLevelManager.GetBossDifficulty(level);
            _bossNameText.text = name;
            _rewardText.text = "REWARD: " + reward + " COINS";
            float r = 0.85f;
            float g = 1f - diff * 0.25f;
            float b = 1f - diff * 0.25f;
            _bossAvatar.sprite = UISpriteFactory.Create3DSphereSprite(new Color(r, g, b), 256);
            _panel.SetActive(true);
            StartCoroutine(PulseAvatar());
            if (SoundManager.Instance != null) SoundManager.Instance.PlayLevelComplete();
        }

        private IEnumerator PulseAvatar()
        {
            var rt = _bossAvatar.GetComponent<RectTransform>();
            while (_panel.activeSelf)
            {
                float sc = 1f + Mathf.Sin(Time.unscaledTime * 3f) * 0.1f;
                rt.localScale = Vector3.one * sc;
                yield return null;
            }
            rt.localScale = Vector3.one;
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void OnFightClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            Hide();
            int level = PlayerPrefs.GetInt("CurrentLevel", 1);
            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(BossLevelManager.GetBossReward(level));
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        private Text MakeText(string s, Vector2 p, int sz, Color c)
        {
            var o = new GameObject("T", typeof(RectTransform));
            o.transform.SetParent(_panel.transform, false);
            var t = o.AddComponent<Text>();
            t.text = s;
            t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            t.fontSize = sz;
            t.fontStyle = FontStyle.Bold;
            t.color = c;
            t.alignment = TextAnchor.MiddleCenter;
            t.raycastTarget = false;
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f);
            r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = p;
            r.sizeDelta = new Vector2(1000f, 100f);
            return t;
        }

        private Button MakeButton(string s, Vector2 p, Color c)
        {
            var o = new GameObject("Btn_" + s, typeof(RectTransform));
            o.transform.SetParent(_panel.transform, false);
            var i = o.AddComponent<Image>();
            i.sprite = UISpriteFactory.Create3DButtonSprite(c, 256, 40);
            i.type = Image.Type.Sliced;
            i.color = Color.white;
            var b = o.AddComponent<Button>();
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f);
            r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = p;
            r.sizeDelta = new Vector2(600f, 110f);
            var t = new GameObject("L", typeof(RectTransform));
            t.transform.SetParent(o.transform, false);
            var tx = t.AddComponent<Text>();
            tx.text = s;
            tx.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            tx.fontSize = 40;
            tx.fontStyle = FontStyle.Bold;
            tx.color = Color.white;
            tx.alignment = TextAnchor.MiddleCenter;
            tx.raycastTarget = false;
            var tr = t.GetComponent<RectTransform>();
            tr.anchorMin = Vector2.zero;
            tr.anchorMax = Vector2.one;
            tr.offsetMin = Vector2.zero;
            tr.offsetMax = Vector2.zero;
            return b;
        }
    }
}