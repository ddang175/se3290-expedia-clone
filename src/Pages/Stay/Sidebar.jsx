import PriceSlider from "./PriceSlider";
export default function Sidebar({ filters, onChange }) {
  return <aside aria-label="Hotel filters">
    <h3 style={{ fontWeight: "bold", marginBottom: 16 }}>Sort & Filter</h3>
    <label htmlFor="hotel-sort">Sort hotels</label>
    <select id="hotel-sort" value={filters.sort} onChange={(event) => onChange({ sort: event.target.value })}>
      <option value="recommended">Recommended</option><option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option><option value="rating-desc">Guest rating: high to low</option>
    </select>
    <div style={{ marginTop: 24 }}><PriceSlider value={[filters.minPrice, filters.maxPrice]} onChange={([minPrice, maxPrice]) => onChange({ minPrice, maxPrice })} /></div>
    <label htmlFor="hotel-rating">Minimum guest rating</label>
    <select id="hotel-rating" value={filters.rating} onChange={(event) => onChange({ rating: event.target.value })}>
      <option value="0">Any rating</option><option value="3">3 and above</option><option value="4">4 and above</option><option value="4.5">4.5 and above</option>
    </select>
    <button type="button" style={{ marginTop: 20 }} onClick={() => onChange({ sort: "recommended", minPrice: 0, maxPrice: 50000, rating: 0 })}>Reset filters</button>
  </aside>;
}
