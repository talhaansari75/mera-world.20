using UnityEngine;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    /// <summary>
    /// Ensures grid cells survive scene reloads.
    /// Runs every LateUpdate: moves any Cell_/Grid/Star/Frame objects to DontDestroyOnLoad scene.
    /// Root cause: SetParent doesn't move objects to parent's scene — must use MoveGameObjectToScene.
    /// </summary>
    public class GridPersistenceFix : MonoBehaviour
    {
        private Scene _ddolScene;
        private int _lastMoveCount = -1;
        private float _lastLogTime = 0f;

        void Start()
        {
            // Get the scene from GameManager itself (reliable, not by name)
            var gm = FindFirstObjectByType<GameManager>();
            if (gm != null && gm.gameObject.scene.IsValid())
            {
                _ddolScene = gm.gameObject.scene;
                Debug.Log($"[GridPersistenceFix] Using GameManager scene: '{_ddolScene.name}' valid={_ddolScene.IsValid()} loaded={_ddolScene.isLoaded}");
            }
            else
            {
                _ddolScene = SceneManager.GetSceneByName("DontDestroyOnLoad");
                Debug.Log($"[GridPersistenceFix] Fallback by name: valid={_ddolScene.IsValid()}");
            }
        }

        void LateUpdate()
        {
            if (!_ddolScene.IsValid()) return;

            int moved = 0;
            var gms = FindObjectsByType<GameManager>(FindObjectsInactive.Include, FindObjectsSortMode.None);
            foreach (var gm in gms)
            {
                if (gm == null) continue;
                moved += MoveChildrenToDDOL(gm.transform);
            }

            // Log only when count changes (avoid spam)
            if (moved != _lastMoveCount && Time.unscaledTime - _lastLogTime > 1f)
            {
                if (moved > 0)
                    Debug.Log($"[GridPersistenceFix] Moved {moved} objects to DDOL");
                _lastMoveCount = moved;
                _lastLogTime = Time.unscaledTime;
            }
        }

        private int MoveChildrenToDDOL(Transform parent)
        {
            int count = 0;
            for (int i = 0; i < parent.childCount; i++)
            {
                var child = parent.GetChild(i);
                if (child == null) continue;
                if (child.gameObject.scene == _ddolScene) continue;

                string n = child.name;
                if (n.StartsWith("Cell_") || n.StartsWith("Star") || n.Contains("Grid") ||
                    n.Contains("Panel") || n.Contains("Rim") || n.Contains("Frame") ||
                    n.Contains("Gold") || n.Contains("Letter") || n.Contains("Shadow") ||
                    n.Contains("Shine") || n.Contains("Glow") || n.Contains("Starfield") ||
                    n.Contains("GameplayBackground"))
                {
                    var originalParent = child.parent;
                    child.SetParent(null, false);
                    SceneManager.MoveGameObjectToScene(child.gameObject, _ddolScene);
                    child.SetParent(originalParent, false);
                    count++;
                }
            }
            return count;
        }
    }
}