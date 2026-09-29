using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class SelectionManager : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;

        [Header("Colors")]
        public Color SelectedColor = new Color(0.95f, 0.85f, 0.30f, 0.70f);
        public Color FoundColor = new Color(0.40f, 0.85f, 0.40f, 0.85f);

        [Header("Rewards")]
        public int CoinsPerWord = 5;

        public event Action<string> OnWordFound;
        public event Action OnLevelComplete;

        private static readonly Color[] WordColors = new Color[]
        {
            new Color(0.30f, 0.85f, 0.40f, 0.85f),
            new Color(0.95f, 0.30f, 0.55f, 0.85f),
            new Color(1.00f, 0.65f, 0.20f, 0.85f),
            new Color(0.65f, 0.40f, 0.85f, 0.85f),
            new Color(0.20f, 0.75f, 0.85f, 0.85f),
            new Color(0.95f, 0.35f, 0.35f, 0.85f),
            new Color(0.95f, 0.85f, 0.30f, 0.85f),
            new Color(0.35f, 0.55f, 0.95f, 0.85f),
        };

        private readonly List<LetterTile> _selection = new List<LetterTile>();
        private readonly HashSet<string> _foundWords = new HashSet<string>();
        private int _colorIndex = 0;
        private bool _isDragging;
        private WordGrid _grid;
        private Camera _cam;

        void Start()
        {
            _cam = Camera.main;
            if (GameManager != null)
                _grid = GameManager.LastGeneratedGrid;
        }

        void Update()
        {
            if (_cam == null) _cam = Camera.main;
            if (_grid == null && GameManager != null)
                _grid = GameManager.LastGeneratedGrid;

            bool pressed = Input.GetMouseButton(0);
            bool down = Input.GetMouseButtonDown(0);
            bool up = Input.GetMouseButtonUp(0);

            if (down)
            {
                var tile = GetTileUnderMouse();
                if (tile != null)
                {
                    ClearSelection();
                    _isDragging = true;
                    Add(tile);
                    if (SoundManager.Instance != null) SoundManager.Instance.PlayLetterSelect();
                    if (VibrationManager.Instance != null) VibrationManager.Instance.VibrateLight();
                }
            }
            else if (pressed && _isDragging)
            {
                var tile = GetTileUnderMouse();
                if (tile != null) TryAddAdjacent(tile);
            }
            else if (up && _isDragging)
            {
                _isDragging = false;
                if (_selection.Count >= 2) Validate();
                else ClearSelection();
            }
        }

        private LetterTile GetTileUnderMouse()
        {
            if (_cam == null) return null;
            Vector3 world = _cam.ScreenToWorldPoint(Input.mousePosition);
            Vector2 point = new Vector2(world.x, world.y);
            var hits = Physics2D.OverlapPointAll(point);
            foreach (var h in hits)
            {
                var tile = h.GetComponent<LetterTile>();
                if (tile != null) return tile;
            }
            return null;
        }

        private void TryAddAdjacent(LetterTile tile)
        {
            if (tile == null) return;
            if (_selection.Contains(tile)) return;

            var last = _selection[_selection.Count - 1];
            int dr = tile.Row - last.Row;
            int dc = tile.Column - last.Column;

            if (Mathf.Abs(dr) > 1 || Mathf.Abs(dc) > 1) return;

            if (_selection.Count >= 2)
            {
                var first = _selection[0];
                int baseDR = last.Row - first.Row;
                int baseDC = last.Column - first.Column;
                baseDR = baseDR == 0 ? 0 : (baseDR > 0 ? 1 : -1);
                baseDC = baseDC == 0 ? 0 : (baseDC > 0 ? 1 : -1);

                int stepDR = dr == 0 ? 0 : (dr > 0 ? 1 : -1);
                int stepDC = dc == 0 ? 0 : (dc > 0 ? 1 : -1);

                if (stepDR != baseDR || stepDC != baseDC) return;
            }

            Add(tile);
        }

        private void Add(LetterTile tile)
        {
            _selection.Add(tile);
            tile.SetSelected(true);
        }

        private void ClearSelection()
        {
            foreach (var t in _selection)
                if (!t.IsFound) t.SetSelected(false);
            _selection.Clear();
        }

        private void Validate()
        {
            var cells = new List<GridCell>();
            foreach (var t in _selection)
            {
                var cell = _grid.GetCell(t.Row, t.Column);
                if (cell != null) cells.Add(cell);
            }

            var word = WordValidator.ExtractWord(cells);

            if (word == null || !WordValidator.IsPlacedWord(_grid, cells))
            {
                Debug.Log($"Not a word: {word ?? "(invalid)"}");
                if (SoundManager.Instance != null) SoundManager.Instance.PlayWordInvalid();
                if (VibrationManager.Instance != null) VibrationManager.Instance.VibrateMedium();
                if (ScreenShakeUI.Instance != null) ScreenShakeUI.Instance.Shake(0.2f, 0.08f);
                ClearSelection();
                return;
            }

            string normalized = NormalizeWord(word);
            if (_foundWords.Contains(normalized))
            {
                ClearSelection();
                return;
            }

            Debug.Log($"Word found: {word}");
            if (SoundManager.Instance != null) SoundManager.Instance.PlayWordFound();
            if (VibrationManager.Instance != null) VibrationManager.Instance.VibrateMedium();

            _foundWords.Add(normalized);

            Color wordColor = WordColors[_colorIndex % WordColors.Length];
            _colorIndex++;

            foreach (var t in _selection) t.SetFound(wordColor);
            _selection.Clear();

            if (PlayerProgressManager.Instance != null)
            {
                PlayerProgressManager.Instance.AddCoins(CoinsPerWord);
                PlayerProgressManager.Instance.AddWordFound();
            }

            if (ComboSystem.Instance != null)
                ComboSystem.Instance.RegisterWordFound();

            if (AchievementManager.Instance != null)
            {
                AchievementManager.Instance.AddProgress("first_word", 1);
                AchievementManager.Instance.AddProgress("word_hunter", 1);
                AchievementManager.Instance.AddProgress("word_master", 1);
            }

            OnWordFound?.Invoke(word);

            if (GameManager != null && _foundWords.Count >= GameManager.Words.Count)
            {
                Debug.Log("LEVEL COMPLETE!");
                if (SoundManager.Instance != null) SoundManager.Instance.PlayLevelComplete();
                if (VibrationManager.Instance != null) VibrationManager.Instance.VibrateHeavy();

                if (AchievementManager.Instance != null)
                {
                    AchievementManager.Instance.AddProgress("first_level", 1);
                    AchievementManager.Instance.AddProgress("level_5", 1);
                    AchievementManager.Instance.AddProgress("level_10", 1);
                }

                if (ComboSystem.Instance != null)
                    ComboSystem.Instance.ResetCombo();

                OnLevelComplete?.Invoke();
            }
        }

        public string GetRandomUnfoundWord()
        {
            if (GameManager == null) return null;

            var unfound = new List<string>();
            foreach (var w in GameManager.Words)
            {
                if (!_foundWords.Contains(NormalizeWord(w)))
                    unfound.Add(w);
            }

            if (unfound.Count == 0) return null;
            return unfound[UnityEngine.Random.Range(0, unfound.Count)];
        }

        public void HintWord(string word)
        {
            if (string.IsNullOrEmpty(word) || _grid == null) return;

            word = word.ToUpperInvariant();
            var (dr, dc) = FindWordDirection(word);
            if (dr == 0 && dc == 0) return;

            for (int r = 0; r < _grid.Rows; r++)
            {
                for (int c = 0; c < _grid.Columns; c++)
                {
                    if (_grid.GetCell(r, c).Letter != word[0]) continue;

                    bool matches = true;
                    for (int i = 0; i < word.Length; i++)
                    {
                        int rr = r + dr * i;
                        int cc = c + dc * i;
                        var cell = _grid.GetCell(rr, cc);
                        if (cell == null || cell.Letter != word[i]) { matches = false; break; }
                    }

                    if (matches)
                    {
                        for (int i = 0; i < word.Length; i++)
                        {
                            int rr = r + dr * i;
                            int cc = c + dc * i;
                            var tile = GetTileAt(rr, cc);
                            if (tile != null) StartCoroutine(FlashTile(tile));
                        }
                        return;
                    }
                }
            }
        }

        private (int dr, int dc) FindWordDirection(string word)
        {
            var dirs = new (int, int)[]
            {
                (0, 1), (0, -1), (1, 0), (-1, 0),
                (1, 1), (1, -1), (-1, 1), (-1, -1)
            };

            foreach (var (dr, dc) in dirs)
            {
                for (int r = 0; r < _grid.Rows; r++)
                {
                    for (int c = 0; c < _grid.Columns; c++)
                    {
                        if (_grid.GetCell(r, c).Letter != word[0]) continue;

                        bool matches = true;
                        for (int i = 0; i < word.Length; i++)
                        {
                            int rr = r + dr * i;
                            int cc = c + dc * i;
                            var cell = _grid.GetCell(rr, cc);
                            if (cell == null || cell.Letter != word[i]) { matches = false; break; }
                        }

                        if (matches) return (dr, dc);
                    }
                }
            }
            return (0, 0);
        }

        private LetterTile GetTileAt(int row, int col)
        {
            var allTiles = FindObjectsByType<LetterTile>(FindObjectsSortMode.None);
            foreach (var t in allTiles)
            {
                if (t.Row == row && t.Column == col) return t;
            }
            return null;
        }

        private IEnumerator FlashTile(LetterTile tile)
        {
            var sr = tile.GetComponent<SpriteRenderer>();
            if (sr == null) yield break;

            Color original = sr.color;
            Color flash = new Color(1f, 0.85f, 0.20f, 1f);

            for (int i = 0; i < 3; i++)
            {
                sr.color = flash;
                yield return new WaitForSeconds(0.25f);
                sr.color = original;
                yield return new WaitForSeconds(0.25f);
            }
        }

        private string NormalizeWord(string word)
        {
            word = word.ToUpperInvariant();
            var arr = word.ToCharArray();
            Array.Reverse(arr);
            var reversed = new string(arr);
            return string.CompareOrdinal(word, reversed) <= 0 ? word : reversed;
        }
    }
}