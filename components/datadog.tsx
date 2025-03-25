"use client";

import Script from "next/script";

function Datadog() {
  return (
    <>
      <Script
        id="dd-rum-sync"
        src="https://www.datadoghq-browser-agent.com/us1/v6/datadog-rum.js"
        type="text/javascript"
        strategy="beforeInteractive"
      />
      <Script id="datadog-rum">
        {`
               window.DD_RUM && window.DD_RUM.init({
                 clientToken: '${process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN}',
                 applicationId: '${process.env.NEXT_PUBLIC_DATADOG_APP_ID}',
                 site: 'us5.datadoghq.com',
                 service: 'bitxenia',
                 env: 'dev',
                 // Specify a version number to identify the deployed version of your application in Datadog
                 // version: '1.0.0',
                 sessionSampleRate: 100,
                 sessionReplaySampleRate: 0,
               });
             `}
      </Script>
    </>
  );
}

export default Datadog;
