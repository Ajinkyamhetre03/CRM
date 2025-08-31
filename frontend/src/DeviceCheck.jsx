import React, { useEffect, useState } from "react";

const DeviceCheck = ({ children }) => {
  const [isLaptop, setIsLaptop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1024px = laptop breakpoint
      if (width < 1024 || height < 600) {
        setIsLaptop(false);
      } else {
        setIsLaptop(true);
      }
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  if (!isLaptop) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "40px 30px",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "15px" }}>🚫 Access Restricted</h1>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            This application is only available on <b>laptops or desktops</b>.  
            Please use a larger screen to continue.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default DeviceCheck;
