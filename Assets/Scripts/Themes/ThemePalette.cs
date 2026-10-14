using UnityEngine;

namespace MeraWorld.Core
{
    public struct ThemeColors
    {
        public Color CameraBg;
        public Color BgDeep;
        public Color BgMid;
        public Color BgTop;
        public Color TileTop;
        public Color TileMid;
        public Color TileBottom;
        public Color RimColor;
        public Color PanelTop;
        public Color PanelBottom;
        public Color AccentColor;
    }

    public static class ThemePalette
    {
        public static ThemeColors Get(string name)
        {
            switch (name)
            {
                case "Cosmic": return Cosmic();
                case "Ocean":  return Ocean();
                case "Sunset": return Sunset();
                case "Forest": return Forest();
                default:       return Classic();
            }
        }

        // Default purple (existing look)
        public static ThemeColors Classic()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.10f, 0.03f, 0.22f),
                BgDeep = new Color(0.10f, 0.03f, 0.22f),
                BgMid  = new Color(0.18f, 0.06f, 0.35f),
                BgTop  = new Color(0.24f, 0.08f, 0.45f),
                TileTop    = new Color(0.45f, 0.30f, 0.75f),
                TileMid    = new Color(0.28f, 0.15f, 0.55f),
                TileBottom = new Color(0.12f, 0.05f, 0.25f),
                RimColor   = new Color(1.00f, 0.82f, 0.30f),
                PanelTop    = new Color(0.28f, 0.10f, 0.48f),
                PanelBottom = new Color(0.12f, 0.05f, 0.25f),
                AccentColor = new Color(1f, 0.85f, 0.35f)
            };
        }

        // Cosmic (same as Classic - default purple)
        public static ThemeColors Cosmic()
        {
            return Classic();
        }

        // Deep blue with cyan accents
        public static ThemeColors Ocean()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.02f, 0.08f, 0.18f),
                BgDeep = new Color(0.02f, 0.08f, 0.18f),
                BgMid  = new Color(0.05f, 0.18f, 0.38f),
                BgTop  = new Color(0.10f, 0.32f, 0.55f),
                TileTop    = new Color(0.30f, 0.65f, 0.85f),
                TileMid    = new Color(0.15f, 0.40f, 0.65f),
                TileBottom = new Color(0.05f, 0.15f, 0.35f),
                RimColor   = new Color(0.50f, 0.95f, 1.00f),
                PanelTop    = new Color(0.15f, 0.42f, 0.65f),
                PanelBottom = new Color(0.05f, 0.15f, 0.35f),
                AccentColor = new Color(0.50f, 0.95f, 1.00f)
            };
        }

        // Warm orange/red
        public static ThemeColors Sunset()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.18f, 0.06f, 0.12f),
                BgDeep = new Color(0.18f, 0.06f, 0.12f),
                BgMid  = new Color(0.38f, 0.12f, 0.18f),
                BgTop  = new Color(0.55f, 0.20f, 0.18f),
                TileTop    = new Color(0.95f, 0.55f, 0.30f),
                TileMid    = new Color(0.75f, 0.30f, 0.20f),
                TileBottom = new Color(0.40f, 0.10f, 0.15f),
                RimColor   = new Color(1.00f, 0.85f, 0.40f),
                PanelTop    = new Color(0.65f, 0.25f, 0.20f),
                PanelBottom = new Color(0.35f, 0.08f, 0.12f),
                AccentColor = new Color(1.00f, 0.85f, 0.40f)
            };
        }

        // Deep green
        public static ThemeColors Forest()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.05f, 0.12f, 0.06f),
                BgDeep = new Color(0.05f, 0.12f, 0.06f),
                BgMid  = new Color(0.10f, 0.28f, 0.15f),
                BgTop  = new Color(0.18f, 0.42f, 0.20f),
                TileTop    = new Color(0.45f, 0.75f, 0.35f),
                TileMid    = new Color(0.25f, 0.55f, 0.25f),
                TileBottom = new Color(0.08f, 0.22f, 0.10f),
                RimColor   = new Color(0.95f, 0.90f, 0.45f),
                PanelTop    = new Color(0.30f, 0.55f, 0.30f),
                PanelBottom = new Color(0.08f, 0.22f, 0.10f),
                AccentColor = new Color(0.95f, 0.90f, 0.45f)
            };
        }
    }
}