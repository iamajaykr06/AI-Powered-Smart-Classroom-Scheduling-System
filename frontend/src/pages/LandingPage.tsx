import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { 
  Calendar, 
  Users, 
  MapPin, 
  BarChart3, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react"

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered timetable generation that optimizes room allocation and teacher availability",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Teacher Management",
      description: "Comprehensive workload tracking and availability management for faculty members",
      color: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Room Optimization",
      description: "Intelligent room allocation based on capacity, equipment, and location preferences",
      color: "text-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into scheduling efficiency and resource utilization",
      color: "text-orange-600"
    }
  ]

  const stats = [
    { label: "Rooms Managed", value: "150+", icon: MapPin },
    { label: "Teachers", value: "80+", icon: Users },
    { label: "Courses", value: "200+", icon: Calendar },
    { label: "Efficiency", value: "95%", icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Department Head",
      content: "This system has reduced our scheduling time by 80% and eliminated conflicts completely.",
      rating: 5
    },
    {
      name: "Prof. Michael Chen",
      role: "Faculty Member",
      content: "Finally, a scheduling system that understands our needs and works seamlessly.",
      rating: 5
    },
    {
      name: "Lisa Anderson",
      role: "Administrator",
      content: "The analytics dashboard gives us insights we never had before. Game changer!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Classroom Scheduling
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Smart Classroom
              <br />
              Scheduler
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your institution's scheduling with intelligent automation. 
              Optimize room allocation, manage teacher workloads, and create perfect timetables effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg group"
                onClick={() => navigate("/app/login")}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={() => navigate("/app/register")}
              >
                Sign Up
              </Button>
            </div>
          </div>

          {/* Animated Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-105 ${
                  activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage classroom scheduling efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <Clock className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Instant synchronization across all devices ensures everyone stays updated with the latest schedule changes.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <Shield className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-3">Conflict Prevention</h3>
              <p className="text-muted-foreground">
                Advanced algorithms detect and prevent scheduling conflicts before they happen.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <CheckCircle className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-3">Automated Validation</h3>
              <p className="text-muted-foreground">
                Ensure all schedules meet institutional requirements and constraints automatically.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by educational institutions worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Scheduling?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions that have already streamlined their scheduling process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={() => navigate("/app/register")}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={() => navigate("/app/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
