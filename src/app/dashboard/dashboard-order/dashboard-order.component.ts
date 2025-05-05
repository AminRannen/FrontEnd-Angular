import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/services/commande.service';
import { AuthService } from 'src/services/auth.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard-order',
  templateUrl: './dashboard-order.component.html',
  styleUrls: ['./dashboard-order.component.scss']
})
export class DashboardOrderComponent implements OnInit {
  orders: any[] = [];
  isLoading: boolean = true;

  statusOptions = [
    { value: 'pending', display: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', display: 'Processing', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', display: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', display: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.isLoading = true;
    this.commandeService.getAllCommandes().subscribe({
      next: async (data) => {
        this.orders = [];
        for (const order of data) {
          const user = await this.authService.getUserById(order.user_id).toPromise();
          this.orders.push({
            ...order,
            total: parseFloat(order.total).toFixed(2),
            date: new Date(order.date_commande),
            productSummary: this.getProductSummary(order.ligne_commandes),
            status: order.status.toLowerCase(),
            originalStatus: order.status.toLowerCase(),
            clientName: user?.name || 'Unknown',
            isEditingStatus: false,
            statusColor: this.getStatusColor(order.status.toLowerCase())
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  private getStatusColor(status: string): string {
    const foundStatus = this.statusOptions.find(s => s.value === status);
    return foundStatus ? foundStatus.color : 'bg-gray-100 text-gray-800';
  }

  toggleEditStatus(order: any): void {
    order.isEditingStatus = !order.isEditingStatus;
    if (!order.isEditingStatus) {
      order.status = order.originalStatus;
    }
  }

  updateOrderStatus(order: any): void {
    if (order.status === order.originalStatus) {
      order.isEditingStatus = false;
      return;
    }

    const updatedData = {
      user_id: order.user_id,
      date_commande: order.date.toISOString().split('T')[0],
      total: order.total,
      status: order.status
    };

    this.commandeService.updateCommande(order.id, updatedData).subscribe({
      next: () => {
        order.originalStatus = order.status;
        order.statusColor = this.getStatusColor(order.status);
        order.isEditingStatus = false;
      },
      error: (err) => {
        console.error('Error updating full order:', err);
        order.status = order.originalStatus;
        order.isEditingStatus = false;
      }
    });
  }

  private getProductSummary(lignes: any[]): string {
    if (!lignes || lignes.length === 0) return 'No items';
    return lignes.length === 1 ? '1 item' : `${lignes.length} items`;
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
        this.updateOrderStatus(order);
      }
    }
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.commandeService.deleteCommande(orderId).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== orderId);
        },
        error: (err) => console.error('Error deleting order:', err)
      });
    }
  }
}
