using System.Collections;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Tracks SpriteRenderer count over time to find WHEN and HOW sprites disappear.
    /// Also logs any Destroy calls by hooking into the scene.
    /// </summary>
    public class SpriteTracker : MonoBehaviour
    {
        void Start()
        {
            StartCoroutine(Track());
        }

        IEnumerator Track()
        {
            int prevCount = -1;
            for (int i = 0; i < 20; i++)
            {
                var sprites = FindObjectsByType<SpriteRenderer>(
                    FindObjectsInactive.Include, FindObjectsSortMode.None);
                int currentCount = sprites.Length;

                if (prevCount != -1 && currentCount != prevCount)
                {
                    Debug.Log($"[SpriteTracker] t={i*0.5f:F1}s: COUNT CHANGED {prevCount} → {currentCount}");
                    
                    if (currentCount < prevCount)
                    {
                        Debug.Log($"[SpriteTracker] ⚠️ {prevCount - currentCount} sprites DESTROYED between {i*0.5f - 0.5f:F1}s and {i*0.5f:F1}s");
                    }
                }
                else if (i == 0)
                {
                    Debug.Log($"[SpriteTracker] t=0: {currentCount} sprites");
                }

                // Log first 5 sprite names when count > 0
                if (currentCount > 0 && prevCount <= 0)
                {
                    int shown = 0;
                    foreach (var sr in sprites)
                    {
                        if (shown >= 5) break;
                        Debug.Log($"[SpriteTracker] Sample: {sr.gameObject.name} | Parent: {sr.transform.parent?.name ?? "ROOT"}");
                        shown++;
                    }
                }

                // Log hierarchy of GameManager when count drops to 0
                if (currentCount == 0 && prevCount > 0)
                {
                    var gms = FindObjectsByType<GameManager>(FindObjectsInactive.Include, FindObjectsSortMode.None);
                    foreach (var gm in gms)
                    {
                        Debug.Log($"[SpriteTracker] GameManager children after drop: {gm.transform.childCount}");
                        for (int j = 0; j < gm.transform.childCount; j++)
                        {
                            var child = gm.transform.GetChild(j);
                            Debug.Log($"[SpriteTracker]   - {child.name}");
                        }
                    }
                }

                prevCount = currentCount;
                yield return new WaitForSecondsRealtime(0.5f);
            }

            Debug.Log("[SpriteTracker] Tracking complete.");
        }
    }
}