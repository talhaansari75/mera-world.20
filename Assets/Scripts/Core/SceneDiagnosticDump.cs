using UnityEngine;
using System.Text;

namespace MeraWorld.Core
{
    /// <summary>
    /// Dumps complete scene state for debugging invisible sprites.
    /// Logs: GameManagers, SpriteRenderers, materials, positions, URP info.
    /// </summary>
    public class SceneDiagnosticDump : MonoBehaviour
    {
        void Start()
        {
            Invoke(nameof(Dump), 3.0f);
        }

        void Dump()
        {
            var sb = new StringBuilder();
            sb.AppendLine("═══════════ SCENE DIAGNOSTIC ═══════════");

            // 1. GameManagers
            var gms = FindObjectsByType<GameManager>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            sb.AppendLine($"\n[1] GameManagers ({gms.Length}):");
            foreach (var gm in gms)
            {
                sb.AppendLine($"    {gm.gameObject.name}");
                sb.AppendLine($"      Parent: {gm.transform.parent?.name ?? "ROOT"}");
                sb.AppendLine($"      WorldPos: {gm.transform.position}");
                sb.AppendLine($"      Scene: {gm.gameObject.scene.name}");
                sb.AppendLine($"      Children count: {gm.transform.childCount}");
            }

            // 2. All SpriteRenderers
            var sprites = FindObjectsByType<SpriteRenderer>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            sb.AppendLine($"\n[2] SpriteRenderers total ({sprites.Length}):");

            int shown = 0;
            foreach (var sr in sprites)
            {
                if (sr == null) continue;
                if (shown >= 8) break;
                string matName = sr.material != null && sr.material.shader != null ? sr.material.shader.name : "NULL_SHADER";
                string sprName = sr.sprite != null ? sr.sprite.name : "NULL";
                sb.AppendLine($"    {sr.gameObject.name}");
                sb.AppendLine($"      Sprite: {sprName}");
                sb.AppendLine($"      Shader: {matName}");
                sb.AppendLine($"      Color: {sr.color}");
                sb.AppendLine($"      WorldPos: {sr.transform.position}");
                sb.AppendLine($"      WorldScale: {sr.transform.lossyScale}");
                sb.AppendLine($"      SortingLayer: {sr.sortingLayerName} | Order: {sr.sortingOrder}");
                sb.AppendLine($"      Enabled: {sr.enabled} | ActiveInHierarchy: {sr.gameObject.activeInHierarchy}");
                shown++;
            }

            // 3. All Cameras
            var cams = FindObjectsByType<Camera>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            sb.AppendLine($"\n[3] Cameras ({cams.Length}):");
            foreach (var cam in cams)
            {
                sb.AppendLine($"    {cam.gameObject.name}");
                sb.AppendLine($"      WorldPos: {cam.transform.position}");
                sb.AppendLine($"      Ortho: {cam.orthographic} | Size: {cam.orthographicSize}");
                sb.AppendLine($"      Near: {cam.nearClipPlane} | Far: {cam.farClipPlane}");
                sb.AppendLine($"      CullingMask: {cam.cullingMask}");
                sb.AppendLine($"      ClearFlags: {cam.clearFlags} | BG: {cam.backgroundColor}");
                sb.AppendLine($"      Depth: {cam.depth}");
            }

            // 4. URP Asset info
            var urpAsset = UnityEngine.Rendering.GraphicsSettings.currentRenderPipeline;
            sb.AppendLine($"\n[4] URP Asset:");
            if (urpAsset != null)
            {
                sb.AppendLine($"    Name: {urpAsset.name}");
                sb.AppendLine($"    Type: {urpAsset.GetType().FullName}");
            }
            else
            {
                sb.AppendLine($"    NULL (Built-in renderer)");
            }

            // 5. Scene info
            sb.AppendLine($"\n[5] Active Scene: {UnityEngine.SceneManagement.SceneManager.GetActiveScene().name}");
            sb.AppendLine($"    Scene Root Count: {UnityEngine.SceneManagement.SceneManager.GetActiveScene().rootCount}");

            Debug.Log(sb.ToString());
        }
    }
}