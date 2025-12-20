import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Table, 
  Modal,
  Alert,
  Spinner,
  Tabs,
  Tab,
  Badge
} from 'react-bootstrap';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaCog, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar,
  FaSave,
  FaTimes,
  FaEye,
  FaFilter,
  FaUtensils  
} from 'react-icons/fa';
import { menuService, orderService } from '../services/firebaseService';

const AdminPage = () => {
  // States
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ menu: true, orders: true });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'pizza',
    isVegetarian: 'false',
    image: '',
    popular: 'false'
  });

  // Categories
  const categories = [
    'pizza', 'burger', 'salad', 'pasta', 
    'indian', 'asian', 'dessert', 'beverage'
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
  }, []);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(prev => ({ ...prev, menu: true }));
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalItems: items.length
      }));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      alert('Error loading menu items: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, menu: false }));
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      // For now, we'll use mock data. You can implement real order fetching later
      const mockOrders = [
        {
          id: '1',
          orderId: 'ORD-001',
          customer: 'John Doe',
          email: 'john@example.com',
          items: ['Margherita Pizza', 'Coke'],
          total: 15.98,
          status: 'pending',
          date: '2024-01-15'
        },
        {
          id: '2',
          orderId: 'ORD-002',
          customer: 'Jane Smith',
          email: 'jane@example.com',
          items: ['Cheeseburger', 'Fries'],
          total: 12.99,
          status: 'delivered',
          date: '2024-01-14'
        }
      ];
      setOrders(mockOrders);
      
      // Calculate stats
      const pending = mockOrders.filter(o => o.status === 'pending').length;
      const revenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
      
      setStats(prev => ({
        ...prev,
        totalOrders: mockOrders.length,
        totalRevenue: revenue,
        pendingOrders: pending
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      isVegetarian: formData.isVegetarian === 'true',
      popular: formData.popular === 'true',
      image: formData.image
    };

    try {
      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, itemData);
        alert('✅ Item updated successfully!');
      } else {
        await menuService.addMenuItem(itemData);
        alert('✅ Item added successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchMenuItems();
      
    } catch (error) {
      console.error("Error saving item:", error);
      alert('❌ Error saving item: ' + error.message);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVegetarian: item.isVegetarian.toString(),
      popular: item.popular?.toString() || 'false',
      image: item.image
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuService.deleteMenuItem(id);
        alert('✅ Item deleted successfully!');
        fetchMenuItems();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert('❌ Error deleting item: ' + error.message);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'pizza',
      isVegetarian: 'false',
      image: '',
      popular: 'false'
    });
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="text-warning">
            <FaCog className="me-2" />
            Admin Dashboard
          </h1>
          <p className="text-muted">Manage your restaurant operations</p>
        </Col>
        <Col className="text-end">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="me-2"
          >
            <FaFilter /> Refresh
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="text-warning">{stats.totalItems}</h2>
              <p className="text-muted mb-0">Menu Items</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="text-warning">{stats.totalOrders}</h2>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="text-warning">${stats.totalRevenue.toFixed(2)}</h2>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="text-warning">{stats.pendingOrders}</h2>
              <p className="text-muted mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        <Tab eventKey="menu" title={
          <>
            <FaUtensils className="me-1" />
            Menu Management
          </>
        }>
          {/* Menu Management Section */}
          <Card className="shadow border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Menu Items</h5>
                <Button 
                  variant="warning" 
                  onClick={() => { resetForm(); setShowModal(true); }}
                >
                  <FaPlus className="me-1" /> Add New Item
                </Button>
              </div>

              {loading.menu ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2">Loading menu items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No menu items found. Add your first item!
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead className="table-light">
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item.id}>
                          <td>
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{ 
                                width: '50px', 
                                height: '50px', 
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50x50?text=Image';
                              }}
                            />
                          </td>
                          <td>
                            <div>
                              <strong>{item.name}</strong>
                              <div className="small text-muted">{item.description.substring(0, 50)}...</div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="secondary">{item.category}</Badge>
                            {item.popular && (
                              <Badge bg="danger" className="ms-1">Popular</Badge>
                            )}
                          </td>
                          <td>
                            <strong>${item.price.toFixed(2)}</strong>
                          </td>
                          <td>
                            {item.isVegetarian ? (
                              <Badge bg="success">Vegetarian</Badge>
                            ) : (
                              <Badge bg="secondary">Non-Veg</Badge>
                            )}
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => handleEdit(item)}
                              title="Edit"
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="orders" title={
          <>
            <FaShoppingCart className="me-1" />
            Orders Management
          </>
        }>
          {/* Orders Management Section */}
          <Card className="shadow border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Recent Orders</h5>
                <Button variant="outline-secondary" size="sm">
                  <FaFilter className="me-1" /> Filter
                </Button>
              </div>

              {loading.orders ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No orders found.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>
                            <strong>{order.orderId}</strong>
                          </td>
                          <td>
                            <div>
                              <div>{order.customer}</div>
                              <small className="text-muted">{order.email}</small>
                            </div>
                          </td>
                          <td>
                            <div className="small">
                              {order.items.map((item, idx) => (
                                <div key={idx}>• {item}</div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong>${order.total.toFixed(2)}</strong>
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(order.status)}>
                              {order.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td>{order.date}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              <Button 
                                variant="outline-info" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                disabled={order.status !== 'pending'}
                              >
                                Prepare
                              </Button>
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                disabled={order.status === 'delivered'}
                              >
                                Deliver
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title={
          <>
            <FaChartBar className="me-1" />
            Analytics
          </>
        }>
          {/* Analytics Section */}
          <Card className="shadow border-0">
            <Card.Body>
              <h5 className="mb-4">Restaurant Analytics</h5>
              
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Body>
                      <h6>Category Distribution</h6>
                      <div className="mt-3">
                        {categories.map(category => {
                          const count = menuItems.filter(item => item.category === category).length;
                          const percentage = menuItems.length > 0 ? (count / menuItems.length * 100).toFixed(1) : 0;
                          
                          return (
                            <div key={category} className="mb-2">
                              <div className="d-flex justify-content-between">
                                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                <span>{count} items ({percentage}%)</span>
                              </div>
                              <div className="progress" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h6>Quick Actions</h6>
                      <div className="mt-3">
                        <Button 
                          variant="outline-warning" 
                          className="w-100 mb-2"
                          onClick={() => setActiveTab('menu')}
                        >
                          <FaPlus className="me-2" />
                          Add New Menu Item
                        </Button>
                        
                        <Button 
                          variant="outline-info" 
                          className="w-100 mb-2"
                          onClick={fetchMenuItems}
                        >
                          <FaFilter className="me-2" />
                          Refresh All Data
                        </Button>
                        
                        <Button 
                          variant="outline-success" 
                          className="w-100"
                          onClick={() => {
                            // Export data functionality can be added here
                            alert('Export feature coming soon!');
                          }}
                        >
                          Export Data
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Margherita Pizza"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe the item..."
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price * ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="9.99"
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Vegetarian</Form.Label>
                  <Form.Select
                    name="isVegetarian"
                    value={formData.isVegetarian}
                    onChange={handleChange}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Popular Item</Form.Label>
                  <Form.Select
                    name="popular"
                    value={formData.popular}
                    onChange={handleChange}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
              />
              <Form.Text className="text-muted">
                Use high-quality food images from Unsplash
              </Form.Text>
            </Form.Group>
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-3">
                <h6>Image Preview:</h6>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <FaTimes className="me-1" /> Cancel
            </Button>
            <Button variant="warning" type="submit">
              <FaSave className="me-1" /> {editingItem ? 'Update' : 'Save'} Item
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminPage;