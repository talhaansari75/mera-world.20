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

        private SpriteRenderer _renderer;
        private Color _defaultColor;
        private Color _selectedColor;
        private Color _foundColor;

        void Awake()
        {
            _renderer = GetComponent<SpriteRenderer>();
        }

        public void SetColors(Color defaultCol, Color selectedCol, Color foundCol)
        {
            _defaultColor = defaultCol;
            _selectedColor = selectedCol;
            _foundColor = foundCol;
            Refresh();
        }

        public void SetSelected(bool selected)
        {
            IsSelected = selected;
            Refresh();
        }

        public void SetFound()
        {
            IsFound = true;
            IsSelected = false;
            Refresh();
        }

        private void Refresh()
        {
            if (_renderer == null) return;

            // Priority: selected > found > default
            if (IsSelected) _renderer.color = _selectedColor;
            else if (IsFound) _renderer.color = _foundColor;
            else _renderer.color = _defaultColor;
        }
    }
}