using System;
using System.Text.RegularExpressions;

namespace MeraWorld.Auth
{
    public enum AuthProvider
    {
        EmailPassword,
        Google,
        Facebook,
        Apple,
        Twitter,
        Guest
    }

    public enum AuthResultCode
    {
        Success,
        InvalidEmail,
        WeakPassword,
        EmailAlreadyInUse,
        UserNotFound,
        WrongPassword,
        NetworkError,
        Cancelled,
        Unknown
    }

    [Serializable]
    public class AuthUser
    {
        public string UserId;
        public string Email;
        public string DisplayName;
        public AuthProvider Provider;
        public bool IsEmailVerified;
        public long CreatedAtUnixSeconds;
        public string PhotoUrl;
    }

    public class AuthResult
    {
        public bool Success;
        public AuthResultCode Code;
        public string Message;
        public AuthUser User;

        public static AuthResult Ok(AuthUser user) => new AuthResult
        {
            Success = true,
            Code = AuthResultCode.Success,
            User = user
        };

        public static AuthResult Fail(AuthResultCode code, string message) => new AuthResult
        {
            Success = false,
            Code = code,
            Message = message
        };
    }

    /// <summary>
    /// Validates email and password before sending to auth provider.
    /// </summary>
    public static class AuthValidator
    {
        private static readonly Regex EmailRegex = new Regex(
            @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return EmailRegex.IsMatch(email.Trim());
        }

        public static bool IsStrongPassword(string password, out string reason)
        {
            reason = null;

            if (string.IsNullOrEmpty(password))
            {
                reason = "Password cannot be empty.";
                return false;
            }

            if (password.Length < 8)
            {
                reason = "Password must be at least 8 characters.";
                return false;
            }

            bool hasUpper = false, hasLower = false, hasDigit = false;
            foreach (var c in password)
            {
                if (char.IsUpper(c)) hasUpper = true;
                else if (char.IsLower(c)) hasLower = true;
                else if (char.IsDigit(c)) hasDigit = true;
            }

            if (!hasUpper || !hasLower || !hasDigit)
            {
                reason = "Password must include uppercase, lowercase, and a number.";
                return false;
            }

            return true;
        }

        public static int GetPasswordStrength(string password)
        {
            if (string.IsNullOrEmpty(password)) return 0;

            int score = 0;
            if (password.Length >= 8) score++;
            if (password.Length >= 12) score++;
            if (Regex.IsMatch(password, "[A-Z]")) score++;
            if (Regex.IsMatch(password, "[a-z]")) score++;
            if (Regex.IsMatch(password, "[0-9]")) score++;
            if (Regex.IsMatch(password, "[^a-zA-Z0-9]")) score++;

            return Math.Min(score, 5); // 0-5 scale
        }
    }
}