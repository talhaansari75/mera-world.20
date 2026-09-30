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
            // ========== Levels 1-20 ==========
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

            // ========== Levels 21-30 ==========
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

            // ========== Levels 31-40 ==========
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

            // ========== Levels 41-50 ==========
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

            // ========== Levels 51-60 ==========
            new[] { "BUTTERFLY", "CATERPILLAR", "DRAGONFLY", "GRASSHOPPER", "LADYBUG", "FIREFLY", "BEETLE", "MANTIS" },
            new[] { "MOUNTAIN", "VOLCANO", "GLACIER", "CANYON", "PLATEAU", "PENINSULA", "ARCHIPELAGO", "CONTINENT" },
            new[] { "SANDWICH", "PIZZA", "BURGER", "PASTA", "SUSHI", "TACO", "SALAD", "SOUP" },
            new[] { "GUITAR", "PIANO", "VIOLIN", "DRUMS", "TRUMPET", "FLUTE", "SAXOPHONE", "HARMONICA" },
            new[] { "ELEPHANT", "GIRAFFE", "RHINOCEROS", "HIPPOPOTAMUS", "CROCODILE", "ALLIGATOR", "KANGAROO", "WOMBAT" },
            new[] { "TELESCOPE", "MICROSCOPE", "PERISCOPE", "STETHOSCOPE", "KALEIDOSCOPE", "GYROSCOPE", "BAROMETER", "THERMOMETER" },
            new[] { "SAPPHIRE", "EMERALD", "DIAMOND", "RUBY", "OPAL", "TOPAZ", "AMETHYST", "OBSIDIAN" },
            new[] { "ADVENTURE", "DISCOVERY", "EXPLORATION", "EXPEDITION", "JOURNEY", "ODYSSEY", "QUEST", "VOYAGE" },
            new[] { "MIDNIGHT", "TWILIGHT", "DAWN", "DUSK", "NOON", "SUNRISE", "SUNSET", "AURORA" },
            new[] { "HAPPINESS", "SADNESS", "EXCITEMENT", "CALMNESS", "BRAVERY", "KINDNESS", "WISDOM", "PATIENCE" },

            // ========== Levels 61-70 ==========
            new[] { "CHOCOLATE", "VANILLA", "STRAWBERRY", "CARAMEL", "MOCHA", "PISTACHIO", "HAZELNUT", "ALMOND" },
            new[] { "COMPUTER", "KEYBOARD", "MONITOR", "SPEAKER", "CAMERA", "PRINTER", "SCANNER", "ROUTER" },
            new[] { "MOUNTAIN", "MEADOW", "FOREST", "DESERT", "JUNGLE", "SAVANNA", "TUNDRA", "SWAMP" },
            new[] { "PHILOSOPHY", "PSYCHOLOGY", "BIOLOGY", "CHEMISTRY", "PHYSICS", "GEOLOGY", "ASTRONOMY", "MATHEMATICS" },
            new[] { "BASKETBALL", "FOOTBALL", "BASEBALL", "CRICKET", "TENNIS", "HOCKEY", "VOLLEYBALL", "BADMINTON" },
            new[] { "FESTIVAL", "CARNIVAL", "PARADE", "CONCERT", "WEDDING", "BIRTHDAY", "ANNIVERSARY", "CELEBRATION" },
            new[] { "STRAWBERRY", "BLUEBERRY", "RASPBERRY", "BLACKBERRY", "CRANBERRY", "GOOSEBERRY", "ELDERBERRY", "MULBERRY" },
            new[] { "HOSPITAL", "PHARMACY", "CLINIC", "DOCTOR", "NURSE", "SURGEON", "DENTIST", "PHYSICIAN" },
            new[] { "ORCHESTRA", "SYMPHONY", "CONCERTO", "SONATA", "BALLAD", "HYMN", "ANTHEM", "OPERA" },
            new[] { "PARLIAMENT", "DEMOCRACY", "REPUBLIC", "MONARCHY", "DICTATORSHIP", "FEDERATION", "CONFEDERATION", "EMPIRE" },

            // ========== Levels 71-80 ==========
            new[] { "REFRIGERATOR", "MICROWAVE", "DISHWASHER", "VACUUM", "TOASTER", "BLENDER", "KETTLE", "COFFEEMAKER" },
            new[] { "JOURNALISM", "PHOTOGRAPHY", "SCULPTURE", "ARCHITECTURE", "PAINTING", "POTTERY", "WEAVING", "CARVING" },
            new[] { "SPACESHIP", "ASTRONAUT", "SATELLITE", "TELESCOPE", "ASTEROID", "METEORITE", "SUPERNOVA", "CONSTELLATION" },
            new[] { "VOCABULARY", "GRAMMAR", "PRONUNCIATION", "SYNTAX", "SEMANTICS", "ETYMOLOGY", "PHONETICS", "LINGUISTICS" },
            new[] { "ELEPHANT", "TIGER", "LEOPARD", "CHEETAH", "JAGUAR", "PANTHER", "LION", "LYNX" },
            new[] { "PYRAMID", "SPHINX", "TEMPLE", "PALACE", "CASTLE", "FORTRESS", "MONUMENT", "OBELISK" },
            new[] { "COMPASSION", "EMPATHY", "SYMPATHY", "GENEROSITY", "ALTRUISM", "BENEVOLENCE", "MAGNANIMITY", "PHILANTHROPY" },
            new[] { "SWEATER", "JACKET", "TROUSERS", "SHIRT", "DRESS", "SKIRT", "SCARF", "GLOVES" },
            new[] { "STETHOSCOPE", "SYRINGE", "BANDAGE", "MEDICINE", "VACCINE", "ANTIBIOTIC", "PRESCRIPTION", "DIAGNOSIS" },
            new[] { "MARATHON", "TRIATHLON", "PENTATHLON", "DECATHLON", "GYMNASTICS", "SWIMMING", "CYCLING", "ROWING" },

            // ========== Levels 81-90 ==========
            new[] { "PHILOSOPHER", "SCIENTIST", "ENGINEER", "ARCHITECT", "MUSICIAN", "ARTIST", "WRITER", "INVENTOR" },
            new[] { "DEMOCRACY", "FREEDOM", "JUSTICE", "EQUALITY", "LIBERTY", "FRATERNITY", "SOLIDARITY", "INDEPENDENCE" },
            new[] { "CIVILIZATION", "CULTURE", "TRADITION", "HERITAGE", "ANCESTRY", "GENEALOGY", "LINEAGE", "DESCENT" },
            new[] { "BREAKFAST", "LUNCH", "DINNER", "SNACK", "DESSERT", "APPETIZER", "MAINCOURSE", "BEVERAGE" },
            new[] { "GALAXY", "NEBULA", "QUASAR", "PULSAR", "BLACKHOLE", "WORMHOLE", "DIMENSION", "UNIVERSE" },
            new[] { "PAINTING", "SCULPTURE", "CERAMICS", "MOSAIC", "FRESCO", "PORTRAIT", "LANDSCAPE", "STILLLIFE" },
            new[] { "ATHLETICS", "FOOTBALL", "CRICKET", "HOCKEY", "RUGBY", "POLO", "BOXING", "WRESTLING" },
            new[] { "ORCHESTRA", "CHOIR", "BAND", "ENSEMBLE", "QUARTET", "TRIO", "DUET", "SOLOIST" },
            new[] { "MOUNTAINEER", "EXPLORER", "ADVENTURER", "PIONEER", "TRAVELER", "VOYAGER", "NAVIGATOR", "CARTOGRAPHER" },
            new[] { "HOSPITALITY", "GENEROSITY", "KINDNESS", "WARMTH", "COMFORT", "WELCOME", "FRIENDLINESS", "GRACIOUSNESS" },

            // ========== Levels 91-100 ==========
            new[] { "TECHNOLOGY", "INNOVATION", "DISCOVERY", "INVENTION", "CREATION", "EVOLUTION", "REVOLUTION", "TRANSFORMATION" },
            new[] { "EDUCATION", "LEARNING", "KNOWLEDGE", "WISDOM", "UNDERSTANDING", "INSIGHT", "ENLIGHTENMENT", "REALIZATION" },
            new[] { "CELEBRATION", "FESTIVITY", "JOYFULNESS", "HAPPINESS", "CHEERFULNESS", "GLADNESS", "MERRIMENT", "JUBILATION" },
            new[] { "COMPETITION", "CHALLENGE", "STRUGGLE", "ENDEAVOR", "PURSUIT", "AMBITION", "ASPIRATION", "DETERMINATION" },
            new[] { "PERSEVERANCE", "PERSISTENCE", "RESILIENCE", "TENACITY", "FORTITUDE", "GRIT", "ENDURANCE", "STAMINA" },
            new[] { "ILLUSTRATION", "PHOTOGRAPHY", "FILMMAKING", "ANIMATION", "GRAPHICDESIGN", "TYPOGRAPHY", "CALLIGRAPHY", "LITHOGRAPHY" },
            new[] { "SHIP", "YACHT", "SAILBOAT", "SUBMARINE", "FERRY", "CANOE", "KAYAK", "GONDOLA" },
            new[] { "HARMONIOUS", "MELODIOUS", "RHYTHMIC", "HARMONIC", "SYMPHONIC", "ORCHESTRAL", "INSTRUMENTAL", "VOCAL" },
            new[] { "ACHIEVEMENT", "ACCOMPLISHMENT", "ATTAINMENT", "REALIZATION", "FULFILLMENT", "SUCCESS", "TRIUMPH", "VICTORY" },
            new[] { "IMAGINATION", "CREATIVITY", "INNOVATION", "ORIGINALITY", "INVENTIVENESS", "RESOURCEFULNESS", "INGENUITY", "ARTISTRY" },
        };

        // =================================================================
        // IMPORTANT: Grid is generated in Awake() so other scripts can
        // read it safely in their Start() methods.
        // =================================================================
        void Awake()
        {
            CurrentLevel = PlayerProgressManager.Instance != null
                ? PlayerProgressManager.Instance.CurrentLevel
                : PlayerPrefs.GetInt("CurrentLevel", 1);

            var requestedWords = GetWordsForLevel(CurrentLevel);
            int seed = CurrentLevel * 7919 + 13;

            Debug.Log($"=== Mera World: Level {CurrentLevel} ===");
            Debug.Log($"Words: {string.Join(", ", requestedWords)}");
            Debug.Log($"Seed: {seed}");

            var result = GenerateWithRetry(requestedWords, seed);

            LastGeneratedGrid = result.Grid;
            Words = new List<string>(result.PlacedWords);

            Debug.Log($"Placed: {result.PlacedWords.Count} / {requestedWords.Count}");
            foreach (var w in result.PlacedWords)
                Debug.Log($"  OK {w}");
            if (result.FailedWords.Count > 0)
                foreach (var w in result.FailedWords)
                    Debug.LogWarning($"  FAIL {w} (dropped)");
        }

        private WordSearchGenerator.Result GenerateWithRetry(List<string> requestedWords, int seed)
        {
            WordSearchGenerator.Result best = null;
            int[] sizes = { GridRows, GridRows + 1, GridRows + 2, GridRows + 3 };

            foreach (var size in sizes)
            {
                var result = WordSearchGenerator.Generate(size, size, requestedWords, seed);

                if (best == null || result.PlacedWords.Count > best.PlacedWords.Count)
                    best = result;

                if (result.FailedWords.Count == 0)
                {
                    GridRows = size;
                    GridColumns = size;
                    Debug.Log($"[GameManager] All words placed in {size}x{size} grid.");
                    return result;
                }
            }

            Debug.LogWarning($"[GameManager] Some words could not be placed. Dropped: {string.Join(", ", best.FailedWords)}");
            return best;
        }

        private List<string> GetWordsForLevel(int level)
        {
            int index = (level - 1) % WordBankByLevel.Length;
            var source = WordBankByLevel[index];

            var list = new List<string>(source);

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