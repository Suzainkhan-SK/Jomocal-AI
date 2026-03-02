import React, { useMemo, useState } from 'react';
import api from '../utils/api';

const CAMPAIGN_SIZES = [25, 50, 100];

function LeadHunterSetup({ userAutomation }) {
  const cfg = userAutomation?.config || {};
  const [targetNiche, setTargetNiche] = useState(cfg.targetNiche || '');
  const [targetLocation, setTargetLocation] = useState(cfg.targetLocation || '');
  const [campaignSize, setCampaignSize] = useState(Number(cfg.campaignSize) || 25);
  const [offer, setOffer] = useState(cfg.offer || '');
  const [benefit, setBenefit] = useState(cfg.benefit || '');
  const [sendingSpeed, setSendingSpeed] = useState(Number(cfg.sendingSpeed) || 20);
  const [mode, setMode] = useState(cfg.mode === 'Auto-Pilot' ? 'Auto-Pilot' : 'Review in Drafts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const intervalMins = useMemo(() => {
    const safeSpeed = Math.max(1, Math.min(50, Number(sendingSpeed) || 1));
    return (1440 / safeSpeed).toFixed(2);
  }, [sendingSpeed]);

  const handleLaunch = async () => {
    setError('');
    setSuccess('');

    if (!targetNiche.trim() || !targetLocation.trim() || !offer.trim() || !benefit.trim()) {
      setError('Please fill Niche, Location, Core Offer, and Big Benefit.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/automations/lead-hunter/start', {
        targetNiche: targetNiche.trim(),
        targetLocation: targetLocation.trim(),
        campaignSize: Number(campaignSize),
        offer: offer.trim(),
        benefit: benefit.trim(),
        sendingSpeed: Number(sendingSpeed),
        mode,
      });

      const data = res.data || {};
      setSuccess(
        `Campaign launched. Queued ${data.queuedCount || 0} lead emails. Sheet: ${data.spreadsheetId || 'created'}`
      );
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to launch campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-main">
        <h4 className="text-sm font-semibold text-main">Lead Hunter Setup</h4>
        <p className="text-[11px] text-secondary">3-step setup for scraping + personalized outreach queue.</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide">1. Target</p>
        <div>
          <label className="block text-xs font-medium text-main mb-1">Niche</label>
          <input
            value={targetNiche}
            onChange={(e) => setTargetNiche(e.target.value)}
            className="input text-sm py-2 w-full"
            placeholder="e.g. Dental Clinics"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-main mb-1">Location</label>
          <input
            value={targetLocation}
            onChange={(e) => setTargetLocation(e.target.value)}
            className="input text-sm py-2 w-full"
            placeholder="e.g. Bangalore, Karnataka"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-main mb-1">Campaign Size</label>
          <select
            value={campaignSize}
            onChange={(e) => setCampaignSize(Number(e.target.value))}
            className="input text-sm py-2 w-full"
          >
            {CAMPAIGN_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide">2. Pitch</p>
        <div>
          <label className="block text-xs font-medium text-main mb-1">Core Offer</label>
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="input text-sm py-2 w-full"
            placeholder="e.g. AI WhatsApp automation for lead handling"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-main mb-1">Big Benefit</label>
          <input
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            className="input text-sm py-2 w-full"
            placeholder="e.g. 40% faster response and more booked calls"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide">3. Safety</p>
        <div>
          <label className="block text-xs font-medium text-main mb-1">
            Daily Sending Speed: {sendingSpeed} emails/day
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={sendingSpeed}
            onChange={(e) => setSendingSpeed(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-[11px] text-secondary mt-1">Approx. interval: {intervalMins} minutes per email</p>
        </div>

        <div>
          <p className="block text-xs font-medium text-main mb-1">Execution Mode</p>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-main flex items-center gap-2">
              <input
                type="radio"
                name="lead_hunter_mode"
                checked={mode === 'Auto-Pilot'}
                onChange={() => setMode('Auto-Pilot')}
              />
              Auto-Pilot (send immediately when queue job fires)
            </label>
            <label className="text-xs text-main flex items-center gap-2">
              <input
                type="radio"
                name="lead_hunter_mode"
                checked={mode === 'Review in Drafts'}
                onChange={() => setMode('Review in Drafts')}
              />
              Review in Drafts (save draft first)
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-emerald-600 font-medium">{success}</p>}

      <button
        type="button"
        onClick={handleLaunch}
        disabled={loading}
        className="btn btn-primary w-full text-sm py-2.5"
      >
        {loading ? 'Launching Lead Hunter...' : 'Launch Lead Hunter'}
      </button>
    </div>
  );
}

export default LeadHunterSetup;
