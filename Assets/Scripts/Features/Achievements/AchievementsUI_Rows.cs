using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class AchievementsUI
    {
        private void CreateSectionHeader(string title)
        {
            var obj = new GameObject("Header");
            obj.transform.SetParent(_scrollContent, false);

            var rt = obj.AddComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 60f);
            var le = obj.AddComponent<LayoutElement>();
            le.minHeight = 60f;
            le.preferredHeight = 60f;

            var txt = obj.AddComponent<Text>();
            txt.text = "-- " + title + " --";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.30f);
            txt.alignment = TextAnchor.MiddleLeft;
            txt.raycastTarget = false;
        }

        private void CreateAchievementRow(AchievementDefinitions.Achievement ach)
        {
            bool unlocked = AchievementManager.Instance.IsUnlocked(ach.Id);
            int progress = AchievementManager.Instance.GetProgress(ach.Id);
            float pct = AchievementManager.Instance.GetProgressPercent(ach.Id);

            var row = new GameObject("Ach_" + ach.Id);
            row.transform.SetParent(_scrollContent, false);

            var rowRt = row.AddComponent<RectTransform>();
            rowRt.sizeDelta = new Vector2(0f, 140f);

            var rowLe = row.AddComponent<LayoutElement>();
            rowLe.minHeight = 140f;
            rowLe.preferredHeight = 140f;

            var bgImg = row.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(
                unlocked ? new Color(0.20f, 0.45f, 0.25f) : new Color(0.14f, 0.18f, 0.28f),
                256, 30);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;

            // Left icon circle
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(row.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.sprite = UISpriteFactory.Create3DSphereSprite(
                unlocked ? new Color(1f, 0.85f, 0.30f) : new Color(0.35f, 0.40f, 0.50f),
                128);
            iconImg.raycastTarget = false;

            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(20f, 0f);
            iconRt.sizeDelta = new Vector2(90f, 90f);

            var iconLabel = new GameObject("IconLabel");
            iconLabel.transform.SetParent(iconObj.transform, false);
            var ilTxt = iconLabel.AddComponent<Text>();
            ilTxt.text = unlocked ? "*" : "?";
            ilTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            ilTxt.fontSize = 48;
            ilTxt.fontStyle = FontStyle.Bold;
            ilTxt.color = unlocked ? new Color(0.15f, 0.20f, 0.10f) : Color.white;
            ilTxt.alignment = TextAnchor.MiddleCenter;
            ilTxt.raycastTarget = false;
            var ilRt = iconLabel.GetComponent<RectTransform>();
            ilRt.anchorMin = Vector2.zero;
            ilRt.anchorMax = Vector2.one;
            ilRt.offsetMin = Vector2.zero;
            ilRt.offsetMax = Vector2.zero;

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(row.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = ach.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 30;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = unlocked ? new Color(1f, 0.95f, 0.75f) : Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 0.5f);
            titleRt.anchorMax = new Vector2(1f, 1f);
            titleRt.pivot = new Vector2(0f, 1f);
            titleRt.anchoredPosition = new Vector2(130f, -15f);
            titleRt.sizeDelta = new Vector2(-150f, 40f);

            // Description
            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(row.transform, false);
            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = ach.Description;
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 22;
            descTxt.fontStyle = FontStyle.Normal;
            descTxt.color = new Color(0.85f, 0.90f, 1f);
            descTxt.alignment = TextAnchor.UpperLeft;
            descTxt.raycastTarget = false;
            var descRt = descObj.GetComponent<RectTransform>();
            descRt.anchorMin = new Vector2(0f, 0.4f);
            descRt.anchorMax = new Vector2(1f, 0.7f);
            descRt.pivot = new Vector2(0f, 1f);
            descRt.anchoredPosition = new Vector2(130f, 5f);
            descRt.sizeDelta = new Vector2(-150f, 30f);

            // Progress text
            var progObj = new GameObject("Progress");
            progObj.transform.SetParent(row.transform, false);
            var progTxt = progObj.AddComponent<Text>();
            progTxt.text = unlocked ? "UNLOCKED" : (progress + " / " + ach.TargetCount);
            progTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            progTxt.fontSize = 22;
            progTxt.fontStyle = FontStyle.Bold;
            progTxt.color = unlocked ? new Color(0.55f, 1f, 0.55f) : new Color(0.75f, 0.85f, 1f);
            progTxt.alignment = TextAnchor.MiddleRight;
            progTxt.raycastTarget = false;
            var progRt = progObj.GetComponent<RectTransform>();
            progRt.anchorMin = new Vector2(0.6f, 0f);
            progRt.anchorMax = new Vector2(1f, 0.4f);
            progRt.pivot = new Vector2(1f, 0.5f);
            progRt.anchoredPosition = new Vector2(-20f, 0f);
            progRt.sizeDelta = new Vector2(-40f, 30f);

            // Progress bar
            if (!unlocked)
                CreateProgressBar(row.transform, pct);

            // Rewards
            if (ach.CoinReward > 0 || ach.GemReward > 0)
            {
                var rewardObj = new GameObject("Reward");
                rewardObj.transform.SetParent(row.transform, false);
                var rewardTxt = rewardObj.AddComponent<Text>();
                string r = "";
                if (ach.CoinReward > 0) r += "+" + ach.CoinReward + " coins ";
                if (ach.GemReward > 0) r += "+" + ach.GemReward + " gems";
                rewardTxt.text = r.Trim();
                rewardTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                rewardTxt.fontSize = 20;
                rewardTxt.fontStyle = FontStyle.Bold;
                rewardTxt.color = new Color(1f, 0.90f, 0.55f);
                rewardTxt.alignment = TextAnchor.MiddleLeft;
                rewardTxt.raycastTarget = false;
                var rrt = rewardObj.GetComponent<RectTransform>();
                rrt.anchorMin = new Vector2(0f, 0f);
                rrt.anchorMax = new Vector2(0.6f, 0.4f);
                rrt.pivot = new Vector2(0f, 0.5f);
                rrt.anchoredPosition = new Vector2(130f, 0f);
                rrt.sizeDelta = new Vector2(-150f, 30f);
            }
        }

        private void CreateProgressBar(Transform parent, float pct)
        {
            var barBg = new GameObject("ProgressBarBg");
            barBg.transform.SetParent(parent, false);

            var bgImg = barBg.AddComponent<Image>();
            bgImg.color = new Color(0.10f, 0.15f, 0.25f, 0.9f);
            bgImg.raycastTarget = false;

            var bgRt = barBg.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0f, 0f);
            bgRt.anchorMax = new Vector2(1f, 0f);
            bgRt.pivot = new Vector2(0.5f, 0f);
            bgRt.anchoredPosition = new Vector2(15f, 15f);
            bgRt.sizeDelta = new Vector2(-30f, 12f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(barBg.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = new Color(0.35f, 0.75f, 0.95f);
            fillImg.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2((bgRt.sizeDelta.x - 4f) * pct, -4f);
        }
    }
}