import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../../services/settings';
import { 
  Loader2, CheckCircle2, AlertTriangle, Eye, EyeOff, Copy, Check, 
  Zap, ChevronDown, ChevronUp, ShieldCheck, ExternalLink, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../utils/error-utils';
import { CustomSelect } from '../../components/ui/CustomSelect';

export function IntegrationsTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProvider, setSelectedProvider] = useState('razorpay');
  const [isEditing, setIsEditing] = useState(false);
  const [showManualSection, setShowManualSection] = useState(false);
  const [showKeySecret, setShowKeySecret] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [formData, setFormData] = useState({
    keyId: '',
    keySecret: '',
    webhookSecret: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ keyId?: boolean; keySecret?: boolean; webhookSecret?: boolean }>({});
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => settingsService.getIntegrations(),
    retry: false,
  });

  const razorpay = integrations?.razorpay;
  const isConfigured = razorpay?.isConfigured;

  // Complete OAuth callback mutation
  const completeOAuthMutation = useMutation({
    mutationFn: (data: { code: string; state?: string; simulate?: boolean }) =>
      settingsService.handleRazorpayOAuthCallback(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsEditing(false);
      setSuccessMsg(data.message || 'Razorpay account connected successfully!');
      setTimeout(() => setSuccessMsg(''), 6000);
      // Clean query params
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('code');
        next.delete('state');
        next.delete('simulate');
        return next;
      }, { replace: true });
    },
    onError: (err: unknown) => {
      setErrorMsg(getErrorMessage(err));
      // Clean query params
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('code');
        next.delete('state');
        next.delete('simulate');
        return next;
      }, { replace: true });
    },
  });

  // Handle OAuth code return from Razorpay or simulate flag in URL
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state') || undefined;
    const simulate = searchParams.get('simulate') === 'true';

    if (code || simulate) {
      completeOAuthMutation.mutate({ code: code || 'simulated', state, simulate });
    }
  }, []);

  // 1-Click Connect Button Mutation
  const oneClickMutation = useMutation({
    mutationFn: async () => {
      const authData = await settingsService.getRazorpayOAuthAuthorizeUrl();
      if (authData.mode === 'live' && authData.url) {
        window.location.href = authData.url;
        return null;
      }
      // Simulate mode (sandbox / dev without registered partner client id)
      return await settingsService.handleRazorpayOAuthCallback({
        code: 'mock_code',
        state: authData.state,
        simulate: true,
      });
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['integrations'] });
        setIsEditing(false);
        setSuccessMsg(data.message || 'Razorpay connected successfully in 1 click!');
        setTimeout(() => setSuccessMsg(''), 6000);
      }
    },
    onError: (err: unknown) => {
      setErrorMsg(getErrorMessage(err));
    },
  });

  // Manual save mutation
  const saveMutation = useMutation({
    mutationFn: (data: typeof formData) => settingsService.saveRazorpayKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsEditing(false);
      setShowManualSection(false);
      setFormData({ keyId: '', keySecret: '', webhookSecret: '' });
      setErrorMsg('');
      setSuccessMsg('Razorpay API keys saved successfully!');
      setTimeout(() => setSuccessMsg(''), 5000);
    },
    onError: (err: unknown) => {
      setErrorMsg(getErrorMessage(err));
    },
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: () => settingsService.disconnectRazorpay(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsEditing(true);
      setShowManualSection(false);
      setSuccessMsg('Razorpay integration disconnected.');
      setTimeout(() => setSuccessMsg(''), 5000);
    },
    onError: (err: unknown) => {
      setErrorMsg(getErrorMessage(err));
    },
  });

  // Test connection mutation
  const testRazorpayMutation = useMutation({
    mutationFn: () => settingsService.testRazorpayKey(),
    onSuccess: (data) => {
      setTestResult(data);
      setTimeout(() => setTestResult(null), 5000);
    },
    onError: (err: unknown) => {
      setTestResult({ success: false, message: getErrorMessage(err) });
      setTimeout(() => setTestResult(null), 5000);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-[#8a8f98]" />
      </div>
    );
  }

  const handleManualSave = () => {
    const errors: typeof fieldErrors = {};
    if (!formData.keyId.trim()) errors.keyId = true;
    if (!formData.keySecret.trim()) errors.keySecret = true;
    if (!formData.webhookSecret.trim()) errors.webhookSecret = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg('Please fill in all required payment integration fields.');
      return;
    }
    setFieldErrors({});
    setErrorMsg('');
    saveMutation.mutate(formData);
  };

  const originUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://www.recovio.site';
  const webhookUrl = `${originUrl}/api/webhooks/payments/${user?.tenantId || 'tenant'}/razorpay`;

  return (
    <div className="space-y-5 text-[#f7f8f8]">
      {/* Provider Selection */}
      <div className="space-y-1.5 max-w-xs">
        <label className="text-xs font-semibold text-[#8a8f98]">Payment Provider</label>
        <CustomSelect
          value={selectedProvider}
          onChange={(val) => setSelectedProvider(val)}
          options={[
            { label: 'Razorpay (Active)', value: 'razorpay' },
            { label: 'Stripe (Coming Soon)', value: 'stripe', disabled: true },
            { label: 'PayPal (Coming Soon)', value: 'paypal', disabled: true },
          ]}
        />
      </div>

      {/* Razorpay Configuration Panel */}
      {selectedProvider === 'razorpay' && (
        <div className="border border-[#23252a] rounded-xl p-4 sm:p-5 bg-[#010102] space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#23252a]">
            <div>
              <h4 className="text-sm font-semibold text-[#f7f8f8] flex items-center">
                Razorpay
                {isConfigured && <CheckCircle2 className="w-4 h-4 text-[#27a644] ml-2" />}
              </h4>
              <p className="text-xs text-[#8a8f98] mt-0.5">
                Accept instant payments via UPI, Credit/Debit Cards, Netbanking, and Wallets.
              </p>
            </div>
            {isConfigured && (
              <span className="inline-flex items-center rounded-full bg-[#27a644]/10 border border-[#27a644]/20 px-2.5 py-1 text-[11px] font-bold text-[#27a644] self-start md:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#27a644]" />
                {razorpay.isOAuth ? '1-Click OAuth Active' : 'API Key Active'}
              </span>
            )}
          </div>

          {/* Success / Error Banners */}
          {successMsg && (
            <div className="p-3.5 rounded-xl text-xs font-medium bg-[#27a644]/10 border border-[#27a644]/30 text-[#27a644] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl text-xs font-medium bg-red-950/40 border border-red-900/50 text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Completing OAuth State */}
          {completeOAuthMutation.isPending && (
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-950/20 text-blue-300 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#3395ff]" />
              <div>
                <p className="text-xs font-semibold text-[#f7f8f8]">Connecting your Razorpay Account...</p>
                <p className="text-[11px] text-[#8a8f98] mt-0.5">Securing tokens and verifying webhook credentials.</p>
              </div>
            </div>
          )}

          {/* STATE 1: ALREADY CONFIGURED & NOT IN EDIT MODE */}
          {isConfigured && !isEditing ? (
            <div className="bg-[#0f1011] p-4 sm:p-5 rounded-xl border border-[#23252a] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-semibold text-[#f7f8f8]">Connected &amp; Operational</p>
                    <span className="text-[10px] text-[#8a8f98] font-mono bg-[#18191c] px-2 py-0.5 rounded border border-[#34343a]">
                      {razorpay.accountId ? `Account: ${razorpay.accountId}` : `Key: •••••••••••${razorpay.maskedKeyId?.slice(-4)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8a8f98]">
                    {razorpay.isOAuth 
                      ? 'Connected via 1-Click OAuth. Invoices automatically generate verified Razorpay payment links.' 
                      : 'Connected using custom API credentials.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => testRazorpayMutation.mutate()}
                    disabled={testRazorpayMutation.isPending}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#f7f8f8] bg-[#18191c] border border-[#34343a] hover:bg-[#23252a] rounded-xl transition-all cursor-pointer inline-flex items-center"
                  >
                    {testRazorpayMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-[#8a8f98]" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-[#8a8f98]" />
                        Test Connection
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 py-1.5 text-xs font-medium text-[#8a8f98] hover:text-[#f7f8f8] bg-[#18191c] border border-[#34343a] hover:bg-[#23252a] rounded-xl transition-all cursor-pointer"
                  >
                    Reconfigure
                  </button>
                  <button
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    className="px-3.5 py-1.5 text-xs font-medium text-red-400 bg-red-950/20 border border-red-900/40 hover:bg-red-950/40 rounded-xl transition-all cursor-pointer inline-flex items-center"
                  >
                    {disconnectMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Disconnect'}
                  </button>
                </div>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  testResult.success 
                    ? 'bg-[#27a644]/10 border border-[#27a644]/30 text-[#27a644]' 
                    : 'bg-red-950/40 border border-red-900/50 text-red-400'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Webhook endpoint box */}
              <div className="pt-2 border-t border-[#1e2025] space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-[#8a8f98]">Payment Webhook Listener</p>
                  <span className="text-[10px] text-[#27a644] font-medium flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Ready for payment.captured events
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] bg-[#010102] text-[#d0d6e0] px-2.5 py-1.5 rounded-lg block flex-1 break-all select-all border border-[#23252a] font-mono">
                    {webhookUrl}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      setCopiedWebhook(true);
                      setTimeout(() => setCopiedWebhook(false), 2000);
                    }}
                    className="p-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] bg-[#18191c] border border-[#34343a] hover:bg-[#23252a] rounded-lg transition-all flex-shrink-0 cursor-pointer"
                    title="Copy Webhook URL"
                  >
                    {copiedWebhook ? <Check className="w-3.5 h-3.5 text-[#27a644]" /> : <Copy className="w-3.5 h-3.5 text-[#8a8f98]" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STATE 2: NOT CONFIGURED OR EDITING MODE */
            <div className="space-y-5">
              {/* PRIMARY 1-CLICK OAUTH CARD */}
              <div className="relative overflow-hidden rounded-2xl border border-[#3395ff]/25 bg-gradient-to-b from-[#0c2340]/40 via-[#0f1011] to-[#010102] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center rounded-full bg-[#3395ff]/15 border border-[#3395ff]/30 px-2 py-0.5 text-[10px] font-bold text-[#3395ff] tracking-wide uppercase">
                        <Zap className="w-3 h-3 mr-1 fill-[#3395ff]" /> 1-Click Instant Connect
                      </span>
                      <span className="text-[10px] text-[#8a8f98]">Zero setup hassle</span>
                    </div>
                    <h3 className="text-base font-bold text-[#f7f8f8] pt-1">
                      Connect with Razorpay in 1 Click
                    </h3>
                    <p className="text-xs text-[#a0a5ad] leading-relaxed">
                      No technical expertise required. You don't need to copy or paste API keys. Simply click below to authenticate your Razorpay merchant account and immediately start generating payment links on invoices.
                    </p>
                  </div>

                  <div className="flex-shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => oneClickMutation.mutate()}
                      disabled={oneClickMutation.isPending}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#0c2340] hover:bg-[#133765] active:bg-[#0a1d35] border border-[#3395ff]/40 hover:border-[#3395ff]/70 text-[#f7f8f8] rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md shadow-blue-950/50 cursor-pointer"
                    >
                      {oneClickMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#3395ff]" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-[#3395ff] fill-[#3395ff]" />
                          <span>Connect Razorpay (1-Click)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#23252a]/60 text-[11px] text-[#8a8f98]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3395ff] flex-shrink-0" />
                    <span>OAuth 2.0 Bank-Grade Security</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#27a644] flex-shrink-0" />
                    <span>Auto-managed Webhooks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Instant Payment Reconciliation</span>
                  </div>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#23252a]" />
                <span className="flex-shrink mx-4 text-[10px] uppercase font-semibold text-[#62666d] tracking-wider">
                  or configure manual api keys
                </span>
                <div className="flex-grow border-t border-[#23252a]" />
              </div>

              {/* MANUAL ACCORDION */}
              <div className="border border-[#23252a] rounded-xl bg-[#0f1011] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowManualSection(!showManualSection)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-[#141516] transition-all cursor-pointer text-left select-none"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#d0d6e0] flex items-center gap-1.5">
                      Manual API Key Configuration (Advanced)
                    </span>
                    <p className="text-[11px] text-[#8a8f98] mt-0.5">
                      For self-hosted deployments or custom Razorpay merchant key pairs.
                    </p>
                  </div>
                  <div className="text-[#8a8f98]">
                    {showManualSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showManualSection && (
                  <div className="p-4 border-t border-[#23252a] bg-[#010102] space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#8a8f98]">Key ID</label>
                        <input
                          type="text"
                          value={formData.keyId}
                          onChange={(e) => setFormData(prev => ({ ...prev, keyId: e.target.value }))}
                          className={`w-full p-2.5 border rounded-xl text-xs text-[#f7f8f8] placeholder-[#62666d] ${
                            fieldErrors.keyId
                              ? 'border-red-500 bg-red-950/20 text-red-300 ring-1 ring-red-500/50'
                              : 'border-[#23252a] bg-[#0f1011] focus:border-[#40434d] focus:ring-1 focus:ring-[#555761] focus:outline-none'
                          }`}
                          placeholder="rzp_live_xxxxxxxxxxxx"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#8a8f98]">Key Secret</label>
                        <div className="relative">
                          <input
                            type={showKeySecret ? 'text' : 'password'}
                            value={formData.keySecret}
                            onChange={(e) => setFormData(prev => ({ ...prev, keySecret: e.target.value }))}
                            className={`w-full p-2.5 pr-9 border rounded-xl text-xs text-[#f7f8f8] placeholder-[#62666d] ${
                              fieldErrors.keySecret
                                ? 'border-red-500 bg-red-950/20 text-red-300 ring-1 ring-red-500/50'
                                : 'border-[#23252a] bg-[#0f1011] focus:border-[#40434d] focus:ring-1 focus:ring-[#555761] focus:outline-none'
                            }`}
                            placeholder="••••••••••••••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowKeySecret(!showKeySecret)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer p-1 transition-colors"
                            tabIndex={-1}
                            title={showKeySecret ? 'Hide secret' : 'Show secret'}
                          >
                            {showKeySecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#8a8f98]">Webhook Secret</label>
                      <div className="relative">
                        <input
                          type={showWebhookSecret ? 'text' : 'password'}
                          value={formData.webhookSecret}
                          onChange={(e) => setFormData(prev => ({ ...prev, webhookSecret: e.target.value }))}
                          className={`w-full p-2.5 pr-9 border rounded-xl text-xs text-[#f7f8f8] placeholder-[#62666d] ${
                            fieldErrors.webhookSecret
                              ? 'border-red-500 bg-red-950/20 text-red-300 ring-1 ring-red-500/50'
                              : 'border-[#23252a] bg-[#0f1011] focus:border-[#40434d] focus:ring-1 focus:ring-[#555761] focus:outline-none'
                          }`}
                          placeholder="Your webhook secret"
                        />
                        <button
                          type="button"
                          onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer p-1 transition-colors"
                          tabIndex={-1}
                          title={showWebhookSecret ? 'Hide secret' : 'Show secret'}
                        >
                          {showWebhookSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="pt-1 max-w-full">
                        <p className="text-[11px] text-[#8a8f98]">
                          Configure your Razorpay webhook to send <code className="text-[10px] text-[#f7f8f8] bg-[#18191c] px-1 py-0.5 rounded border border-[#34343a]">payment.captured</code> events to:
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 max-w-full">
                          <code className="text-[10px] bg-[#010102] text-[#d0d6e0] px-2.5 py-1.5 rounded-lg block flex-1 break-all select-all border border-[#23252a] font-mono overflow-x-auto">
                            {webhookUrl}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(webhookUrl);
                              setCopiedWebhook(true);
                              setTimeout(() => setCopiedWebhook(false), 2000);
                            }}
                            className="p-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] bg-[#18191c] border border-[#34343a] hover:bg-[#23252a] rounded-lg transition-all flex-shrink-0 cursor-pointer"
                            title="Copy Webhook URL"
                          >
                            {copiedWebhook ? <Check className="w-3.5 h-3.5 text-[#27a644]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 space-x-3">
                      {isConfigured && (
                        <button 
                          onClick={() => { setIsEditing(false); setErrorMsg(''); }}
                          className="px-4 py-2 text-[#f7f8f8] bg-[#18191c] border border-[#34343a] hover:bg-[#23252a] rounded-xl text-xs font-medium transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        onClick={handleManualSave}
                        disabled={saveMutation.isPending}
                        className="px-4 py-2 bg-[#f7f8f8] text-[#010102] hover:bg-[#e1e4e8] active:bg-[#d0d6e0] rounded-xl text-xs font-semibold transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-xs"
                      >
                        {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                        <span>Save API Keys</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
