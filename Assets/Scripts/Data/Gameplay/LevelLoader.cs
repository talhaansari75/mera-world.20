using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace MeraWorld.Gameplay
{
    /// <summary>
    /// Loads level definition files (plain text, one word per line).
    /// Works with a folder path — Unity will pass Application.streamingAssetsPath later.
    /// </summary>
    public static class LevelLoader
    {
        public class LevelDefinition
        {
            public int LevelNumber { get; set; }
            public List<string> Words { get; set; } = new List<string>();
            public int GridRows { get; set; } = 8;
            public int GridColumns { get; set; } = 8;
        }

        /// <summary>
        /// Loads a single level from a .txt file. One word per line.
        /// Blank lines and lines starting with '#' are ignored.
        /// </summary>
        public static LevelDefinition LoadFromFile(string filePath, int levelNumber)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Level file not found: {filePath}");

            var level = new LevelDefinition { LevelNumber = levelNumber };

            foreach (var line in File.ReadAllLines(filePath))
            {
                var trimmed = line.Trim();
                if (string.IsNullOrWhiteSpace(trimmed)) continue;
                if (trimmed.StartsWith("#")) continue;

                level.Words.Add(trimmed.ToUpperInvariant());
            }

            return level;
        }

        /// <summary>
        /// Loads all level-XX.txt files in a folder, sorted by number.
        /// </summary>
        public static List<LevelDefinition> LoadAllFromFolder(string folderPath)
        {
            if (!Directory.Exists(folderPath))
                throw new DirectoryNotFoundException($"Levels folder not found: {folderPath}");

            var levels = new List<LevelDefinition>();
            var files = Directory.GetFiles(folderPath, "level-*.txt")
                                 .OrderBy(f => int.Parse(System.Text.RegularExpressions.Regex.Match(f, @"\d+").Value))
                                 .ToList();

            for (int i = 0; i < files.Count; i++)
            {
                levels.Add(LoadFromFile(files[i], i + 1));
            }

            return levels;
        }
    }
}