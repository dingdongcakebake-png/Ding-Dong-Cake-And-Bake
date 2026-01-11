import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Star, ChefHat, Heart, Truck, Shield, Clock } from 'lucide-react';
import { fetchProducts } from '../store/slices/productsSlice';
import Button from '../components/UI/Button';
import logo from '../assects/logo.png';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts()); // optional
  }, [dispatch]);

  const features = [
    { icon: ChefHat, title: 'Expert Bakers', description: 'Crafted by skilled professionals' },
    { icon: Clock, title: 'Fresh Daily', description: 'Baked fresh every morning' },
    { icon: Heart, title: 'Made with Love', description: 'Every product crafted with care' },
    { icon: Truck, title: 'Fast Delivery', description: 'Quick doorstep delivery' },
    { icon: Shield, title: 'Quality Guarantee', description: '100% satisfaction assured' },
    { icon: Star, title: 'Premium Quality', description: 'Finest ingredients only' }
  ];

  const stats = [
    { number: '5000+', label: 'Happy Customers' },
    { number: '1000+', label: 'Custom Cakes' },
    { number: '50+', label: 'Varieties' },
    { number: '4.9★', label: 'Rating' }
  ];

  // Separate images
  const heroBg =
    "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1600";

  const ctaBg =
    "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <div className="space-y-24">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBg}')` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">

          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="h-24 mx-auto mb-6 object-contain"
          />

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900 dark:text-white">
            DING DONG
            <br />
            <span className="text-3xl md:text-4xl text-amber-600 dark:text-amber-400">
              CAKE & BAKE
            </span>
          </h1>

          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Premium Cakes • Custom Cakes • Brownies • Pizza
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/products"
              size="lg"
              className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-700"
            >
              Explore Menu <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              as={Link}
              to="/contact"
              variant="outline"
              size="lg"
              className="border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-amber-500">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We deliver quality, freshness, and happiness in every bite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <div className="bg-amber-100 dark:bg-amber-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-amber-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${ctaBg}')` }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 container mx-auto px-4 py-24 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Need a Custom Cake?
          </h2>
          <p className="text-xl text-amber-200 mb-8 max-w-2xl mx-auto">
            From birthdays to weddings, we design your dream cake.
          </p>

          <Button
            as={Link}
            to="/contact"
            size="xl"
            className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-700"
          >
            Order Custom Cake <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

    </div>
  );
};

export default Home;
