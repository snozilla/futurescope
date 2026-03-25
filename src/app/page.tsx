"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Globe,
  DollarSign,
  Users,
  Cpu,
  Leaf,
  Shield,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Settings,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TimelineEntry {
  timeframe: string;
  title: string;
  description: string;
  confidence: number;
  category: "political" | "economic" | "social" | "technological" | "environmental" | "military";
  sentiment: "positive" | "negative" | "neutral" | "mixed";
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartConfig {
  title: string;
  type: "line" | "area" | "bar";
  color: "amber" | "blue" | "emerald" | "red" | "cyan" | "purple";
  unit: string;
  data: ChartDataPoint[];
}

interface Prediction {
  summary: string;
  overallConfidence: number;
  charts?: ChartConfig[];
  timeline: TimelineEntry[];
}

const ALL_EXAMPLES = [
  "America and Iran sign a peace agreement",
  "Apple acquires Anthropic for $100B",
  "A universal basic income is adopted across the EU",
  "SpaceX successfully lands humans on Mars",
  "China reunifies with Taiwan peacefully",
  "AI passes the bar exam with a perfect score",
  "Bitcoin becomes legal tender in the US",
  "Russia and Ukraine agree to a ceasefire",
  "Self-driving cars are legalized worldwide",
  "The WHO declares a new global pandemic",
  "Nuclear fusion achieves commercial viability",
  "Amazon acquires TikTok",
  "India becomes the world's largest economy",
  "The US abolishes the Electoral College",
  "Lab-grown meat replaces 50% of livestock farming",
  "A major social media platform shuts down permanently",
  "NASA discovers microbial life on Europa",
  "Global birth rates drop below replacement level",
  "The EU creates a unified military force",
  "Quantum computers break RSA encryption",
  "Water scarcity triggers a major international conflict",
  "A universal translator eliminates language barriers",
  "The first trillionaire is announced",
  "All fossil fuel power plants are decommissioned in Europe",
];

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const categoryConfig = {
  political: { icon: Globe, solid: "bg-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
  economic: { icon: DollarSign, solid: "bg-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400" },
  social: { icon: Users, solid: "bg-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
  technological: { icon: Cpu, solid: "bg-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400" },
  environmental: { icon: Leaf, solid: "bg-green-500", bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-600 dark:text-green-400" },
  military: { icon: Shield, solid: "bg-red-500", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-600 dark:text-red-400" },
};

function ConfidenceMeter({ score }: { score: number }) {
  const color = score >= 70 ? "text-green-600 dark:text-green-400" : score >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
  const bgColor = score >= 70 ? "bg-green-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  const label = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-score-track rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${color}`}>
        {score}% {label}
      </span>
    </div>
  );
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    case "mixed":
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    default:
      return <Minus className="w-4 h-4 text-muted" />;
  }
}

function TimelineCard({
  entry,
  index,
  isVisible,
}: {
  entry: TimelineEntry;
  index: number;
  isVisible: boolean;
}) {
  const config = categoryConfig[entry.category] || categoryConfig.political;
  const CategoryIcon = config.icon;
  const isLeft = index % 2 === 0;

  return (
    <>
      {/* Mobile: single column */}
      <div className="relative flex items-start w-full mb-2 md:hidden">
        <div className="relative z-10 flex-shrink-0 w-10 flex justify-center mt-4">
          <div
            className={`w-8 h-8 rounded-full ${config.solid} flex items-center justify-center shadow-lg transition-all duration-500 ${
              isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <CategoryIcon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="flex-1 pl-3">
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <CardContent entry={entry} config={config} CategoryIcon={CategoryIcon} align="left" />
          </div>
        </div>
      </div>

      {/* Desktop: alternating left/right */}
      <div className="relative hidden md:flex items-center w-full mb-2">
        <div className={`w-[calc(50%-28px)] ${isLeft ? "pr-6" : ""}`}>
          {isLeft && (
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <CardContent entry={entry} config={config} CategoryIcon={CategoryIcon} align="right" />
            </div>
          )}
        </div>

        <div className="relative z-10 flex-shrink-0 w-14 flex justify-center">
          <div
            className={`w-10 h-10 rounded-full ${config.solid} flex items-center justify-center shadow-lg transition-all duration-500 ${
              isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <CategoryIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className={`w-[calc(50%-28px)] ${!isLeft ? "pl-6" : ""}`}>
          {!isLeft && (
            <div
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <CardContent entry={entry} config={config} CategoryIcon={CategoryIcon} align="left" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CardContent({
  entry,
  config,
  align,
}: {
  entry: TimelineEntry;
  config: (typeof categoryConfig)["political"];
  CategoryIcon: React.ComponentType<{ className?: string }>;
  align: "left" | "right";
}) {
  return (
    <div
      className={`group relative p-5 rounded-2xl bg-card border border-app-border hover:border-app-border-hover backdrop-blur-sm transition-all duration-300 hover:bg-card-hover ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <div className={`flex items-center gap-2 mb-3 ${align === "right" ? "justify-end" : "justify-start"}`}>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.border} ${config.text} border`}>
          <Clock className="w-3 h-3" />
          {entry.timeframe}
        </span>
        <SentimentIcon sentiment={entry.sentiment} />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-2 leading-tight">
        {entry.title}
      </h3>

      <p className="text-sm text-muted leading-relaxed mb-3">
        {entry.description}
      </p>

      <div className={`${align === "right" ? "flex justify-end" : ""}`}>
        <ConfidenceMeter score={entry.confidence} />
      </div>
    </div>
  );
}

function OverallScore({ prediction }: { prediction: Prediction }) {
  const score = prediction.overallConfidence;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-app-border backdrop-blur-sm">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" className="stroke-score-track" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted uppercase tracking-wider">Confidence</span>
        </div>
      </div>
      <p className="text-sm text-muted text-center max-w-sm leading-relaxed">
        {prediction.summary}
      </p>
    </div>
  );
}

const CHART_COLORS: Record<string, string> = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  emerald: "#10b981",
  red: "#ef4444",
  cyan: "#06b6d4",
  purple: "#8b5cf6",
};

function PredictionChart({ chart }: { chart: ChartConfig }) {
  const strokeColor = CHART_COLORS[chart.color] || CHART_COLORS.amber;

  const commonProps = {
    data: chart.data,
    margin: { top: 5, right: 10, left: 0, bottom: 5 },
  };

  const renderChart = () => {
    switch (chart.type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`grad-${chart.title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted" />
            <YAxis tick={{ fontSize: 11 }} className="text-muted" width={45} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                fontSize: "0.8rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: strokeColor }}
            />
            <Area type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} fill={`url(#grad-${chart.title})`} name={chart.unit} />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted" />
            <YAxis tick={{ fontSize: 11 }} className="text-muted" width={45} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                fontSize: "0.8rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: strokeColor }}
            />
            <Bar dataKey="value" fill={strokeColor} radius={[4, 4, 0, 0]} name={chart.unit} />
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted" />
            <YAxis tick={{ fontSize: 11 }} className="text-muted" width={45} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                fontSize: "0.8rem",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: strokeColor }}
            />
            <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} dot={{ fill: strokeColor, r: 3 }} name={chart.unit} />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-card border border-app-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4" style={{ color: strokeColor }} />
        <h3 className="text-sm font-semibold text-foreground">{chart.title}</h3>
        <span className="text-xs text-muted ml-auto">{chart.unit}</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PredictionCharts({ charts }: { charts: ChartConfig[] }) {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-foreground text-center mb-6">Projected Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charts.map((chart, idx) => (
          <PredictionChart key={idx} chart={chart} />
        ))}
      </div>
    </div>
  );
}

function LoadingTimeline() {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
        <Zap className="absolute inset-0 m-auto w-6 h-6 text-amber-500 animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-foreground mb-1">Analyzing future outcomes...</p>
        <p className="text-sm text-muted">Generating prediction timeline</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [event, setEvent] = useState("");
  const [submittedEvent, setSubmittedEvent] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState("15 years");
  const [steps, setSteps] = useState(15);
  const [examples, setExamples] = useState<string[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const TIME_OPTIONS = ["1 year", "3 years", "5 years", "10 years", "15 years", "25 years", "50 years"];

  useEffect(() => {
    setHasApiKey(!!localStorage.getItem("futurescope_anthropic_key"));
    setExamples(pickRandom(ALL_EXAMPLES, 6));
  }, []);

  const handleSubmit = async (eventText?: string) => {
    const query = eventText || event;
    if (!query.trim()) return;

    setIsLoading(true);
    setPrediction(null);
    setIsVisible(false);
    setError(null);
    setSubmittedEvent(query);

    try {
      const apiKey = localStorage.getItem("futurescope_anthropic_key") || "";
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: query, apiKey, timeHorizon, steps }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("NO_KEY");
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to generate prediction");
      }

      const parsed = (await res.json()) as Prediction;
      setPrediction(parsed);

      setTimeout(() => {
        setIsVisible(true);
        timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to generate prediction. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setEvent("");
    setSubmittedEvent("");
    setIsVisible(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-12">
        {/* Settings link */}
        <div className="flex justify-end mb-4">
          <Link
            href="/settings"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
              hasApiKey
                ? "bg-surface border border-app-border text-muted hover:text-foreground hover:border-app-border-hover"
                : "bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 animate-pulse"
            }`}
          >
            <Settings className="w-4 h-4" />
            {hasApiKey ? "Settings" : "Add API Key"}
          </Link>
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Predictions
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Future<span className="text-amber-500">Scope</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Enter any hypothetical world event and explore a timeline of cascading
            consequences up to 50 years into the future.
          </p>
        </header>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-amber-500 rounded-2xl opacity-0 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 blur transition-opacity" />
            <div className="relative bg-card rounded-2xl p-6 border border-app-border">
              <label className="block text-sm font-medium text-muted mb-3">
                What if...
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="e.g., America and Iran sign a peace agreement"
                  className="flex-1 bg-input-bg border border-app-border rounded-xl px-5 py-3.5 text-foreground placeholder-muted focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all text-base"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={isLoading || !event.trim()}
                  className="px-6 py-3.5 bg-amber-500 text-white dark:text-gray-950 font-semibold rounded-xl hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <Zap className="w-4 h-4" />
                  Predict
                </button>
              </div>

              {/* Time horizon & steps */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-muted flex-shrink-0 mb-1.5 block">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Horizon:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIME_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setTimeHorizon(opt)}
                        disabled={isLoading}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-all disabled:opacity-40 ${
                          timeHorizon === opt
                            ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                            : "bg-surface border-app-border text-muted hover:text-foreground hover:border-app-border-hover"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted flex-shrink-0">Steps:</label>
                  <input
                    type="number"
                    min={3}
                    max={30}
                    value={steps}
                    onChange={(e) => setSteps(Math.min(30, Math.max(3, Number(e.target.value) || 3)))}
                    disabled={isLoading}
                    className="w-16 bg-input-bg border border-app-border rounded-lg px-2.5 py-1 text-xs text-foreground text-center focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Example events */}
              <div className="mt-4">
                <p className="text-xs text-muted mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => {
                        setEvent(ex);
                        handleSubmit(ex);
                      }}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs bg-surface border border-app-border text-muted-strong rounded-lg hover:border-app-border-hover hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error === "NO_KEY" ? (
              <span>
                No API key found.{" "}
                <Link href="/settings" className="underline font-medium hover:text-red-500 dark:hover:text-red-300 transition-colors">
                  Add your Anthropic API key in Settings
                </Link>{" "}
                to get started.
              </span>
            ) : (
              error
            )}
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingTimeline />}

        {/* Results */}
        {prediction && (
          <div ref={timelineRef}>
            {/* Event banner */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <ArrowRight className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-muted">Predictions for:</span>
                <span className="text-sm font-semibold text-foreground">&ldquo;{submittedEvent}&rdquo;</span>
              </div>
            </div>

            {/* Overall confidence */}
            <div className="flex justify-center mb-12">
              <OverallScore prediction={prediction} />
            </div>

            {/* Charts */}
            {prediction.charts && <PredictionCharts charts={prediction.charts} />}

            {/* Timeline */}
            <div className="relative">
              {/* Center line (left on mobile, center on desktop) */}
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-amber-500/20 md:-translate-x-0.5" />

              {/* Timeline entries */}
              <div className="relative">
                {prediction.timeline.map((entry, idx) => (
                  <TimelineCard
                    key={idx}
                    entry={entry}
                    index={idx}
                    isVisible={isVisible}
                  />
                ))}
              </div>

              {/* End marker */}
              <div className="relative flex justify-center pt-4">
                <div
                  className={`w-8 h-8 rounded-full bg-surface border-2 border-app-border flex items-center justify-center transition-all duration-500 ${
                    isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                  style={{ transitionDelay: `${prediction.timeline.length * 120}ms` }}
                >
                  <ChevronRight className="w-4 h-4 text-muted rotate-90" />
                </div>
              </div>
            </div>

            {/* Category legend */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {Object.entries(categoryConfig).map(([key, cfg]) => {
                const Icon = cfg.icon;
                const count = prediction.timeline.filter((e) => e.category === key).length;
                if (count === 0) return null;
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${cfg.bg} ${cfg.border} ${cfg.text} border`}
                  >
                    <Icon className="w-3 h-3" />
                    {key} ({count})
                  </span>
                );
              })}
            </div>

            {/* Reset button */}
            <div className="flex justify-center mt-10">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-app-border text-muted hover:text-foreground hover:border-app-border-hover transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                New Prediction
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-20 pb-8">
          <p className="text-xs text-muted">
            Predictions are AI-generated speculation for entertainment purposes only. Not financial or political advice.
          </p>
          <p className="text-xs text-muted/50 mt-2">v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
