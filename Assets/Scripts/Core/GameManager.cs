using UnityEngine;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Core
{
    public class GameManager : MonoBehaviour
    {
        [Header("Grid Settings")]
        public int GridRows = 8;
        public int GridColumns = 8;

        [Header("Words")]
        public List<string> Words = new List<string>();

        [HideInInspector]
        public WordGrid LastGeneratedGrid;

        [HideInInspector]
        public int CurrentLevel = 1;

        private static readonly string[][] WordBankByLevel = new string[][]
        {
            // ========== Levels 1-20 (existing) ==========
            new[] { "CAT", "DOG", "SUN", "MOON", "STAR", "FISH", "BIRD", "TREE" },
            new[] { "BOOK", "GAME", "PLAY", "FOOD", "HOME", "LOVE", "HOPE", "TIME" },
            new[] { "APPLE", "BREAD", "CHAIR", "DANCE", "EAGLE", "FLAME", "GRASS", "HONEY" },
            new[] { "BEACH", "CLOUD", "DREAM", "EARTH", "FRUIT", "GRAPE", "HAPPY", "JUICE" },
            new[] { "MUSIC", "NIGHT", "OCEAN", "PIANO", "QUEEN", "RIVER", "SMILE", "TIGER" },
            new[] { "BRIDGE", "CASTLE", "DRAGON", "FLOWER", "GARDEN", "HUNTER", "ISLAND", "JUNGLE" },
            new[] { "ANIMAL", "BOTTLE", "CAMERA", "DOCTOR", "ENGINE", "FAMILY", "GUITAR", "HAMMER" },
            new[] { "ADVENTURE", "BUTTERFLY", "CHAMPION", "DINOSAUR", "ELEPHANT", "FIREFLY", "GALAXY", "HORIZON" },
            new[] { "BLOSSOM", "COMPASS", "DIAMOND", "EXPLORE", "FREEDOM", "GLOWING", "HARMONY", "JOURNEY" },
            new[] { "MYSTERY", "PUZZLE", "RIDDLE", "SECRET", "ENIGMA", "CIPHER", "KEYSTONE", "PATTERN" },
            new[] { "WHISPER", "THUNDER", "SILENCE", "ECHOING", "RHYTHM", "MELODY", "CRESCENDO", "SYMPHONY" },
            new[] { "MEADOW", "CANYON", "GLACIER", "VOLCANO", "HARBOR", "LAGOON", "SUMMIT", "VALLEY" },
            new[] { "PLANET", "COMET", "METEOR", "ORBIT", "ROCKET", "NEBULA", "COSMOS", "STELLAR" },
            new[] { "OCEAN", "DOLPHIN", "WHALE", "CORAL", "SEAWEED", "TURTLE", "ISLAND", "SHELL" },
            new[] { "SPRING", "SUMMER", "AUTUMN", "WINTER", "BLOSSOM", "SUNSHINE", "RAINBOW", "SNOWFLAKE" },
            new[] { "TEACHER", "DOCTOR", "ENGINEER", "ARTIST", "WRITER", "SCIENTIST", "PILOT", "CHEF" },
            new[] { "ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "KANGAROO", "BUTTERFLY", "CROCODILE", "FLAMINGO" },
            new[] { "TREASURE", "JOURNEY", "ADVENTURE", "DISCOVERY", "EXPEDITION", "EXPLORER", "COMPASS", "MAP" },
            new[] { "TWILIGHT", "ECLIPSE", "PHANTOM", "CRYSTAL", "SILVER", "GOLDEN", "MARBLE", "VELVET" },
            new[] { "INFINITY", "ETERNAL", "COSMIC", "QUANTUM", "PHOTON", "GRAVITY", "MAGNETIC", "SPECTRUM" },

            // ========== Levels 21-30 (NEW) ==========
            new[] { "GARDEN", "SILVER", "MEADOW", "PUZZLE", "CANDLE", "DESERT", "FOREST", "MIRROR" },
            new[] { "ANCIENT", "MYSTERY", "WHISPER", "JOURNEY", "BALANCE", "HORIZON", "MAGICAL", "SPARKLE" },
            new[] { "CRIMSON", "EMERALD", "SAPPHIRE", "OBSIDIAN", "AMETHYST", "TOPAZ", "OPAL", "JADE" },
            new[] { "WHISKER", "TWINKLE", "GIGGLE", "NIBBLE", "WOBBLE", "SPRINKLE", "CRACKLE", "WIGGLE" },
            new[] { "FRIENDSHIP", "HAPPINESS", "ADVENTURE", "DISCOVERY", "CHALLENGE", "TRIUMPH", "VICTORY", "FREEDOM" },
            new[] { "TELESCOPE", "MICROSCOPE", "PERISCOPE", "KALEIDOSCOPE", "STETHOSCOPE", "HOROSCOPE", "GYROSCOPE", "SCOPE" },
            new[] { "THUNDER", "LIGHTNING", "HURRICANE", "TORNADO", "BLIZZARD", "AVALANCHE", "EARTHQUAKE", "TSUNAMI" },
            new[] { "BUTTERFLY", "LADYBUG", "FIREFLY", "DRAGONFLY", "GRASSHOPPER", "CRICKET", "BEETLE", "MANTIS" },
            new[] { "PIANO", "GUITAR", "VIOLIN", "TRUMPET", "SAXOPHONE", "FLUTE", "DRUMS", "HARP" },
            new[] { "SPAGHETTI", "LASAGNA", "RAVIOLI", "FETTUCCINE", "MACARONI", "PENNE", "RIGATONI", "LINGUINE" },

            // ========== Levels 31-40 (NEW) ==========
            new[] { "AURORA", "CORONA", "SOLSTICE", "EQUINOX", "ZENITH", "NADIR", "APEX", "VERGE" },
            new[] { "ANTIQUE", "VINTAGE", "CLASSIC", "MODERN", "FUTURE", "PRESENT", "HISTORY", "LEGACY" },
            new[] { "SAPPHIRE", "DIAMOND", "EMERALD", "RUBY", "PEARL", "OPAL", "TOPAZ", "AMBER" },
            new[] { "ELEGANCE", "GRACE", "BEAUTY", "CHARM", "POISE", "STYLE", "FASHION", "GLAMOUR" },
            new[] { "MOUNTAIN", "VALLEY", "CANYON", "PLATEAU", "CLIFF", "RIDGE", "SUMMIT", "PEAK" },
            new[] { "ALPHABET", "LANGUAGE", "GRAMMAR", "VOCABULARY", "SENTENCE", "PARAGRAPH", "CHAPTER", "STORY" },
            new[] { "CRYSTAL", "PRISM", "SPECTRUM", "REFLECT", "REFRACT", "SHIMMER", "GLIMMER", "GLISTEN" },
            new[] { "COMPASSION", "KINDNESS", "GENEROSITY", "HONESTY", "LOYALTY", "PATIENCE", "COURAGE", "WISDOM" },
            new[] { "TRIUMPH", "VICTORY", "CHAMPION", "WINNER", "LEGEND", "HERO", "MASTER", "TITAN" },
            new[] { "STARDUST", "MOONBEAM", "SUNRISE", "SUNSET", "TWILIGHT", "DAWN", "DUSK", "NIGHTFALL" },

            // ========== Levels 41-50 (NEW) ==========
            new[] { "OBSERVATORY", "LABORATORY", "LIBRARY", "GALLERY", "THEATER", "STADIUM", "MUSEUM", "ACADEMY" },
            new[] { "MELODIOUS", "HARMONIOUS", "RHYTHMIC", "LYRICAL", "POETIC", "ARTISTIC", "CREATIVE", "MUSICAL" },
            new[] { "RESPLENDENT", "MAGNIFICENT", "SPLENDID", "GLORIOUS", "MAJESTIC", "GRAND", "SUBLIME", "DIVINE" },
            new[] { "PERSEVERE", "ENDEAVOR", "PURSUE", "CONQUER", "OVERCOME", "ACHIEVE", "SUCCEED", "PROSPER" },
            new[] { "WHIMSICAL", "QUIZZICAL", "COMICAL", "FANCIFUL", "CAPRICIOUS", "PLAYFUL", "MISCHIEVOUS", "JOVIAL" },
            new[] { "TRANQUIL", "SERENE", "PEACEFUL", "CALM", "SOOTHING", "GENTLE", "TENDER", "SOFT" },
            new[] { "ILLUMINATE", "RADIATE", "GLOWING", "SHIMMERING", "GLISTENING", "SPARKLING", "DAZZLING", "BLAZING" },
            new[] { "ADVENTUROUS", "COURAGEOUS", "FEARLESS", "DARING", "BOLD", "VALIANT", "HEROIC", "GALLANT" },
            new[] { "ABUNDANCE", "PROSPERITY", "WEALTH", "FORTUNE", "RICHES", "TREASURE", "PLENTY", "BOUNTY" },
            new[] { "TRANSCENDENT", "EXTRAORDINARY", "REMARKABLE", "EXCEPTIONAL", "PHENOMENAL", "MIRACULOUS", "WONDROUS", "ASTOUNDING" },
        };

        void Start()
        {
            CurrentLevel = PlayerProgressManager.Instance != null
                ? PlayerProgressManager.Instance.CurrentLevel
                : PlayerPrefs.GetInt("CurrentLevel", 1);

            Words = GetWordsForLevel(CurrentLevel);

            int seed = CurrentLevel * 7919 + 13;

            Debug.Log($"=== Mera World: Level {CurrentLevel} ===");
            Debug.Log($"Words: {string.Join(", ", Words)}");
            Debug.Log($"Seed: {seed}");

            var result = WordSearchGenerator.Generate(GridRows, GridColumns, Words, seed);

            LastGeneratedGrid = result.Grid;

            Debug.Log($"Placed: {result.PlacedWords.Count} / {Words.Count}");

            foreach (var w in result.PlacedWords)
                Debug.Log($"  OK {w}");

            if (result.FailedWords.Count > 0)
                foreach (var w in result.FailedWords)
                    Debug.LogWarning($"  FAIL {w}");
        }

        private List<string> GetWordsForLevel(int level)
        {
            int index = (level - 1) % WordBankByLevel.Length;
            var source = WordBankByLevel[index];

            var list = new List<string>(source);

            // For levels > 50, shuffle the words
            if (level > WordBankByLevel.Length)
            {
                var rng = new System.Random(level * 9973);
                for (int i = list.Count - 1; i > 0; i--)
                {
                    int j = rng.Next(i + 1);
                    var tmp = list[i];
                    list[i] = list[j];
                    list[j] = tmp;
                }
            }

            return list;
        }
    }
}