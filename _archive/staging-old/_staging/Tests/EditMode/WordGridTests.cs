using NUnit.Framework;
using MeraWorld.WordSearch;

namespace MeraWorld.Tests
{
    [TestFixture]
    public class WordGridTests
    {
        [Test]
        public void Grid_Initializes_With_Correct_Dimensions()
        {
            var grid = new WordGrid(5, 8);
            Assert.AreEqual(5, grid.Rows);
            Assert.AreEqual(8, grid.Columns);
        }

        [Test]
        public void GetCell_Returns_Null_For_Out_Of_Bounds()
        {
            var grid = new WordGrid(5, 5);
            Assert.IsNull(grid.GetCell(-1, 0));
            Assert.IsNull(grid.GetCell(5, 0));
        }

        [Test]
        public void SetLetter_Stores_Uppercase()
        {
            var grid = new WordGrid(3, 3);
            grid.SetLetter(1, 1, 'a');
            Assert.AreEqual('A', grid.GetCell(1, 1).Letter);
        }
    }
}