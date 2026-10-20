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
                case "Neon":     return Neon();
                case "Ice":      return Ice();
                case "Cherry":   return Cherry();
                case "Midnight": return Midnight();
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
                BgMid  = new Color(0.22f, 0.12f, 0.45f),
                BgTop  = new Color(0.24f, 0.08f, 0.45f),
                TileTop    = new Color(0.55f, 0.42f, 0.88f),
                TileMid    = new Color(0.42f, 0.28f, 0.72f),
                TileBottom = new Color(0.25f, 0.15f, 0.45f),
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
                TileTop    = new Color(0.40f, 0.75f, 0.95f),
                TileMid    = new Color(0.25f, 0.55f, 0.80f),
                TileBottom = new Color(0.15f, 0.30f, 0.50f),
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
                TileTop    = new Color(1.00f, 0.65f, 0.40f),
                TileMid    = new Color(0.88f, 0.45f, 0.30f),
                TileBottom = new Color(0.55f, 0.25f, 0.25f),
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
                TileTop    = new Color(0.55f, 0.85f, 0.45f),
                TileMid    = new Color(0.38f, 0.68f, 0.38f),
                TileBottom = new Color(0.20f, 0.38f, 0.22f),
                RimColor   = new Color(0.95f, 0.90f, 0.45f),
                PanelTop    = new Color(0.30f, 0.55f, 0.30f),
                PanelBottom = new Color(0.08f, 0.22f, 0.10f),
                AccentColor = new Color(0.95f, 0.90f, 0.45f)
            };
        }
 

        // Cyberpunk: black + neon magenta + cyan
        public static ThemeColors Neon()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.02f, 0.00f, 0.05f),
                BgDeep   = new Color(0.02f, 0.00f, 0.05f),
                BgMid    = new Color(0.15f, 0.00f, 0.25f),
                BgTop    = new Color(0.35f, 0.00f, 0.50f),
                TileTop    = new Color(1.00f, 0.20f, 0.80f),
                TileMid    = new Color(0.70f, 0.00f, 0.90f),
                TileBottom = new Color(0.20f, 0.00f, 0.35f),
                RimColor   = new Color(0.00f, 1.00f, 1.00f),
                PanelTop    = new Color(0.50f, 0.00f, 0.70f),
                PanelBottom = new Color(0.15f, 0.00f, 0.25f),
                AccentColor = new Color(0.00f, 1.00f, 1.00f)
            };
        }

        // Frozen: light blue + white + ice
        public static ThemeColors Ice()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.60f, 0.75f, 0.90f),
                BgDeep   = new Color(0.60f, 0.75f, 0.90f),
                BgMid    = new Color(0.75f, 0.88f, 0.98f),
                BgTop    = new Color(0.88f, 0.95f, 1.00f),
                TileTop    = new Color(0.95f, 1.00f, 1.00f),
                TileMid    = new Color(0.65f, 0.85f, 1.00f),
                TileBottom = new Color(0.35f, 0.55f, 0.75f),
                RimColor   = new Color(1.00f, 1.00f, 1.00f),
                PanelTop    = new Color(0.80f, 0.92f, 1.00f),
                PanelBottom = new Color(0.45f, 0.65f, 0.85f),
                AccentColor = new Color(0.20f, 0.55f, 0.90f)
            };
        }

        // Cherry blossom: pink + magenta
        public static ThemeColors Cherry()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.25f, 0.05f, 0.15f),
                BgDeep   = new Color(0.25f, 0.05f, 0.15f),
                BgMid    = new Color(0.55f, 0.15f, 0.30f),
                BgTop    = new Color(0.80f, 0.35f, 0.55f),
                TileTop    = new Color(1.00f, 0.65f, 0.80f),
                TileMid    = new Color(0.85f, 0.35f, 0.60f),
                TileBottom = new Color(0.45f, 0.10f, 0.30f),
                RimColor   = new Color(1.00f, 0.90f, 0.95f),
                PanelTop    = new Color(0.70f, 0.25f, 0.45f),
                PanelBottom = new Color(0.35f, 0.08f, 0.20f),
                AccentColor = new Color(1.00f, 0.75f, 0.85f)
            };
        }

        // Elegant: black + silver + gold
        public static ThemeColors Midnight()
        {
            return new ThemeColors
            {
                CameraBg = new Color(0.02f, 0.02f, 0.04f),
                BgDeep   = new Color(0.02f, 0.02f, 0.04f),
                BgMid    = new Color(0.08f, 0.08f, 0.15f),
                BgTop    = new Color(0.15f, 0.15f, 0.25f),
                TileTop    = new Color(0.85f, 0.85f, 0.90f),
                TileMid    = new Color(0.50f, 0.50f, 0.60f),
                TileBottom = new Color(0.15f, 0.15f, 0.22f),
                RimColor   = new Color(1.00f, 0.90f, 0.60f),
                PanelTop    = new Color(0.25f, 0.25f, 0.35f),
                PanelBottom = new Color(0.08f, 0.08f, 0.15f),
                AccentColor = new Color(1.00f, 0.90f, 0.60f)
            };
        }   }
}