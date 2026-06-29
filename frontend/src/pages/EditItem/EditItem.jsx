import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import itemService from '../../services/itemService';
import Loader from '../../components/Loader/Loader';
import { CONDITIONS } from '../../utils/constants';

const EditItem = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dailyPrice: '',
    location: '',
    condition: 'Good',
    availability: true,
  });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadItemData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          itemService.getCategories(),
          itemService.getItemDetails(id)
        ]);

        if (catRes.success) setCategories(catRes.categories);
        
        if (itemRes.success) {
          const item = itemRes.item;
          setFormData({
            title: item.title,
            description: item.description,
            category: item.category?._id || '',
            dailyPrice: item.dailyPrice,
            location: item.location,
            condition: item.condition,
            availability: item.availability,
          });
          setImagePreviews(item.images || []);
        }
      } catch (err) {
        toast.error('Failed to load item listings details');
        navigate('/listings/my');
      } finally {
        setLoading(false);
      }
    };
    loadItemData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
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
    const { title, description, category, dailyPrice, location, condition, availability } = formData;

    if (!title || !description || !category || !dailyPrice || !location || !condition) {
      return toast.warn('Please fill in all required fields');
    }

    setSubmitting(true);

    const submitData = new FormData();
    submitData.append('title', title);
    submitData.append('description', description);
    submitData.append('category', category);
    submitData.append('dailyPrice', dailyPrice);
    submitData.append('location', location);
    submitData.append('condition', condition);
    submitData.append('availability', availability);

    images.forEach((image) => {
      submitData.append('images', image);
    });

    try {
      const data = await itemService.editItem(id, submitData);
      if (data.success) {
        toast.success('Listing updated successfully!');
        navigate('/listings/my');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update item listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '750px' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card"
      >
        <h2 style={{ marginBottom: '0.5rem' }}>Edit Rental Listing</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update information, pricing, or images for your item listing.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">Item Title *</label>
            <input
              type="text"
              name="title"
              id="edit-title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-desc">Description *</label>
            <textarea
              name="description"
              id="edit-desc"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              maxLength="2000"
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">Category *</label>
              <select
                name="category"
                id="edit-category"
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
              <label className="form-label" htmlFor="edit-condition">Condition *</label>
              <select
                name="condition"
                id="edit-condition"
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
              <label className="form-label" htmlFor="edit-price">Daily Price (₹) *</label>
              <input
                type="number"
                name="dailyPrice"
                id="edit-price"
                value={formData.dailyPrice}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-location">Location / Area *</label>
              <input
                type="text"
                name="location"
                id="edit-location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-check" htmlFor="edit-availability">
              <input
                type="checkbox"
                name="availability"
                id="edit-availability"
                checked={formData.availability}
                onChange={handleChange}
              />
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>Item Available for Rent</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Update Images (Max 5)</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', color: 'var(--text-light)' }} htmlFor="image-edit-input">
                <FaCloudUploadAlt style={{ fontSize: '1.75rem' }} />
                <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload</span>
                <input
                  type="file"
                  id="image-edit-input"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>

              {imagePreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', padding: '0.2rem', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex' }} aria-label="Remove image thumbnail preview">
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
            <button type="submit" className="btn btn-primary" style={{ width: '50%' }} disabled={submitting}>
              <FaSave /> {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditItem;
