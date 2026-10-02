using UnityEngine;

namespace MeraWorld.Core
{
    [CreateAssetMenu(fileName = "NewTheme", menuName = "MeraWorld/Theme")]
    public class GameTheme : ScriptableObject
    {
        public string themeName = "Ink & Starlight";
        public Color bgTop = new Color(0.16f, 0.08f, 0.34f);
        public Color bgBottom = new Color(0.02f, 0.02f, 0.08f);
        public Color gold = new Color(1f, 0.85f, 0.30f);
        public Color buttonGreen = new Color(0.25f, 0.65f, 0.35f);
        public Color buttonBlue = new Color(0.25f, 0.45f, 0.85f);
        public Color topBarColor = new Color32(20, 30, 60, 255);
    }
}