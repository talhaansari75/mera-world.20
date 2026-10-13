using UnityEngine;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class GridVisualizer : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        // Ye 2 values badli hain Ã¢â‚¬â€ pehle 0.60f/0.10f the
        private const float CellSize = 0.72f;
        private const float CellGap  = 0.08f;
        private const float GridOffsetX = 0f;
        private const float GridOffsetY = 0.55f;

        private static readonly Color ProdTileTop    = new Color(0.45f, 0.30f, 0.75f);
        private static readonly Color ProdTileMid    = new Color(0.28f, 0.15f, 0.55f);
        private static readonly Color ProdTileBottom = new Color(0.12f, 0.05f, 0.25f);

        private static readonly Color TestTileTop    = new Color(1.00f, 0.99f, 0.96f);
        private static readonly Color TestTileMid    = new Color(0.97f, 0.95f, 0.90f);
        private static readonly Color TestTileBottom = new Color(0.92f, 0.88f, 0.82f);
        private static readonly Color TestPanelTop    = new Color(0.98f, 0.96f, 0.90f);
        private static readonly Color TestPanelBottom = new Color(0.88f, 0.84f, 0.76f);

        private static Color TileTop    { get { return TestModeTheme.IsActive ? TestTileTop    : ProdTileTop;    } }
        private static Color TileMid    { get { return TestModeTheme.IsActive ? TestTileMid    : ProdTileMid;    } }
        private static Color TileBottom { get { return TestModeTheme.IsActive ? TestTileBottom : ProdTileBottom; } }
        private static Color PanelTop    { get { return TestModeTheme.IsActive ? TestPanelTop    : ProdPanelTop;    } }
        private static Color PanelBottom { get { return TestModeTheme.IsActive ? TestPanelBottom : ProdPanelBottom; } }

        private static readonly Color ProdPanelTop    = new Color(0.28f, 0.10f, 0.48f);
        private static readonly Color ProdPanelBottom = new Color(0.12f, 0.05f, 0.25f);
        private static readonly Color GoldRim     = new Color(1.00f, 0.82f, 0.30f);

        private static readonly Color LetterColor       = new Color(1f, 1f, 1f);
        private static readonly Color LetterShadowColor = new Color(0f, 0f, 0f, 0.55f);
        private static readonly Color StarColor         = new Color(0.9f, 0.95f, 1.0f, 0.5f);

        private Sprite _tileSprite;
        private Sprite _panelSprite;
        private Sprite _rimSprite;
        private Sprite _circleSprite;
        
        // IDEMPOTENT GUARD: track what we last built
        
        
        

        private void Start()
        {
            if (GameManager == null)
            {
                Debug.LogError("GridVisualizer: GameManager not assigned!");
                return;
            }

            // Try premium tile first
            Sprite premiumTile = Resources.Load<Sprite>("UI/Premium/tile_glossy");
            _tileSprite = premiumTile != null ? premiumTile : CreateTileSprite(160, 30);
            Debug.Log("[GridVisualizer] Tile: " + (premiumTile != null ? "premium" : "fallback"));
            _panelSprite  = CreateGradientRoundedSprite(160, 18, PanelTop, PanelBottom);
            _rimSprite    = CreateRoundedSprite(160, 18);
            _circleSprite = CreateCircleSprite(32);

            Invoke(nameof(BuildVisuals), 0.1f);
        }

        private float _lastWatchdogCheck = 0f;

        void LateUpdate()
        {
            if (GameManager == null || GameManager.LastGeneratedGrid == null) return;
            if (Time.unscaledTime < 1f) return; // FIX: startup pe chup raho
            if (Time.unscaledTime - _lastWatchdogCheck < 0.5f) return;
            _lastWatchdogCheck = Time.unscaledTime;

            int cellCount = 0;
            for (int i = 0; i < transform.childCount; i++)
            {
                if (transform.GetChild(i).name.StartsWith("Cell_")) cellCount++;
            }

            if (cellCount == 0)
            {
                Debug.LogWarning("[GridVisualizer] WATCHDOG: rebuilding missing cells");
                BuildVisuals();
            }
        }

        public void BuildVisuals()
        {
            var grid = GameManager.LastGeneratedGrid;
            if (grid == null)
            {
                Debug.LogError("[GridVisualizer] LastGeneratedGrid is NULL! Keeping existing cells.");
                return;
            }

            // Purane grid objects clear karo (scene reload pe leftover)
            for (int i = transform.childCount - 1; i >= 0; i--)
            {
                var child = transform.GetChild(i);
                if (child.name.StartsWith("Cell_") || child.name.Contains("Grid") || child.name.Contains("Tile") || child.name.Contains("Letter") || child.name.Contains("Rim") || child.name.Contains("Star") || child.name.Contains("Panel") || child.name.Contains("Gold") || child.name.Contains("Frame") || child.name.Contains("Glow") || child.name.Contains("Shadow") || child.name.Contains("Shine") || child.name.Contains("Ornate") || child.name.Contains("Book") || child.name.Contains("Word"))
                {
                    Destroy(child.gameObject);
                }
            }
            Debug.Log("[GridVisualizer] Old grid cleared, rebuilding...");

            int rows = grid.Rows;
            int cols = grid.Columns;

            float totalWidth  = cols * (CellSize + CellGap) - CellGap;
            float totalHeight = rows * (CellSize + CellGap) - CellGap;
            float originX = -totalWidth  / 2f + CellSize / 2f;
            float originY =  totalHeight / 2f - CellSize / 2f;

            float padX = CellSize * 0.9f;
            float padY = CellSize * 0.9f;
            float panelW = totalWidth  + padX;
            float panelH = totalHeight + padY;

            CreateStarfield(panelW * 4f, panelH * 4f, 60);

            var rimObj = new GameObject("GoldRim");
            rimObj.transform.SetParent(transform);
            rimObj.transform.position = new Vector3(GridOffsetX, GridOffsetY, 1.5f);
            var rimSr = rimObj.AddComponent<SpriteRenderer>();
            rimSr.sprite = _rimSprite;
            rimSr.color = GoldRim;
            rimSr.sortingOrder = -12;
            rimObj.transform.localScale = new Vector3(panelW + 0.12f, panelH + 0.12f, 1f);

            var rimDarkObj = new GameObject("RimDark");
            rimDarkObj.transform.SetParent(transform);
            rimDarkObj.transform.position = new Vector3(GridOffsetX, GridOffsetY, 1.4f);
            var rimDarkSr = rimDarkObj.AddComponent<SpriteRenderer>();
            rimDarkSr.sprite = _rimSprite;
            rimDarkSr.color = new Color(0.02f, 0.03f, 0.08f);
            rimDarkSr.sortingOrder = -11;
            rimDarkObj.transform.localScale = new Vector3(panelW + 0.06f, panelH + 0.06f, 1f);

            // Try premium ornate frame
            Sprite premiumFrame = Resources.Load<Sprite>("UI/Premium/frame_ornate");
            var frameObj = new GameObject("OrnateFrame");
            frameObj.transform.SetParent(transform);
            frameObj.transform.position = new Vector3(GridOffsetX, GridOffsetY, -0.5f);
            var frameSr = frameObj.AddComponent<SpriteRenderer>();
            if (premiumFrame != null)
            {
                frameSr.sprite = premiumFrame;
                frameSr.color = Color.white;
                frameSr.sortingOrder = 10;   // tiles ke UPAR
                frameObj.transform.localScale = new Vector3(panelW + 1.3f, panelH + 1.3f, 1f);
                Debug.Log("[GridVisualizer] Premium ornate frame loaded!");
            }
            else
            {
                frameObj.SetActive(false);
            }

            var panelObj = new GameObject("GridPanel");
            panelObj.transform.SetParent(transform);
            panelObj.transform.position = new Vector3(GridOffsetX, GridOffsetY, 1f);
            var panelSr = panelObj.AddComponent<SpriteRenderer>();
            panelSr.sprite = _panelSprite;
            panelSr.color = Color.white;
            panelSr.sortingOrder = -10;
            panelObj.transform.localScale = new Vector3(panelW, panelH, 1f);

            for (int r = 0; r < rows; r++)
            {
                for (int c = 0; c < cols; c++)
                {
                    var cell = grid.GetCell(r, c);
                    Vector3 pos = new Vector3(
                        originX + c * (CellSize + CellGap) + GridOffsetX,
                        originY - r * (CellSize + CellGap) + GridOffsetY,
                        -5f);   // TEST: moved closer to camera

                    CreateCellVisual(pos, cell.Letter, r, c);
                }
            }

            // Grid ko screen ke andar fit karo
            FitGridToScreen(rows, cols);

            Debug.Log($"GridVisualizer: Rendered {rows}x{cols} grid.");
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

        private void CreateCellVisual(Vector3 position, char letter, int row, int col)
        {
            var cellObj = new GameObject($"Cell_{row}_{col}");
            cellObj.transform.SetParent(transform);
            cellObj.transform.position = position;
            // Premium tile ka aspect ratio match karo
            // Sprite ke actual bounds ke hisaab se scale karo (PPU 100/256 kuch bhi ho)
            float spriteSizeX = (_tileSprite != null && _tileSprite.bounds.size.x > 0.01f) ? _tileSprite.bounds.size.x : 1f;
            float spriteSizeY = (_tileSprite != null && _tileSprite.bounds.size.y > 0.01f) ? _tileSprite.bounds.size.y : 1f;
            float targetTileSize = CellSize * 0.92f;
            cellObj.transform.localScale = new Vector3(targetTileSize / spriteSizeX, targetTileSize / spriteSizeY, 1f);
            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(cellObj.transform, false);
            shadowObj.transform.localPosition = new Vector3(0.02f, -0.10f, 0f);
            var shadowSr = shadowObj.AddComponent<SpriteRenderer>();
            shadowSr.sprite = _tileSprite;
            shadowSr.color = new Color(0f, 0f, 0f, 0.40f);
            shadowSr.sortingOrder = 0;
            shadowObj.transform.localScale = new Vector3(1.05f, 1.05f, 1f);

            var sr = cellObj.AddComponent<SpriteRenderer>();
            sr.sprite = _tileSprite;
            sr.color = Color.white;
            sr.sortingOrder = 1;

            // Shine highlight (top of tile)
            var shineObj = new GameObject("Shine");
            shineObj.transform.SetParent(cellObj.transform, false);
            var shineSr = shineObj.AddComponent<SpriteRenderer>();
            shineSr.sprite = _circleSprite;
            shineSr.color = new Color(1f, 1f, 1f, 0.35f);
            shineSr.sortingOrder = 2;
            shineObj.transform.localPosition = new Vector3(0f, 0.25f, -0.05f);
            shineObj.transform.localScale = new Vector3(0.65f, 0.22f, 1f);

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
                    TestModeTheme.IsActive ? TestModeTheme.WhiteTileTop : Color.white,
                    new Color(1f, 0.85f, 0.30f, 0.98f),
                    new Color(0.35f, 0.95f, 0.55f, 0.98f));
            }

            var textShadowObj = new GameObject("LetterShadow");
            textShadowObj.transform.SetParent(cellObj.transform, false);
            textShadowObj.transform.localPosition = new Vector3(0.03f, -0.03f, -0.49f);
            textShadowObj.transform.localScale = new Vector3(0.9f, 0.9f, 1f);

            var tms = textShadowObj.AddComponent<TextMesh>();
            tms.text = letter.ToString();
            tms.color = TestModeTheme.IsActive ? TestModeTheme.BrownShadow : LetterShadowColor;
            tms.fontSize = 100;
            tms.characterSize = 0.075f;
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

            var textObj = new GameObject("Letter");
            textObj.transform.SetParent(cellObj.transform, false);
            textObj.transform.localPosition = new Vector3(0f, 0f, -0.5f);
            textObj.transform.localScale = Vector3.one;

            var tm = textObj.AddComponent<TextMesh>();
            tm.text = letter.ToString();
            tm.color = TestModeTheme.IsActive ? TestModeTheme.BrownLetter : LetterColor;
            tm.fontSize = 100;
            tm.characterSize = 0.075f;
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

        /// <summary>
        /// Grid ko screen ke andar fit karo (top bar + bottom UI ke liye jagah chhodkar).
        /// </summary>
        private void FitGridToScreen(int rows, int cols)
        {
            var cam = Camera.main;
            if (cam == null) return;

            // Screen size in world units
            float worldHeight = cam.orthographicSize * 2f;
            float worldWidth = worldHeight * cam.aspect;

            // Grid ka current size
            float gridWidth  = cols * (CellSize + CellGap) - CellGap;
            float gridHeight = rows * (CellSize + CellGap) - CellGap;

            // Top bar ~20%, bottom UI ~25% reserve karo
            float availableHeight = worldHeight * 0.55f;
            float availableWidth  = worldWidth * 0.90f;

            // Scale factor calculate karo
            float scaleX = availableWidth  / gridWidth;
            float scaleY = availableHeight / gridHeight;
            float scale  = Mathf.Min(scaleX, scaleY);

            // FIX: Hamesha scale apply karo (mobile portrait me overflow rokne ke liye)
            float finalScale = Mathf.Min(scale, 1.0f);
            transform.localScale = new Vector3(finalScale, finalScale, 1f);
            Debug.Log($"[GridVisualizer] Grid scaled to {finalScale:F2} (avail {availableWidth:F2}x{availableHeight:F2}, grid {gridWidth:F2}x{gridHeight:F2}) screen {Screen.width}x{Screen.height}");
            // Grid ko center mein rakho
            transform.localPosition = Vector3.zero;
        }

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

























