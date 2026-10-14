namespace MeraWorld.Gameplay
{
    /// <summary>
    /// Represents the current state of a gameplay session.
    /// Used by the game loop to decide what should happen next.
    /// </summary>
    public enum GameState
    {
        NotStarted,
        Playing,
        Paused,
        LevelComplete,
        LevelFailed,
        Loading
    }
}