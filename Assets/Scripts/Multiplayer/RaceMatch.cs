using System;
using MeraWorld.Session;

namespace MeraWorld.Multiplayer
{
    public enum RaceStatus
    {
        Countdown,
        Playing,
        PlayerWon,
        BotWon,
        Draw
    }

    /// <summary>
    /// Manages a 1v1 race between player and bot on the same puzzle.
    /// Bot difficulty auto-scales with level. Bot looks like a real player.
    /// Pure C# — game loop calls Update() every frame.
    /// </summary>
    public class RaceMatch
    {
        public RaceStatus Status { get; private set; } = RaceStatus.Countdown;
        public BotPlayer Bot { get; private set; }
        public GameSession PlayerSession { get; private set; }

        public float CountdownSeconds { get; private set; } = 3f;
        public float ElapsedSeconds { get; private set; }

        /// <summary>
        /// Name shown to the player. Always looks like a human — never reveals "bot".
        /// </summary>
        public string OpponentDisplayName => Bot.Name;

        /// <summary>
        /// True if this match is player vs bot (as opposed to a real PvP match).
        /// Internal only — UI should NOT display this to the player.
        /// </summary>
        internal bool IsBotMatch { get; private set; }

        public event Action<string> OnWordFound; // "player:APPLE" or "opponent:APPLE"
        public event Action<RaceStatus> OnRaceEnded;

        /// <summary>
        /// Create a match. If a real online opponent isn't available, we fill with a bot.
        /// Player never sees the difference.
        /// </summary>
        public static RaceMatch Create(
            GameSession playerSession,
            bool realOpponentAvailable,
            int currentLevel,
            float countdown = 3f)
        {
            if (realOpponentAvailable)
            {
                // Real PvP — hook will be added later
                throw new NotImplementedException("Real PvP will be added in a future update.");
            }

            // Fallback: create a level-appropriate bot
            var bot = BotPlayer.CreateForLevel(currentLevel, playerSession.WordsToFind);
            var match = new RaceMatch(playerSession, bot, countdown);
            match.IsBotMatch = true;
            return match;
        }

        public RaceMatch(GameSession playerSession, BotPlayer bot, float countdown = 3f)
        {
            PlayerSession = playerSession ?? throw new ArgumentNullException(nameof(playerSession));
            Bot = bot ?? throw new ArgumentNullException(nameof(bot));
            CountdownSeconds = countdown;
        }

        public void Update(float deltaSeconds)
        {
            if (Status == RaceStatus.PlayerWon || Status == RaceStatus.BotWon || Status == RaceStatus.Draw)
                return;

            if (Status == RaceStatus.Countdown)
            {
                CountdownSeconds -= deltaSeconds;
                if (CountdownSeconds <= 0f)
                {
                    Status = RaceStatus.Playing;
                    CountdownSeconds = 0f;
                }
                return;
            }

            ElapsedSeconds += deltaSeconds;

            var botWord = Bot.Update(deltaSeconds);
            if (botWord != null)
            {
                // Event label says "opponent" — never "bot"
                OnWordFound?.Invoke($"opponent:{botWord}");
            }

            bool playerDone = PlayerSession.IsComplete;
            bool botDone = Bot.IsFinished;

            if (playerDone && botDone) EndRace(RaceStatus.Draw);
            else if (playerDone) EndRace(RaceStatus.PlayerWon);
            else if (botDone) EndRace(RaceStatus.BotWon);
        }

        public bool PlayerFoundWord(string word)
        {
            if (Status != RaceStatus.Playing) return false;
            if (!PlayerSession.RegisterFoundWord(word)) return false;

            OnWordFound?.Invoke($"player:{word}");
            return true;
        }

        public string GetProgressSummary()
        {
            int playerFound = PlayerSession.FoundWords.Count;
            int opponentFound = Bot.FoundWords.Count;
            int total = PlayerSession.WordsToFind.Count;
            return $"You: {playerFound}/{total}   |   {Bot.Name}: {opponentFound}/{total}";
        }

        private void EndRace(RaceStatus result)
        {
            Status = result;
            OnRaceEnded?.Invoke(result);
        }
    }
}