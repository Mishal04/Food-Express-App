import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Modal, Badge, Spinner } from 'react-bootstrap';
import { 
  FaPlus, FaCog, FaShoppingCart, FaUtensils, FaChartBar, 
  FaUsers, FaDollarSign, FaBox, FaTrash, FaEdit, FaChevronRight, FaCloudUploadAlt 
} from 'react-icons/fa';
import { menuService, orderService } from '../services/firebaseService';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalItems: 0,
    activeCustomers: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'pizza',
    isVegetarian: 'false',
    popular: 'false',
    image: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [items, allOrders] = await Promise.all([
        menuService.getAllMenuItems(),
        orderService.getAllOrders()
      ]);
      
      setMenuItems(items);
      setOrders(allOrders);
      
      // Calculate real stats
      const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const uniqueCustomers = new Set(allOrders.map(o => o.userId)).size;
      
      setStats({
        totalRevenue: revenue,
        totalOrders: allOrders.length,
        totalItems: items.length,
        activeCustomers: uniqueCustomers
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `menu_images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        console.error("Upload Error:", error);
        alert(`❌ Upload Failed: ${error.code}\n\nCheck your Firebase Storage Rules!`);
        setUploading(false);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData(prev => ({ ...prev, image: downloadURL }));
          alert("✅ Upload Successful!");
          setUploading(false);
        });
      }
    );
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVegetarian: item.isVegetarian.toString(),
      popular: (item.popular || false).toString(),
      image: item.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item? This cannot be undone.')) {
      try {
        await menuService.deleteMenuItem(id);
        fetchData();
      } catch (error) {
        alert('Error deleting: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      price: parseFloat(formData.price),
      isVegetarian: formData.isVegetarian === 'true',
      popular: formData.popular === 'true'
    };

    try {
      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, itemData);
      } else {
        await menuService.addMenuItem(itemData);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '#ff7a00';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6366f1';
    }
  };

  return (
    <div className="admin-layout">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="admin-sidebar d-none d-lg-flex">
        <div className="mb-5 px-3">
          <h3 className="fw-900 text-white mb-0">Food<span className="text-accent">Express</span></h3>
          <p className="text-muted small">Admin Dashboard</p>
        </div>
        
        <nav className="flex-grow-1">
          <div className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <FaChartBar /> <span>Overview</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <FaShoppingCart /> <span>Orders</span>
          </div>
          <div className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
            <FaUtensils /> <span>Menu Management</span>
          </div>
        </nav>

        <div className="admin-nav-item mt-auto" onClick={() => window.location.href = '/'}>
           <span>Back to Site</span> <FaChevronRight size={12} />
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="admin-main">
        <header className="mb-5 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-900 mb-1">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Order Management'}
              {activeTab === 'menu' && 'Menu Settings'}
            </h1>
            <p className="text-muted">Welcome back, Mishal</p>
          </div>
          <div className="d-flex gap-3">
            {activeTab === 'menu' && (
              <Button className="btn-accent px-4 py-2 rounded-3 fw-bold border-0" onClick={() => { setEditingItem(null); setShowModal(true); }}>
                <FaPlus className="me-2" /> Add Item
              </Button>
            )}
            <Button variant="outline-secondary" onClick={fetchData} className="rounded-3">Refresh</Button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          <>
            {/* ── Overview Tab ────────────────────────────────── */}
            {activeTab === 'overview' && (
              <section className="animate-fade-in">
                <Row className="gy-4 mb-5">
                  <Col md={3}>
                    <div className="stat-card-premium">
                      <div className="stat-icon-box" style={{ background: 'rgba(255, 122, 0, 0.1)', color: '#ff7a00' }}>
                        <FaDollarSign />
                      </div>
                      <h6 className="text-muted mb-1 fw-bold">Total Revenue</h6>
                      <h3 className="fw-900 mb-0">${stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="stat-card-premium">
                      <div className="stat-icon-box" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                        <FaShoppingCart />
                      </div>
                      <h6 className="text-muted mb-1 fw-bold">Total Orders</h6>
                      <h3 className="fw-900 mb-0">{stats.totalOrders}</h3>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="stat-card-premium">
                      <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                        <FaUsers />
                      </div>
                      <h6 className="text-muted mb-1 fw-bold">Customers</h6>
                      <h3 className="fw-900 mb-0">{stats.activeCustomers}</h3>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="stat-card-premium">
                      <div className="stat-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                        <FaBox />
                      </div>
                      <h6 className="text-muted mb-1 fw-bold">Menu Items</h6>
                      <h3 className="fw-900 mb-0">{stats.totalItems}</h3>
                    </div>
                  </Col>
                </Row>

                <Card className="table-premium border-0">
                  <Card.Header className="bg-transparent p-4 border-0">
                    <h5 className="fw-900 mb-0">Recent Activity</h5>
                  </Card.Header>
                  <div className="table-responsive">
                    <Table className="mb-0 align-middle">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id}>
                            <td className="fw-800">{o.orderId}</td>
                            <td>{o.customerInfo?.name || 'Guest'}</td>
                            <td className="fw-900">${(o.total || 0).toFixed(2)}</td>
                            <td>
                              <span className="badge-status" style={{ background: `${getStatusColor(o.status)}20`, color: getStatusColor(o.status) }}>
                                {o.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </section>
            )}

            {/* ── Orders Tab ──────────────────────────────────── */}
            {activeTab === 'orders' && (
              <section className="animate-fade-in">
                <Card className="table-premium border-0">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id}>
                            <td className="fw-800">{o.orderId}</td>
                            <td>
                              <div className="fw-bold">{o.customerInfo?.name}</div>
                              <div className="text-muted small">{o.customerInfo?.phone}</div>
                            </td>
                            <td>
                              {o.items?.map((it, i) => (
                                <div key={i} className="small text-muted">• {it.name} (x{it.quantity})</div>
                              ))}
                            </td>
                            <td className="fw-900">${(o.total || 0).toFixed(2)}</td>
                            <td className="small">{new Date(o.orderDate).toLocaleDateString()}</td>
                            <td>
                               <span className="badge-status" style={{ background: `${getStatusColor(o.status)}20`, color: getStatusColor(o.status) }}>
                                {o.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </section>
            )}

            {/* ── Menu Tab ────────────────────────────────────── */}
            {activeTab === 'menu' && (
              <section className="animate-fade-in">
                <Row className="gy-4">
                  {menuItems.map(item => (
                    <Col md={6} xl={4} key={item.id}>
                      <Card className="stat-card-premium h-100">
                        <div className="d-flex gap-3">
                          <img src={item.image} alt="" className="rounded-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                          <div className="flex-grow-1">
                            <h6 className="fw-900 mb-1">{item.name}</h6>
                            <p className="text-muted small mb-2">{item.category}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-900 text-accent">${item.price.toFixed(2)}</span>
                              <div className="d-flex gap-2">
                                <Button variant="none" className="p-2 text-muted hover-accent" onClick={() => handleEdit(item)}><FaEdit /></Button>
                                <Button variant="none" className="p-2 text-muted hover-danger" onClick={() => handleDelete(item.id)}><FaTrash /></Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </section>
            )}
          </>
        )}
      </main>

      {/* ── Management Modal ───────────────────────────────── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg dark-surface">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="border-0 p-4">
            <Modal.Title className="fw-900">{editingItem ? 'Edit Dish' : 'Add New Dish'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 pt-0">
            <Form.Group className="mb-3">
              <Form.Label className="form-label-premium">Dish Name</Form.Label>
              <Form.Control className="form-control-premium" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-premium">Price ($)</Form.Label>
                  <Form.Control className="form-control-premium" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-premium">Category</Form.Label>
                  <Form.Select className="form-control-premium" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burger</option>
                    <option value="salad">Salad</option>
                    <option value="pasta">Pasta</option>
                    <option value="indian">Indian</option>
                    <option value="asian">Asian</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-premium">Dish Image</Form.Label>
              <div className="d-flex flex-column gap-2">
                <div className="upload-box-premium p-3 text-center border rounded-3 position-relative" style={{ background: 'rgba(0,0,0,0.02)', borderStyle: 'dashed !important' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="py-2">
                      <Spinner animation="border" size="sm" variant="warning" className="me-2" />
                      <span className="small fw-bold">Uploading...</span>
                    </div>
                  ) : (
                    <div className="py-2 text-muted">
                      <FaCloudUploadAlt size={24} className="mb-1 d-block mx-auto" />
                      <span className="small fw-bold">Click to upload from PC</span>
                    </div>
                  )}
                </div>
                <div className="text-center text-muted small fw-bold">OR</div>
                <Form.Control 
                  className="form-control-premium" 
                  type="url" 
                  placeholder="Paste image URL here"
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})} 
                  required 
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="form-label-premium">Description</Form.Label>
              <Form.Control as="textarea" rows={3} className="form-control-premium" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
            </Form.Group>
            <div className="d-flex gap-3">
              <Form.Check type="checkbox" label="Vegetarian" checked={formData.isVegetarian === 'true'} onChange={(e) => setFormData({...formData, isVegetarian: e.target.checked.toString()})} />
              <Form.Check type="checkbox" label="Popular" checked={formData.popular === 'true'} onChange={(e) => setFormData({...formData, popular: e.target.checked.toString()})} />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 p-4">
            <Button variant="none" className="fw-bold text-muted" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" className="btn-accent px-4 py-2 border-0 rounded-3 fw-bold">
              {editingItem ? 'Update Dish' : 'Save Dish'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;