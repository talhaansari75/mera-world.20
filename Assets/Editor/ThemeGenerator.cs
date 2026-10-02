using UnityEngine;
using UnityEditor;
using MeraWorld.Core;

public class ThemeGenerator
{
    [MenuItem("Tools/Generate Themes")]
    public static void GenerateThemes()
    {
        string folder = "Assets/Scripts/Themes";
        if (!AssetDatabase.IsValidFolder(folder))
        {
            AssetDatabase.CreateFolder("Assets/Scripts", "Themes");
        }

        CreateTheme(folder + "/DefaultTheme.asset", "Ink & Starlight",
            new Color(0.16f, 0.08f, 0.34f, 1f),
            new Color(0.02f, 0.02f, 0.08f, 1f),
            new Color(1f, 0.85f, 0.30f, 1f),
            new Color(0.25f, 0.65f, 0.35f, 1f),
            new Color(0.25f, 0.45f, 0.85f, 1f));

        CreateTheme(folder + "/GoldenTheme.asset", "Golden",
            new Color(0.30f, 0.20f, 0.05f, 1f),
            new Color(0.10f, 0.05f, 0.02f, 1f),
            new Color(1f, 0.85f, 0.30f, 1f),
            new Color(0.65f, 0.50f, 0.20f, 1f),
            new Color(0.85f, 0.65f, 0.25f, 1f));

        CreateTheme(folder + "/OceanTheme.asset", "Ocean",
            new Color(0.05f, 0.15f, 0.30f, 1f),
            new Color(0.02f, 0.05f, 0.12f, 1f),
            new Color(0.55f, 0.85f, 1f, 1f),
            new Color(0.20f, 0.55f, 0.75f, 1f),
            new Color(0.20f, 0.45f, 0.85f, 1f));

        CreateTheme(folder + "/SunsetTheme.asset", "Sunset",
            new Color(0.35f, 0.10f, 0.15f, 1f),
            new Color(0.12f, 0.03f, 0.05f, 1f),
            new Color(1f, 0.75f, 0.45f, 1f),
            new Color(0.85f, 0.35f, 0.30f, 1f),
            new Color(0.75f, 0.30f, 0.55f, 1f));

        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();

        Debug.Log("[ThemeGenerator] 4 themes created successfully!");
        EditorUtility.DisplayDialog("Success", "4 themes ban gayi!\n\nAb:\n1. GameManager select karo\n2. ThemeManager ke 'All Themes' mein Size 4 karo\n3. 4 themes drag karo", "OK");
    }

    private static void CreateTheme(string path, string name, Color bgTop, Color bgBottom,
        Color gold, Color green, Color blue)
    {
        var existing = AssetDatabase.LoadAssetAtPath<GameTheme>(path);
        if (existing != null)
        {
            existing.themeName = name;
            existing.bgTop = bgTop;
            existing.bgBottom = bgBottom;
            existing.gold = gold;
            existing.buttonGreen = green;
            existing.buttonBlue = blue;
            EditorUtility.SetDirty(existing);
            return;
        }

        var theme = ScriptableObject.CreateInstance<GameTheme>();
        theme.themeName = name;
        theme.bgTop = bgTop;
        theme.bgBottom = bgBottom;
        theme.gold = gold;
        theme.buttonGreen = green;
        theme.buttonBlue = blue;
        theme.topBarColor = new Color32(20, 30, 60, 255);

        AssetDatabase.CreateAsset(theme, path);
    }
}