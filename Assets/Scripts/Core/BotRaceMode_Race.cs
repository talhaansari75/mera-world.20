using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class BotRaceMode
    {
        private void OnPlayerFoundWord(string word)
        {
            if (!IsActive) return;
            _playerFoundCount++;
            if (_bot != null)
                _bot.SetPlayerFoundCount(_playerFoundCount);
            if (_playerScoreText != null)
                _playerScoreText.text = "YOU: " + _playerFoundCount + "/" + _totalWords;
            UpdateBar(_playerProgressFill, _playerFoundCount);

            ShowToast(word, -370f, new Color(0.20f, 0.65f, 0.30f));

            CheckRaceEnd();
        }

        private void OnBotFoundWord(string word)
        {
            if (!IsActive || _bot == null) return;
            if (_botScoreText != null)
                _botScoreText.text = _bot.Name + ": " + _bot.FoundWords + "/" + _totalWords;
            UpdateBar(_botProgressFill, _bot.FoundWords);

            ShowToast(word, 370f, new Color(0.85f, 0.35f, 0.20f));

            CheckRaceEnd();
        }

        private void ShowToast(string word, float xPos, Color color)
        {
            if (_canvas == null) return;

            var toast = new GameObject("WordToast");
            toast.transform.SetParent(_canvas.transform, false);

            var bg = toast.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 20);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = toast.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(xPos, -230f);
            rt.sizeDelta = new Vector2(320f, 65f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(toast.transform, false);

            var txt = textObj.AddComponent<Text>();
            txt.text = "+ " + word;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 38;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            StartCoroutine(FadeAndDestroy(toast, 1.6f));
        }

        private IEnumerator FadeAndDestroy(GameObject obj, float lifetime)
        {
            yield return new WaitForSeconds(lifetime * 0.66f);

            if (obj == null) yield break;

            var canvasGroup = obj.AddComponent<CanvasGroup>();
            float fadeTime = lifetime * 0.34f;
            float elapsed = 0f;

            while (elapsed < fadeTime)
            {
                elapsed += Time.deltaTime;
                canvasGroup.alpha = 1f - (elapsed / fadeTime);
                yield return null;
            }

            if (obj != null) Destroy(obj);
        }

        private void UpdateBar(Image fill, int count)
        {
            if (fill == null) return;
            float pct = Mathf.Clamp01((float)count / Mathf.Max(1, _totalWords));
            fill.rectTransform.sizeDelta = new Vector2(236f * pct, -4f);
        }

        private void CheckRaceEnd()
        {
            if (_bot == null) return;
            bool playerDone = _playerFoundCount >= _totalWords;
            bool botDone = _bot.FoundWords >= _totalWords;

            if (playerDone && botDone) EndRace("draw");
            else if (playerDone) EndRace("win");
            else if (botDone) EndRace("lose");
        }

        private void EndRace(string result)
        {
            IsActive = false;

            switch (result)
            {
                case "win":
                    Debug.Log("[BotRace] Player WON!");
                    if (Progress != null) Progress.AddCoins(50);
                    ShowResult("YOU WIN!", "+50 bonus coins", new Color(0.25f, 0.75f, 0.35f));
                    break;
                case "lose":
                    Debug.Log("[BotRace] Bot won.");
                    ShowLoseScreen();
                    break;
                default:
                    Debug.Log("[BotRace] Draw.");
                    ShowResult("DRAW!", "Tie!", new Color(0.85f, 0.75f, 0.30f));
                    break;
            }
        }
    }
}