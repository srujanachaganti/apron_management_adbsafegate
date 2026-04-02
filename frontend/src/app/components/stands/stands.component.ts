import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StandsService } from '../../services/stands.service';
import { Stand } from '../../models/stand.model';

@Component({
  selector: 'app-stands',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="stands">
      <h2>Airport Stands</h2>

      <div class="search-section">
        <input
          type="text"
          placeholder="Search by stand (e.g., K21)"
          [(ngModel)]="searchStand"
          class="search-input"
        />
        <input
          type="text"
          placeholder="Apron"
          [(ngModel)]="searchApron"
          class="search-input"
        />
        <input
          type="text"
          placeholder="Terminal"
          [(ngModel)]="searchTerminal"
          class="search-input"
        />
        <button (click)="performSearch()" class="search-btn">Search</button>
        <button (click)="resetSearch()" class="reset-btn">Reset</button>
      </div>

      <div *ngIf="loading()" class="loading">Loading...</div>

      <table *ngIf="!loading() && stands().length > 0; else noData">
        <thead>
          <tr>
            <th>Stand</th>
            <th>Apron</th>
            <th>Terminal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let stand of stands()">
            <td><strong>{{ stand.stand }}</strong></td>
            <td>{{ stand.apron || '-' }}</td>
            <td>{{ stand.terminal || '-' }}</td>
            <td>
              <a [routerLink]="['/stands', stand.stand]" class="action-link"
                >View</a
              >
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #noData>
        <p class="no-data">No stands found</p>
      </ng-template>

      <div *ngIf="!loading() && stands().length > 0" class="pagination">
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
      .stands {
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
export class StandsComponent implements OnInit {
  stands = signal<Stand[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);

  searchStand = '';
  searchApron = '';
  searchTerminal = '';

  constructor(private standsService: StandsService) {}

  ngOnInit() {
    this.loadStands();
  }

  loadStands() {
    this.loading.set(true);
    this.standsService.getAll(this.currentPage(), 50).subscribe({
      next: (response) => {
        this.stands.set(response.data);
        this.totalPages.set(response.pages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading stands:', error);
        this.loading.set(false);
      },
    });
  }

  performSearch() {
    this.loading.set(true);
    this.standsService
      .search({
        apron: this.searchApron || undefined,
        terminal: this.searchTerminal || undefined,
        stand: this.searchStand || undefined,
      })
      .subscribe({
        next: (data) => {
          this.stands.set(data);
          this.totalPages.set(Math.ceil(data.length / 50));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error searching stands:', error);
          this.loading.set(false);
        },
      });
  }

  resetSearch() {
    this.searchStand = '';
    this.searchApron = '';
    this.searchTerminal = '';
    this.currentPage.set(1);
    this.loadStands();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      if (this.searchStand || this.searchApron || this.searchTerminal) {
        this.performSearch();
      } else {
        this.loadStands();
      }
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      if (this.searchStand || this.searchApron || this.searchTerminal) {
        this.performSearch();
      } else {
        this.loadStands();
      }
    }
  }
}
