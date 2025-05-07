import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommandeService } from 'src/services/commande.service';

@Component({
  selector: 'app-order-edit-modal',
  templateUrl: './order-edit-modal.component.html',
  styleUrls: ['./order-edit-modal.component.scss']
})
export class OrderEditModalComponent {
  isLoading = false; // Add loading state

  constructor(
    public dialogRef: MatDialogRef<OrderEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public order: any,
    private commandeService: CommandeService
  ) {}

  save(): void {
    this.isLoading = true;
  
    // Ensure status is correctly capitalized before sending to backend
    this.order.status = this.order.status.charAt(0).toUpperCase() + this.order.status.slice(1);
  
    this.commandeService.updateCommande(this.order.id, this.order)
      .subscribe({
        next: (updatedOrder) => {
          this.dialogRef.close(updatedOrder);
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.isLoading = false;
          // Show error message to user if needed
        }
      });
  }
  

  cancel(): void {
    this.dialogRef.close(); // return nothing
  }
}