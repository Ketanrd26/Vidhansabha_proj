import React, { useEffect, useRef } from "react";

const DisSep = ({ visibleDistrict }) => {
  const mapRef = useRef(null);

  const handleLoad = () => {
    const obj = mapRef.current;
    const svg = obj?.contentDocument;

    if (!svg) return;

    const BASE = "#eaeaea";

    const districtOrder = [
      "Ahmednagar","Akola","Amravati","Aurangabad","Bhandara","Beed",
      "Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli",
      "Jalgaon","Jalna","Kolhapur","Latur","Mumbai City",
      "Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik",
      "Osmanabad","Parbhani","Pune","Raigad","Ratnagiri","Sangli",
      "Satara","Sindhudurg","Solapur","Thane","Wardha",
      "Washim","Yavatmal","Palghar",
    ];

    const paths = svg.querySelectorAll("path");

    // Remove old text/circles
    svg.querySelectorAll("text, circle").forEach(el => el.remove());

    paths.forEach((el, index) => {
      const name = districtOrder[index];
      const number = index + 1;

       

      if (name.toLowerCase() !== visibleDistrict) {
        el.style.display = "none";
        return;
      }

 

      el.style.display = "block";
      el.style.fill = BASE;
      el.style.stroke = "#333";
      el.style.strokeWidth = "0.6";

      const bbox = el.getBBox();

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      text.setAttribute("x", bbox.x + bbox.width / 2);
      text.setAttribute("y", bbox.y + bbox.height / 2);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.style.fontSize = "14px";
      text.style.fontWeight = "bold";
      text.textContent = `${number} / ${name}`;

      el.parentNode.appendChild(text);
    });
  };

  useEffect(() => {
    const obj = mapRef.current;
    if (obj?.contentDocument) {
      handleLoad(); // already loaded case
    }
  }, [visibleDistrict]);

  return (
    <object
      ref={mapRef}
      data="/2011_Dist.svg"
      type="image/svg+xml"
      onLoad={handleLoad}
      style={{ width: "900px", height: "900px" }}
    />
  );
};

export default DisSep;