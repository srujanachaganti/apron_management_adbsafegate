import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StandAssignmentsService } from '../../services/stand-assignments.service';
import { StandsService } from '../../services/stands.service';
import { FlightPlansService } from '../../services/flight-plans.service';
import { StandAssignment, CreateStandAssignmentRequest } from '../../models/stand-assignment.model';
import { Stand } from '../../models/stand.model';
import { FlightPlan } from '../../models/flight-plan.model';

@Component({
  selector: 'app-stand-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="stand-assignments">
      <h2>Stand Assignments</h2>

      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-row">
          <select [(ngModel)]="filterStandId" class="filter-select">
            <option value="">All Stands</option>
            <option *ngFor="let stand of stands()" [value]="stand.stand">
              {{ stand.stand }} ({{ stand.terminal || 'N/A' }})
            </option>
          </select>

          <input
            type="datetime-local"
            [(ngModel)]="filterFrom"
            class="filter-input"
            placeholder="From"
          />

          <input
            type="datetime-local"
            [(ngModel)]="filterTo"
            class="filter-input"
            placeholder="To"
          />

          <button (click)="loadAssignments()" class="filter-btn">Filter</button>
          <button (click)="resetFilters()" class="reset-btn">Reset</button>
        </div>
      </div>

      <!-- Create Assignment Section -->
      <div class="create-section">
        <h3>Create New Assignment</h3>
        <div class="create-form">
          <div class="form-row">
            <label>Flight Plan:</label>
            <select [(ngModel)]="newAssignment.flightPlanId" class="form-select">
              <option [ngValue]="0">-- Select Flight Plan --</option>
              <option *ngFor="let fp of flightPlans()" [ngValue]="fp.id">
                {{ fp.calculatedCallsign }} (ID: {{ fp.id }})
              </option>
            </select>
          </div>

          <div class="form-row">
            <label>Stand:</label>
            <select [(ngModel)]="newAssignment.standId" class="form-select">
              <option value="">-- Select Stand --</option>
              <option *ngFor="let stand of stands()" [value]="stand.stand">
                {{ stand.stand }} - {{ stand.apron }} ({{ stand.terminal || 'N/A' }})
              </option>
            </select>
          </div>

          <div class="form-row">
            <label>From Time:</label>
            <input
              type="datetime-local"
              [(ngModel)]="newAssignment.fromTime"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <label>To Time:</label>
            <input
              type="datetime-local"
              [(ngModel)]="newAssignment.toTime"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <label>Remarks:</label>
            <input
              type="text"
              [(ngModel)]="newAssignment.remarks"
              class="form-input"
              placeholder="Optional remarks"
            />
          </div>

          <div class="form-actions">
            <button
              (click)="checkAvailabilityBeforeCreate()"
              class="check-btn"
              [disabled]="!canCreate()"
            >
              Check Availability
            </button>
            <button
              (click)="createAssignment()"
              class="create-btn"
              [disabled]="!canCreate()"
            >
              Create Assignment
            </button>
          </div>

          <div *ngIf="availabilityMessage()" class="availability-message" [class.error]="!isAvailable()">
            {{ availabilityMessage() }}
          </div>

          <div *ngIf="errorMessage()" class="error-message">
            {{ errorMessage() }}
          </div>

          <div *ngIf="successMessage()" class="success-message">
            {{ successMessage() }}
          </div>
        </div>
      </div>

      <!-- Assignments List -->
      <div class="assignments-section">
        <h3>Current Assignments</h3>
        <div *ngIf="loading()" class="loading">Loading...</div>

        <table *ngIf="!loading() && assignments().length > 0; else noData">
          <thead>
            <tr>
              <th>Stand</th>
              <th>Flight</th>
              <th>From</th>
              <th>To</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let assignment of assignments()">
              <td>
                <strong>{{ assignment.standId }}</strong>
                <br />
                <small>{{ assignment.stand?.apron || '-' }}</small>
              </td>
              <td>
                <a [routerLink]="['/flight-plans', assignment.flightPlanId]" class="flight-link">
                  {{ assignment.flightPlan?.calculatedCallsign || 'Flight #' + assignment.flightPlanId }}
                </a>
                <br />
                <small>{{ assignment.flightPlan?.flightPlanType || '-' }}</small>
              </td>
              <td>{{ assignment.fromTime | date: 'short' }}</td>
              <td>{{ assignment.toTime | date: 'short' }}</td>
              <td>{{ assignment.remarks || '-' }}</td>
              <td>
                <button (click)="deleteAssignment(assignment.id)" class="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <ng-template #noData>
          <p *ngIf="!loading()" class="no-data">No assignments found</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .stand-assignments {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      h2 {
        color: #333;
        margin-bottom: 1.5rem;
      }

      h3 {
        color: #555;
        margin-bottom: 1rem;
        border-bottom: 2px solid #667eea;
        padding-bottom: 0.5rem;
      }

      .filter-section,
      .create-section,
      .assignments-section {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
      }

      .filter-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
      }

      .filter-select,
      .filter-input {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;
      }

      .filter-btn,
      .reset-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
      }

      .filter-btn {
        background: #667eea;
        color: white;
      }

      .reset-btn {
        background: #ddd;
        color: #333;
      }

      .create-form {
        display: grid;
        gap: 1rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 120px 1fr;
        align-items: center;
        gap: 1rem;
      }

      .form-row label {
        font-weight: 600;
        color: #555;
      }

      .form-select,
      .form-input {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.95rem;
      }

      .form-select:focus,
      .form-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .check-btn,
      .create-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .check-btn {
        background: #f0ad4e;
        color: white;
      }

      .check-btn:hover:not(:disabled) {
        background: #ec971f;
      }

      .create-btn {
        background: #28a745;
        color: white;
      }

      .create-btn:hover:not(:disabled) {
        background: #218838;
      }

      .check-btn:disabled,
      .create-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .availability-message {
        padding: 0.75rem;
        border-radius: 4px;
        background: #d4edda;
        color: #155724;
        margin-top: 1rem;
      }

      .availability-message.error {
        background: #f8d7da;
        color: #721c24;
      }

      .error-message {
        padding: 0.75rem;
        border-radius: 4px;
        background: #f8d7da;
        color: #721c24;
        margin-top: 1rem;
      }

      .success-message {
        padding: 0.75rem;
        border-radius: 4px;
        background: #d4edda;
        color: #155724;
        margin-top: 1rem;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: #667eea;
        font-weight: 600;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th {
        background: #f5f5f5;
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid #ddd;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }

      tr:hover {
        background: #f9f9f9;
      }

      .flight-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
      }

      .flight-link:hover {
        text-decoration: underline;
      }

      .delete-btn {
        padding: 0.5rem 1rem;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
      }

      .delete-btn:hover {
        background: #c82333;
      }

      .no-data {
        text-align: center;
        padding: 2rem;
        color: #888;
      }

      small {
        color: #888;
      }
    `,
  ],
})
export class StandAssignmentsComponent implements OnInit {
  // State signals
  assignments = signal<StandAssignment[]>([]);
  stands = signal<Stand[]>([]);
  flightPlans = signal<FlightPlan[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  availabilityMessage = signal<string | null>(null);
  isAvailable = signal(true);

  // Filter state
  filterStandId = '';
  filterFrom = '';
  filterTo = '';

  // New assignment form state
  newAssignment: CreateStandAssignmentRequest = {
    flightPlanId: 0,
    standId: '',
    fromTime: '',
    toTime: '',
    remarks: '',
  };

  constructor(
    private standAssignmentsService: StandAssignmentsService,
    private standsService: StandsService,
    private flightPlansService: FlightPlansService,
  ) {}

  ngOnInit() {
    this.loadStands();
    this.loadFlightPlans();
    this.loadAssignments();
  }

  loadStands() {
    this.standsService.getAll().subscribe({
      next: (response) => {
        this.stands.set(response.data);
      },
      error: (err) => console.error('Error loading stands:', err),
    });
  }

  loadFlightPlans() {
    this.flightPlansService.getAll(1, 200).subscribe({
      next: (response) => {
        this.flightPlans.set(response.data);
      },
      error: (err) => console.error('Error loading flight plans:', err),
    });
  }

  loadAssignments() {
    this.loading.set(true);
    this.errorMessage.set(null);

    const params: any = {};
    if (this.filterStandId) params.standId = this.filterStandId;
    if (this.filterFrom) params.from = new Date(this.filterFrom).toISOString();
    if (this.filterTo) params.to = new Date(this.filterTo).toISOString();

    this.standAssignmentsService.getAll(params).subscribe({
      next: (data) => {
        this.assignments.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading assignments:', err);
        this.loading.set(false);
      },
    });
  }

  resetFilters() {
    this.filterStandId = '';
    this.filterFrom = '';
    this.filterTo = '';
    this.loadAssignments();
  }

  canCreate(): boolean {
    return (
      this.newAssignment.flightPlanId > 0 &&
      this.newAssignment.standId !== '' &&
      this.newAssignment.fromTime !== '' &&
      this.newAssignment.toTime !== ''
    );
  }

  checkAvailabilityBeforeCreate() {
    if (!this.canCreate()) return;

    this.availabilityMessage.set(null);
    this.errorMessage.set(null);

    this.standAssignmentsService
      .checkAvailability(
        this.newAssignment.standId,
        new Date(this.newAssignment.fromTime).toISOString(),
        new Date(this.newAssignment.toTime).toISOString(),
      )
      .subscribe({
        next: (response) => {
          this.isAvailable.set(response.available);
          if (response.available) {
            this.availabilityMessage.set(
              `✅ Stand ${this.newAssignment.standId} is available during the selected time.`,
            );
          } else {
            const conflicts = response.conflicts
              .map((c) => `${new Date(c.fromTime).toLocaleString()} - ${new Date(c.toTime).toLocaleString()}`)
              .join(', ');
            this.availabilityMessage.set(
              `❌ Stand ${this.newAssignment.standId} is occupied during: ${conflicts}`,
            );
          }
        },
        error: (err) => {
          this.errorMessage.set('Error checking availability: ' + err.message);
        },
      });
  }

  createAssignment() {
    if (!this.canCreate()) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.availabilityMessage.set(null);

    const payload: CreateStandAssignmentRequest = {
      flightPlanId: this.newAssignment.flightPlanId,
      standId: this.newAssignment.standId,
      fromTime: new Date(this.newAssignment.fromTime).toISOString(),
      toTime: new Date(this.newAssignment.toTime).toISOString(),
      remarks: this.newAssignment.remarks || undefined,
    };

    this.standAssignmentsService.create(payload).subscribe({
      next: () => {
        this.successMessage.set('✅ Stand assignment created successfully!');
        this.resetForm();
        this.loadAssignments();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
      },
    });
  }

  deleteAssignment(id: string) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    this.standAssignmentsService.delete(id).subscribe({
      next: () => {
        this.loadAssignments();
      },
      error: (err) => {
        this.errorMessage.set('Error deleting assignment: ' + err.message);
      },
    });
  }

  resetForm() {
    this.newAssignment = {
      flightPlanId: 0,
      standId: '',
      fromTime: '',
      toTime: '',
      remarks: '',
    };
  }
}
