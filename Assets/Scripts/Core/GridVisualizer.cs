using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class GridVisualizer : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        [Header("Fit Settings")]
        [Tooltip("Grid kitni % screen width use kare (0.5 - 1.0)")]
        [Range(0.5f, 1.0f)]
        public float MaxWidthFraction = 0.92f;

        [Tooltip("Grid kitni % screen height use kare (0.3 - 0.8)")]
        [Range(0.3f, 0.8f)]
        public float MaxHeightFraction = 0.58f;

        [Tooltip("Cell ke size ke hisaab se gap ratio (0.05 - 0.30)")]
        [Range(0.05f, 0.30f)]
        public float GapRatio = 0.12f;

        [Tooltip("Grid ko vertically kitna shift kare (world units)")]
        public float GridOffsetY = 0.55f;

        private static readonly Color TileTop    = new Color(0.42f, 0.68f, 1.00f);
        private static readonly Color TileMid    = new Color(0.20f, 0.42f, 0.85f);
        private static readonly Color TileBottom = new Color(0.08f, 0.20f, 0.55f);

        private static readonly Color PanelTop    = new Color(0.14f, 0.22f, 0.42f);
        private static readonly Color PanelBottom = new Color(0.05f, 0.08f, 0.20f);
        private static readonly Color GoldRim     = new Color(1.00f, 0.82f, 0.30f);

        private static readonly Color LetterColor       = new Color(1f, 1f, 1f);
        private static readonly Color LetterShadowColor = new Color(0f, 0f, 0f, 0.55f);
        private static readonly Color StarColor         = new Color(0.9f, 0.95f, 1.0f, 0.5f);

        private Sprite _tileSprite;
        private Sprite _panelSprite;
        private Sprite _rimSprite;
        private Sprite _circleSprite;

        private void Start()
        {
            if (GameManager == null)
            {
                Debug.LogError("GridVisualizer: GameManager not assigned!");
                return;
            }

            _tileSprite   = CreateTileSprite(160, 30);
            _panelSprite  = CreateGradientRoundedSprite(160, 18, PanelTop, PanelBottom);
            _rimSprite    = CreateRoundedSprite(160, 18);
            _circleSprite = CreateCircleSprite(32);

            Invoke(nameof(BuildVisuals), 0.1f);
        }

        private void BuildVisuals()
        {
            var grid = GameManager.LastGeneratedGrid;
            if (grid == null) return;

            Camera cam = Camera.main;
            if (cam == null || !cam.orthographic)
            {
                Debug.LogError("GridVisualizer: needs an orthographic Main Camera (tagged 'MainCamera').");
                return;
            }

            int rows = grid.Rows;
            int cols = grid.Columns;

            // ---- Compute camera viewport in world units ----
            float camHeight = cam.orthographicSize * 2f;
            float camWidth  = camHeight * ((float)Screen.width / Screen.height);

            float availW = camWidth  * MaxWidthFraction;
            float availH = camHeight * MaxHeightFraction;

            // ---- Compute cell size so that grid fits both width & height ----
            // totalWidth  = cols * cell + (cols-1) * cell * gapRatio
            // totalHeight = rows * cell + (rows-1) * cell * gapRatio
            float denomW = cols + (cols - 1) * GapRatio;
            float denomH = rows + (rows - 1) * GapRatio;

            float cellFromW = availW / denomW;
            float cellFromH = availH / denomH;
            float cellSize  = Mathf.Min(cellFromW, cellFromH);

            float cellGap = cellSize * GapRatio;
            float pad     = cellSize * 0.45f;

            float totalWidth  = cols * cellSize + (cols - 1) * cellGap;
            float totalHeight = rows * cellSize + (rows - 1) * cellGap;
            float panelW = totalWidth  + pad;
            float panelH = totalHeight + pad;

            float originX = -totalWidth  / 2f + cellSize / 2f;
            float originY =  totalHeight / 2f - cellSize / 2f;

            Debug.Log($"[GridVisualizer] Screen {Screen.width}x{Screen.height} " +
                      $"({(float)Screen.width / Screen.height:F2}) → " +
                      $"cell {cellSize:F3}, grid {rows}x{cols}, panel {panelW:F2}x{panelH:F2}");

            CreateStarfield(panelW * 4f, panelH * 4f, 60);

            // ---- Gold rim ----
            var rimObj = new GameObject("GoldRim");
            rimObj.transform.SetParent(transform);
            rimObj.transform.position = new Vector3(0f, GridOffsetY, 1.5f);
            var rimSr = rimObj.AddComponent<SpriteRenderer>();
            rimSr.sprite = _rimSprite;
            rimSr.color = GoldRim;
            rimSr.sortingOrder = -12;
            rimObj.transform.localScale = new Vector3(panelW + 0.12f, panelH + 0.12f, 1f);

            // ---- Dark inner rim ----
            var rimDarkObj = new GameObject("RimDark");
            rimDarkObj.transform.SetParent(transform);
            rimDarkObj.transform.position = new Vector3(0f, GridOffsetY, 1.4f);
            var rimDarkSr = rimDarkObj.AddComponent<SpriteRenderer>();
            rimDarkSr.sprite = _rimSprite;
            rimDarkSr.color = new Color(0.02f, 0.03f, 0.08f);
            rimDarkSr.sortingOrder = -11;
            rimDarkObj.transform.localScale = new Vector3(panelW + 0.06f, panelH + 0.06f, 1f);

            // ---- Panel background ----
            var panelObj = new GameObject("GridPanel");
            panelObj.transform.SetParent(transform);
            panelObj.transform.position = new Vector3(0f, GridOffsetY, 1f);
            var panelSr = panelObj.AddComponent<SpriteRenderer>();
            panelSr.sprite = _panelSprite;
            panelSr.color = Color.white;
            panelSr.sortingOrder = -10;
            panelObj.transform.localScale = new Vector3(panelW, panelH, 1f);

            // ---- Letter cells ----
            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    var cell = grid.GetCell(r, c);
                    Vector3 pos = new Vector3(
                        originX + c * (cellSize + cellGap),
                        originY - r * (cellSize + cellGap) + GridOffsetY,
                        0f);

                    CreateCellVisual(pos, cell.Letter, r, c, cellSize);
                }
            }
        }

        private void CreateStarfield(float width, float height, int count)
        {
            var starfieldObj = new GameObject("Starfield");
            starfieldObj.transform.SetParent(transform);
            starfieldObj.transform.position = new Vector3(0f, 0f, 5f);

            var rng = new System.Random(42);
            for (int i = 0; i < count; i++)
            {
                var starObj = new GameObject($"Star_{i}");
                starObj.transform.SetParent(starfieldObj.transform, false);

                float x = (float)(rng.NextDouble() - 0.5) * width;
                float y = (float)(rng.NextDouble() - 0.5) * height;
                float size = (float)(rng.NextDouble() * 0.06 + 0.02);

                starObj.transform.localPosition = new Vector3(x, y, 0f);
                starObj.transform.localScale = new Vector3(size, size, 1f);

                var sr = starObj.AddComponent<SpriteRenderer>();
                sr.sprite = _circleSprite;
                sr.color = new Color(StarColor.r, StarColor.g, StarColor.b,
                    (float)(rng.NextDouble() * 0.5 + 0.15));
                sr.sortingOrder = -20;
            }
        }

        private void CreateCellVisual(Vector3 position, char letter, int row, int col, float cellSize)
        {
            var cellObj = new GameObject($"Cell_{row}_{col}");
            cellObj.transform.SetParent(transform);
            cellObj.transform.position = position;
            cellObj.transform.localScale = new Vector3(cellSize, cellSize, 1f);

            // Shadow
            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(cellObj.transform, false);
            shadowObj.transform.localPosition = new Vector3(0.02f, -0.10f, 0f);
            var shadowSr = shadowObj.AddComponent<SpriteRenderer>();
            shadowSr.sprite = _tileSprite;
            shadowSr.color = new Color(0f, 0f, 0f, 0.40f);
            shadowSr.sortingOrder = 0;
            shadowObj.transform.localScale = new Vector3(1.05f, 1.05f, 1f);

            // Tile background
            var sr = cellObj.AddComponent<SpriteRenderer>();
            sr.sprite = _tileSprite;
            sr.color = Color.white;
            sr.sortingOrder = 1;

            var col2d = cellObj.AddComponent<BoxCollider2D>();
            col2d.size = new Vector2(1f, 1f);

            var tile = cellObj.AddComponent<LetterTile>();
            tile.Row = row;
            tile.Column = col;
            tile.Letter = letter;

            if (SelectionManager != null)
            {
                tile.Manager = SelectionManager;
                tile.SetColors(
                    Color.white,
                    new Color(1f, 0.85f, 0.30f, 0.98f),
                    new Color(0.35f, 0.95f, 0.55f, 0.98f));
            }

            // Text scale relative to cell size (0.058f was for cellSize 0.78)
            float charSize = cellSize * 0.075f;

            // Letter shadow
            var textShadowObj = new GameObject("LetterShadow");
            textShadowObj.transform.SetParent(cellObj.transform, false);
            textShadowObj.transform.localPosition = new Vector3(0.03f, -0.03f, -0.49f);
            textShadowObj.transform.localScale = Vector3.one;

            var tms = textShadowObj.AddComponent<TextMesh>();
            tms.text = letter.ToString();
            tms.color = LetterShadowColor;
            tms.fontSize = 100;
            tms.characterSize = charSize;
            tms.anchor = TextAnchor.MiddleCenter;
            tms.alignment = TextAlignment.Center;
            tms.fontStyle = FontStyle.Bold;
            tms.richText = false;

            var mrs = textShadowObj.GetComponent<MeshRenderer>();
            if (mrs != null)
            {
                mrs.sortingOrder = 9;
                mrs.material = tms.font.material;
            }

            // Letter
            var textObj = new GameObject("Letter");
            textObj.transform.SetParent(cellObj.transform, false);
            textObj.transform.localPosition = new Vector3(0f, 0f, -0.5f);
            textObj.transform.localScale = Vector3.one;

            var tm = textObj.AddComponent<TextMesh>();
            tm.text = letter.ToString();
            tm.color = LetterColor;
            tm.fontSize = 100;
            tm.characterSize = charSize;
            tm.anchor = TextAnchor.MiddleCenter;
            tm.alignment = TextAlignment.Center;
            tm.fontStyle = FontStyle.Bold;
            tm.richText = false;

            var mr = textObj.GetComponent<MeshRenderer>();
            if (mr != null)
            {
                mr.sortingOrder = 10;
                mr.material = tm.font.material;
            }
        }

        // ---------------------------------------------------------------
        // Sprite helpers (unchanged)
        // ---------------------------------------------------------------

        private Sprite CreateTileSprite(int size, int radius)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            {
                float t = (float)y / size;

                Color rowColor;
                if (t < 0.5f)
                    rowColor = Color.Lerp(TileBottom, TileMid, t * 2f);
                else
                    rowColor = Color.Lerp(TileMid, TileTop, (t - 0.5f) * 2f);

                for (int x = 0; x < size; x++)
                {
                    float dist = DistanceToCorner(x, y, size, radius);
                    float alpha = Mathf.Clamp01(radius - dist + 0.5f);

                    Color c = rowColor;
                    float topBand = Mathf.InverseLerp(0.78f, 0.92f, t);
                    float shineStrength = Mathf.Sin(topBand * Mathf.PI) * 0.35f;
                    c = Color.Lerp(c, Color.white, shineStrength);

                    c.a *= alpha;
                    pixels[y * size + x] = c;
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        private Sprite CreateGradientRoundedSprite(int size, int radius, Color bottom, Color top)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            {
                float t = (float)y / size;
                Color rowColor = Color.Lerp(bottom, top, t);

                for (int x = 0; x < size; x++)
                {
                    float dist = DistanceToCorner(x, y, size, radius);
                    float alpha = Mathf.Clamp01(radius - dist + 0.5f);
                    Color c = rowColor;
                    c.a *= alpha;
                    pixels[y * size + x] = c;
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        private Sprite CreateRoundedSprite(int size, int radius)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dist = DistanceToCorner(x, y, size, radius);
                    float alpha = Mathf.Clamp01(radius - dist + 0.5f);
                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        private Sprite CreateCircleSprite(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            float half = size / 2f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dx = x - half + 0.5f;
                    float dy = y - half + 0.5f;
                    float d = Mathf.Sqrt(dx * dx + dy * dy);
                    float alpha = Mathf.Clamp01(half - d);
                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        private float DistanceToCorner(int x, int y, int size, int radius)
        {
            int cx = x < radius ? radius : (x >= size - radius ? size - radius - 1 : x);
            int cy = y < radius ? radius : (y >= size - radius ? size - radius - 1 : y);

            if (cx == x && cy == y) return 0f;

            float dx = x - cx;
            float dy = y - cy;
            return Mathf.Sqrt(dx * dx + dy * dy);
        }
    }
}