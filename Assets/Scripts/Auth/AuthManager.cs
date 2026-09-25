using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MeraWorld.Auth
{
    /// <summary>
    /// Backend interface — implement this for Firebase, PlayFab, or custom server.
    /// </summary>
    public interface IAuthBackend
    {
        Task<AuthResult> SignUpWithEmail(string email, string password, string displayName);
        Task<AuthResult> SignInWithEmail(string email, string password);
        Task<AuthResult> SignInWithProvider(AuthProvider provider);
        Task<AuthResult> SendPasswordResetEmail(string email);
        Task<AuthResult> SignInAsGuest();
        Task SignOut();
        AuthUser CurrentUser { get; }
    }

    /// <summary>
    /// Main auth orchestrator. UI talks to this — not directly to backend.
    /// Also holds in-memory session + integrates with save system later.
    /// </summary>
    public class AuthManager
    {
        private readonly IAuthBackend _backend;

        public AuthUser CurrentUser => _backend?.CurrentUser;
        public bool IsSignedIn => CurrentUser != null;
        public bool IsGuest => CurrentUser != null && CurrentUser.Provider == AuthProvider.Guest;

        public event Action<AuthUser> OnSignedIn;
        public event Action OnSignedOut;

        public AuthManager(IAuthBackend backend)
        {
            _backend = backend ?? throw new ArgumentNullException(nameof(backend));
        }

        public async Task<AuthResult> SignUp(string email, string password, string displayName)
        {
            if (!AuthValidator.IsValidEmail(email))
                return AuthResult.Fail(AuthResultCode.InvalidEmail, "Please enter a valid email address.");

            if (!AuthValidator.IsStrongPassword(password, out var reason))
                return AuthResult.Fail(AuthResultCode.WeakPassword, reason);

            if (string.IsNullOrWhiteSpace(displayName))
                return AuthResult.Fail(AuthResultCode.Unknown, "Please enter a display name.");

            var result = await _backend.SignUpWithEmail(email.Trim().ToLowerInvariant(), password, displayName.Trim());

            if (result.Success)
                OnSignedIn?.Invoke(result.User);

            return result;
        }

        public async Task<AuthResult> SignIn(string email, string password)
        {
            if (!AuthValidator.IsValidEmail(email))
                return AuthResult.Fail(AuthResultCode.InvalidEmail, "Please enter a valid email address.");

            if (string.IsNullOrEmpty(password))
                return AuthResult.Fail(AuthResultCode.WeakPassword, "Please enter your password.");

            var result = await _backend.SignInWithEmail(email.Trim().ToLowerInvariant(), password);

            if (result.Success)
                OnSignedIn?.Invoke(result.User);

            return result;
        }

        public async Task<AuthResult> SignInWithProvider(AuthProvider provider)
        {
            if (provider == AuthProvider.EmailPassword)
                return AuthResult.Fail(AuthResultCode.Unknown, "Use SignIn(email, password) for email login.");

            var result = await _backend.SignInWithProvider(provider);

            if (result.Success)
                OnSignedIn?.Invoke(result.User);

            return result;
        }

        public async Task<AuthResult> ForgotPassword(string email)
        {
            if (!AuthValidator.IsValidEmail(email))
                return AuthResult.Fail(AuthResultCode.InvalidEmail, "Please enter a valid email address.");

            return await _backend.SendPasswordResetEmail(email.Trim().ToLowerInvariant());
        }

        public async Task<AuthResult> ContinueAsGuest()
        {
            var result = await _backend.SignInAsGuest();

            if (result.Success)
                OnSignedIn?.Invoke(result.User);

            return result;
        }

        public async Task SignOut()
        {
            await _backend.SignOut();
            OnSignedOut?.Invoke();
        }
    }
}