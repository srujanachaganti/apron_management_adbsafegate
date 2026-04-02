import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightPlansService } from '../../services/flight-plans.service';
import { StandsService } from '../../services/stands.service';
import { FlightPlan } from '../../models/flight-plan.model';
import { Stand } from '../../models/stand.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Total Flight Plans</h3>
            <p class="stat-value">{{ totalFlightPlans() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Active Flights</h3>
            <p class="stat-value">{{ activeFlightPlans() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🅿️</div>
          <div class="stat-content">
            <h3>Total Stands</h3>
            <p class="stat-value">{{ totalStands() }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✈️</div>
          <div class="stat-content">
            <h3>Assigned Stands</h3>
            <p class="stat-value">{{ assignedStands() }}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Recent Flight Plans</h3>
        <table *ngIf="recentFlightPlans().length > 0; else noData">
          <thead>
            <tr>
              <th>ID</th>
              <th>Callsign</th>
              <th>Aircraft</th>
              <th>Stand</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let plan of recentFlightPlans()">
              <td>{{ plan.id }}</td>
              <td>{{ plan.calculatedCallsign }}</td>
              <td>{{ plan.aircraftType }}</td>
              <td>{{ plan.stand || '-' }}</td>
              <td>
                <span [class]="'status-' + plan.flightPlanAction.toLowerCase()">
                  {{ plan.flightPlanAction }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noData>
          <p class="no-data">No flight plans available</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
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
        margin-bottom: 2rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
      }

      .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        font-size: 2.5rem;
      }

      .stat-content h3 {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
        text-transform: uppercase;
      }

      .stat-value {
        margin: 0;
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
      }

      .section {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .section h3 {
        margin-top: 0;
        color: #333;
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

      .no-data {
        text-align: center;
        color: #999;
        padding: 2rem;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  totalFlightPlans = signal(0);
  activeFlightPlans = signal(0);
  totalStands = signal(0);
  assignedStands = signal(0);
  recentFlightPlans = signal<FlightPlan[]>([]);

  constructor(
    private flightPlansService: FlightPlansService,
    private standsService: StandsService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load flight plans
    this.flightPlansService.getAll(1, 100).subscribe((response) => {
      this.totalFlightPlans.set(response.total);
      this.recentFlightPlans.set(response.data.slice(0, 5));
      const activeCount = response.data.filter(
        (fp) => fp.flightPlanAction === 'Active',
      ).length;
      this.activeFlightPlans.set(activeCount);
    });

    // Load stands
    this.standsService.getAll(1, 100).subscribe((response) => {
      this.totalStands.set(response.total);
      const assignedCount = response.data.filter(
        (stand) => stand.stand !== null,
      ).length;
      this.assignedStands.set(assignedCount);
    });
  }
}
