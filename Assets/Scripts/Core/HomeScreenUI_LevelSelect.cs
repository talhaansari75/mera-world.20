using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public partial class HomeScreenUI
    {
        private GameObject _levelGridParent;

        private void BuildLevelSelectCanvas()
        {
            var canvasObj = new GameObject("LevelSelectCanvas");
            canvasObj.transform.SetParent(transform, false);
            _levelSelectCanvas = canvasObj.AddComponent<Canvas>();
            _levelSelectCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _levelSelectCanvas.sortingOrder = 501;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var bgObj = new GameObject("Background");
            bgObj.transform.SetParent(_levelSelectCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.CreateGradientSprite(BG_BOTTOM, BG_TOP, 32, 256);
            bgImg.color = Color.white;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            CreateText(_levelSelectCanvas.transform, "SELECT LEVEL",
                new Vector2(0f, 830f), 70, GOLD, FontStyle.Bold, true);

            CreateSmallButton(_levelSelectCanvas.transform, "◀ BACK",
                new Vector2(-380f, 830f), new Color(0.5f, 0.5f, 0.55f), OnBackToHome);

            _levelSelectCanvas.gameObject.SetActive(false);
        }

        private void BuildLevelSelectContent()
        {
            if (_levelGridParent != null) Destroy(_levelGridParent);

            _levelGridParent = new GameObject("LevelGrid");
            _levelGridParent.transform.SetParent(_levelSelectCanvas.transform, false);

            var rt = _levelGridParent.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(1000f, 1400f);

            var grid = _levelGridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(170f, 200f);
            grid.spacing = new Vector2(15f, 15f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 5;
            grid.padding = new RectOffset(30, 30, 30, 30);

            int highest = Progress != null ? Progress.HighestLevelUnlocked : 1;
            int totalLevels = Mathf.Max(highest + 10, 100);

            for (int i = 1; i <= totalLevels; i++)
            {
                int levelNum = i;
                bool unlocked = i <= highest;
                int stars = PlayerPrefs.GetInt(STARS_KEY_PREFIX + i, 0);
                CreateLevelCard(i, unlocked, stars, () => OnLevelClicked(levelNum));
            }
        }

        private void CreateLevelCard(int level, bool unlocked, int stars, UnityEngine.Events.UnityAction onClick)
        {
            var cardObj = new GameObject($"Level_{level}");
            cardObj.transform.SetParent(_levelGridParent.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(
                unlocked ? new Color(0.25f, 0.55f, 0.90f) : new Color(0.25f, 0.28f, 0.35f),
                256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;

            var btn = cardObj.AddComponent<Button>();
            btn.interactable = unlocked;
            if (unlocked) btn.onClick.AddListener(onClick);

            var numObj = new GameObject("Num");
            numObj.transform.SetParent(cardObj.transform, false);
            var numTxt = numObj.AddComponent<Text>();
            numTxt.text = unlocked ? level.ToString() : "X";
            numTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            numTxt.fontSize = 60;
            numTxt.fontStyle = FontStyle.Bold;
            numTxt.color = Color.white;
            numTxt.alignment = TextAnchor.MiddleCenter;
            numTxt.raycastTarget = false;
            var numShadow = numObj.AddComponent<Shadow>();
            numShadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
            numShadow.effectDistance = new Vector2(2f, -2f);

            var numRt = numObj.GetComponent<RectTransform>();
            numRt.anchorMin = new Vector2(0f, 0.3f);
            numRt.anchorMax = new Vector2(1f, 1f);
            numRt.offsetMin = Vector2.zero;
            numRt.offsetMax = Vector2.zero;

            if (unlocked)
            {
                for (int s = 0; s < 3; s++)
                {
                    var starObj = new GameObject($"Star_{s}");
                    starObj.transform.SetParent(cardObj.transform, false);
                    var starImg = starObj.AddComponent<Image>();
                    starImg.sprite = UISpriteFactory.Create3DSphereSprite(
                        s < stars ? new Color(1f, 0.85f, 0.25f) : new Color(0.30f, 0.35f, 0.45f), 64);
                    starImg.raycastTarget = false;
                    var starRt = starObj.GetComponent<RectTransform>();
                    starRt.anchorMin = new Vector2(0.5f, 0f);
                    starRt.anchorMax = new Vector2(0.5f, 0f);
                    starRt.pivot = new Vector2(0.5f, 0.5f);
                    starRt.anchoredPosition = new Vector2(-35f + s * 35f, 30f);
                    starRt.sizeDelta = new Vector2(28f, 28f);
                }
            }
        }

        private void OnLevelClicked(int level) { StartLevel(level); }

        private void OnBackToHome()
        {
            IsHomeVisible = true;
            _levelSelectCanvas.gameObject.SetActive(false);
            _homeCanvas.gameObject.SetActive(true);
        }

        private void StartLevel(int level)
        {
            if (Progress != null) Progress.SetCurrentLevel(level);
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", level);
                PlayerPrefs.Save();
            }

            _skipHomeForThisSession = true;
            ShowGameplay();

            Debug.Log($"➡️ Loading Level {level}...");
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }
    }
}