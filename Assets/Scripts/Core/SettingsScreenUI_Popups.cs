using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class SettingsScreenUI
    {
        private void BuildConfirmDialog()
        {
            _confirmDialog = new GameObject("ConfirmDialog", typeof(RectTransform));
            _confirmDialog.transform.SetParent(_canvas.transform, false);
            var rt = _confirmDialog.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero; rt.offsetMax = Vector2.zero;

            var dim = _confirmDialog.AddComponent<Image>();
            dim.color = new Color(0f, 0f, 0f, 0.75f);

            var box = new GameObject("Box", typeof(RectTransform));
            box.transform.SetParent(_confirmDialog.transform, false);
            var boxImg = box.AddComponent<Image>();
            boxImg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 40);
            boxImg.type = Image.Type.Sliced;
            var brt = box.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(880f, 700f);

            _confirmTitle = MakeText(box.transform, "Title", new Vector2(0f, 260f), 44, TEXT_GOLD);
            _confirmMsg = MakeText(box.transform, "Message", new Vector2(0f, 30f), 30, new Color(1f, 0.95f, 0.85f));
            _confirmMsg.rectTransform.sizeDelta = new Vector2(800f, 340f);
            _confirmMsg.horizontalOverflow = HorizontalWrapMode.Wrap;
            _confirmMsg.verticalOverflow = VerticalWrapMode.Overflow;

            var yesBtn = MakeButton(box.transform, "YES", new Vector2(-190f, -250f), new Vector2(320f, 100f), RED);
            yesBtn.onClick.AddListener(() => { PlayClick(); _confirmDialog.SetActive(false); _confirmYes?.Invoke(); });

            var noBtn = MakeButton(box.transform, "CANCEL", new Vector2(190f, -250f), new Vector2(320f, 100f), GREY);
            noBtn.onClick.AddListener(() => { PlayClick(); _confirmDialog.SetActive(false); _confirmNo?.Invoke(); });

            _confirmDialog.SetActive(false);
        }

        private void BuildInfoPopup()
        {
            _infoPopup = new GameObject("InfoPopup", typeof(RectTransform));
            _infoPopup.transform.SetParent(_canvas.transform, false);
            var rt = _infoPopup.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero; rt.offsetMax = Vector2.zero;

            var dim = _infoPopup.AddComponent<Image>();
            dim.color = new Color(0f, 0f, 0f, 0.8f);

            var box = new GameObject("Box", typeof(RectTransform));
            box.transform.SetParent(_infoPopup.transform, false);
            var boxImg = box.AddComponent<Image>();
            boxImg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 40);
            boxImg.type = Image.Type.Sliced;
            var brt = box.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(920f, 1200f);

            _infoTitle = MakeText(box.transform, "Title", new Vector2(0f, 500f), 46, TEXT_GOLD);
            _infoMsg = MakeText(box.transform, "Message", new Vector2(0f, 0f), 28, new Color(1f, 0.95f, 0.85f));
            _infoMsg.rectTransform.sizeDelta = new Vector2(840f, 880f);
            _infoMsg.horizontalOverflow = HorizontalWrapMode.Wrap;
            _infoMsg.verticalOverflow = VerticalWrapMode.Overflow;
            _infoMsg.alignment = TextAnchor.UpperLeft;

            var closeBtn = MakeButton(box.transform, "CLOSE", new Vector2(0f, -520f), new Vector2(400f, 100f), GREEN);
            closeBtn.onClick.AddListener(() => { PlayClick(); _infoPopup.SetActive(false); });

            _infoPopup.SetActive(false);
        }

        private void BuildToast()
        {
            _toastObj = new GameObject("Toast", typeof(RectTransform));
            _toastObj.transform.SetParent(_canvas.transform, false);
            var img = _toastObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.10f, 0.30f, 0.98f), 256, 40);
            img.type = Image.Type.Sliced;
            var rt = _toastObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -220f);
            rt.sizeDelta = new Vector2(880f, 110f);

            _toastText = MakeText(_toastObj.transform, "", Vector2.zero, 30, TEXT_GOLD);
            _toastText.rectTransform.anchorMin = Vector2.zero;
            _toastText.rectTransform.anchorMax = Vector2.one;
            _toastText.rectTransform.offsetMin = Vector2.zero;
            _toastText.rectTransform.offsetMax = Vector2.zero;

            _toastObj.SetActive(false);
        }

        private void ShowToast(string msg)
        {
            if (_toastObj == null) return;
            _toastObj.SetActive(true);
            _toastText.text = msg;
            CancelInvoke(nameof(HideToast));
            Invoke(nameof(HideToast), 2.2f);
        }

        private void HideToast() { if (_toastObj != null) _toastObj.SetActive(false); }

        private void ShowConfirm(string title, string msg, System.Action onYes, System.Action onNo = null)
        {
            _confirmTitle.text = title;
            _confirmMsg.text = msg;
            _confirmYes = onYes;
            _confirmNo = onNo;
            _confirmDialog.SetActive(true);
        }

        private void ShowInfo(string title, string msg)
        {
            _infoTitle.text = title;
            _infoMsg.text = msg;
            _infoPopup.SetActive(true);
        }
    }
}