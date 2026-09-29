using System;
using UnityEngine;

namespace MeraWorld.Core
{
    public class ComboSystem : MonoBehaviour
    {
        public static ComboSystem Instance { get; private set; }

        public event Action<int, int> OnComboChanged;

        [Header("Settings")]
        public float ComboWindowSeconds = 5f;
        public int BaseBonusCoins = 2;

        private int _currentCombo = 0;
        private float _lastFindTime = -10f;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public void RegisterWordFound()
        {
            float now = Time.time;
            float timeSinceLast = now - _lastFindTime;

            if (timeSinceLast <= ComboWindowSeconds && _lastFindTime > 0)
            {
                _currentCombo++;
            }
            else
            {
                _currentCombo = 1;
            }

            _lastFindTime = now;

            int bonus = 0;
            if (_currentCombo >= 2)
            {
                bonus = BaseBonusCoins * (_currentCombo - 1);

                if (PlayerProgressManager.Instance != null)
                    PlayerProgressManager.Instance.AddCoins(bonus);

                Debug.Log($"[Combo] x{_currentCombo}! +{bonus} bonus coins");
            }

            OnComboChanged?.Invoke(_currentCombo, bonus);
        }

        public void ResetCombo()
        {
            _currentCombo = 0;
            _lastFindTime = -10f;
            OnComboChanged?.Invoke(0, 0);
        }

        public int GetCurrentCombo() => _currentCombo;
    }
}