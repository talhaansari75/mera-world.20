using NUnit.Framework;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Tests
{
    [TestFixture]
    public class WordSearchGeneratorTests
    {
        [Test]
        public void Generator_Places_All_Short_Words()
        {
            var words = new List<string> { "CAT", "DOG", "SUN", "MOON" };
            var result = WordSearchGenerator.Generate(10, 10, words, seed: 42);
            Assert.AreEqual(4, result.PlacedWords.Count);
        }

        [Test]
        public void Generator_Is_Deterministic()
        {
            var words = new List<string> { "CAT", "DOG" };
            var r1 = WordSearchGenerator.Generate(8, 8, words, seed: 100);
            var r2 = WordSearchGenerator.Generate(8, 8, words, seed: 100);
            Assert.AreEqual(r1.Grid.ToDisplayString(), r2.Grid.ToDisplayString());
        }
    }
}