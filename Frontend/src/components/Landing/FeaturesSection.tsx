import { AlertCircle, ArrowRight, BarChart3, CheckSquare, Clock, Code2, LineChart, MessageSquare, Play, Shield, Sparkles, Users, Workflow, Lock } from "lucide-react";
import { Button } from "../ui/Button";

const features = [
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Organize and prioritize tasks with intuitive drag-and-drop interfaces and smart automation.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Work together seamlessly with live updates, comments, and instant notifications.",
  },
  {
    icon: BarChart3,
    title: "Project Tracking",
    description: "Monitor progress with beautiful dashboards and detailed analytics in real-time.",
  },
  {
    icon: AlertCircle,
    title: "Issue Tracking",
    description: "Identify and resolve issues quickly with comprehensive bug tracking and reporting.",
  },
  {
    icon: Shield,
    title: "Role Management",
    description: "Control access and permissions with flexible role-based security settings.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects to optimize team productivity and billing.",
  },
];

const stats = [
  { value: "10K+", label: "Projects managed" },
  { value: "50K+", label: "Active teams" },
  { value: "99.9%", label: "Uptime" },
];


const benefits = [
  {
    icon: Sparkles,
    title: "Intuitive UI",
    description: "Clean and modern interface that your team will love using every day.",
  },
  {
    icon: Workflow,
    title: "Flexible Workflows",
    description: "Customize workflows to match your team's unique processes and needs.",
  },
  {
    icon: LineChart,
    title: "Real-Time Analytics",
    description: "Get instant insights into project health and team performance.",
  },
  {
    icon: MessageSquare,
    title: "Team Collaboration",
    description: "Built-in chat, comments, and mentions keep everyone connected.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance with industry standards.",
  },
  {
    icon: Code2,
    title: "Developer-Friendly API",
    description: "Integrate with your favorite tools using our comprehensive API.",
  },
];


function FeaturesSection() {
  return (
    <div>
      <section className="relative min-h-screen overflow-hidden pt-16">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px]" />
        </div>

        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 lg:flex-row lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Transform the Way{" "}
              <span className="text-[#626FF6]">Your Team</span>{" "}
              Works
            </h1>
            <p className="mb-8 max-w-xl text-lg text-muted-foreground lg:text-xl">
              Streamline collaboration, track projects effortlessly, and deliver results faster with our intuitive project management platform.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Start Your Project
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-border text-foreground hover:bg-secondary">
                <Play className="h-4 w-4" />
                Join Waitlist
              </Button>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="mt-12 flex-1 lg:mt-0">
            <div className="gradient-border glow-effect relative mx-auto max-w-lg overflow-hidden rounded-2xl p-1">
              <div className="rounded-xl bg-card p-4">
                {/* Mock Dashboard */}
                <div className="space-y-4">
                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5 ">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  </div>

                  {/* Cards Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-xl bg-slate-900/50 p-3 border border-slate-800 backdrop-blur-sm">
                        <div className="mb-3 h-8 w-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-blue-500/20" />
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-16 rounded-full bg-slate-700/50" />
                          <div className="h-1.5 w-10 rounded-full bg-slate-700/30" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status Bar */}
                  <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/50 text-emerald-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-full rounded-full bg-emerald-950/50 overflow-hidden">
                          <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-600/50 to-emerald-500/20" />
                        </div>
                        <div className="h-1.5 w-24 rounded-full bg-emerald-900/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="relative py-24">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need for{" "}
              <span className="text-[#626FF6]">Success</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features designed to help your team collaborate better and deliver projects on time.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-hover group rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative py-24">
        <div className="container mx-auto px-50">
          <div className="gradient-border glow-effect overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 sm:p-12">
              {/* Section Header */}
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                  Built for{" "}
                  <span className="text-[#626FF6] ">Modern Teams</span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Join thousands of teams already using Planix to deliver amazing results.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-8 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2 text-4xl font-bold text-foreground sm:text-5xl">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative py-24">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-accent/10 blur-[100px]" />
        </div>

        <div className="container mx-auto px-10">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose{" "}
              <span className="gradient-text">Planix</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover the advantages that set Planix apart from other project management tools.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="card-hover group rounded-xl border border-border bg-[#131729] p-6 "
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative py-24">
        <div className="container max-w-4xl mx-auto">
          <div className="gradient-border glow-effect overflow-hidden rounded-2xl">
            <div className="bg-card bg-linear-to-br from-[#131729] to-[#131729] rounded-2xl p-12 text-center border border-white/10 relative overflow-hidden">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Start Managing Your Projects{" "}
                <span className="gradient-text">Smarter</span>
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Join thousands of teams who trust Planix to deliver their projects on time and within budget. Get started for free today.
              </p>
              <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesSection
