using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class GridVisualizer : MonoBehaviour
    {
        [Header("Grid Reference")]
        public GameManager GameManager;

        [Header("Visual Settings")]
        public float CellSize = 1.0f;
        public float CellGap = 0.05f;
        public Color CellColor = new Color(0.2f, 0.4f, 0.8f);
        public Color LetterColor = Color.white;

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

                    CreateCellVisual(pos, cell.Letter);
                }
            }

            Debug.Log($"GridVisualizer: Rendered {rows}x{cols} grid.");
        }

        private void CreateCellVisual(Vector3 position, char letter)
        {
            var cellObj = new GameObject($"Cell_{letter}");
            cellObj.transform.SetParent(transform);
            cellObj.transform.position = position;

            var sr = cellObj.AddComponent<SpriteRenderer>();
            sr.sprite = CreateSquareSprite();
            sr.color = CellColor;
            sr.sortingOrder = 0;

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