
import { PROJECTS, MY_ORDERS, MY_TICKETS } from './mockData';
import { Project, Order, SupportTicket, PackageType, TicketReply } from '../types';

// Helper to initialize data from mock if localStorage is empty
const getFromStorage = <T>(key: string, initialData: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

const saveToStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DataManager = {
  // Projects
  getProjects: (): Project[] => getFromStorage('pygenic_projects', PROJECTS),
  
  saveProject: (project: Project) => {
    const projects = DataManager.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.unshift(project);
    }
    saveToStorage('pygenic_projects', projects);
  },

  deleteProject: (id: string) => {
    const projects = DataManager.getProjects().filter(p => p.id !== id);
    saveToStorage('pygenic_projects', projects);
  },

  // Inventory Management
  reduceStock: (projectId: string, packageType: PackageType, quantity: number = 1) => {
    const projects = DataManager.getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index >= 0) {
        const project = projects[index];
        const currentStock = project.inventory[packageType];
        
        // Don't reduce if it's digital (usually unlimited, but we track it as high number) or if already 0
        if (currentStock > 0 && packageType !== PackageType.DIGITAL) {
            project.inventory[packageType] = Math.max(0, currentStock - quantity);
            
            // Check if ANY physical stock is left to set legacy inStock flag (though UI should use inventory now)
            const physicalStock = (project.inventory[PackageType.HARDWARE_KIT] || 0) + (project.inventory[PackageType.FULL_BUILD] || 0);
            project.inStock = physicalStock > 0;
            
            saveToStorage('pygenic_projects', projects);
        }
    }
  },

  // Orders
  getOrders: (): Order[] => getFromStorage('pygenic_orders', MY_ORDERS),
  
  updateOrder: (order: Order) => {
    const orders = DataManager.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
      saveToStorage('pygenic_orders', orders);
    }
  },

  addOrder: (order: Order) => {
      const orders = DataManager.getOrders();
      orders.unshift(order);
      saveToStorage('pygenic_orders', orders);
  },

  // Tickets
  getTickets: (): SupportTicket[] => getFromStorage('pygenic_tickets', MY_TICKETS),
  
  getTicketById: (id: string): SupportTicket | undefined => {
    const tickets = DataManager.getTickets();
    return tickets.find(t => t.id === id);
  },

  addTicket: (ticket: SupportTicket) => {
    const tickets = DataManager.getTickets();
    tickets.unshift(ticket);
    saveToStorage('pygenic_tickets', tickets);
  },

  updateTicket: (ticket: SupportTicket) => {
    const tickets = DataManager.getTickets();
    const index = tickets.findIndex(t => t.id === ticket.id);
    if (index >= 0) {
      tickets[index] = ticket;
      saveToStorage('pygenic_tickets', tickets);
    }
  },

  addReplyToTicket: (ticketId: string, reply: TicketReply) => {
    const tickets = DataManager.getTickets();
    const index = tickets.findIndex(t => t.id === ticketId);
    if (index >= 0) {
      const ticket = tickets[index];
      // Ensure replies array exists
      if (!ticket.replies) ticket.replies = [];
      
      ticket.replies.push(reply);
      ticket.lastUpdated = reply.date;
      
      // If user replies, change status to In Progress if it was Resolved
      if (reply.sender === 'user' && ticket.status === 'Resolved') {
          ticket.status = 'In Progress';
      }

      saveToStorage('pygenic_tickets', tickets);
      return ticket;
    }
    return null;
  },

  // Dashboard Stats
  getStats: () => {
    const orders = DataManager.getOrders();
    const totalRevenue = orders.reduce((sum, o) => {
       const price = o.packageType.includes('Full') ? 3999 : o.packageType.includes('Kit') ? 2499 : 999;
       return sum + price;
    }, 0);
    
    return {
      revenue: totalRevenue,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status !== 'Delivered').length,
      activeTickets: DataManager.getTickets().filter(t => t.status !== 'Resolved').length
    };
  }
};
