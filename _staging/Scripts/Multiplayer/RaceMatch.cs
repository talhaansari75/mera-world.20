using System;
using System.Collections.Generic;
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
    /// Manages a 1v1 race between player and bot on the same word puzzle.
    /// Pure C# — game loop calls Update() every frame.
    /// </summary>
    public class RaceMatch
    {
        public RaceStatus Status { get; private set; } = RaceStatus.Countdown;
        public BotPlayer Bot { get; private set; }
        public GameSession PlayerSession { get; private set; }

        public float CountdownSeconds { get; private set; } = 3f;
        public float ElapsedSeconds { get; private set; }

        public event Action<string> OnWordFound; // "player:APPLE" or "bot:APPLE"
        public event Action<RaceStatus> OnRaceEnded;

        public RaceMatch(GameSession playerSession, BotPlayer bot, float countdown = 3f)
        {
            PlayerSession = playerSession ?? throw new ArgumentNullException(nameof(playerSession));
            Bot = bot ?? throw new ArgumentNullException(nameof(bot));
            CountdownSeconds = countdown;
        }

        /// <summary>
        /// Called every frame from the game loop.
        /// </summary>
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

            // Bot's turn
            var botWord = Bot.Update(deltaSeconds);
            if (botWord != null)
                OnWordFound?.Invoke($"bot:{botWord}");

            // Check end conditions
            bool playerDone = PlayerSession.IsComplete;
            bool botDone = Bot.IsFinished;

            if (playerDone && botDone)
                EndRace(RaceStatus.Draw);
            else if (playerDone)
                EndRace(RaceStatus.PlayerWon);
            else if (botDone)
                EndRace(RaceStatus.BotWon);
        }

        /// <summary>
        /// Called by the player input handler when they select a valid word.
        /// </summary>
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
            int botFound = Bot.FoundWords.Count;
            int total = PlayerSession.WordsToFind.Count;
            return $"Player: {playerFound}/{total}  |  {Bot.Name}: {botFound}/{total}";
        }

        private void EndRace(RaceStatus result)
        {
            Status = result;
            OnRaceEnded?.Invoke(result);
        }
    }
}