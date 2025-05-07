import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/services/commande.service';
import { AuthService } from 'src/services/auth.service';
import { OrderEditModalComponent } from 'src/app/components/order-edit-modal/order-edit-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  openOrderEditModal(order: any): void {
    const dialogRef = this.dialog.open(OrderEditModalComponent, {
      width: '600px',
      data: { ...order } // Pass a copy of the order
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commandeService.updateCommande(order.id, result).subscribe({
          next: () => this.loadCommandes(), // Refresh the list after update
          error: err => console.error('Error updating order:', err)
        });
      }
    });
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
            clientName: user?.name || 'Unknown',
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

  private getProductSummary(lignes: any[]): string {
    if (!lignes || lignes.length === 0) return 'No items';
    return lignes.length === 1 ? '1 item' : `${lignes.length} items`;
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.commandeService.updateOrderStatus(orderId, 'cancelled').subscribe({
        next: () => this.loadCommandes(),
        error: err => console.error('Error cancelling order:', err)
      });
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