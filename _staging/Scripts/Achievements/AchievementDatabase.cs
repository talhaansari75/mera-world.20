using System.Collections.Generic;
using System.Linq;

namespace MeraWorld.Achievements
{
    /// <summary>
    /// Static list of all achievements in the game.
    /// Add new achievements here.
    /// </summary>
    public static class AchievementDatabase
    {
        public static readonly List<Achievement> All = new List<Achievement>
        {
            new Achievement("first_word", "First Word", "Find your first word", 1, 10),
            new Achievement("word_hunter", "Word Hunter", "Find 100 words", 100, 50),
            new Achievement("word_master", "Word Master", "Find 1000 words", 1000, 500),
            new Achievement("level_10", "Getting Started", "Complete level 10", 10, 100),
            new Achievement("level_50", "Halfway There", "Complete level 50", 50, 300),
            new Achievement("level_100", "Centurion", "Complete level 100", 100, 1000),
            new Achievement("perfect_level", "Flawless", "Complete a level with 3 stars", 1, 25),
            new Achievement("no_hints", "Puzzler", "Complete 10 levels without hints", 10, 150),
            new Achievement("speed_demon", "Speed Demon", "Finish a level in 30 seconds", 1, 75),
            new Achievement("streak_7", "Dedicated", "Play 7 days in a row", 7, 200),
        };

        public static Achievement GetById(string id)
        {
            return All.FirstOrDefault(a => a.Id == id);
        }
    }
}