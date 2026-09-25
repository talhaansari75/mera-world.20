using NUnit.Framework;
using MeraWorld.WordSearch;

namespace MeraWorld.Tests
{
    [TestFixture]
    public class WordPlacerTests
    {
        [Test]
        public void Place_Horizontal_Word_Succeeds()
        {
            var grid = new WordGrid(5, 5);
            bool ok = WordPlacer.TryPlace(grid, "CAT", 0, 0, Direction.Right);
            Assert.IsTrue(ok);
            Assert.AreEqual('C', grid.GetCell(0, 0).Letter);
            Assert.AreEqual('A', grid.GetCell(0, 1).Letter);
            Assert.AreEqual('T', grid.GetCell(0, 2).Letter);
        }

        [Test]
        public void Place_Word_Out_Of_Bounds_Fails()
        {
            var grid = new WordGrid(3, 3);
            bool ok = WordPlacer.TryPlace(grid, "ELEPHANT", 0, 0, Direction.Right);
            Assert.IsFalse(ok);
        }

        [Test]
        public void Place_Conflicting_Word_Fails()
        {
            var grid = new WordGrid(5, 5);
            WordPlacer.TryPlace(grid, "CAT", 0, 0, Direction.Right);
            bool ok = WordPlacer.TryPlace(grid, "DOG", 0, 0, Direction.Right);
            Assert.IsFalse(ok);
        }
    }
}