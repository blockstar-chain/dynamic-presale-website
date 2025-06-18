import React, { useEffect } from "react";

function DynamicHead({ title, faviconBase64 }) {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Set favicon with base64 data URL
    if (faviconBase64) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = faviconBase64;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [title, faviconBase64]);

  return null;
}

export default DynamicHead;
