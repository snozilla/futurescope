"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  Check,
  Trash2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

const API_KEY_STORAGE_KEY = "futurescope_anthropic_key";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
      setHasKey(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
    setHasKey(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey("");
    setHasKey(false);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FutureScope
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted">
            Configure your API key to power predictions.
          </p>
        </header>

        {/* API Key Card */}
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-amber-500 rounded-2xl opacity-0 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 blur transition-opacity" />
          <div className="relative bg-card rounded-2xl p-6 border border-app-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Anthropic API Key
                </h2>
                <p className="text-sm text-muted">
                  Required for generating predictions
                </p>
              </div>
              {hasKey && (
                <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>

            {/* Input */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="sk-ant-api03-..."
                  className="w-full bg-input-bg border border-app-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder-muted font-mono text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  type="button"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={!apiKey.trim() || saved}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                    saved
                      ? "bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400"
                      : "bg-amber-500 text-white dark:text-gray-950 hover:bg-amber-400"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved
                    </>
                  ) : (
                    "Save Key"
                  )}
                </button>

                {hasKey && (
                  <button
                    onClick={handleDelete}
                    className="px-5 py-2.5 rounded-xl font-medium text-sm bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="bg-surface/40 rounded-xl p-4 border border-app-border/50 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted space-y-1">
            <p>
              Your API key is stored <strong className="text-foreground">only in your browser&apos;s local storage</strong>. It is sent directly to the Anthropic API and never stored on any server.
            </p>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
            >
              Get an API key from Anthropic
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
