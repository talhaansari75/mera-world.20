using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Generates 3D-look sprites in code: gradients, rounded rectangles with bevels, circles with highlights.
    /// </summary>
    public static class UISpriteFactory
    {
        public static Sprite CreateGradientSprite(Color bottom, Color top, int width = 64, int height = 256)
        {
            var tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            tex.wrapMode = TextureWrapMode.Clamp;
            var pixels = new Color[width * height];

            for (int y = 0; y < height; y++)
            {
                float t = (float)y / (height - 1);
                Color c = Color.Lerp(bottom, top, t);
                for (int x = 0; x < width; x++)
                    pixels[y * width + x] = c;
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, width, height), new Vector2(0.5f, 0.5f), 100f);
        }

        /// <summary>
        /// Rounded rectangle with top highlight and bottom shadow → 3D bevel look.
        /// </summary>
        public static Sprite Create3DButtonSprite(Color baseColor, int size = 256, int radius = 40)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            Color topHighlight = Color.Lerp(baseColor, Color.white, 0.35f);
            Color bottomShadow = Color.Lerp(baseColor, Color.black, 0.35f);

            for (int y = 0; y < size; y++)
            {
                float v = (float)y / (size - 1);

                // Vertical gradient: shadow at bottom, highlight at top
                Color rowColor;
                if (v < 0.5f)
                    rowColor = Color.Lerp(bottomShadow, baseColor, v * 2f);
                else
                    rowColor = Color.Lerp(baseColor, topHighlight, (v - 0.5f) * 2f);

                for (int x = 0; x < size; x++)
                {
                    float alpha = RoundedAlpha(x, y, size, radius);
                    if (alpha <= 0f) { pixels[y * size + x] = new Color(0, 0, 0, 0); continue; }

                    Color c = rowColor;

                    // Edge highlight — soft gloss at very top
                    float gloss = Mathf.InverseLerp(0.85f, 0.98f, v);
                    c = Color.Lerp(c, Color.white, gloss * 0.25f);

                    c.a = alpha;
                    pixels[y * size + x] = c;
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        /// <summary>
        /// Circle with radial highlight — like 3D sphere.
        /// </summary>
        public static Sprite Create3DSphereSprite(Color color, int size = 128)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            Vector2 center = new Vector2(size / 2f, size / 2f);
            float radius = size / 2f;
            Vector2 lightDir = new Vector2(-0.4f, 0.5f);

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    Vector2 p = new Vector2(x, y) - center;
                    float d = p.magnitude / radius;
                    if (d > 1f) { pixels[y * size + x] = new Color(0, 0, 0, 0); continue; }

                    // Fake sphere shading
                    Vector2 norm = p / radius;
                    float light = Vector2.Dot(norm, lightDir);
                    float shade = Mathf.Clamp01(0.55f + light * 0.6f);

                    Color c = Color.Lerp(Color.black, color, shade);
                    c = Color.Lerp(c, Color.white, Mathf.Pow(shade, 6f) * 0.6f);

                    // Soft edge
                    float alpha = Mathf.Clamp01((1f - d) * 4f);
                    c.a = alpha;
                    pixels[y * size + x] = c;
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        /// <summary>
        /// Rounded rectangle with soft glow (for cards).
        /// </summary>
        public static Sprite CreateRoundedSprite(Color color, int size = 128, int radius = 20)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float alpha = RoundedAlpha(x, y, size, radius);
                    Color c = color;
                    c.a *= alpha;
                    pixels[y * size + x] = c;
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        /// <summary>
        /// Radial glow (soft light halo behind title).
        /// </summary>
        public static Sprite CreateGlowSprite(Color color, int size = 256)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            Vector2 center = new Vector2(size / 2f, size / 2f);
            float radius = size / 2f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float d = Vector2.Distance(new Vector2(x, y), center) / radius;
                    float alpha = Mathf.Clamp01(1f - d);
                    alpha = Mathf.Pow(alpha, 2f);
                    Color c = color;
                    c.a *= alpha;
                    pixels[y * size + x] = c;
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        private static float RoundedAlpha(int x, int y, int size, int radius)
        {
            int cx = x < radius ? radius : (x >= size - radius ? size - radius - 1 : x);
            int cy = y < radius ? radius : (y >= size - radius ? size - radius - 1 : y);
            if (cx == x && cy == y) return 1f;
            float dx = x - cx, dy = y - cy;
            float d = Mathf.Sqrt(dx * dx + dy * dy);
            return Mathf.Clamp01(radius - d + 0.5f);
        }
    }
}