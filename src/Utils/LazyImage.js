import React from "react";

const LazyImage = ({ src, alt, style, width, height, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default LazyImage;
