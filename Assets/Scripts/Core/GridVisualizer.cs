using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class GridVisualizer : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        [Header("Visual Settings")]
        public float CellSize = 1.0f;
        public float CellGap = 0.05f;
        public Color CellColor = new Color(0.2f, 0.4f, 0.8f);
        public Color LetterColor = Color.white;
        private Sprite _squareSprite;

        private void Start()
        {
            if (GameManager == null)
            {
                Debug.LogError("GridVisualizer: GameManager not assigned!");
                return;
            }
            Invoke(nameof(BuildVisuals), 0.1f);
        }

        private void BuildVisuals()
        {
            var grid = GameManager.LastGeneratedGrid;
            if (grid == null)
            {
                Debug.LogError("GridVisualizer: No grid available.");
                return;
            }

            int rows = grid.Rows;
            int cols = grid.Columns;

            float totalWidth = cols * (CellSize + CellGap);
            float totalHeight = rows * (CellSize + CellGap);
            float originX = -totalWidth / 2f + CellSize / 2f;
            float originY = totalHeight / 2f - CellSize / 2f;

            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    var cell = grid.GetCell(r, c);
                    Vector3 pos = new Vector3(
                        originX + c * (CellSize + CellGap),
                        originY - r * (CellSize + CellGap),
                        0f);

                    CreateCellVisual(pos, cell.Letter, r, c);
                }
            }

            Debug.Log($"GridVisualizer: Rendered {rows}x{cols} grid.");
        }

        private void CreateCellVisual(Vector3 position, char letter, int row, int col)
        {
            var cellObj = new GameObject($"Cell_{row}_{col}");
            cellObj.transform.SetParent(transform);
            cellObj.transform.position = position;

            // Sprite
            var sr = cellObj.AddComponent<SpriteRenderer>();
            sr.sprite = _squareSprite ?? (_squareSprite = CreateSquareSprite());
            sr.color = CellColor;
            sr.sortingOrder = 0;

            // Collider for click detection
            var col2d = cellObj.AddComponent<BoxCollider2D>();
            col2d.size = new Vector2(CellSize, CellSize);

            // Letter tile behaviour
            var tile = cellObj.AddComponent<LetterTile>();
            tile.Row = row;
            tile.Column = col;
            tile.Letter = letter;

            if (SelectionManager != null)
            {
                tile.Manager = SelectionManager;
                tile.SetColors(CellColor, SelectionManager.SelectedColor, SelectionManager.FoundColor);
            }

            // Letter text
            var textObj = new GameObject("Letter");
            textObj.transform.SetParent(cellObj.transform);
            textObj.transform.localPosition = new Vector3(0, 0, -0.1f);

            var tm = textObj.AddComponent<TextMesh>();
            tm.text = letter.ToString();
            tm.color = LetterColor;
            tm.fontSize = 60;
            tm.characterSize = 0.05f;
            tm.anchor = TextAnchor.MiddleCenter;
            tm.alignment = TextAlignment.Center;
            tm.fontStyle = FontStyle.Bold;
        }

        private Sprite CreateSquareSprite()
        {
            int size = 32;
            var tex = new Texture2D(size, size);
            var pixels = new Color[size * size];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = Color.white;
            tex.SetPixels(pixels);
            tex.Apply();

            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }
    }
}