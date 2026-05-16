import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Monitor, Cpu, Menu, X, Search, ChevronRight } from 'lucide-react';
import { prebuiltPCs, pcParts } from './mockData';
import './index.css';

// --- State Management ---
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [builderState, setBuilderState] = useState({
        CPU: null,
        GPU: null,
        Motherboard: null,
        RAM: null,
        PSU: null,
        Case: null
    });

    const addToCart = (item) => setCart([...cart, item]);
    const toggleWishlist = (item) => {
        if (wishlist.find(w => w.id === item.id)) {
            setWishlist(wishlist.filter(w => w.id !== item.id));
        } else {
            setWishlist([...wishlist, item]);
        }
    };

    const selectPartForBuilder = (category, part) => {
        setBuilderState(prev => ({ ...prev, [category]: part }));
    };

    const removePartFromBuilder = (category) => {
        setBuilderState(prev => ({ ...prev, [category]: null }));
    };

    const getBuilderTotal = () => {
        return Object.values(builderState).reduce((total, part) => total + (part?.price || 0), 0);
    };

    return (
        <AppContext.Provider value={{
            cart, addToCart,
            wishlist, toggleWishlist,
            builderState, selectPartForBuilder, removePartFromBuilder, getBuilderTotal
        }}>
            {children}
        </AppContext.Provider>
    );
};

// --- Components ---

const Navbar = () => {
    const { cart, wishlist } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    <Cpu className="text-gradient" size={32} />
                    <span>PC<span className="text-gradient">-Craft</span></span>
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
                    <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
                    <Link to="/prebuilts" style={{ fontWeight: 500 }}>Pre-built PCs</Link>
                    <Link to="/builder" style={{ fontWeight: 500, color: 'var(--accent-purple)' }}>Custom Builder</Link>
                    <Link to="/parts" style={{ fontWeight: 500 }}>Components</Link>

                    <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Heart size={24} color="var(--text-secondary)" />
                            {wishlist.length > 0 && (
                                <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--accent-purple)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {wishlist.length}
                                </span>
                            )}
                        </div>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <ShoppingCart size={24} color="var(--text-secondary)" />
                            {cart.length > 0 && (
                                <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--accent-blue)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {cart.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// --- Pages ---

const Home = () => {
    return (
        <div>
            <section className="hero" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <h1 className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>Craft Your Ultimate <span className="text-gradient">Dream Machine</span></h1>
                    <p className="text-secondary animate-fade-in" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', animationDelay: '0.1s' }}>
                        Whether you are building from scratch or looking for a ready-made powerhouse, PC-Craft has everything you need to ascend to the next level of computing.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }} className="animate-fade-in">
                        <Link to="/builder" className="btn btn-primary"><Cpu size={20} /> Start Custom Builder</Link>
                        <Link to="/prebuilts" className="btn btn-secondary"><Monitor size={20} /> Shop Pre-builts</Link>
                    </div>
                </div>
            </section>

            <section className="section container">
                <h2 style={{ marginBottom: '3rem', textAlign: 'center' }}>Featured <span className="text-gradient">Pre-builts</span></h2>
                <div className="grid grid-cols-3">
                    {prebuiltPCs.map(pc => (
                        <div key={pc.id} className="card">
                            <div className="card-img-wrapper">
                                <img src={pc.image} alt={pc.name} className="card-img" style={{ height: '250px' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <span className="badge" style={{ marginBottom: '0.5rem' }}>{pc.type}</span>
                                    <h3>{pc.name}</h3>
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>${pc.price}</span>
                            </div>
                            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                <li style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}><strong>CPU:</strong> {pc.cpu}</li>
                                <li style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}><strong>GPU:</strong> {pc.gpu}</li>
                                <li style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}><strong>RAM:</strong> {pc.ram}</li>
                                <li style={{ padding: '0.25rem 0' }}><strong>Storage:</strong> {pc.storage}</li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%' }}>View Details</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const CustomBuilder = () => {
    const { builderState, removePartFromBuilder, getBuilderTotal } = useAppContext();
    const navigate = useNavigate();

    const slots = ['CPU', 'GPU', 'Motherboard', 'RAM', 'PSU', 'Case'];

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1>Custom <span className="text-gradient">PC Builder</span></h1>
                    <p className="text-secondary">Select parts to build your custom rig. Compatibility check enabled.</p>
                </div>
                <div className="card" style={{ padding: '1rem 2rem', background: 'var(--gradient-primary)', color: 'white' }}>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Estimated Total</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${getBuilderTotal().toFixed(2)}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {slots.map(slot => {
                        const selectedPart = builderState[slot];
                        return (
                            <div key={slot} className="card" style={{ flexDirection: 'row', alignItems: 'center', padding: '1rem', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Cpu color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>{slot}</h4>
                                        {selectedPart ? (
                                            <div style={{ fontWeight: '600' }}>{selectedPart.name}</div>
                                        ) : (
                                            <div style={{ color: 'var(--text-secondary)' }}>Select a {slot}</div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selectedPart && <span style={{ fontWeight: 'bold' }}>${selectedPart.price}</span>}
                                    {selectedPart ? (
                                        <button className="btn btn-secondary" onClick={() => removePartFromBuilder(slot)} style={{ padding: '0.5rem 1rem' }}><X size={16} /></button>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => navigate(`/parts?category=${slot}`)} style={{ padding: '0.5rem 1rem' }}>Choose</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '100px' }}>
                        <h3>Build Summary</h3>
                        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {slots.map(slot => (
                                <li key={`summary-${slot}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span className="text-secondary">{slot}</span>
                                    <span style={{ fontWeight: 500 }}>{builderState[slot] ? `$${builderState[slot].price}` : '-'}</span>
                                </li>
                            ))}
                        </ul>
                        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            <span>Total:</span>
                            <span className="text-gradient">${getBuilderTotal().toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Add Build to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PartsCatalog = () => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const filterCategory = params.get('category');

    const { selectPartForBuilder, addToCart } = useAppContext();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(filterCategory || 'All');

    const categories = ['All', 'CPU', 'GPU', 'Motherboard', 'RAM', 'PSU', 'Case'];

    const filteredParts = pcParts.filter(part => {
        const matchesCategory = activeCategory === 'All' || part.category === activeCategory;
        const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleSelectForBuilder = (part) => {
        selectPartForBuilder(part.category, part);
        navigate('/builder');
    };

    return (
        <div className="container section">
            <h1 style={{ marginBottom: '2rem' }}>Components <span className="text-gradient">Catalog</span></h1>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search for parts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
                <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} style={{ width: '200px' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-4">
                {filteredParts.map(part => (
                    <div key={part.id} className="card">
                        <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>{part.category}</span>
                        <h4 style={{ marginBottom: '0.5rem', minHeight: '3rem' }}>{part.name}</h4>
                        <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>{part.specs}</p>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--accent-blue)' }}>
                            ${part.price}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {filterCategory ? (
                                <button className="btn btn-primary" onClick={() => handleSelectForBuilder(part)}>Select for Build</button>
                            ) : (
                                <>
                                    <button className="btn btn-primary" onClick={() => addToCart(part)}>Add to Cart</button>
                                    <button className="btn btn-secondary" onClick={() => handleSelectForBuilder(part)}>Add to Builder</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const PrebuiltsCatalog = () => {
    const { addToCart } = useAppContext();
    return (
        <div className="container section">
            <h1 style={{ marginBottom: '2rem' }}>Pre-built <span className="text-gradient">Showcase</span></h1>
            <div className="grid grid-cols-3">
                {prebuiltPCs.map(pc => (
                    <div key={pc.id} className="card">
                        <div className="card-img-wrapper">
                            <img src={pc.image} alt={pc.name} className="card-img" style={{ height: '250px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <span className="badge" style={{ marginBottom: '0.5rem' }}>{pc.type}</span>
                                <h3>{pc.name}</h3>
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>${pc.price}</span>
                        </div>
                        <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                            <li style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}><strong>CPU:</strong> {pc.cpu}</li>
                            <li style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}><strong>GPU:</strong> {pc.gpu}</li>
                            <li style={{ padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}><strong>RAM:</strong> {pc.ram}</li>
                            <li style={{ padding: '0.25rem 0' }}><strong>Storage:</strong> {pc.storage}</li>
                        </ul>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => addToCart(pc)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main App ---

const App = () => {
    return (
        <AppProvider>
            <Router>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/prebuilts" element={<PrebuiltsCatalog />} />
                            <Route path="/builder" element={<CustomBuilder />} />
                            <Route path="/parts" element={<PartsCatalog />} />
                        </Routes>
                    </main>
                    <footer style={{ background: 'var(--bg-secondary)', padding: '2rem 0', marginTop: '4rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                        <p className="text-secondary">© 2026 PC-Craft. All rights reserved.</p>
                    </footer>
                </div>
            </Router>
        </AppProvider>
    );
};

export default App;
