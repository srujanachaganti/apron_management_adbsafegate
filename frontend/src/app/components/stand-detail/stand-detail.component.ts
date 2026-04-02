import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StandsService } from '../../services/stands.service';
import { FlightPlansService } from '../../services/flight-plans.service';
import { Stand } from '../../models/stand.model';
import { FlightPlan } from '../../models/flight-plan.model';

@Component({
  selector: 'app-stand-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="stand-detail">
      <button routerLink="/stands" class="back-btn">← Back to Stands</button>

      <div *ngIf="loading()" class="loading">Loading...</div>

      <div *ngIf="!loading() && stand(); else notFound" class="detail-card">
        <div class="detail-header">
          <h2>Stand {{ stand()!.stand }}</h2>
          <span class="stand-badge">🅿️ {{ stand()!.stand }}</span>
        </div>

        <div class="stand-info">
          <div class="info-section">
            <h3>Stand Information</h3>
            <div class="info-row">
              <label>Stand:</label>
              <value>{{ stand()!.stand }}</value>
            </div>
            <div class="info-row">
              <label>Apron:</label>
              <value>{{ stand()!.apron || '-' }}</value>
            </div>
            <div class="info-row">
              <label>Terminal:</label>
              <value>{{ stand()!.terminal || '-' }}</value>
            </div>
          </div>
        </div>

        <div class="flights-section" *ngIf="assignedFlights().length > 0">
          <h3>Currently Assigned Flights</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Callsign</th>
                <th>Aircraft</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let flight of assignedFlights()">
                <td>{{ flight.id }}</td>
                <td>{{ flight.calculatedCallsign }}</td>
                <td>{{ flight.aircraftType }}</td>
                <td>
                  <span [class]="'status-' + flight.flightPlanAction.toLowerCase()">
                    {{ flight.flightPlanAction }}
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/flight-plans', flight.id]" class="action-link"
                    >View</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="assignedFlights().length === 0" class="no-flights">
          <p>No flights currently assigned to this stand</p>
        </div>
      </div>

      <ng-template #notFound>
        <p class="not-found">Stand not found</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .stand-detail {
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

      .back-btn {
        padding: 0.5rem 1rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        margin-bottom: 1.5rem;
        transition: background 0.3s;
      }

      .back-btn:hover {
        background: #5568d3;
      }

      .loading {
        text-align: center;
        padding: 2rem;
        color: #667eea;
        font-weight: 600;
      }

      .detail-card {
        background: white;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f0f0f0;
      }

      .detail-header h2 {
        margin: 0;
        color: #333;
      }

      .stand-badge {
        background: #667eea;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 600;
      }

      .stand-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .info-section h3 {
        color: #667eea;
        margin-top: 0;
        font-size: 1rem;
        text-transform: uppercase;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .info-row label {
        font-weight: 600;
        color: #666;
      }

      .info-row value {
        color: #333;
      }

      .flights-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #f0f0f0;
      }

      .flights-section h3 {
        color: #667eea;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
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

      .status-active {
        background: #d4edda;
        color: #155724;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.85rem;
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

      .no-flights {
        text-align: center;
        padding: 2rem;
        color: #999;
        background: #f9f9f9;
        border-radius: 4px;
      }

      .not-found {
        text-align: center;
        padding: 2rem;
        color: #999;
      }
    `,
  ],
})
export class StandDetailComponent implements OnInit {
  stand = signal<Stand | null>(null);
  assignedFlights = signal<FlightPlan[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private standsService: StandsService,
    private flightPlansService: FlightPlansService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const standId = params['stand'];
      this.loadStand(standId);
    });
  }

  loadStand(standId: string) {
    this.loading.set(true);
    this.standsService.getByStand(standId).subscribe({
      next: (stand) => {
        this.stand.set(stand);
        this.loadAssignedFlights(standId);
      },
      error: (error) => {
        console.error('Error loading stand:', error);
        this.loading.set(false);
      },
    });
  }

  loadAssignedFlights(standId: string) {
    this.flightPlansService.getByStand(standId).subscribe({
      next: (flights) => {
        this.assignedFlights.set(flights);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading assigned flights:', error);
        this.loading.set(false);
      },
    });
  }
}
