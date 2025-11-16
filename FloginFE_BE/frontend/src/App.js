import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import './App.css';

function App() {
  const [view, setView] = useState('list');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleViewChange = (newView, productId = null) => {
    setView(newView);
    setSelectedProductId(productId);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product Management System</h1>
        <nav>
          <button onClick={() => handleViewChange('list')}>List Products</button>
          <button onClick={() => handleViewChange('create')}>Create Product</button>
        </nav>
      </header>
      
      <main>
        {view === 'list' && <ProductList />}
        {view === 'create' && (
          <ProductForm onSuccess={() => handleViewChange('list')} />
        )}
        {view === 'edit' && selectedProductId && (
          <ProductForm 
            productId={selectedProductId} 
            onSuccess={() => handleViewChange('list')} 
          />
        )}
        {view === 'detail' && selectedProductId && (
          <ProductDetail productId={selectedProductId} />
        )}
      </main>
    </div>
  );
}

export default App;
