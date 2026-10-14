using UnityEngine;
using DG.Tweening;

namespace MeraWorld.Core
{
    /// <summary>
    /// DOTween initializer — high capacity for star twinkles + animations.
    /// </summary>
    public class DOTweenInitializer : MonoBehaviour
    {
        void Awake()
        {
            DOTween.Init(true, true, LogBehaviour.ErrorsOnly);
            // High capacity for: loading stars + button juice + tile halos + win intro
            DOTween.SetTweensCapacity(1500, 250);
            Application.targetFrameRate = 60;
            Debug.Log("[DOTween] Initialized with capacity 1500/250");
        }
    }
}