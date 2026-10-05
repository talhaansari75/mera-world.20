#if false
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Attach to any Image to make it respond to theme changes.
    /// </summary>
    [RequireComponent(typeof(Image))]
    public class ThemedImage : MonoBehaviour
    {
        public enum ColorRole { Primary, Accent, Background, Highlight }

        public ColorRole Role = ColorRole.Primary;

        private Image _image;

        void Awake()
        {
            _image = GetComponent<Image>();
        }

        void Start()
        {
            Refresh();
        }

        public void Refresh()
        {
            if (_image == null || ThemeManager.Instance == null) return;

            switch (Role)
            {
                case ColorRole.Primary:
                    _image.color = ThemeManager.Instance.GetPrimaryColor();
                    break;
                case ColorRole.Accent:
                    _image.color = ThemeManager.Instance.GetAccentColor();
                    break;
                case ColorRole.Background:
                    _image.color = new Color(0.04f, 0.08f, 0.20f);
                    break;
                case ColorRole.Highlight:
                    _image.color = Color.white;
                    break;
            }
        }
    }
}
#endif