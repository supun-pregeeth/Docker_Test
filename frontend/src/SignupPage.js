import React, { useState } from 'react';
import './SignupPage.css';

export const SignupPage = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setIsLoading(false);

      if (response.ok) setIsSubmitted(true);
      else setErrors({ api: data.message });
    } catch {
      setIsLoading(false);
      setErrors({ api: 'Server error' });
    }
  };

  return (
    <div className="login-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {isSubmitted && <div className="success-message">Account created successfully!</div>}
        {errors.api && <div className="error-message">{errors.api}</div>}

        <div className="form-group">
          <input name="firstName" placeholder="First Name" onChange={handleChange} />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <input name="lastName" placeholder="Last Name" onChange={handleChange} />
          {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <input name="email" placeholder="Email" onChange={handleChange} />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" name="agreeToTerms" onChange={handleChange} /> I agree to terms
          </label>
          {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}
        </div>

        <div className="signup-link">
          Already have an account?{" "}
          <button type="button" className="link-button" onClick={switchToLogin}>
            Sign in
          </button>
        </div>

        <button type="submit">{isLoading ? 'Loading...' : 'Sign Up'}</button>
      </form>
    </div>
  );
};
