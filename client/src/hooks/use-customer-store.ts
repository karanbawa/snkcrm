import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Note, CustomerStatus, Priority, CustomerType } from '@/types/customer';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
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
      
      addCustomer: (customer) => set(state => ({ 
        customers: [...state.customers, customer] 
      })),
      
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
        const { 
          customers, 
          filterCountry, 
          filterStatus, 
          filterPriority, 
          filterCustomerType,
          searchTerm 
        } = get();
        
        return customers.filter(customer => {
          // Apply filters
          if (filterCountry && customer.country !== filterCountry) return false;
          if (filterStatus && customer.status !== filterStatus) return false;
          if (filterPriority && customer.priority !== filterPriority) return false;
          if (filterCustomerType && customer.customerType !== filterCustomerType) return false;
          
          // Apply search
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            
            // Search by name
            const nameMatch = customer.name.toLowerCase().includes(searchLower);
            
            // Search by tags
            const tagMatch = customer.tags.some(tag => 
              tag.toLowerCase().includes(searchLower)
            );
            
            // Search by requirements
            const requirementsMatch = customer.requirements.toLowerCase().includes(searchLower);
            
            return nameMatch || tagMatch || requirementsMatch;
          }
          
          return true;
        });
      }
    }),
    {
      name: 'customer-storage',
    }
  )
);

export default useCustomerStore;
