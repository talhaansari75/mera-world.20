using NUnit.Framework;
using MeraWorld.Gameplay;

namespace MeraWorld.Tests
{
    [TestFixture]
    public class StarCalculatorTests
    {
        [Test]
        public void ZeroStars_WhenNotCompleted()
        {
            Assert.AreEqual(0, StarCalculator.Calculate(30, 0, false));
        }

        [Test]
        public void OneStar_WhenCompletedWithHints()
        {
            Assert.AreEqual(1, StarCalculator.Calculate(120, 2, true));
        }

        [Test]
        public void TwoStars_WhenNoHints()
        {
            Assert.AreEqual(2, StarCalculator.Calculate(90, 0, true));
        }

        [Test]
        public void ThreeStars_WhenNoHintsAndFast()
        {
            Assert.AreEqual(3, StarCalculator.Calculate(45, 0, true));
        }
    }
}
