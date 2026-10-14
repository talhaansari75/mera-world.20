using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class LeaderboardUI
    {
        private void CreatePodium()
        {
            var entries = GetEntries();

            if (entries.Count > 1)
                CreatePodiumSlot(2, entries[1], new Vector2(-250f, 400f),
                    new Color(0.75f, 0.75f, 0.85f), 160f);

            if (entries.Count > 0)
                CreatePodiumSlot(1, entries[0], new Vector2(0f, 480f),
                    new Color(1f, 0.85f, 0.30f), 200f);

            if (entries.Count > 2)
                CreatePodiumSlot(3, entries[2], new Vector2(250f, 350f),
                    new Color(0.85f, 0.55f, 0.30f), 140f);
        }

        private void CreatePodiumSlot(int rank, string entry, Vector2 pos, Color color, float size)
        {
            string[] parts = entry.Split('|');
            string name = parts.Length > 0 ? parts[0] : "Player";
            string score = parts.Length > 1 ? parts[1] : "0";

            var slot = new GameObject("Podium_" + rank);
            slot.transform.SetParent(_panel.transform, false);

            var bg = slot.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var rt = slot.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(size, size);

            var rankObj = new GameObject("Rank");
            rankObj.transform.SetParent(slot.transform, false);
            var rankTxt = rankObj.AddComponent<Text>();
            rankTxt.text = rank.ToString();
            rankTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            rankTxt.fontSize = 70;
            rankTxt.fontStyle = FontStyle.Bold;
            rankTxt.color = new Color(0.15f, 0.10f, 0.05f);
            rankTxt.alignment = TextAnchor.MiddleCenter;
            rankTxt.raycastTarget = false;
            var rankRt = rankObj.GetComponent<RectTransform>();
            rankRt.anchorMin = new Vector2(0f, 0.5f);
            rankRt.anchorMax = new Vector2(1f, 1f);
            rankRt.offsetMin = Vector2.zero;
            rankRt.offsetMax = Vector2.zero;

            var nameObj = new GameObject("Name");
            nameObj.transform.SetParent(slot.transform, false);
            var nameTxt = nameObj.AddComponent<Text>();
            nameTxt.text = name;
            nameTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            nameTxt.fontSize = 22;
            nameTxt.fontStyle = FontStyle.Bold;
            nameTxt.color = Color.white;
            nameTxt.alignment = TextAnchor.MiddleCenter;
            nameTxt.raycastTarget = false;
            var nameRt = nameObj.GetComponent<RectTransform>();
            nameRt.anchorMin = new Vector2(0f, 0.3f);
            nameRt.anchorMax = new Vector2(1f, 0.5f);
            nameRt.offsetMin = Vector2.zero;
            nameRt.offsetMax = Vector2.zero;

            var scoreObj = new GameObject("Score");
            scoreObj.transform.SetParent(slot.transform, false);
            var scoreTxt = scoreObj.AddComponent<Text>();
            scoreTxt.text = score;
            scoreTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            scoreTxt.fontSize = 28;
            scoreTxt.fontStyle = FontStyle.Bold;
            scoreTxt.color = new Color(0.15f, 0.10f, 0.05f);
            scoreTxt.alignment = TextAnchor.MiddleCenter;
            scoreTxt.raycastTarget = false;
            var scoreRt = scoreObj.GetComponent<RectTransform>();
            scoreRt.anchorMin = new Vector2(0f, 0f);
            scoreRt.anchorMax = new Vector2(1f, 0.3f);
            scoreRt.offsetMin = Vector2.zero;
            scoreRt.offsetMax = Vector2.zero;
        }

        private void CreateRow(int rank, string entry, float y)
        {
            string[] parts = entry.Split('|');
            string name = parts.Length > 0 ? parts[0] : "Player";
            string score = parts.Length > 1 ? parts[1] : "0";

            var rowObj = new GameObject("Row_" + rank);
            rowObj.transform.SetParent(_panel.transform, false);

            var bg = rowObj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.20f, 0.35f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = rowObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 80f);

            CreateRowText(rowObj.transform, rank.ToString(), new Vector2(-380f, 0f), 36,
                new Color(0.70f, 0.80f, 1f), TextAnchor.MiddleLeft);

            CreateRowText(rowObj.transform, name, new Vector2(-100f, 0f), 32,
                Color.white, TextAnchor.MiddleLeft);

            CreateRowText(rowObj.transform, score, new Vector2(380f, 0f), 36,
                new Color(1f, 0.85f, 0.30f), TextAnchor.MiddleRight);
        }

        private void CreateRowText(Transform parent, string content, Vector2 pos, int size,
            Color color, TextAnchor anchor)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = anchor;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(anchor == TextAnchor.MiddleLeft ? 0f : 1f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(300f, 60f);
        }
    }
}