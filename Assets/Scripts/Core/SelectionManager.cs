using System.Collections.Generic;
using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    /// <summary>
    /// Tracks letter selection using mouse position (works with new Input System).
    /// </summary>
    public class SelectionManager : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;

        [Header("Colors")]
        public Color SelectedColor = new Color(0.95f, 0.75f, 0.2f);
        public Color FoundColor = new Color(0.25f, 0.75f, 0.3f);

        private readonly List<LetterTile> _selection = new List<LetterTile>();
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
                if (tile != null && !tile.IsFound)
                {
                    ClearSelection();
                    _isDragging = true;
                    Add(tile);
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
            if (tile == null || tile.IsFound) return;
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
            foreach (var t in _selection) t.SetSelected(false);
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

            if (word != null && WordValidator.IsPlacedWord(_grid, cells))
            {
                Debug.Log($"✅ Word found: {word}");
                foreach (var t in _selection) t.SetFound();
                _selection.Clear();
            }
            else
            {
                Debug.Log($"❌ Not a word: {word ?? "(invalid)"}");
                ClearSelection();
            }
        }
    }
}