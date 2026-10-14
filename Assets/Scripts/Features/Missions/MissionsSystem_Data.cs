using System.Collections.Generic;

namespace MeraWorld.Core
{
    public partial class MissionsSystem
    {
        private static readonly List<Mission> DailyMissions = new List<Mission>
        {
            new Mission { Id = "d_words_10", Title = "Word Finder", Description = "Find 10 words", Target = 10, Reward = 50, Type = "daily" },
            new Mission { Id = "d_levels_2", Title = "Level Master", Description = "Complete 2 levels", Target = 2, Reward = 75, Type = "daily" },
            new Mission { Id = "d_combo_3", Title = "Combo King", Description = "Reach x3 combo", Target = 1, Reward = 100, Type = "daily" },
            new Mission { Id = "d_perfect_1", Title = "Perfectionist", Description = "Complete a level with 0 hints", Target = 1, Reward = 80, Type = "daily" },
        };

        private static readonly List<Mission> WeeklyMissions = new List<Mission>
        {
            new Mission { Id = "w_words_100", Title = "Word Warrior", Description = "Find 100 words this week", Target = 100, Reward = 500, Type = "weekly" },
            new Mission { Id = "w_levels_15", Title = "Level Champion", Description = "Complete 15 levels", Target = 15, Reward = 750, Type = "weekly" },
            new Mission { Id = "w_combo_5", Title = "Combo Legend", Description = "Reach x5 combo", Target = 1, Reward = 1000, Type = "weekly" },
        };
    }
}