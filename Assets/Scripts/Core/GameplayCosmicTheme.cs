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

        public void BuildBackground()
        {
            if (_bgObj != null) Destroy(_bgObj);

            var cam = Camera.main;
            if (cam == null) { Debug.LogError("[GameplayTheme] No main camera!"); return; }

            // FORCE camera setup
            cam.clearFlags = CameraClearFlags.SolidColor;

            if (TestModeTheme.IsActive)
            {
                cam.backgroundColor = new Color(0.98f, 0.96f, 0.90f);
                Debug.Log("[GameplayTheme] TEST camera cream set");
            }

            // TEST MODE: camera solid cream
            if (TestModeTheme.IsActive)
            {
                cam.clearFlags = CameraClearFlags.SolidColor;
                cam.backgroundColor = TestModeTheme.CreamBG;
                Debug.Log("[GameplayTheme] TEST MODE - camera cream");

                // Sprite bhi lagao backup ke liye
                _bgObj = new GameObject("GameplayBackground");
                _bgObj.transform.SetParent(transform, false);
                var sr = _bgObj.AddComponent<SpriteRenderer>();
                sr.sprite = UISpriteFactory.Create3DSphereSprite(TestModeTheme.CreamBG, 4);
                sr.color = Color.white;
                sr.sortingOrder = -1000;
                float wh = cam.orthographicSize * 2.5f;
                float ww = wh * ((float)Screen.width / Screen.height);
                _bgObj.transform.localScale = new Vector3(ww, wh, 1f);
                _bgObj.transform.position = new Vector3(0f, 0f, 5f);
                return;
            }

            // PRODUCTION
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.05f, 0.05f, 0.15f);

            _bgObj = new GameObject("GameplayBackground");
            _bgObj.transform.SetParent(transform, false);

            var sr2 = _bgObj.AddComponent<SpriteRenderer>();
            sr2.sprite = Resources.Load<Sprite>("UI/HomeScreen/Backgrounds/bg_space");
            sr2.color = Color.white;
            sr2.sortingOrder = -1000;

            if (sr2.sprite != null)
            {
                float worldHeight = cam.orthographicSize * 2f;
                float worldWidth = worldHeight * ((float)Screen.width / Screen.height);
                float spriteW = sr2.sprite.bounds.size.x;
                float spriteH = sr2.sprite.bounds.size.y;
                _bgObj.transform.localScale = new Vector3(worldWidth / spriteW, worldHeight / spriteH, 1f);
            }
            _bgObj.transform.position = new Vector3(0f, 0f, 5f);
            Debug.Log("[GameplayTheme] PRODUCTION - space bg");
        }
    }
}

