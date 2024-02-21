// import React from "react";
// import { motion } from "framer-motion";
// import StyleTab from "./TabButton.module.css";

// const variants = {
//   default: { width: 0, backgroundColor: "#0E4D4F" },
//   active: { width: "calc(100% - 0.75rem)", backgroundColor: "red" },
// };

// const TabButton = ({ active, selectTab, children }) => {
//   const buttonClasses = active ? "red" : "text-[#0E4D4F]";

//   return (
//     <>
//       <button onClick={selectTab} className={StyleTab.tab}>
//         {children}
//         <motion.div
//           animate={active ? "active" : "default"}
//           variants={variants}
//         ></motion.div>
//       </button>
//     </>
//   );
// };

// export default TabButton;

import React from "react";
import { motion } from "framer-motion";
import StyleTab from "./TabButton.module.css";

const TabButton = ({ active, selectTab, children }) => {
  return (
    <button
      onClick={selectTab}
      className={`${StyleTab.tab} ${active ? StyleTab.activeTab : ""}`}
    >
      {children}
      <motion.div
        animate={active ? "active" : "default"}
        className={StyleTab.animationDiv}
      ></motion.div>
    </button>
  );
};

export default TabButton;
