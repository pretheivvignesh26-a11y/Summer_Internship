import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../../components/Hero/Hero';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import ItemCard from '../../components/ItemCard/ItemCard';
import Loader from '../../components/Loader/Loader';
import itemService from '../../services/itemService';
import { CATEGORIES_FALLBACK } from '../../utils/constants';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          itemService.getCategories(),
          itemService.getItems({ limit: 4 })
        ]);
        if (catRes.success) {
          setCategories(catRes.categories);
        } else {
          setCategories(CATEGORIES_FALLBACK);
        }
        if (itemRes.success) {
          setFeaturedItems(itemRes.items);
        }
      } catch (error) {
        console.error('Error fetching landing page data:', error);
        setCategories(CATEGORIES_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (searchTerm) => {
    navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero onSearch={handleHeroSearch} />

      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Browse by Category</h2>
        {loading ? (
          <Loader size="medium" />
        ) : (
          <div className="categories-container">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      <section className="container" style={{ padding: '0 1.5rem 6rem' }}>
        <div className="section-title-wrap">
          <h2>Featured Rental Items</h2>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/browse')}>
            View All
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--border-radius-lg)' }} />
            ))}
          </div>
        ) : featuredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            <p>No featured items available right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4">
            {featuredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Home;
