using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;

namespace MeraWorld.Core
{
    public class ClickTest : MonoBehaviour
    {
        void Start()
        {
            Invoke(nameof(LogUIState), 3f);
        }

        private void LogUIState()
        {
            Debug.Log("══════ CLICK TEST ══════");
            Debug.Log($"EventSystem.current: {(EventSystem.current != null ? EventSystem.current.name : "NULL")}");
            Debug.Log($"Time.timeScale: {Time.timeScale}");
            Debug.Log($"Screen: {Screen.width}x{Screen.height}");

            var canvases = FindObjectsByType<Canvas>(FindObjectsSortMode.None);
            Debug.Log($"Total Canvases: {canvases.Length}");
            foreach (var c in canvases)
            {
                Debug.Log($"  '{c.gameObject.name}' order={c.sortingOrder} active={c.gameObject.activeInHierarchy}");
                var gr = c.GetComponent<GraphicRaycaster>();
                Debug.Log($"    GraphicRaycaster={(gr != null ? "YES" : "NO")} enabled={(gr != null ? gr.enabled : false)}");
            }

            // Check raycast blockers above HomeCanvas
            int blockers = 0;
            foreach (var c in canvases)
            {
                if (c.gameObject.name == "HomeCanvas") continue;
                if (!c.gameObject.activeInHierarchy) continue;
                if (c.sortingOrder <= 500) continue;

                // Get top-most full-screen image
                var img = c.GetComponent<Image>();
                if (img != null && img.raycastTarget && img.color.a > 0.1f)
                {
                    Debug.LogWarning($"  🚫 BLOCKER: '{c.gameObject.name}' order={c.sortingOrder}");
                    blockers++;
                }
            }
            if (blockers == 0) Debug.Log("  ✅ No blockers above HomeCanvas");

            Debug.Log("══════ END ══════");
        }

        void Update()
        {
            // Live log mouse clicks
            if (Input.GetMouseButtonDown(0))
            {
                Debug.Log($"[Click] Mouse at {Input.mousePosition}");

                var pointerData = new PointerEventData(EventSystem.current)
                {
                    position = Input.mousePosition
                };
                var results = new List<RaycastResult>();
                EventSystem.current.RaycastAll(pointerData, results);

                Debug.Log($"[Click] Raycast hits: {results.Count}");
                for (int i = 0; i < results.Count && i < 5; i++)
                {
                    Debug.Log($"  #{i}: {results[i].gameObject.name} (canvas: {results[i].gameObject.GetComponentInParent<Canvas>()?.name})");
                }
            }
        }
    }
}