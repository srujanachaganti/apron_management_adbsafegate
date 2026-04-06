import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  UsersService,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from '../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <div class="page-header">
        <h1>👥 User Management</h1>
        <button class="btn btn-primary" (click)="showAddForm()">
          ➕ Add User
        </button>
      </div>

      <!-- User Form Modal -->
      <div class="modal-overlay" *ngIf="showForm()">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isEditing() ? '✏️ Edit User' : '➕ Add New User' }}</h2>
            <button class="close-btn" (click)="closeForm()">&times;</button>
          </div>

          <form (ngSubmit)="onSubmit()" class="user-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  [(ngModel)]="formData.firstName"
                  name="firstName"
                  required
                />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  [(ngModel)]="formData.lastName"
                  name="lastName"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="formData.email"
                name="email"
                required
              />
            </div>

            <div class="form-group" *ngIf="!isEditing()">
              <label for="password">Password *</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="formData.password"
                name="password"
                [required]="!isEditing()"
                minlength="6"
              />
            </div>

            <div class="form-group" *ngIf="isEditing()">
              <label for="newPassword">New Password (leave empty to keep current)</label>
              <input
                type="password"
                id="newPassword"
                [(ngModel)]="formData.password"
                name="newPassword"
                minlength="6"
              />
            </div>

            <div class="form-group">
              <label for="role">Role *</label>
              <select id="role" [(ngModel)]="formData.role" name="role" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeForm()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                {{ isSaving() ? 'Saving...' : isEditing() ? 'Update User' : 'Create User' }}
              </button>
            </div>

            <div *ngIf="formError()" class="error-message">
              {{ formError() }}
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showDeleteConfirm()">
        <div class="modal modal-small">
          <div class="modal-header">
            <h2>⚠️ Confirm Delete</h2>
            <button class="close-btn" (click)="cancelDelete()">&times;</button>
          </div>
          <p>
            Are you sure you want to delete user
            <strong>{{ userToDelete()?.email }}</strong>? This action cannot be undone.
          </p>
          <div class="form-actions">
            <button class="btn btn-secondary" (click)="cancelDelete()">Cancel</button>
            <button class="btn btn-danger" (click)="confirmDelete()">Delete</button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="usersService.isLoading()" class="loading">
        <p>Loading users...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="usersService.error()" class="error-message">
        {{ usersService.error() }}
      </div>

      <!-- Users Table -->
      <div class="table-container" *ngIf="!usersService.isLoading()">
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of usersService.users()">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" [class.badge-admin]="user.role === 'admin'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span
                  class="status-badge"
                  [class.active]="user.isActive"
                  [class.inactive]="!user.isActive"
                >
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>{{ user.createdAt | date : 'short' }}</td>
              <td class="actions">
                <button
                  class="btn btn-sm btn-icon"
                  title="Edit user"
                  (click)="editUser(user)"
                >
                  ✏️
                </button>
                <button
                  class="btn btn-sm btn-icon"
                  [title]="user.isActive ? 'Deactivate user' : 'Activate user'"
                  (click)="toggleStatus(user)"
                >
                  {{ user.isActive ? '🔒' : '🔓' }}
                </button>
                <button
                  class="btn btn-sm btn-icon btn-danger"
                  title="Delete user"
                  (click)="deleteUser(user)"
                >
                  🗑️
                </button>
              </td>
            </tr>
            <tr *ngIf="usersService.users().length === 0">
              <td colspan="6" class="empty-state">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .users-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        margin: 0;
        color: #333;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      }

      .modal-small {
        max-width: 400px;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .modal-header h2 {
        margin: 0;
        color: #333;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        transition: color 0.3s;
      }

      .close-btn:hover {
        color: #333;
      }

      .user-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-weight: 600;
        color: #555;
      }

      .form-group input,
      .form-group select {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .btn-secondary {
        background: #e9ecef;
        color: #495057;
      }

      .btn-secondary:hover {
        background: #dee2e6;
      }

      .btn-danger {
        background: #dc3545;
        color: white;
      }

      .btn-danger:hover {
        background: #c82333;
      }

      .btn-sm {
        padding: 0.4rem 0.75rem;
        font-size: 0.875rem;
      }

      .btn-icon {
        padding: 0.4rem;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
      }

      .btn-icon:hover {
        background: #e9ecef;
      }

      .btn-icon.btn-danger {
        background: #f8f9fa;
        color: #dc3545;
        border-color: #e9ecef;
      }

      .btn-icon.btn-danger:hover {
        background: #dc3545;
        color: white;
      }

      .table-container {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .users-table {
        width: 100%;
        border-collapse: collapse;
      }

      .users-table th,
      .users-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
      }

      .users-table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #495057;
      }

      .users-table tr:hover {
        background: #f8f9fa;
      }

      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
        background: #e9ecef;
        color: #495057;
        text-transform: capitalize;
      }

      .badge-admin {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .status-badge.active {
        background: #d4edda;
        color: #155724;
      }

      .status-badge.inactive {
        background: #f8d7da;
        color: #721c24;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .loading,
      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
      }

      .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 0.75rem;
        border-radius: 6px;
        margin-top: 1rem;
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .users-table {
          font-size: 0.9rem;
        }

        .users-table th,
        .users-table td {
          padding: 0.75rem 0.5rem;
        }
      }
    `,
  ],
})
export class UsersComponent implements OnInit {
  showForm = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  formError = signal<string | null>(null);
  showDeleteConfirm = signal(false);
  userToDelete = signal<User | null>(null);
  editingUserId = signal<string | null>(null);

  formData: CreateUserRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
  };

  constructor(public usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.loadUsers();
  }

  showAddForm(): void {
    this.resetForm();
    this.isEditing.set(false);
    this.showForm.set(true);
  }

  editUser(user: User): void {
    this.formData = {
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    this.editingUserId.set(user.id);
    this.isEditing.set(true);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'user',
    };
    this.editingUserId.set(null);
    this.formError.set(null);
  }

  onSubmit(): void {
    this.isSaving.set(true);
    this.formError.set(null);

    if (this.isEditing()) {
      const updateData: UpdateUserRequest = {
        email: this.formData.email,
        firstName: this.formData.firstName,
        lastName: this.formData.lastName,
        role: this.formData.role,
      };

      // Only include password if provided
      if (this.formData.password) {
        updateData.password = this.formData.password;
      }

      this.usersService.updateUser(this.editingUserId()!, updateData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeForm();
        },
        error: (error) => {
          this.isSaving.set(false);
          this.formError.set(error.error?.message || 'Failed to update user');
        },
      });
    } else {
      this.usersService.createUser(this.formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeForm();
        },
        error: (error) => {
          this.isSaving.set(false);
          this.formError.set(error.error?.message || 'Failed to create user');
        },
      });
    }
  }

  deleteUser(user: User): void {
    this.userToDelete.set(user);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete(): void {
    this.userToDelete.set(null);
    this.showDeleteConfirm.set(false);
  }

  confirmDelete(): void {
    const user = this.userToDelete();
    if (user) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
          this.cancelDelete();
        },
      });
    }
  }

  toggleStatus(user: User): void {
    this.usersService.toggleUserStatus(user.id).subscribe({
      error: (error) => {
        console.error('Failed to toggle user status:', error);
      },
    });
  }
}
