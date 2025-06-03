import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Search, Users, Shield, UserPlus } from "lucide-react"

export default function HomePage() {
  const stats = [
    { icon: Heart, label: "Happy Adoptions", value: "2,847" },
    { icon: Users, label: "Registered Shelters", value: "156" },
    { icon: Shield, label: "Verified Pets", value: "1,234" },
  ]

  const features = [
    {
      icon: Search,
      title: "Find Your Perfect Match",
      description: "Browse through hundreds of adorable pets waiting for their forever home.",
    },
    {
      icon: Shield,
      title: "Verified & Safe",
      description: "All pets are health-checked and come from verified shelters and rescues.",
    },
    {
      icon: Heart,
      title: "Easy Adoption Process",
      description: "Simple, streamlined adoption process to help you bring your new friend home.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Find Your
              <span className="block text-gradient">Perfect Companion</span>
            </h1>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Connect with loving pets in need of homes. Every adoption saves a life and brings joy to your family.
            </p>
          </div>

          <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gradient-lilac hover:opacity-90 text-white px-8 py-3 text-lg">
              <Link href="/pets">
                <Search className="w-5 h-5 mr-2" />
                View Available Pets
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-400 text-purple-300 hover:bg-purple-600/20 hover:text-white px-8 py-3 text-lg"
            >
              <Link href="/register">
                <UserPlus className="w-5 h-5 mr-2" />
                Get Started
              </Link>
            </Button>
          </div>

          {/* Pet Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Heart, label: "Dogs" },
              { icon: Heart, label: "Cats" },
              { icon: Heart, label: "Rabbits" },
              { icon: Heart, label: "Birds" },
            ].map((item, i) => (
              <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="relative aspect-square rounded-2xl glass-effect shadow-lg card-hover flex items-center justify-center">
                  <div className="text-center">
                    <item.icon className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                    <p className="text-purple-200 font-medium">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 gradient-lilac rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose PawPal?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We make pet adoption simple, safe, and joyful for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="card-hover bg-gray-700 border-gray-600 animate-slide-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 gradient-lilac rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Start your journey today and give a loving pet the home they deserve.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            <Link href="/pets">
              <Heart className="w-5 h-5 mr-2" />
              Start Adopting Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
