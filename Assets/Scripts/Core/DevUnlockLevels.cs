using UnityEngine;

namespace MeraWorld.Core
{
    public class DevUnlockLevels : MonoBehaviour
    {
        [Tooltip("Kitne levels unlock karne hain")]
        public int UnlockUpTo = 10;

        void Start()
        {
            if (PlayerProgressManager.Instance == null) return;
            
            // Set highest unlocked
            PlayerPrefs.SetInt("HighestLevelUnlocked", UnlockUpTo);
            PlayerPrefs.SetInt("CurrentLevel", 1);
            PlayerPrefs.Save();
            
            Debug.Log($"[DevUnlock] Unlocked levels up to {UnlockUpTo}");
            
            // Force progress manager reload
            var pm = PlayerProgressManager.Instance;
            var field = pm.GetType().GetField("HighestLevelUnlocked");
            if (field != null) field.SetValue(pm, UnlockUpTo);
        }
    }
}