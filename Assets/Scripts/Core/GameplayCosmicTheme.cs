using UnityEngine;

namespace MeraWorld.Core
{
    public class GameplayCosmicTheme : MonoBehaviour
    {
        private GameObject _bgObj;

        void Start()
        {
            Invoke(nameof(BuildBackground), 0.05f);
        }

        void BuildBackground()
        {
            if (_bgObj != null) Destroy(_bgObj);

            _bgObj = new GameObject("GameplayCosmicBG");
            _bgObj.transform.SetParent(transform, false);

            var sr = _bgObj.AddComponent<SpriteRenderer>();
            sr.sprite = Resources.Load<Sprite>("UI/HomeScreen/Backgrounds/bg_space");
            sr.sortingOrder = -1000;
            sr.color = Color.white;

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

            Debug.Log("[GameplayCosmic] Background applied as SpriteRenderer");
        }
    }
}