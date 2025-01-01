import React, { CSSProperties } from "react";
import  ClipLoader  from "react-spinners/ClipLoader";


const overrider: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "transparent",
};


const Spinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="w-12 h-12 border-4 border-t-[#ff8800] border-gray-200 rounded-full animate-spin">
    <ClipLoader
      color={"#ff8800"}
      loading={true}
      cssOverride={overrider}
      size={20}
      speedMultiplier={1.5}
      aria-label="Loading Spinner"
      data-testid="Loader"
    ></ClipLoader>
    </div>
  </div>
    
  );
};

export default Spinner;
