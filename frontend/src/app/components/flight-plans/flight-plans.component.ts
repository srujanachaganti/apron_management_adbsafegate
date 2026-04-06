import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlightPlansService } from '../../services/flight-plans.service';
import { FlightPlan, SearchFlightPlanRequest } from '../../models/flight-plan.model';

@Component({
  selector: 'app-flight-plans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flight-plans">
      <h2>Flight Plans</h2>

      <div class="search-section">
        <input
          type="text"
          placeholder="Free-text search..."
          [(ngModel)]="searchText"
          class="search-input search-wide"
        />
        <select [(ngModel)]="searchFlightPlanType" class="search-input">
          <option value="">All Types</option>
          <option value="Arrival">Arrival</option>
          <option value="Departure">Departure</option>
          <option value="TowOutMovement">Tow Out Movement</option>
          <option value="TowInMovement">Tow In Movement</option>
        </select>
        <input
          type="text"
          placeholder="Carrier (e.g., AF)"
          [(ngModel)]="searchCarrier"
          class="search-input"
        />
        <input
          type="text"
          placeholder="Flight number"
          [(ngModel)]="searchFlightNumber"
          class="search-input"
        />
        <input
          type="text"
          placeholder="Stand (e.g., K21)"
          [(ngModel)]="searchStand"
          class="search-input"
        />
        <input
          type="date"
          [(ngModel)]="searchOriginDateFrom"
          class="search-input"
          title="Origin Date From"
        />
        <input
          type="date"
          [(ngModel)]="searchOriginDateTo"
          class="search-input"
          title="Origin Date To"
        />
        <button (click)="performSearch()" class="search-btn">Search</button>
        <button (click)="resetSearch()" class="reset-btn">Reset</button>
      </div>

      <div *ngIf="loading()" class="loading">Loading...</div>

      <table *ngIf="!loading() && flightPlans().length > 0; else noData">
        <thead>
          <tr>
            <th>ID</th>
            <th>Callsign</th>
            <th>Type</th>
            <th>Route</th>
            <th>Stand</th>
            <th>Origin Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let plan of flightPlans()">
            <td>{{ plan.id }}</td>
            <td>{{ plan.calculatedCallsign }}</td>
            <td>
              <span [class]="'type-' + plan.flightPlanType.toLowerCase()">
                {{ plan.flightPlanType }}
              </span>
            </td>
            <td>{{ plan.adep }} → {{ plan.ades }}</td>
            <td>{{ plan.stand || '-' }}</td>
            <td>{{ plan.originDate | date: 'shortDate' }}</td>
            <td>
              <span [class]="'status-' + plan.flightPlanAction.toLowerCase()">
                {{ plan.flightPlanAction }}
              </span>
            </td>
            <td>
              <a [routerLink]="['/flight-plans', plan.id]" class="action-link">View</a>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #noData>
        <p *ngIf="!loading()" class="no-data">No flight plans found</p>
      </ng-template>

      <div *ngIf="!loading() && flightPlans().length > 0" class="pagination">
        <button
          (click)="previousPage()"
          [disabled]="currentPage() === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ currentPage() }} of {{ totalPages() }}
        </span>
        <button
          (click)="nextPage()"
          [disabled]="currentPage() >= totalPages()"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .flight-plans {
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      h2 {
        color: #333;
        margin-bottom: 1.5rem;
      }

      .search-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .search-input {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.95rem;
      }

      .search-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .search-btn {
        padding: 0.75rem 1.5rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .search-btn:hover {
        background: #5568d3;
      }

      .reset-btn {
        padding: 0.75rem 1.5rem;
        background: #ddd;
        color: #333;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .reset-btn:hover {
        background: #ccc;
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
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      th {
        background: #f5f5f5;
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 2px solid #ddd;
        color: #333;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }

      tr:hover {
        background: #f9f9f9;
      }

      .status-active {
        background: #d4edda;
        color: #155724;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .status-inactive {
        background: #f8d7da;
        color: #721c24;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 500;
      }

      .type-arrival {
        background: #cce5ff;
        color: #004085;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .type-departure {
        background: #fff3cd;
        color: #856404;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .type-towoutmovement, .type-towinmovement {
        background: #e2e3e5;
        color: #383d41;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .search-wide {
        grid-column: span 2;
      }
        font-weight: 500;
      }

      .action-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }

      .action-link:hover {
        text-decoration: underline;
      }

      .no-data {
        text-align: center;
        padding: 2rem;
        color: #999;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        padding: 1rem;
      }

      .pagination-btn {
        padding: 0.5rem 1rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s;
      }

      .pagination-btn:hover:not(:disabled) {
        background: #5568d3;
      }

      .pagination-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .page-info {
        color: #666;
        font-weight: 600;
      }
    `,
  ],
})
export class FlightPlansComponent implements OnInit {
  flightPlans = signal<FlightPlan[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);

  // Search fields
  searchText = '';
  searchCarrier = '';
  searchFlightNumber = '';
  searchFlightPlanType = '';
  searchStand = '';
  searchOriginDateFrom = '';
  searchOriginDateTo = '';

  constructor(private flightPlansService: FlightPlansService) {}

  ngOnInit() {
    this.loadFlightPlans();
  }

  loadFlightPlans() {
    this.loading.set(true);
    this.flightPlansService.getAll(this.currentPage(), 50).subscribe({
      next: (response) => {
        this.flightPlans.set(response.data);
        this.totalPages.set(response.pages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading flight plans:', error);
        this.loading.set(false);
      },
    });
  }

  performSearch() {
    this.loading.set(true);
    const searchParams: SearchFlightPlanRequest = {
      search: this.searchText || undefined,
      carrier: this.searchCarrier || undefined,
      flightNumber: this.searchFlightNumber || undefined,
      flightPlanType: this.searchFlightPlanType || undefined,
      stand: this.searchStand || undefined,
      originDateFrom: this.searchOriginDateFrom || undefined,
      originDateTo: this.searchOriginDateTo || undefined,
      page: this.currentPage(),
      limit: 50,
    };

    this.flightPlansService.search(searchParams).subscribe({
      next: (response) => {
        this.flightPlans.set(response.data);
        this.totalPages.set(response.pages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching flight plans:', error);
        this.loading.set(false);
      },
    });
  }

  hasSearchParams(): boolean {
    return !!(
      this.searchText ||
      this.searchCarrier ||
      this.searchFlightNumber ||
      this.searchFlightPlanType ||
      this.searchStand ||
      this.searchOriginDateFrom ||
      this.searchOriginDateTo
    );
  }

  resetSearch() {
    this.searchText = '';
    this.searchCarrier = '';
    this.searchFlightNumber = '';
    this.searchFlightPlanType = '';
    this.searchStand = '';
    this.searchOriginDateFrom = '';
    this.searchOriginDateTo = '';
    this.currentPage.set(1);
    this.loadFlightPlans();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      if (this.hasSearchParams()) {
        this.performSearch();
      } else {
        this.loadFlightPlans();
      }
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      if (this.hasSearchParams()) {
        this.performSearch();
      } else {
        this.loadFlightPlans();
      }
    }
  }
}
