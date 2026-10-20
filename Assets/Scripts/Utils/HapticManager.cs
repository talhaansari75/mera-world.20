using UnityEngine;

namespace MeraWorld.Core
{
    public static class HapticManager
    {
        public static void Light()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            Handheld.Vibrate(); // Android standard short vibration
            #endif
        }

        public static void Heavy()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            Handheld.Vibrate(); // Unity doesn't distinguish by default without plugins, but we keep it separate for future upgrades
            #endif
        }

        public static void Double()
        {
            #if UNITY_ANDROID && !UNITY_EDITOR
            Handheld.Vibrate();
            #endif
        }
    }
}