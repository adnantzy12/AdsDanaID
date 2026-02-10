import { useState, useEffect } from 'react';

export function useIP() {
  const [ip, setIP] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        // Try multiple IP detection services
        const services = [
          'https://api.ipify.org?format=json',
          'https://api64.ipify.org?format=json',
          'https://ipapi.co/json/'
        ];
        
        for (const service of services) {
          try {
            const response = await fetch(service);
            if (response.ok) {
              const data = await response.json();
              const detectedIP = data.ip || data.ip_address;
              if (detectedIP) {
                setIP(detectedIP);
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            continue;
          }
        }
        
        // Fallback: generate a fingerprint from browser info
        const fingerprint = generateBrowserFingerprint();
        setIP(fingerprint);
      } catch (error) {
        const fingerprint = generateBrowserFingerprint();
        setIP(fingerprint);
      } finally {
        setLoading(false);
      }
    };

    fetchIP();
  }, []);

  return { ip, loading };
}

function generateBrowserFingerprint(): string {
  const nav = navigator;
  const screen = window.screen;
  const data = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.platform,
    nav.hardwareConcurrency || '',
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `fp_${Math.abs(hash).toString(16)}`;
}
