export default function BrowseGameSubHeader({ setSearchTerm, setSortBy }) {

    return (

        <section className="browse-games-subheader">
            <div className="seach-game-container">

                <input
                    type="text"
                    placeholder="Search"
                    className="search-game-input"
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div class="sort-by-container">
                <label for="sort-by" className="sort-by-label">Sort By</label>
                <select
                    name="gameFilter"
                    id="sort-by"
                    className="sort-by-dropdown"
                    onChange={e => setSortBy(e.target.value)}
                >
                    <option value="playerCountASC">Player Count (High to Low)</option>
                    <option value="playerCountDESC">Player Count (Low to High)</option>
                    <option value="tournamentCountASC">Tournament Count (High to Low)</option>
                    <option value="tournamentCountDESC">Tournament Count (Low to High)</option>
                </select>
            </div>
        </section>

    )
}
