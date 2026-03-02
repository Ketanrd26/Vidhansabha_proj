import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const width = 900;
const height = 900;

const Fourty1map = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/India_AC.geojson")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  // ✅ STOP rendering until data loads
  if (!data) return <div>Loading map...</div>;

  // ✅ Now data is guaranteed
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

  const vidhansabha = [
    "Parner",
    "Akole (ST)",
    "Ahmednagar City",
    "Kopargaon",
    "Amravati",
    "Majalgaon",
    "Georai",
    "Parli",
    "Tumsar",
    "Sindkhed Raja",
    "Aheri (ST)",
    "Arjuni-Morgaon (SC)",
    "Basmat",
    "Amalner",
    "Kagal",
    "Ahmedpur",
    "Udgir (SC)",
    "Anushakti Nagar",
    "Loha",
    "Kalwan (ST)",
    "Yevla",
    "Niphad",
    "Deolali (SC)",
    "Sinnar",
    "Dindori (ST)",
    "Igatpuri (ST)",
    "Pathri",
    "Ambegaon",
    "Hadapsar",
    "Indapur",
    "Bhor",
    "Pimpri (SC)",
    "Shirur",
    "Baramati",
    "Maval",
    "Shrivardhan",
    "Chiplun",
    "Phaltan (SC)",
    "Wai",
    "Shahapur (ST)",
    "Pusad",
  ];

  return (
    <div class="map_parent">
      <svg width={width} height={height} style={{ background: "#eee" }}>
        {district.features.map((f, i) => {
          const [x, y] = path.centroid(f);

          return (
            <g key={i}>
              <path
                d={path(f)}
                //   fill="#ccc"
                stroke="black"
                style={{ cursor: "pointer" }}
                fill={
                  vidhansabha.includes(f?.properties?.AC_NAME) ? "blue" : "#ccc"
                }
              />

              {(() => {
                const acName = f?.properties?.AC_NAME;
                const index = vidhansabha.indexOf(acName);

                if (index !== -1) {
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill="white"
                      fontSize="12"
                      pointerEvents="none"
                    >
                      {index + 1}
                    </text>
                  );
                }

                return null;
              })()}
            </g>
          );
        })}
      </svg>
      <div class="search_input">
        <ul style={{ listStyleType: "numberic", paddingLeft: "50px" }}>
          {vidhansabha?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Fourty1map;
