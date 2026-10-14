using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class SettingsScreenUI
    {
        private GameObject _dropdownPopup;
        private Text _dropdownTitle;
        private Transform _dropdownListParent;

        // ================= BUILD DROPDOWN POPUP =================
        private void BuildDropdownPopup()
        {
            _dropdownPopup = new GameObject("DropdownPopup", typeof(RectTransform));
            _dropdownPopup.transform.SetParent(_canvas.transform, false);
            _dropdownPopup.transform.SetAsLastSibling();

            var rt = _dropdownPopup.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Dark overlay (click to close)
            var dim = _dropdownPopup.AddComponent<Image>();
            dim.color = new Color(0f, 0f, 0f, 0.82f);
            var dimBtn = _dropdownPopup.AddComponent<Button>();
            dimBtn.transition = Selectable.Transition.None;
            dimBtn.onClick.AddListener(() => { PlayClick(); HideDropdown(); });

            // Main box
            var box = new GameObject("Box", typeof(RectTransform));
            box.transform.SetParent(_dropdownPopup.transform, false);
            var boxImg = box.AddComponent<Image>();
            boxImg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 512, 50);
            boxImg.type = Image.Type.Sliced;
            boxImg.color = Color.white;
            boxImg.raycastTarget = true;

            // Block clicks passing through box
            var boxBtn = box.AddComponent<Button>();
            boxBtn.transition = Selectable.Transition.None;

            var brt = box.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(880f, 1000f);

            // Gold border (behind box content but on top of box bg)
            var border = new GameObject("GoldBorder", typeof(RectTransform));
            border.transform.SetParent(box.transform, false);
            border.transform.SetAsFirstSibling();
            var bdrImg = border.AddComponent<Image>();
            bdrImg.sprite = UISpriteFactory.Create3DButtonSprite(GOLD, 512, 50);
            bdrImg.type = Image.Type.Sliced;
            bdrImg.raycastTarget = false;
            var bdrt = border.GetComponent<RectTransform>();
            bdrt.anchorMin = Vector2.zero;
            bdrt.anchorMax = Vector2.one;
            bdrt.offsetMin = new Vector2(-8f, -8f);
            bdrt.offsetMax = new Vector2(8f, 8f);

            // Title
            _dropdownTitle = MakeText(box.transform, "SELECT", new Vector2(0f, 400f), 56, TEXT_GOLD);
            _dropdownTitle.fontStyle = FontStyle.Bold;
            var tOutline = _dropdownTitle.gameObject.AddComponent<Outline>();
            tOutline.effectColor = new Color(0.3f, 0.1f, 0f, 1f);
            tOutline.effectDistance = new Vector2(3f, -3f);
            _dropdownTitle.rectTransform.sizeDelta = new Vector2(800f, 90f);

            // Options container (vertical layout)
            var listObj = new GameObject("OptionsList", typeof(RectTransform));
            listObj.transform.SetParent(box.transform, false);
            var listRt = listObj.GetComponent<RectTransform>();
            listRt.anchorMin = new Vector2(0f, 0f);
            listRt.anchorMax = new Vector2(1f, 1f);
            listRt.offsetMin = new Vector2(50f, 180f);
            listRt.offsetMax = new Vector2(-50f, -120f);

            var vlg = listObj.AddComponent<VerticalLayoutGroup>();
            vlg.spacing = 18f;
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = false;

            _dropdownListParent = listObj.transform;

            // Cancel button at bottom
            var cancelBtn = MakeButton(box.transform, "CANCEL", new Vector2(0f, -420f), new Vector2(400f, 100f), GREY);
            cancelBtn.onClick.AddListener(() => { PlayClick(); HideDropdown(); });

            _dropdownPopup.SetActive(false);
        }

        // ================= SHOW DROPDOWN =================
        private void ShowDropdown(string title, string[] options, string currentValue, Action<string> onSelect)
        {
            if (_dropdownPopup == null) return;

            _dropdownTitle.text = title;

            // Clear old options
            for (int i = _dropdownListParent.childCount - 1; i >= 0; i--)
                Destroy(_dropdownListParent.GetChild(i).gameObject);

            // Create option rows
            foreach (var option in options)
            {
                bool isSelected = (option == currentValue);
                string capturedOption = option;
                Action<string> capturedCallback = onSelect;

                var row = new GameObject("Option_" + option, typeof(RectTransform));
                row.transform.SetParent(_dropdownListParent, false);
                row.GetComponent<RectTransform>().sizeDelta = new Vector2(0f, 130f);
                var le = row.AddComponent<LayoutElement>();
                le.minHeight = 130f;
                le.preferredHeight = 130f;

                var bg = row.AddComponent<Image>();
                Color rowColor = isSelected ? GOLD : new Color(0.18f, 0.12f, 0.38f);
                bg.sprite = UISpriteFactory.Create3DButtonSprite(rowColor, 256, 30);
                bg.type = Image.Type.Sliced;
                bg.color = Color.white;

                var btn = row.AddComponent<Button>();
                btn.transition = Selectable.Transition.None;
                btn.onClick.AddListener(() =>
                {
                    PlayClick();
                    HideDropdown();
                    capturedCallback?.Invoke(capturedOption);
                });

                // Label
                var lbl = MakeText(row.transform, option, Vector2.zero, 38,
                    isSelected ? new Color(0.25f, 0.15f, 0f) : Color.white);
                lbl.fontStyle = FontStyle.Bold;
                var o = lbl.gameObject.AddComponent<Outline>();
                o.effectColor = isSelected ? new Color(1f, 0.98f, 0.7f, 0.6f) : new Color(0f, 0f, 0f, 0.8f);
                o.effectDistance = new Vector2(2f, -2f);
                lbl.rectTransform.anchorMin = Vector2.zero;
                lbl.rectTransform.anchorMax = Vector2.one;
                lbl.rectTransform.offsetMin = Vector2.zero;
                lbl.rectTransform.offsetMax = Vector2.zero;

                // Checkmark on selected
                if (isSelected)
                {
                    var check = MakeText(row.transform, "\u2713", new Vector2(0f, 0f), 44,
                        new Color(0.25f, 0.15f, 0f));
                    check.fontStyle = FontStyle.Bold;
                    check.rectTransform.anchorMin = new Vector2(1f, 0.5f);
                    check.rectTransform.anchorMax = new Vector2(1f, 0.5f);
                    check.rectTransform.pivot = new Vector2(1f, 0.5f);
                    check.rectTransform.anchoredPosition = new Vector2(-30f, 0f);
                    check.rectTransform.sizeDelta = new Vector2(60f, 60f);
                }
            }

            _dropdownPopup.SetActive(true);
            _dropdownPopup.transform.SetAsLastSibling();
        }

        private void HideDropdown()
        {
            if (_dropdownPopup != null)
                _dropdownPopup.SetActive(false);
        }
    }
}