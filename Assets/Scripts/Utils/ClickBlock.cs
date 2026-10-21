using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class ClickBlock : MonoBehaviour
    {
        private CanvasGroup cg;

        void Awake() { cg = GetComponent<CanvasGroup>(); }

        void OnEnable()
        {
            if (cg == null) cg = GetComponent<CanvasGroup>();
            if (cg != null)
            {
                cg.interactable = false;
                DOVirtual.DelayedCall(0.5f, () => cg.interactable = true);
            }
        }
    }
}