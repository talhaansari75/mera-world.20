using NUnit.Framework;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Tests
{
    [TestFixture]
    public class WordSearchGeneratorTests
    {
        [Test]
        public void Generator_Places_All_Short_Words_In_Large_Grid()
        {
            var words = new List<string> { "CAT", "DOG", "SUN", "MOON" };
            var result = WordSearchGenerator.Generate(10, 10, words, seed: 42);

            Assert.AreEqual(4, result.PlacedWords.Count);
            Assert.AreEqual(0, result.FailedWords.Count);
        }

        [Test]
        public void Generator_Is_Deterministic_With_Same_Seed()
        {
            var words = new List<string> { "CAT", "DOG", "SUN" };
            var r1 = WordSearchGenerator.Generate(8, 8, words, seed: 100);
            var r2 = WordSearchGenerator.Generate(8, 8, words, seed: 100);

            Assert.AreEqual(r1.Grid.ToDisplayString(), r2.Grid.ToDisplayString());
        }

        [Test]
        public void Generator_Fills_Empty_Cells()
        {
            var words = new List<string> { "CAT" };
            var result = WordSearchGenerator.Generate(5, 5, words, seed: 1);

            for (int r = 0; r < 5; r++)
                for (int c = 0; c < 5; c++)
                    Assert.AreNotEqual(' ', result.Grid.GetCell(r, c).Letter);
        }
    }
}