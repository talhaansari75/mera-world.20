using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;

namespace MeraWorld.Core
{
    /// <summary>
    /// Diagnostic: prints everything related to button clicks.
    /// Attach to any scene object, Play, then read Console.
    /// Remove after fixing.
    /// </summary>
    public class ButtonDebugTool : MonoBehaviour
    {
        void Start() { Invoke(nameof(Diagnose), 3f); }

        private void Diagnose()
        {
            Debug.Log("════════ BUTTON DIAGNOSTIC START ════════");

            // 1. EventSystems
            var eventSystems = FindObjectsByType<EventSystem>(FindObjectsSortMode.None);
            Debug.Log($"[Diag] EventSystems: {eventSystems.Length}");
            foreach (var es in eventSystems)
            {
                var modules = es.GetComponents<BaseInputModule>();
                Debug.Log($"[Diag]   '{es.gameObject.name}' active={es.gameObject.activeInHierarchy} enabled={es.enabled} modules={modules.Length}");
                foreach (var m in modules)
                {
                    if (m == null) Debug.LogWarning("[Diag]     MISSING MODULE!");
                    else Debug.Log($"[Diag]     module: {m.GetType().FullName} enabled={m.enabled}");
                }
            }

            // 2. All Canvases by sorting order
            var canvases = FindObjectsByType<Canvas>(FindObjectsSortMode.None);
            var sorted = new List<Canvas>(canvases);
            sorted.Sort((a, b) => a.sortingOrder.CompareTo(b.sortingOrder));

            Debug.Log($"[Diag] Canvases: {sorted.Count}");
            foreach (var c in sorted)
            {
                var gr = c.GetComponent<GraphicRaycaster>();
                var cg = c.GetComponent<CanvasGroup>();
                Debug.Log($"[Diag]   '{c.gameObject.name}' order={c.sortingOrder} active={c.gameObject.activeInHierarchy} " +
                          $"raycaster={(gr != null ? "YES" : "NO")} " +
                          $"canvasGroup={(cg != null ? $"blocks={cg.blocksRaycasts} interactable={cg.interactable}" : "none")}");
            }

            // 3. Find full-screen Image raycast blockers
            var images = FindObjectsByType<Image>(FindObjectsSortMode.None);
            int blockers = 0;
            foreach (var img in images)
            {
                if (img == null || !img.gameObject.activeInHierarchy) continue;
                if (!img.raycastTarget) continue;

                var rt = img.rectTransform;
                if (rt == null) continue;

                // Check if image covers full screen
                bool fullScreen = rt.anchorMin == Vector2.zero && rt.anchorMax == Vector2.one;
                if (!fullScreen) continue;

                // Get parent canvas
                var parentCanvas = img.GetComponentInParent<Canvas>();
                int order = parentCanvas != null ? parentCanvas.sortingOrder : 0;

                if (order > 500) // above HomeCanvas (500)
                {
                    blockers++;
                    Debug.LogWarning($"[Diag] 🚫 BLOCKER: '{img.gameObject.name}' canvas='{parentCanvas?.gameObject.name}' order={order} raycastTarget=true");
                }
            }
            if (blockers == 0) Debug.Log("[Diag] ✅ No full-screen blockers above HomeCanvas.");

            // 4. Find HomeCanvas and its buttons
            var homeCanvas = GameObject.Find("HomeCanvas");
            if (homeCanvas != null)
            {
                Debug.Log($"[Diag] HomeCanvas found. Children:");
                foreach (Transform child in homeCanvas.transform)
                {
                    Debug.Log($"[Diag]   - {child.name}");
                }

                var buttons = homeCanvas.GetComponentsInChildren<Button>(true);
                Debug.Log($"[Diag] Buttons inside HomeCanvas: {buttons.Length}");
                foreach (var b in buttons)
                {
                    Debug.Log($"[Diag]   btn '{b.gameObject.name}' interactable={b.interactable} active={b.gameObject.activeInHierarchy} onClickCount={b.onClick.GetPersistentEventCount()}");
                }
            }
            else
            {
                Debug.LogWarning("[Diag] HomeCanvas not found!");
            }

            // 5. Time scale
            Debug.Log($"[Diag] Time.timeScale = {Time.timeScale} (must be > 0 for UI clicks)");

            Debug.Log("════════ BUTTON DIAGNOSTIC END ════════");
        }
    }
}