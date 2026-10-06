using UnityEngine;

namespace MeraWorld.Core
{
    public class GameplayCosmicTheme : MonoBehaviour
    {
        private GameObject _bgObj;

        [Header("Background Style")]
        [Tooltip("Light mode ON - white/cream background")]
        public bool LightMode = true;

        [Tooltip("Top color of gradient")]
        public Color TopColor = new Color(1.00f, 0.99f, 0.95f);    // cream white

        [Tooltip("Bottom color of gradient")]
        public Color BottomColor = new Color(0.98f, 0.96f, 0.90f); // light cream

        void Start()
        {
            Invoke(nameof(BuildBackground), 0.05f);
        }

        void BuildBackground()
        {
            if (_bgObj != null) Destroy(_bgObj);

            _bgObj = new GameObject("GameplayBackground");
            _bgObj.transform.SetParent(transform, false);

            var sr = _bgObj.AddComponent<SpriteRenderer>();

            // TEST MODE: cream background
            // PRODUCTION: space background
            if (false)
            {
                sr.sprite = UISpriteFactory.Create3DSphereSprite(TestModeTheme.CreamBG, 4);
                sr.color = Color.white;
                Debug.Log("[GameplayTheme] TEST MODE - cream background");
            }
            else
            {
                sr.sprite = Resources.Load<Sprite>("UI/HomeScreen/Backgrounds/bg_space");
                sr.color = Color.white;
                Debug.Log("[GameplayTheme] PRODUCTION - space background");
            }

            sr.sortingOrder = -1000;

            var cam = Camera.main;
            if (cam != null && sr.sprite != null)
            {
                float worldHeight = cam.orthographicSize * 2f;
                float worldWidth = worldHeight * ((float)Screen.width / Screen.height);
                float spriteW = sr.sprite.bounds.size.x;
                float spriteH = sr.sprite.bounds.size.y;
                _bgObj.transform.localScale = new Vector3(worldWidth / spriteW, worldHeight / spriteH, 1f);
            }

            _bgObj.transform.position = new Vector3(0f, 0f, 5f);

            Debug.Log("[GameplayTheme] Background applied - LightMode=" + LightMode);
        }
    }
}



