import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaFolderOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ItemCard from '../../components/ItemCard/ItemCard';
import Loader from '../../components/Loader/Loader';
import itemService from '../../services/itemService';
import useAuth from '../../hooks/useAuth';

const Wishlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await itemService.getWishlist();
      if (data.success) {
        setItems(data.wishlist);
      }
    } catch (err) {
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleWishlistToggle = (itemId, isAdded) => {
    
    if (!isAdded) {
      setItems(prev => prev.filter(item => item._id !== itemId));
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1>My Wishlist</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and manage items you saved for later renting.</p>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
          <FaHeart style={{ fontSize: '3.5rem', color: 'var(--text-light)', marginBottom: '1.25rem' }} />
          <h3>Wishlist is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            Click the heart icon on any listing card while browsing to save items here.
          </p>
          <Link to="/browse" className="btn btn-primary btn-sm">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              isWishlistedInitial={true}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
