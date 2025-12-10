import React, { useState } from 'react';
import './Product.css';

const initialProducts = [
  {
    name: 'Đồng hồ thông minh',
    desc: 'Theo dõi sức khỏe với cảm biến nhịp tim',
    category: 'Điện tử',
    price: 990000,
    stock: 32,
  },
  {
    name: 'Giá đỡ laptop',
    desc: 'Giá đỡ laptop nhôm ergonomic',
    category: 'Phụ kiện',
    price: 399000,
    stock: 78,
  },
  {
    name: 'Tai nghe không dây',
    desc: 'Tai nghe chống ồn cao cấp',
    category: 'Điện tử',
    price: 299000,
    stock: 45,
  },
];

const Product = ({ onLogout }) => {
      const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

      const handleSort = key => {
        setSortConfig(prev => {
          if (prev.key === key) {
            return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
          }
          return { key, direction: 'asc' };
        });
      };
    const [editIndex, setEditIndex] = useState(null);
    const [editProduct, setEditProduct] = useState({ name: '', desc: '', price: '', stock: '', category: '' });

    const handleEditProduct = idx => {
      setEditIndex(idx);
      setEditProduct({
        name: products[idx].name,
        desc: products[idx].desc,
        price: products[idx].price,
        stock: products[idx].stock,
        category: products[idx].category
      });
    };

    const handleEditChange = e => {
      const { name, value } = e.target;
      setEditProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = e => {
      e.preventDefault();
      if (!editProduct.name || !editProduct.desc || !editProduct.price || !editProduct.stock || !editProduct.category) return;
      setProducts(prev => prev.map((p, idx) => idx === editIndex ? {
        name: editProduct.name,
        desc: editProduct.desc,
        price: parseFloat(editProduct.price),
        stock: parseInt(editProduct.stock),
        category: editProduct.category
      } : p));
      setEditIndex(null);
      showToast(`Đã cập nhật sản phẩm!\n${editProduct.name} đã được cập nhật`, 'success');
    };

    const handleDeleteProduct = idx => {
      const deletedName = products[idx].name;
      if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        setProducts(prev => {
          const newList = prev.filter((_, i) => i !== idx);
          showToast(`Đã xóa sản phẩm!\n${deletedName} đã được xóa khỏi kho hàng`, 'success');
          return newList;
        });
      }
    };
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', desc: '', price: '', stock: '', category: ''
  });

  const handleAddProduct = () => {
    setShowModal(true);
    setNewProduct({ name: '', desc: '', price: '', stock: '', category: '' });
  };

  const handleModalChange = e => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = e => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.desc || !newProduct.price || !newProduct.stock || !newProduct.category) return;
    setProducts(prev => [
      ...prev,
      {
        name: newProduct.name,
        desc: newProduct.desc,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: newProduct.category
      }
    ]);
    setShowModal(false);
    showToast(`Đã thêm sản phẩm!\n${newProduct.name} đã được thêm vào kho hàng`, 'success');
  };

  let filteredProducts = products.filter(
    p =>
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase())) &&
      (category === '' || p.category === category)
  );

  if (sortConfig.key) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      if (sortConfig.key === 'price' || sortConfig.key === 'stock') {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      } else {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key].localeCompare(b[sortConfig.key], 'vi', { sensitivity: 'base' })
          : b[sortConfig.key].localeCompare(a[sortConfig.key], 'vi', { sensitivity: 'base' });
      }
    });
  }

  // Lấy danh sách danh mục động từ products
const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2500);
  };

  return (
    <div className="product-bg">
      <div className="product-header">
        <div className="header-left">
          <span className="product-icon" role="img" aria-label="box">📦</span>
          <div>
            <h1>Quản Lý Sản Phẩm</h1>
            <span className="product-sub">Quản lý kho hàng sản phẩm của bạn</span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Đăng xuất</button>
      </div>
      <div className="product-list-box">
        <div className="product-stats-center">
          <div className="stat-box">
            <div className="stat-label">Tổng số sản phẩm</div>
            <div className="stat-value">{products.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Tổng giá trị kho hàng</div>
            <div className="stat-value">
              ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Sản phẩm sắp hết hàng</div>
            <div className="stat-value">{products.filter(p => p.stock < 5).length}</div>
          </div>
        </div>
        <div className="product-list-header">
          <div className="product-list-title">Danh sách sản phẩm</div>
          <button className="add-btn" data-testid="add-product-btn" onClick={handleAddProduct}>+ Thêm sản phẩm</button>
        </div>
        <div className="product-list-filter">
          <input
            className="search-input"
            data-testid="search-input"
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mô tả..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="category-select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <table className="product-table">
           <thead>
             <tr>
               <th style={{cursor:'pointer'}} onClick={()=>handleSort('name')}>
                 Tên sản phẩm
                 {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
               </th>
               <th style={{cursor:'pointer'}} onClick={()=>handleSort('category')}>
                 Danh mục
                 {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
               </th>
               <th style={{cursor:'pointer'}} onClick={()=>handleSort('price')}>
                 Giá
                 {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
               </th>
               <th style={{cursor:'pointer'}} onClick={()=>handleSort('stock')}>
                 Tồn kho
                 {sortConfig.key === 'stock' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
               </th>
               <th>THAO TÁC</th>
             </tr>
           </thead>
          <tbody>
             {filteredProducts.map((p, idx) => {
               // Tìm index thực trong mảng products
               const realIdx = products.findIndex(pr => pr.name === p.name && pr.desc === p.desc && pr.price === p.price && pr.stock === p.stock && pr.category === p.category);
               return (
                 <tr key={idx} data-testid="product-item">
                   <td>
                     <div className="product-name">{p.name}</div>
                     <div className="product-desc">{p.desc}</div>
                   </td>
                   <td>
                     <span className={`category-badge ${p.category === 'Điện tử' ? 'blue' : 'purple'}`}>{p.category}</span>
                   </td>
                   <td data-testid="product-price">${p.price.toFixed(2)}</td>
                   <td>
                     <span className="stock-badge" data-testid="product-quantity">{p.stock} cái</span>
                   </td>
                   <td>
                     <span className="action-icon edit" title="Sửa" onClick={() => handleEditProduct(realIdx)}>✏️</span>
                     <span className="action-icon delete" title="Xóa" onClick={() => handleDeleteProduct(realIdx)}>🗑️</span>
                   </td>
                 </tr>
               );
             })}
                {editIndex !== null && (
                  <div className="modal-overlay">
                    <div className="modal-box">
                      <div className="modal-header">
                        <span>Sửa sản phẩm</span>
                        <button className="modal-close" onClick={()=>setEditIndex(null)}>&times;</button>
                      </div>
                      <div className="modal-desc">Cập nhật thông tin sản phẩm bên dưới.</div>
                      <form className="modal-form" onSubmit={handleEditSubmit}>
                        <div className="modal-group">
                          <label>Tên sản phẩm</label>
                          <input name="name" data-testid="product-name-input" value={editProduct.name} onChange={handleEditChange} placeholder="Nhập tên sản phẩm" />
                        </div>
                        <div className="modal-group">
                          <label>Mô tả</label>
                          <input name="desc" data-testid="product-desc-input" value={editProduct.desc} onChange={handleEditChange} placeholder="Nhập mô tả sản phẩm" />
                        </div>
                        <div className="modal-row">
                          <div className="modal-group">
                            <label>Giá ($)</label>
                            <input name="price" data-testid="product-price-input" type="number" min="0" step="0.01" value={editProduct.price} onChange={handleEditChange} placeholder="0.00" />
                          </div>
                          <div className="modal-group">
                            <label>Tồn kho</label>
                            <input name="stock" data-testid="product-stock-input" type="number" min="0" value={editProduct.stock} onChange={handleEditChange} placeholder="0" />
                          </div>
                        </div>
                        <div className="modal-group">
                          <label>Danh mục</label>
                          <input name="category" data-testid="product-category-input" value={editProduct.category} onChange={handleEditChange} placeholder="Nhập danh mục" />
                        </div>
                        <div className="modal-actions">
                          <button type="button" className="modal-cancel" onClick={()=>setEditIndex(null)}>Hủy</button>
                          <button type="submit" data-testid="product-submit-btn" className="modal-submit">Cập nhật sản phẩm</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
          </tbody>
        </table>
        <div className="product-list-footer">
          Hiển thị 1 đến {filteredProducts.length} trong {products.length} sản phẩm
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <span>Thêm sản phẩm mới</span>
              <button className="modal-close" onClick={()=>setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-desc">Nhập thông tin cho sản phẩm mới.</div>
            <form className="modal-form" onSubmit={handleModalSubmit}>
              <div className="modal-group">
                <label>Tên sản phẩm</label>
                <input name="name" data-testid="product-name-input" value={newProduct.name} onChange={handleModalChange} placeholder="Nhập tên sản phẩm" />
              </div>
              <div className="modal-group">
                <label>Mô tả</label>
                <input name="desc" data-testid="product-desc-input" value={newProduct.desc} onChange={handleModalChange} placeholder="Nhập mô tả sản phẩm" />
              </div>
              <div className="modal-row">
                <div className="modal-group">
                  <label>Giá ($)</label>
                  <input name="price" data-testid="product-price-input" type="number" min="0" step="0.01" value={newProduct.price} onChange={handleModalChange} placeholder="0.00" />
                </div>
                <div className="modal-group">
                  <label>Tồn kho</label>
                  <input name="stock" data-testid="product-stock-input" type="number" min="0" value={newProduct.stock} onChange={handleModalChange} placeholder="0" />
                </div>
              </div>
              <div className="modal-group">
                <label>Danh mục</label>
                <input name="category" data-testid="product-category-input" value={newProduct.category} onChange={handleModalChange} placeholder="Nhập danh mục" />
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" data-testid="product-submit-btn" className="modal-submit">Thêm sản phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast.show && (
        <div className="toast-popup" data-testid="success-message">
          <div className="toast-content" style={{background:'#065f46',color:'#fff'}}>
            <span style={{fontSize:20,marginRight:8}}>✔️</span>
            <div>
              <div style={{fontWeight:600}}> {toast.message.split('\n')[0]} </div>
              <div style={{fontSize:'1rem'}}> {toast.message.split('\n')[1]} </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
