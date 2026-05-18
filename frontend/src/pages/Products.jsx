import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronRight } from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const catId = new URLSearchParams(location.search).get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products${catId ? `?category=${catId}` : ''}`),
          axios.get('/api/categories')
        ]);

        setProducts(prodRes.data);
        setCategories(catRes.data);

        if (catId) {
          const matched = catRes.data.find(c => c._id === catId);
          setSelectedCategory(matched || null);
        } else {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error('Error fetching products/categories', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [catId]);

  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('search') || '';

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="section-padding products-page-bg" style={{ paddingTop: '30px' }}>
      <div className="full-width-container">
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem' }}>
            {searchKeyword 
              ? `Search Results for "${searchKeyword}"` 
              : selectedCategory 
                ? selectedCategory.name 
                : 'All Products'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Showing {filteredProducts.length} products
          </p>
        </div>

        <div className="grid-products-layout">
          {/* Sidebar Filters */}
          <aside>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Filter size={20} />
                Categories
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <li>
                  <button 
                    onClick={() => navigate('/products')}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '10px', 
                      borderRadius: 'var(--radius)',
                      backgroundColor: selectedCategory === null ? 'var(--background)' : 'transparent',
                      fontWeight: selectedCategory === null ? '700' : '500',
                      color: selectedCategory === null ? 'var(--accent)' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    All Products
                    {selectedCategory === null && <ChevronRight size={16} />}
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <button 
                      onClick={() => navigate(`/products?category=${cat._id}`)}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '10px', 
                        borderRadius: 'var(--radius)',
                        backgroundColor: selectedCategory?._id === cat._id ? 'var(--background)' : 'transparent',
                        fontWeight: selectedCategory?._id === cat._id ? '700' : '500',
                        color: selectedCategory?._id === cat._id ? 'var(--accent)' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      {cat.name}
                      {selectedCategory?._id === cat._id && <ChevronRight size={16} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main>
            {loading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="card text-center" style={{ padding: '60px' }}>
                <h3>No products found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try typing another search keyword or select a category.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
