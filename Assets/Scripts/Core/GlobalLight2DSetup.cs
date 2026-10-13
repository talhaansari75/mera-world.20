using UnityEngine;
using UnityEngine.Rendering.Universal;

namespace MeraWorld.Core
{
    /// <summary>
    /// URP 2D games mein Sprite-Lit-Default material ko Global Light 2D chahiye.
    /// Ye script auto-create karta hai taaki saare lit sprites visible ho.
    /// </summary>
    public class GlobalLight2DSetup : MonoBehaviour
    {
        void Awake()
        {
            // Agar already exist karta hai to skip
            var existing = FindFirstObjectByType<Light2D>();
            if (existing != null)
            {
                Debug.Log("[GlobalLight2D] Already exists");
                return;
            }

            var go = new GameObject("[GlobalLight2D]");
            go.transform.SetParent(transform, false);

            var light = go.AddComponent<Light2D>();
            light.lightType = Light2D.LightType.Global;
            light.intensity = 1f;
            light.color = Color.white;

            Debug.Log("[GlobalLight2D] Created — lit sprites now visible!");
        }
    }
}