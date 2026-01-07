import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Package, Destination, Testimonial, Service, Car, SiteSettings, Booking, DataContextType, FAQ, Post, Subscriber, GeneratedPlan, TripPlanRequest, AIItineraryResponse } from '../types';
import { PACKAGES, DESTINATIONS, TESTIMONIALS, CARS, CONTACT_INFO, INITIAL_FAQS, INITIAL_POSTS, INITIAL_SERVICES } from '../constants';
import { api } from '../lib/api';
import { useNotification } from './NotificationContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'Episode World',
  logo: 'https://i.ibb.co/pwnL1Xh/skyline-savannah-logo.png',
  logoWhite: '',
  favicon: 'https://i.ibb.co/pwnL1Xh/skyline-savannah-logo.png',
  enableServices: true,
  phone: CONTACT_INFO.phone,
  email: CONTACT_INFO.email,
  address: CONTACT_INFO.address,
  whatsapp: CONTACT_INFO.whatsapp,
  socials: { facebook: '#', instagram: '#', twitter: '#' },
  hero: {
    videoUrl: 'https://cdn.pixabay.com/video/2022/03/10/110362-687206285_large.mp4', 
    fallbackImage: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=2067&auto=format&fit=crop',
    title: 'Discover. Explore.',
    subtitle: ''
  },
  pageHeaders: {
    destinations: {
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80',
      title: 'Wanderlust Awaits',
      subtitle: 'Explore our top rated destinations across East Africa and beyond.'
    },
    tours: {
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80',
      title: 'Safari Packages',
      subtitle: 'Curated itineraries for the ultimate adventure.'
    },
    services: {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
      title: 'Our Services',
      subtitle: 'Comprehensive travel solutions tailored for you.'
    },
    blog: {
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80',
      title: 'Travel Journal',
      subtitle: 'Stories, tips, and inspiration from the wild.'
    },
    contact: {
      image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1920&q=80',
      title: 'Contact Us',
      subtitle: "We're here to help plan your perfect trip."
    },
    about: {
      image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1920&q=80',
      title: 'About Us',
      subtitle: 'The story behind the journeys.'
    }
  },
  about: {
    title: "Our Story",
    subtitle: "Experience Kenya with dignity, authenticity, and respect.",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
    paragraph1: "Episode World was born from a vision to create extraordinary travel experiences that connect people with the world's most beautiful destinations. We believe that every journey should be a story worth telling, an adventure that transforms, and a memory that lasts forever. Our mission is to curate unique travel experiences that blend adventure, culture, and discovery into unforgettable episodes of your life.",
    paragraph2: "At Episode World, we don't just plan trips — we craft experiences. Each journey is carefully designed to immerse you in the local culture, connect you with authentic experiences, and create moments that become the stories you'll tell for years to come. From breathtaking landscapes to vibrant cityscapes, from serene beaches to mountain peaks, we bring the world to you, one episode at a time. Our team of travel experts works tirelessly to ensure every detail is perfect, every moment is meaningful, and every destination leaves you inspired. Join us as we explore the world together, creating episodes of adventure, discovery, and wonder.",
    stat1_value: "15+",
    stat1_label: "Years Experience",
    stat2_value: "100+",
    stat2_label: "Curated Journeys"
  },
  aboutUsSection: {
    image1_url: "https://images.unsplash.com/photo-1525092029991-13f5c7146523?q=80&w=1887&auto=format&fit=crop",
    image2_url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071&auto=format&fit=crop",
    review_rating: "4.9/5",
    review_count: "200+ Reviews",
    pre_title: "Why Choose Us",
    title: "Crafting Unforgettable Episodes",
    feature1: "Curated Experiences",
    feature2: "Expert Travel Guides",
    feature3: "Global Destinations",
    paragraph1: "At Episode World, we believe that every journey should be a story worth telling. Our mission is to connect travelers with extraordinary destinations and authentic experiences that create lasting memories.",
    paragraph2: "With years of experience in crafting personalized travel experiences, we bring you face-to-face with the world's most beautiful places. Every journey is carefully curated by our expert team, ensuring authenticity, safety, and unforgettable moments that become the episodes of your life story.",
    button_text: "Explore Now",
    button_link: "/about"
  },
  seo: {
    title: 'Episode World | Your Journey, Your Story',
    description: 'Discover extraordinary travel experiences with Episode World. Curated adventures, authentic cultures, and unforgettable memories around the globe.',
    keywords: 'travel, adventure, tours, experiences, destinations, world travel, curated trips'
  },
  scripts: { header: '', body: '' },
  aiProvider: 'gemini',
  storageProvider: 'supabase',
  wasabi: {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    bucket: ''
  },
  smtp: {
    server: '',
    port: 587,
    user: '',
    pass: ''
  },
  adminEmail: 'admin@example.com'
};

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-brand-green via-[#c01e2a] to-[#a01a26] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated logo/icon container */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-32 h-32 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-white rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-2 w-28 h-28 border-2 border-white/30 rounded-full animate-ping"></div>
          
          {/* Inner icon */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading text with animation */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            <span className="inline-block animate-fade-in-up">Loading</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}> Your</span>
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}> Adventure</span>
          </h2>
          <p className="text-white/80 text-sm md:text-base font-light tracking-wider uppercase">
            Preparing something amazing...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full w-full bg-white rounded-full animate-progress"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                bottom: '10%',
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [generatedPlans, setGeneratedPlans] = useState<GeneratedPlan[]>([]);
  const [settings, setSettingsState] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addNotification } = useNotification();

  const fetchAllData = async (isBackgroundRefresh = false) => {
    if (!isBackgroundRefresh) setIsLoading(true);

    try {
      const response = await api.get('get_all_data');
      if (response) {
          if (response.packages) setPackages(response.packages);
          if (response.destinations) setDestinations(response.destinations);
          if (response.services) setServices(response.services);
          if (response.cars) setCars(response.cars);
          if (response.testimonials) setTestimonials(response.testimonials);
          if (response.faqs) setFaqs(response.faqs);
          if (response.posts) setPosts(response.posts);
          
          if (response.settings && response.settings.siteName) {
              setSettingsState({ ...INITIAL_SETTINGS, ...response.settings });
          }
      } else {
          // Fallback if API fails
          console.warn("API request failed, using static fallback.");
          setPackages(PACKAGES);
          setDestinations(DESTINATIONS);
          setServices(INITIAL_SERVICES as Service[]); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (!isBackgroundRefresh) setIsLoading(false);
    }
  };

  const fetchAdminData = async () => {
      const response = await api.get('get_admin_data');
      if (response) {
          if (response.bookings) setBookings(response.bookings);
          if (response.subscribers) setSubscribers(response.subscribers);
          if (response.generated_plans) setGeneratedPlans(response.generated_plans);
      }
  };

  useEffect(() => {
    fetchAllData();
    // Check if admin is logged in (token exists) then fetch admin data
    if (localStorage.getItem('skyline_token')) {
        fetchAdminData();
    }
  }, []);

  // Generic CRUD Helper using PHP API
  const createCrudActions = <T extends { id: string }>(tableName: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => ({
    add: async (item: Omit<T, 'id'>): Promise<boolean> => {
      const res = await api.post('crud', { table: tableName, op: 'create', data: item });
      if (res && res.success) {
          // Re-fetch to be safe or append locally
          setter(prev => [...prev, { ...item, id: res.id } as T]);
          return true;
      }
      return false;
    },
    update: async (item: T): Promise<boolean> => {
      const res = await api.post('crud', { table: tableName, op: 'update', data: item });
      if (res && res.success) {
          setter(prev => prev.map(p => p.id === item.id ? item : p));
          return true;
      }
      return false;
    },
    remove: async (id: string): Promise<boolean> => {
      const res = await api.post('crud', { table: tableName, op: 'delete', id });
      if (res && res.success) {
          setter(prev => prev.filter(p => p.id !== id));
          return true;
      }
      return false;
    }
  });

  const packageActions = createCrudActions<Package>('packages', setPackages);
  const destinationActions = createCrudActions<Destination>('destinations', setDestinations);
  const serviceActions = createCrudActions<Service>('services', setServices);
  const testimonialActions = createCrudActions<Testimonial>('testimonials', setTestimonials);
  const faqActions = createCrudActions<FAQ>('faqs', setFaqs);
  const postActions = createCrudActions<Post>('posts', setPosts);
  const subscriberActions = createCrudActions<Subscriber>('subscribers', setSubscribers);

  const addBooking = async (booking: Omit<Booking, 'id' | 'date'>): Promise<boolean> => {
    const res = await api.post('create_booking', booking);
    if (res && res.success) {
        addNotification('booking', booking);
        // Optimistic update if we are in admin view, though mostly for public side
        return true;
    }
    return false;
  };

  const updateBookingStatus = async (id: string, status: Booking['status']): Promise<boolean> => {
    const res = await api.post('crud', { table: 'bookings', op: 'update', data: { id, status } });
    if (res && res.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        return true;
    }
    return false;
  };

  const addSubscriber = async (email: string): Promise<boolean> => {
    const res = await api.post('add_subscriber', { email });
    if (res && res.success) {
        addNotification('subscriber', { email });
        return true;
    }
    return false;
  };

  const saveGeneratedPlan = async (email: string, request: TripPlanRequest, response: AIItineraryResponse): Promise<boolean> => {
    const res = await api.post('save_plan', { email, request, response });
    return !!(res && res.success);
  };

  const checkAiUsage = async (email: string): Promise<boolean> => {
    const res = await api.get('check_ai_usage', { email });
    return res ? res.allowed : false;
  };

  const updateSettings = async (newSettings: SiteSettings): Promise<boolean> => {
    const res = await api.post('update_settings', newSettings);
    if (res && res.success) {
        setSettingsState(newSettings);
        return true;
    }
    return false;
  };

  const resetData = async () => {
    if (!window.confirm('Resetting data is not implemented in this version safely via frontend.')) return;
  };

  const value: DataContextType = {
    packages, destinations, testimonials, faqs, posts, cars, services, settings,
    bookings, subscribers, generatedPlans,
    addPackage: packageActions.add as any, updatePackage: packageActions.update, deletePackage: packageActions.remove,
    addDestination: destinationActions.add as any, updateDestination: destinationActions.update, deleteDestination: destinationActions.remove,
    addService: serviceActions.add, updateService: serviceActions.update, deleteService: serviceActions.remove,
    addTestimonial: testimonialActions.add as any, updateTestimonial: testimonialActions.update, deleteTestimonial: testimonialActions.remove,
    addFaq: faqActions.add as any, updateFaq: faqActions.update, deleteFaq: faqActions.remove,
    addPost: postActions.add as any, updatePost: postActions.update, deletePost: postActions.remove,
    addBooking, updateBookingStatus, addSubscriber, deleteSubscriber: subscriberActions.remove, saveGeneratedPlan, checkAiUsage, updateSettings, resetData,
  };

  return (
    <DataContext.Provider value={value}>
      {isLoading ? <LoadingScreen /> : children}
    </DataContext.Provider>
  );
};