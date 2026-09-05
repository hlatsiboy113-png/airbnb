import React, { useState, useRef } from 'react';
import { getImageUrl } from '../services/api';

/**
 * Reusable ListingForm Component
 * Used by both CreateListing and UpdateListing pages
 * @param {Object} initialData - Pre-filled data for updates (optional)
 * @param {Function} onSubmit - Submit handler from parent
 * @param {boolean} isUpdate - Whether this is an update form
 * @param {boolean} loading - Loading state from parent
 */
const ListingForm = ({ initialData = null, onSubmit, isUpdate = false, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    type: initialData?.type || 'Entire place',
    guests: initialData?.guests || 1,
    bedrooms: initialData?.bedrooms || 1,
    bathrooms: initialData?.bathrooms || 1,
    price: initialData?.price || '',
    amenities: initialData?.amenities?.join(', ') || '',
    weeklyDiscount: initialData?.weeklyDiscount || 0,
    cleaningFee: initialData?.cleaningFee || 0,
    serviceFee: initialData?.serviceFee || 0,
    occupancyTaxes: initialData?.occupancyTaxes || 0,
    rating: initialData?.rating || 0,
    reviews: initialData?.reviews || 0,
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(
    initialData?.images?.map(getImageUrl) || []
  );
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  /**
   * Handle text/number input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle image file selection with preview
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors((prev) => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }
    setImages(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setErrors((prev) => ({ ...prev, images: '' }));
  };

  /**
   * Validate all form fields
   * @returns {boolean} True if valid
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!isUpdate && images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Build FormData and submit to parent
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'amenities') {
        data.append(key, JSON.stringify(formData[key].split(',').map((a) => a.trim()).filter(Boolean)));
      } else {
        data.append(key, formData[key]);
      }
    });

    images.forEach((image) => {
      data.append('images', image);
    });

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={gridStyle}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Modern Apartment in New York"
            className={errors.title ? 'error-border' : ''}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., New York"
            className={errors.location ? 'error-border' : ''}
          />
          {errors.location && <span className="field-error">{errors.location}</span>}
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="Entire place">Entire place</option>
            <option value="Private room">Private room</option>
            <option value="Shared room">Shared room</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price per Night ($) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="150"
            min="0"
            className={errors.price ? 'error-border' : ''}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="guests">Guests</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="weeklyDiscount">Weekly Discount ($)</label>
          <input
            type="number"
            id="weeklyDiscount"
            name="weeklyDiscount"
            value={formData.weeklyDiscount}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cleaningFee">Cleaning Fee ($)</label>
          <input
            type="number"
            id="cleaningFee"
            name="cleaningFee"
            value={formData.cleaningFee}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="serviceFee">Service Fee ($)</label>
          <input
            type="number"
            id="serviceFee"
            name="serviceFee"
            value={formData.serviceFee}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="occupancyTaxes">Occupancy Taxes ($)</label>
          <input
            type="number"
            id="occupancyTaxes"
            name="occupancyTaxes"
            value={formData.occupancyTaxes}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="amenities">Amenities (comma-separated)</label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="wifi, kitchen, free parking, pool"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="images">
            Images {!isUpdate && '*'} (max 5)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/jpeg,image/jpg,image/png"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary"
          >
            {isUpdate ? 'Change Images' : 'Upload Images'}
          </button>
          {errors.images && <span className="field-error">{errors.images}</span>}

          {previewUrls.length > 0 && (
            <div style={previewGridStyle}>
              {previewUrls.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index + 1}`} style={previewImgStyle} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isUpdate ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '0 24px',
};

const previewGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '12px',
  marginTop: '16px',
};

const previewImgStyle = {
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '8px',
};

export default ListingForm;
