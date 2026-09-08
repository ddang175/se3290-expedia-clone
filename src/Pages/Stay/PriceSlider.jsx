import "./PriceSlider.css";
export default function PriceSlider({ value = [0, 50000], onChange = () => {} }) {
  return <div className="price-range-slider">
    <label htmlFor="minimum-hotel-price">Minimum Price: ₹{Number(value[0]).toLocaleString("en-IN")}</label>
    <input id="minimum-hotel-price" type="range" min="0" max="50000" step="100" value={value[0]}
      onChange={(event) => onChange([Math.min(Number(event.target.value), value[1]), value[1]])} />
    <label htmlFor="maximum-hotel-price">Maximum Price: ₹{Number(value[1]).toLocaleString("en-IN")}</label>
    <input id="maximum-hotel-price" type="range" min="0" max="50000" step="100" value={value[1]}
      onChange={(event) => onChange([value[0], Math.max(Number(event.target.value), value[0])])} />
  </div>;
}
