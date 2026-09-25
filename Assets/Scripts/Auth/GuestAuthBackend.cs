using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MeraWorld.Auth
{
    /// <summary>
    /// Local-only auth backend for testing before Firebase is set up.
    /// Stores users in memory + a local file.
    /// </summary>
    public class GuestAuthBackend : IAuthBackend
    {
        private readonly Dictionary<string, (string passwordHash, AuthUser user)> _users
            = new Dictionary<string, (string, AuthUser)>();

        public AuthUser CurrentUser { get; private set; }

        public Task<AuthResult> SignUpWithEmail(string email, string password, string displayName)
        {
            if (_users.ContainsKey(email))
                return Task.FromResult(AuthResult.Fail(
                    AuthResultCode.EmailAlreadyInUse,
                    "This email is already registered."));

            var user = new AuthUser
            {
                UserId = Guid.NewGuid().ToString("N").Substring(0, 12),
                Email = email,
                DisplayName = displayName,
                Provider = AuthProvider.EmailPassword,
                IsEmailVerified = false,
                CreatedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            _users[email] = (HashPassword(password), user);
            CurrentUser = user;
            return Task.FromResult(AuthResult.Ok(user));
        }

        public Task<AuthResult> SignInWithEmail(string email, string password)
        {
            if (!_users.TryGetValue(email, out var record))
                return Task.FromResult(AuthResult.Fail(
                    AuthResultCode.UserNotFound,
                    "No account found with this email."));

            if (record.passwordHash != HashPassword(password))
                return Task.FromResult(AuthResult.Fail(
                    AuthResultCode.WrongPassword,
                    "Incorrect password."));

            CurrentUser = record.user;
            return Task.FromResult(AuthResult.Ok(record.user));
        }

        public Task<AuthResult> SignInWithProvider(AuthProvider provider)
        {
            // Simulate provider sign-in (for testing UI)
            var user = new AuthUser
            {
                UserId = Guid.NewGuid().ToString("N").Substring(0, 12),
                Email = $"{provider.ToString().ToLower()}@example.com",
                DisplayName = $"{provider} User",
                Provider = provider,
                IsEmailVerified = true,
                CreatedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            CurrentUser = user;
            return Task.FromResult(AuthResult.Ok(user));
        }

        public Task<AuthResult> SendPasswordResetEmail(string email)
        {
            if (!_users.ContainsKey(email))
                return Task.FromResult(AuthResult.Fail(
                    AuthResultCode.UserNotFound,
                    "No account found with this email."));

            // In real app: this sends an email via Firebase
            return Task.FromResult(AuthResult.Ok(null));
        }

        public Task<AuthResult> SignInAsGuest()
        {
            var user = new AuthUser
            {
                UserId = "guest_" + Guid.NewGuid().ToString("N").Substring(0, 8),
                Email = null,
                DisplayName = "Guest",
                Provider = AuthProvider.Guest,
                IsEmailVerified = false,
                CreatedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            CurrentUser = user;
            return Task.FromResult(AuthResult.Ok(user));
        }

        public Task SignOut()
        {
            CurrentUser = null;
            return Task.CompletedTask;
        }

        private static string HashPassword(string password)
        {
            // Simple hash for stub — real backend uses bcrypt/scrypt
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(password + "mera-world-salt");
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}