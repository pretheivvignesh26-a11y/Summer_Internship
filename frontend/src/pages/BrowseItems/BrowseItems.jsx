import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch, FaSlidersH } from 'react-icons/fa';
import ItemCard from '../../components/ItemCard/ItemCard';
import Loader from '../../components/Loader/Loader';
import itemService from '../../services/itemService';
import { CONDITIONS, SORT_OPTIONS } from '../../utils/constants';

const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setCondition(searchParams.get('condition') || '');
    setSortBy(searchParams.get('sortBy') || 'newest');
  }, [searchParams]);

  useEffect(() => {
    const initPage = async () => {
      try {
        const catRes = await itemService.getCategories();
        if (catRes.success) setCategories(catRes.categories);
        
        const token = localStorage.getItem('token');
        if (token) {
          const wishRes = await itemService.getWishlist();
          if (wishRes.success) {
            setWishlistIds(wishRes.wishlist.map(i => i._id));
          }
        }
      } catch (err) {
        console.error('Failed to prefetch browse page data:', err);
      }
    };
    initPage();
  }, []);

  useEffect(() => {
    const fetchFilteredListings = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (condition) params.condition = condition;
        if (sortBy) params.sortBy = sortBy;

        const data = await itemService.getItems(params);
        if (data.success) {
          setItems(data.items);
        }
      } catch (error) {
        console.error('Failed to load listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredListings();
  }, [search, category, minPrice, maxPrice, condition, sortBy]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (search) newParams.search = search;
    if (category) newParams.category = category;
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (condition) newParams.condition = condition;
    if (sortBy) newParams.sortBy = sortBy;
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCondition('');
    setSortBy('newest');
    setSearchParams({});
  };

  const handleWishlistToggle = (itemId, isAdded) => {
    if (isAdded) {
      setWishlistIds(prev => [...prev, itemId]);
    } else {
      setWishlistIds(prev => prev.filter(id => id !== itemId));
    }
  };

  return (
    <div className="container browse-layout">
      {}
      <aside className="card filter-sidebar">
        <h3 className="filter-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaFilter style={{ fontSize: '1rem' }} /> Filters
        </h3>

        <form onSubmit={handleFilterSubmit}>
          <div className="filter-section">
            <label className="form-label" htmlFor="search-input">Search Query</label>
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              placeholder="What are you looking for?"
            />
          </div>

          <div className="filter-section">
            <label className="form-label" htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label className="form-label" htmlFor="min-price-input">Price Range (Daily)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                id="min-price-input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-control"
                placeholder="Min"
              />
              <span style={{ color: 'var(--text-light)' }}>-</span>
              <input
                type="number"
                aria-label="Maximum daily price filter input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-control"
                placeholder="Max"
              />
            </div>
          </div>

          <div className="filter-section">
            <label className="form-label" htmlFor="condition-select">Condition</label>
            <select
              id="condition-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="form-control"
            >
              <option value="">Any Condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label className="form-label" htmlFor="sort-select">Sort By</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary btn-sm">
              Apply Filters
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
              Clear All
            </button>
          </div>
        </form>
      </aside>

      {}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Rental Listings</h2>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
            {loading ? 'Searching...' : `${items.length} items found`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '320px', borderRadius: 'var(--border-radius-lg)' }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
            <FaSlidersH style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
            <h3>No Listings Found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
              We couldn't find any rentals matching your exact filters. Try broadening your query or clearing price ranges.
            </p>
            <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isWishlistedInitial={wishlistIds.includes(item._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BrowseItems;
