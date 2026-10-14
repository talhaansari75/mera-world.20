using System.Collections.Generic;

namespace MeraWorld.Core
{
    /// <summary>
    /// Central list of all achievements in the game.
    /// Add new achievements here — no other file needs to change.
    /// </summary>
    public static class AchievementDefinitions
    {
        public class Achievement
        {
            public string Id;
            public string Title;
            public string Description;
            public int TargetCount;
            public int CoinReward;
            public int GemReward;
            public string Category; // "Words", "Levels", "Coins", "Social", "Special"
        }

        public static readonly List<Achievement> All = new List<Achievement>
        {
            // ========== WORDS FOUND ==========
            new Achievement { Id="first_word",    Title="First Steps",       Description="Find your first word",           TargetCount=1,    CoinReward=50,   GemReward=0,  Category="Words" },
            new Achievement { Id="word_10",       Title="Getting Warm",      Description="Find 10 words",                  TargetCount=10,   CoinReward=100,  GemReward=1,  Category="Words" },
            new Achievement { Id="word_50",       Title="Word Hunter",      Description="Find 50 words",                  TargetCount=50,   CoinReward=250,  GemReward=3,  Category="Words" },
            new Achievement { Id="word_hunter",   Title="Sharp Eyes",       Description="Find 100 words",                 TargetCount=100,  CoinReward=500,  GemReward=5,  Category="Words" },
            new Achievement { Id="word_master",   Title="Word Master",      Description="Find 500 words",                 TargetCount=500,  CoinReward=1000, GemReward=15, Category="Words" },
            new Achievement { Id="word_legend",   Title="Word Legend",      Description="Find 1000 words",                TargetCount=1000, CoinReward=2500, GemReward=30, Category="Words" },
            new Achievement { Id="word_5000",     Title="Vocabulary King",  Description="Find 5000 words",                TargetCount=5000, CoinReward=5000, GemReward=50, Category="Words" },

            // ========== LEVELS ==========
            new Achievement { Id="first_level",   Title="Level 1 Complete", Description="Complete your first level",      TargetCount=1,    CoinReward=100,  GemReward=0,  Category="Levels" },
            new Achievement { Id="level_5",       Title="Beginner",         Description="Complete 5 levels",              TargetCount=5,    CoinReward=150,  GemReward=1,  Category="Levels" },
            new Achievement { Id="level_10",      Title="Apprentice",       Description="Complete 10 levels",             TargetCount=10,   CoinReward=300,  GemReward=3,  Category="Levels" },
            new Achievement { Id="level_25",      Title="Intermediate",     Description="Complete 25 levels",             TargetCount=25,   CoinReward=600,  GemReward=5,  Category="Levels" },
            new Achievement { Id="level_50",      Title="Advanced",         Description="Complete 50 levels",             TargetCount=50,   CoinReward=1200, GemReward=10, Category="Levels" },
            new Achievement { Id="level_100",     Title="Expert",           Description="Complete 100 levels",            TargetCount=100,  CoinReward=2500, GemReward=20, Category="Levels" },
            new Achievement { Id="level_250",     Title="Master",           Description="Complete 250 levels",            TargetCount=250,  CoinReward=5000, GemReward=40, Category="Levels" },
            new Achievement { Id="level_500",     Title="Grandmaster",      Description="Complete 500 levels",            TargetCount=500,  CoinReward=10000,GemReward=75, Category="Levels" },

            // ========== PERFECT LEVELS ==========
            new Achievement { Id="perfect_1",     Title="Flawless",         Description="Complete a level without hints", TargetCount=1,    CoinReward=100,  GemReward=1,  Category="Special" },
            new Achievement { Id="perfect_10",    Title="Perfectionist",    Description="Complete 10 perfect levels",     TargetCount=10,   CoinReward=500,  GemReward=5,  Category="Special" },
            new Achievement { Id="perfect_50",    Title="Immaculate",       Description="Complete 50 perfect levels",     TargetCount=50,   CoinReward=2000, GemReward=20, Category="Special" },

            // ========== SPEED ==========
            new Achievement { Id="speed_30",      Title="Quick Thinker",    Description="Complete a level in 30s",        TargetCount=1,    CoinReward=200,  GemReward=2,  Category="Special" },
            new Achievement { Id="speed_5",       Title="Speed Demon",      Description="Complete 5 levels under 30s",    TargetCount=5,    CoinReward=800,  GemReward=8,  Category="Special" },

            // ========== COINS ==========
            new Achievement { Id="coins_500",     Title="Piggy Bank",       Description="Earn 500 coins total",           TargetCount=500,  CoinReward=50,   GemReward=0,  Category="Coins" },
            new Achievement { Id="coins_5000",    Title="Rich",             Description="Earn 5000 coins total",          TargetCount=5000, CoinReward=250,  GemReward=5,  Category="Coins" },
            new Achievement { Id="coins_50000",   Title="Millionaire",      Description="Earn 50000 coins total",         TargetCount=50000,CoinReward=2500, GemReward=25, Category="Coins" },

            // ========== STREAKS ==========
            new Achievement { Id="streak_3",      Title="On a Roll",        Description="Play 3 days in a row",           TargetCount=3,    CoinReward=150,  GemReward=2,  Category="Special" },
            new Achievement { Id="streak_7",      Title="Weekly Warrior",   Description="Play 7 days in a row",           TargetCount=7,    CoinReward=500,  GemReward=10, Category="Special" },
            new Achievement { Id="streak_30",     Title="Monthly Master",   Description="Play 30 days in a row",          TargetCount=30,   CoinReward=2500, GemReward=50, Category="Special" },

            // ========== MULTIPLAYER ==========
            new Achievement { Id="mp_first_win",  Title="First Blood",      Description="Win your first multiplayer match",TargetCount=1,   CoinReward=200,  GemReward=3,  Category="Social" },
            new Achievement { Id="mp_win_10",     Title="Competitor",       Description="Win 10 multiplayer matches",     TargetCount=10,   CoinReward=800,  GemReward=10, Category="Social" },
            new Achievement { Id="mp_win_50",     Title="Champion",         Description="Win 50 multiplayer matches",     TargetCount=50,   CoinReward=3000, GemReward=30, Category="Social" },
            new Achievement { Id="mp_win_100",    Title="Gladiator",        Description="Win 100 multiplayer matches",    TargetCount=100,  CoinReward=7500, GemReward=75, Category="Social" },

            // ========== SOCIAL ==========
            new Achievement { Id="share_1",       Title="Show Off",         Description="Share your progress once",       TargetCount=1,    CoinReward=100,  GemReward=1,  Category="Social" },
            new Achievement { Id="friend_1",      Title="Better Together",  Description="Add your first friend",          TargetCount=1,    CoinReward=200,  GemReward=3,  Category="Social" },
            new Achievement { Id="referral_1",    Title="Recruiter",        Description="Invite a friend",                TargetCount=1,    CoinReward=500,  GemReward=10, Category="Social" },

            // ========== SPECIAL ==========
            new Achievement { Id="night_owl",     Title="Night Owl",        Description="Play between 12am - 4am",        TargetCount=1,    CoinReward=150,  GemReward=2,  Category="Special" },
            new Achievement { Id="early_bird",    Title="Early Bird",       Description="Play between 4am - 7am",         TargetCount=1,    CoinReward=150,  GemReward=2,  Category="Special" },
            new Achievement { Id="daily_1",       Title="Daily Visitor",    Description="Complete a daily challenge",     TargetCount=1,    CoinReward=200,  GemReward=3,  Category="Special" },
            new Achievement { Id="daily_10",      Title="Daily Devotee",    Description="Complete 10 daily challenges",   TargetCount=10,   CoinReward=1000, GemReward=15, Category="Special" },
        };

        public static Achievement GetById(string id)
        {
            foreach (var a in All)
                if (a.Id == id) return a;
            return null;
        }
    }
}