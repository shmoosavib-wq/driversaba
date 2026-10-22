import { useEffect } from "react";

const ClarityTracking = () => {
  useEffect(() => {
    // ایجاد یک اسکریپت برای اجرای کد Clarity
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "jxjmfcsvwz");
      `;

    // افزودن اسکریپت به head
    document.head.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null; // or any other JSX if needed
};

export default ClarityTracking;
