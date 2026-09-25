using NUnit.Framework;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Tests
{
    [TestFixture]
    public class WordValidatorTests
    {
        [Test]
        public void ExtractWord_ReturnsNull_ForSingleCell()
        {
            var cells = new List<GridCell> { new GridCell(0, 0, 'A') };
            Assert.IsNull(WordValidator.ExtractWord(cells));
        }

        [Test]
        public void ExtractWord_ReturnsNull_ForSameCell()
        {
            var cells = new List<GridCell>
            {
                new GridCell(0, 0, 'A'),
                new GridCell(0, 0, 'A')
            };
            Assert.IsNull(WordValidator.ExtractWord(cells));
        }

        [Test]
        public void ExtractWord_ReturnsWord_ForHorizontalLine()
        {
            var cells = new List<GridCell>
            {
                new GridCell(0, 0, 'C'),
                new GridCell(0, 1, 'A'),
                new GridCell(0, 2, 'T')
            };
            Assert.AreEqual("CAT", WordValidator.ExtractWord(cells));
        }

        [Test]
        public void ExtractWord_ReturnsNull_ForNonAdjacentCells()
        {
            var cells = new List<GridCell>
            {
                new GridCell(0, 0, 'C'),
                new GridCell(0, 5, 'A')
            };
            Assert.IsNull(WordValidator.ExtractWord(cells));
        }
    }
}
