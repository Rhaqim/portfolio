import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

export default function Calendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal('ui', {
        styles: { branding: { brandColor: '#000000' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <div className="w-full h-full">
        <h1 className="text-center text-2xl font-bold">Schedule a 30 minute meeting with me</h1>
      <Cal
        calLink="rhaqim/30min"
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ layout: 'month_view' }}
      />
    </div>
  );
}
