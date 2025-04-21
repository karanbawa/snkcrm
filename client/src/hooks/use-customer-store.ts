import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Note, CustomerStatus, Priority, CustomerType } from '@/types/customer';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Customer) => Promise<void>;
  editCustomer: (id: string, updatedCustomer: Customer) => void;
  deleteCustomer: (id: string) => void;
  
  // Notes
  addNote: (customerId: string, note: Note) => void;
  deleteNote: (customerId: string, noteId: string) => void;
  toggleKeyNote: (customerId: string, noteId: string) => void;
  
  // Filters
  filterCountry: string;
  setFilterCountry: (country: string) => void;
  
  filterStatus: CustomerStatus | "";
  setFilterStatus: (status: CustomerStatus | "") => void;
  
  filterPriority: Priority | "";
  setFilterPriority: (priority: Priority | "") => void;
  
  filterCustomerType: CustomerType | "";
  setFilterCustomerType: (customerType: CustomerType | "") => void;
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  getFilteredCustomers: () => Customer[];
}

const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],
      
      addCustomer: async (customer) => {
        try {
          const response = await fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
          });
          
          if (!response.ok) {
            throw new Error('Failed to add customer');
          }
          
          const newCustomer = await response.json();
          set(state => ({ 
            customers: [...state.customers, newCustomer] 
          }));
        } catch (error) {
          console.error('Error adding customer:', error);
          throw error;
        }
      },
      
      editCustomer: (id, updatedCustomer) => set(state => ({
        customers: state.customers.map(c => c.id === id ? updatedCustomer : c)
      })),
      
      deleteCustomer: (id) => set(state => ({
        customers: state.customers.filter(c => c.id !== id)
      })),
      
      // Notes
      addNote: (customerId, note) => set(state => ({
        customers: state.customers.map(customer => 
          customer.id === customerId 
            ? { ...customer, notes: [note, ...customer.notes] }
            : customer
        )
      })),
      
      deleteNote: (customerId, noteId) => set(state => ({
        customers: state.customers.map(customer => 
          customer.id === customerId 
            ? { ...customer, notes: customer.notes.filter(note => note.id !== noteId) }
            : customer
        )
      })),
      
      toggleKeyNote: (customerId, noteId) => set(state => ({
        customers: state.customers.map(customer => 
          customer.id === customerId 
            ? { 
                ...customer, 
                notes: customer.notes.map(note => 
                  note.id === noteId 
                    ? { ...note, isKey: !note.isKey }
                    : note
                ) 
              }
            : customer
        )
      })),
      
      // Filters
      filterCountry: "",
      setFilterCountry: (country) => set({ filterCountry: country }),
      
      filterStatus: "",
      setFilterStatus: (status) => set({ filterStatus: status }),
      
      filterPriority: "",
      setFilterPriority: (priority) => set({ filterPriority: priority }),
      
      filterCustomerType: "",
      setFilterCustomerType: (customerType) => set({ filterCustomerType: customerType }),
      
      searchTerm: "",
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      getFilteredCustomers: () => {
        const { customers, filterCountry, filterStatus, filterPriority, filterCustomerType, searchTerm } = get();
        
        return customers.filter(customer => {
          const matchesCountry = !filterCountry || customer.country === filterCountry;
          const matchesStatus = !filterStatus || customer.status === filterStatus;
          const matchesPriority = !filterPriority || customer.priority === filterPriority;
          const matchesCustomerType = !filterCustomerType || customer.customerType === filterCustomerType;
          const matchesSearch = !searchTerm || 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
          
          return matchesCountry && matchesStatus && matchesPriority && matchesCustomerType && matchesSearch;
        });
      }
    }),
    {
      name: 'customer-storage',
    }
  )
);

export default useCustomerStore;
