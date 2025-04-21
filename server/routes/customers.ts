import express from 'express';
import { Customer, CustomerStorage } from '../storage-mongo';

const router = express.Router();

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const customerData = req.body;
    const customer = await CustomerStorage.createCustomer(customerData);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await CustomerStorage.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

// Get a single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await CustomerStorage.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error getting customer:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await CustomerStorage.updateCustomer(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const success = await CustomerStorage.deleteCustomer(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router; 