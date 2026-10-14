using UnityEngine;
using UnityEngine.Rendering;

namespace MeraWorld.Core
{
    /// <summary>
    /// Fixes invisible sprites caused by Sprite-Lit-Default material in 3D URP renderer.
    /// Changes ALL sprite materials to classic Unlit "Sprites/Default" shader.
    /// Works in any URP setup (2D or 3D).
    /// </summary>
    public class SpriteMaterialFixer : MonoBehaviour
    {
        void Awake()
        {
            FixAllSprites();
        }

        void Start()
        {
            // Second pass — grid may be rebuilt
            Invoke(nameof(FixAllSprites), 0.3f);
            Invoke(nameof(FixAllSprites), 1.0f);
        }

        public void FixAllSprites()
        {
            var shader = Shader.Find("Sprites/Default");
            if (shader == null)
            {
                Debug.LogError("[SpriteMaterialFixer] Sprites/Default shader NOT FOUND!");
                return;
            }

            int fixedCount = 0;
            var allSprites = FindObjectsByType<SpriteRenderer>(
                FindObjectsInactive.Include, FindObjectsSortMode.None);

            foreach (var sr in allSprites)
            {
                if (sr == null) continue;
                if (sr.material == null || sr.material.shader == null) continue;
                if (sr.material.shader == shader) continue;
                
                // Change to Unlit material
                var mat = new Material(shader);
                sr.material = mat;
                fixedCount++;
            }

            if (fixedCount > 0)
                Debug.Log($"[SpriteMaterialFixer] Fixed {fixedCount} sprite materials to Sprites/Default");
        }
    }
}