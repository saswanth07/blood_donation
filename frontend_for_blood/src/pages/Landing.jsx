import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Users, Calendar, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const stats = [
        { icon: Users, label: 'Active Donors', value: '5,000+', color: 'text-blue-500', bg: 'bg-blue-100' },
        { icon: Heart, label: 'Lives Saved', value: '12,000+', color: 'text-red-500', bg: 'bg-red-100' },
        { icon: Award, label: 'Awards Won', value: '15+', color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { icon: Calendar, label: 'Years Active', value: '8+', color: 'text-green-500', bg: 'bg-green-100' },
    ];

    const features = [
        {
            icon: ShieldCheck,
            title: 'Safe & Secure',
            desc: 'We follow strict health protocols to ensure donor and recipient safety.'
        },
        {
            icon: Clock,
            title: 'Quick Process',
            desc: 'Our streamlined donation process takes less than 30 minutes of your time.'
        },
        {
            icon: Activity,
            title: 'Real-time Updates',
            desc: 'Track your blood donation journey and see exactly when you save a life.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white overflow-hidden font-sans text-gray-800">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-md py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                            <Heart className="w-6 h-6 text-white fill-current" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-800">
                            LifeFlow
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Features</a>
                        <a href="#stats" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Impact</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-red-600 font-medium transition-colors">Stories</a>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 rounded-full font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            Donate Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                {/* Background Decorations */}
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-red-200/20 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold border border-red-200">
                            <Activity size={16} className="animate-pulse" />
                            <span>Saving lives, one drop at a time</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                            Donate Blood, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-purple-600">
                                Save a Life
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Join our community of heroes. Your simple act of kindness connects you to someone in desperate need. Be the lifeline today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl shadow-red-200 hover:shadow-red-300 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 group"
                            >
                                Start Donating
                                <Heart className="w-5 h-5 group-hover:scale-125 transition-transform fill-current" />
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 rounded-2xl font-bold text-lg bg-white text-gray-800 border-2 border-gray-100 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                            >
                                Hospital Login
                            </button>
                        </div>

                        <div className="pt-4 flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                                ))}
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white text-xs">+2k</div>
                            </div>
                            <p>Join 2,000+ donors today</p>
                        </div>
                    </div>

                    <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {/* Abstract Hero Image Composition */}
                        <div className="relative z-10 glass rounded-3xl p-6 shadow-2xl border border-white/40 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg animate-float">
                                <Heart className="w-12 h-12 text-white fill-current" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <p className="text-sm text-gray-500">Urgent Request</p>
                                        <h3 className="text-xl font-bold">O- Blood Needed</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">URGENT</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-red-500 rounded-full"></div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Raised: 15 Units</span>
                                    <span className="font-bold text-gray-800">Goal: 20 Units</span>
                                </div>
                                <button className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold">Donate Now</button>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -bottom-10 -left-10 glass p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <ShieldCheck />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="font-bold text-green-600">Verified Donor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group cursor-default">
                                <div className={`w-16 h-16 mx-auto mb-4 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                    <stat.icon size={32} />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-red-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="text-4xl font-bold mt-2 mb-4">The Smarter Way to Save Lives</h2>
                        <p className="text-gray-600">We've simplified the blood donation process to make it as easy, safe, and transparent as possible.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto bg-gradient-to-r from-red-600 to-rose-700 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to Become a Hero?</h2>
                    <p className="text-red-100 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                        There are patients waiting for your help perfectly matching your blood type. Join LifeFlow today.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-10 py-5 bg-white text-red-600 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl relative z-10"
                    >
                        Create Account
                    </button>
                    <p className="mt-6 text-sm text-red-200 opacity-80 relative z-10">No credit card required • Takes 2 minutes</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Heart className="text-red-500 fill-current" />
                        <span className="text-xl font-bold">LifeFlow</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 LifeFlow System. Saving lives every day.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
