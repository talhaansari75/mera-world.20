using UnityEngine;

namespace MeraWorld.Core
{
    public class LetterTile : MonoBehaviour
    {
        public int Row;
        public int Column;
        public char Letter;

        [HideInInspector] public SelectionManager Manager;

        public bool IsSelected { get; private set; }
        public bool IsFound { get; private set; }
        public Color FoundColor { get; private set; }

        private SpriteRenderer _renderer;
        private Color _defaultColor;
        private Color _selectedColor;

        void Awake()
        {
            _renderer = GetComponent<SpriteRenderer>();
        }

        public void SetColors(Color defaultCol, Color selectedCol, Color foundCol)
        {
            _defaultColor = defaultCol;
            _selectedColor = selectedCol;
            FoundColor = foundCol;
            Refresh();
        }

        public void SetSelected(bool selected)
        {
            if (IsFound) return;
            IsSelected = selected;
            Refresh();
        }

        public void SetFound(Color color)
        {
            IsFound = true;
            IsSelected = false;
            FoundColor = color;
            Refresh();
        }

        private void Refresh()
        {
            if (_renderer == null) return;

            if (IsFound) _renderer.color = FoundColor;
            else if (IsSelected) _renderer.color = _selectedColor;
            else _renderer.color = _defaultColor;
        }
    }
}