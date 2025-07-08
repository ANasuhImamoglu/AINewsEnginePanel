import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  exports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatPaginatorModule
  ]
})
export class MaterialModule {}
