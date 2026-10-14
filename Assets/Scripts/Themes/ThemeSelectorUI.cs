using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// DEPRECATED: Theme selection ab Settings dropdown se hota hai.
    /// Ye file kaam nahi karti, sirf compile-safe stub hai.
    /// </summary>
    public class ThemeSelectorUI : MonoBehaviour
    {
        void Start()
        {
            // Do nothing - theme picker is in Settings dropdown now
            // Hide any existing canvas
            gameObject.SetActive(false);
        }
    }
}