using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class BotRaceMode
    {
        private void ShowResult(string title, string subtitle, Color color)
        {
            if (_canvas == null) return;

            var panel = new GameObject("RaceResult");
            panel.transform.SetParent(_canvas.transform, false);

            var bg = panel.AddComponent<Image>();
            bg.color = new Color(color.r, color.g, color.b, 0.95f);

            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(700f, 350f);

            CreateText(panel.transform, title, new Vector2(0f, 60f), 65, Color.white, FontStyle.Bold);
            CreateText(panel.transform, subtitle, new Vector2(0f, -40f), 32, Color.white, FontStyle.Normal);

            Destroy(panel, 3f);
        }

        private void ShowLoseScreen()
        {
            if (_canvas == null) return;

            Time.timeScale = 0f;

            var panel = new GameObject("LoseScreen");
            panel.transform.SetParent(_canvas.transform, false);

            var bg = panel.AddComponent<Image>();
            bg.color = new Color(0.15f, 0.05f, 0.10f, 0.98f);

            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(panel.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = "YOU LOSE!";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 90;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = new Color(0.95f, 0.35f, 0.35f);
            titleTxt.alignment = TextAnchor.MiddleCenter;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 0.5f);
            trt.anchorMax = new Vector2(0.5f, 0.5f);
            trt.pivot = new Vector2(0.5f, 0.5f);
            trt.anchoredPosition = new Vector2(0f, 250f);
            trt.sizeDelta = new Vector2(800f, 150f);

            var subObj = new GameObject("Sub");
            subObj.transform.SetParent(panel.transform, false);
            var subTxt = subObj.AddComponent<Text>();
            subTxt.text = _bot.Name + " found all words first!";
            subTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            subTxt.fontSize = 36;
            subTxt.color = Color.white;
            subTxt.alignment = TextAnchor.MiddleCenter;
            var srt = subObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 0.5f);
            srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, 130f);
            srt.sizeDelta = new Vector2(800f, 80f);

            CreateResultButton(panel.transform, "HOME", new Vector2(0f, -50f),
                new Vector2(500f, 130f), new Color(0.25f, 0.45f, 0.85f), () =>
                {
                    Time.timeScale = 1f;
                    Destroy(panel);
                    HomeScreenUI.ForceShowHome();
                    var brm = FindFirstObjectByType<BotRaceMode>();
                    if (brm != null) Destroy(brm.gameObject);
                });

            CreateResultButton(panel.transform, "REPLAY", new Vector2(0f, -220f),
                new Vector2(500f, 130f), new Color(0.25f, 0.65f, 0.35f), () =>
                {
                    Time.timeScale = 1f;
                    PlayerPrefs.SetInt("SkipHome", 1);
                    PlayerPrefs.SetInt("ForceTestRace", 1);
                    PlayerPrefs.Save();
                    UnityEngine.SceneManagement.SceneManager.LoadScene(
                        UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
                });
        }

        private void CreateResultButton(Transform parent, string label, Vector2 pos,
            Vector2 size, Color color, System.Action onClick)
        {
            var obj = new GameObject("Btn_" + label);
            obj.transform.SetParent(parent, false);

            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(() => onClick());

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var txtObj = new GameObject("Label");
            txtObj.transform.SetParent(obj.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void CreateText(Transform parent, string content, Vector2 pos,
            int size, Color color, FontStyle style)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = style;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(600f, 100f);
        }
    }
}