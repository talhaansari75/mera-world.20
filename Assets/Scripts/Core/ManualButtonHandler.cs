using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;

namespace MeraWorld.Core
{
    /// <summary>
    /// Manual button handler for Unity 6 Input System bugs.
    /// Bypasses EventSystem's InputModule entirely and manually fires Button.onClick.
    /// Works regardless of Active Input Handling setting.
    /// </summary>
    public class ManualButtonHandler : MonoBehaviour
    {
        private static ManualButtonHandler _instance;

        private PointerEventData _pointerData;
        private readonly List<RaycastResult> _results = new List<RaycastResult>();
        private bool _wasPressed;

        void Awake()
        {
            if (_instance != null && _instance != this) { Destroy(gameObject); return; }
            _instance = this;

            // Ensure EventSystem exists for RaycastAll
            if (EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<EventSystem>();
            }
        }

        void Update()
        {
            bool isDown = Input.GetMouseButtonDown(0);
            bool isUp = Input.GetMouseButtonUp(0);

            if (isDown)
            {
                _wasPressed = true;
                return;
            }

            if (isUp && _wasPressed)
            {
                _wasPressed = false;
                TryClick();
            }
        }

        private void TryClick()
        {
            if (EventSystem.current == null) return;

            _pointerData = new PointerEventData(EventSystem.current)
            {
                position = Input.mousePosition
            };

            _results.Clear();
            EventSystem.current.RaycastAll(_pointerData, _results);

            if (_results.Count == 0) return;

            // Iterate from top-most hit
            foreach (var r in _results)
            {
                if (r.gameObject == null) continue;

                // Find Button on this object or its parents
                var btn = r.gameObject.GetComponent<Button>();
                if (btn == null) btn = r.gameObject.GetComponentInParent<Button>();

                if (btn != null && btn.interactable && btn.gameObject.activeInHierarchy)
                {
                    Debug.Log($"[ManualButton] Firing onClick on '{btn.gameObject.name}'");

                    // Play sound
                    if (SoundManager.Instance != null)
                        SoundManager.Instance.PlayButtonClick();

                    // Fire onClick
                    btn.onClick.Invoke();
                    return; // Only fire top-most
                }
            }
        }
    }
}