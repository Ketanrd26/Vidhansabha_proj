import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./DistrictMap.scss";
import DisSep from "../disSep/DisSep";

const width = 900;
const height = 900;

const DistrictMap = () => {
  const [data, setData] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    fetch("/India_AC.geojson")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <p>Loading...</p>;

  // Filter Maharashtra only
  const districtFeatures = data.features.filter(
    (f) =>
      f.properties?.ST_NAME && f.properties.ST_NAME.trim() === "MAHARASHTRA",
  );

  const district = {
    type: "FeatureCollection",
    features: districtFeatures,
  };

  const projection = d3
    .geoIdentity()
    .reflectY(true)
    .fitSize([width, height], district);

  const path = d3.geoPath().projection(projection);

  const highlightMap = (name,disName) => {
    setSelected(disName.toLowerCase());
    setSearch("");
  };

  return (
    <div className="map_parent">
      {selected !== null ? (
        <DisSep
        visibleDistrict={selected}
        />
      ) : (
        <svg
          ref={mapRef}
          width={width}
          height={height}
          style={{ background: "#eee" }}
        >
          {district.features.map((f, i) => {
            const [x, y] = path.centroid(f);
            const acName = f?.properties?.AC_NAME;

            return (
              <g key={i}>
                <path
                  d={path(f)}
                  stroke="#333"
                  strokeWidth="0.6"
                  style={{ cursor: "pointer" }}
                  fill={
                    selected === acName
                      ? "#ff5722"
                      : hovered === acName
                        ? "orange"
                        : "#eaeaea"
                  }
                  onMouseEnter={() => setHovered(acName)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    setSelected(selected === acName ? null : acName)
                  }
                />

                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="10"
                  pointerEvents="none"
                >
                  {f?.properties?.AC_NO}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* SEARCH */}
      <div className="search_input">
        <div className="input">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Vidhansabha"
          />
        </div>

     
          <div className="list">
            <ul>
              {district.features
                ?.filter((item) =>
                  item?.properties?.AC_NAME?.toLowerCase().includes(
                    search.toLowerCase(),
                  ),
                )
                .map((item, index) => (
                  <li
                    key={index}
                    onClick={() => highlightMap(item?.properties?.AC_NAME,item?.properties?.DIST_NAME)}
                  >
                    {item?.properties?.AC_NAME}
                  </li>
                ))}
            </ul>
          </div>
       
      </div>
    </div>
  );
};

export default DistrictMap;
