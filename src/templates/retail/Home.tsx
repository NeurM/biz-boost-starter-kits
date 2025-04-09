import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonial from '@/components/Testimonial';
import { ArrowRight, ShoppingBag, Truck, CreditCard, Star } from 'lucide-react';

const RetailHome = () => {
  const navItems = [
    { name: "Home", path: "/retail" },
    { name: "About", path: "/retail/about" },
    { name: "Products", path: "/retail/products" },
    { name: "Blog", path: "/retail/blog" },
    { name: "Contact", path: "/retail/contact" },
  ];
  
  const contactInfo = {
    address: "456 Shop Boulevard, Retailville, RV 67890",
    phone: "(555) 789-0123",
    email: "hello@retailready.com",
  };

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Widget",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Widgets"
    },
    {
      id: 2,
      name: "Deluxe Gadget",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Gadgets"
    },
    {
      id: 3,
      name: "Essential Tool Set",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Tools"
    },
    {
      id: 4,
      name: "Designer Accessory",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      category: "Accessories"
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar 
        logo="Retail<span class='text-purple-600'>Ready</span>" 
        basePath="retail"
        navItems={navItems}
        ctaText="Shop Now" 
        ctaLink="/retail/products"
      />
      
      {/* Remove the UserMenu reference that was causing the error */}
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 to-pink-500 text-white">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium mb-6 inline-block">New Collection</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Our Latest Collection</h1>
              <p className="text-xl mb-8 text-purple-100">
                Explore our curated selection of high-quality products for your home and lifestyle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
                  <Link to="/retail/products">Shop Collection</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/retail/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Elegant retail products"
                className="rounded-lg shadow-xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-white" style={{clipPath: "polygon(0 100%, 100% 100%, 100% 0)"}}></div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Easy 30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/retail/products" className="text-purple-600 hover:text-purple-800 flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover-grow">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                    <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-600 font-semibold">${product.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <Star className="h-4 w-4 fill-current text-gray-300" />
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                      <Link to="/retail/products">View Product</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="bg-pink-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Join Our Mailing List</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Sign up for our newsletter to receive updates on new products, special offers, and exclusive deals!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 border border-gray-300 rounded flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button className="bg-purple-600 hover:bg-purple-700">Subscribe</Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't take our word for it, hear what our valued customers have to say about our products and service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="I absolutely love the quality of products from this store. Fast shipping and excellent customer service too!"
              author="Jennifer Adams"
              role="Verified Customer"
              className="border-purple-200"
            />
            <Testimonial 
              quote="The products I purchased exceeded my expectations. Will definitely shop here again!"
              author="Michael Roberts"
              role="Verified Customer"
              className="border-purple-200"
            />
            <Testimonial 
              quote="Great selection, competitive prices, and outstanding service. My new favorite online shop!"
              author="Emily Chen"
              role="Verified Customer"
              className="border-purple-200"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Shop By Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Home Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
              { name: "Electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
              { name: "Accessories", image: "https://images.unsplash.com/photo-1611923134957-1a9a1631e790?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" },
              { name: "Clothing", image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" }
            ].map((category, index) => (
              <Link to="/retail/products" key={index} className="block">
                <div className="relative overflow-hidden rounded-lg group hover-grow">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2">{category.name}</h3>
                      <span className="text-white/80 flex items-center">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Instagram Feed */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Follow Us on Instagram</h2>
            <p className="text-gray-600">@retailready</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative group overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${i}/300/300`}
                  alt="Instagram post"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-purple-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white">View Post</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer 
        logo="RetailReady"
        description="Your one-stop shop for quality products and exceptional service."
        basePath="retail"
        navItems={navItems}
        contactInfo={contactInfo}
      />
    </div>
  );
};

export default RetailHome;
