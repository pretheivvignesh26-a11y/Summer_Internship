import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import itemService from '../../services/itemService';
import { CONDITIONS } from '../../utils/constants';

const CreateItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dailyPrice: '',
    location: '',
    condition: 'Good',
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await itemService.getCategories();
        if (data.success) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setFormData(prev => ({ ...prev, category: data.categories[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      return toast.warn('You can upload a maximum of 5 images');
    }

    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, dailyPrice, location, condition } = formData;

    if (!title || !description || !category || !dailyPrice || !location || !condition) {
      return toast.warn('Please fill in all required fields');
    }

    if (parseFloat(dailyPrice) <= 0) {
      return toast.warn('Daily price must be a positive number');
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append('title', title);
    submitData.append('description', description);
    submitData.append('category', category);
    submitData.append('dailyPrice', dailyPrice);
    submitData.append('location', location);
    submitData.append('condition', condition);

    images.forEach((image) => {
      submitData.append('images', image);
    });

    try {
      const data = await itemService.createItem(submitData);
      if (data.success) {
        toast.success('Rental item listed successfully!');
        navigate('/listings/my');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to list rental item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '750px' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card"
      >
        <h2 style={{ marginBottom: '0.5rem' }}>List an Item for Rent</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Fill in details and upload pictures of your item to start earning rental income.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="item-title">Item Title *</label>
            <input
              type="text"
              name="title"
              id="item-title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Sony Alpha 7III Camera / Mountain Bicycle"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-desc">Description *</label>
            <textarea
              name="description"
              id="item-desc"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Describe the item, features, accessories included, and pick-up/return instructions."
              maxLength="2000"
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="item-category">Category *</label>
              <select
                name="category"
                id="item-category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
              >
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="item-condition">Condition *</label>
              <select
                name="condition"
                id="item-condition"
                value={formData.condition}
                onChange={handleChange}
                className="form-control"
              >
                {CONDITIONS.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="item-price">Daily Price (₹) *</label>
              <input
                type="number"
                name="dailyPrice"
                id="item-price"
                value={formData.dailyPrice}
                onChange={handleChange}
                className="form-control"
                placeholder="₹ 500"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="item-location">Location / Area *</label>
              <input
                type="text"
                name="location"
                id="item-location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Indiranagar, Bangalore"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Images (Max 5)</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', color: 'var(--text-light)' }} htmlFor="image-upload-input">
                <FaCloudUploadAlt style={{ fontSize: '1.75rem' }} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload</span>
                <input
                  type="file"
                  id="image-upload-input"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>

              {imagePreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', padding: '0.2rem', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex' }} aria-label="Remove uploaded image preview">
                    <FaTimes style={{ fontSize: '0.75rem' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} style={{ width: '50%' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: '50%' }} disabled={loading}>
              <FaPlus /> {loading ? 'Creating Listing...' : 'List Item'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateItem;
