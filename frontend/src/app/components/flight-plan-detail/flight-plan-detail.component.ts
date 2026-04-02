import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlightPlansService } from '../../services/flight-plans.service';
import { FlightPlan } from '../../models/flight-plan.model';

@Component({
  selector: 'app-flight-plan-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flight-plan-detail">
      <button routerLink="/flight-plans" class="back-btn">← Back to Flight Plans</button>

      <div *ngIf="loading()" class="loading">Loading...</div>

      <div *ngIf="!loading() && flightPlan(); else notFound" class="detail-card">
        <div class="detail-header">
          <h2>{{ flightPlan()!.calculatedCallsign }}</h2>
          <span [class]="'status-' + flightPlan()!.flightPlanAction.toLowerCase()">
            {{ flightPlan()!.flightPlanAction }}
          </span>
        </div>

        <div class="detail-grid">
          <div class="detail-section">
            <h3>Flight Information</h3>
            <div class="detail-row">
              <label>Flight ID:</label>
              <value>{{ flightPlan()!.id }}</value>
            </div>
            <div class="detail-row">
              <label>IFPL ID:</label>
              <value>{{ flightPlan()!.ifplid || '-' }}</value>
            </div>
            <div class="detail-row">
              <label>Carrier:</label>
              <value>{{ flightPlan()!.carrier }}</value>
            </div>
            <div class="detail-row">
              <label>Flight Number:</label>
              <value>{{ flightPlan()!.flightNumber }}</value>
            </div>
            <div class="detail-row">
              <label>Plan Type:</label>
              <value>{{ flightPlan()!.flightPlanType }}</value>
            </div>
          </div>

          <div class="detail-section">
            <h3>Aircraft Information</h3>
            <div class="detail-row">
              <label>Aircraft Type:</label>
              <value>{{ flightPlan()!.aircraftType }}</value>
            </div>
            <div class="detail-row">
              <label>ICAO Type:</label>
              <value>{{ flightPlan()!.aircraftTypeIcao }}</value>
            </div>
            <div class="detail-row">
              <label>Registration:</label>
              <value>{{ flightPlan()!.aircraftRegistration }}</value>
            </div>
          </div>

          <div class="detail-section">
            <h3>Airport Information</h3>
            <div class="detail-row">
              <label>Origin (ADEP):</label>
              <value>{{ flightPlan()!.adep }}</value>
            </div>
            <div class="detail-row">
              <label>Destination (ADES):</label>
              <value>{{ flightPlan()!.ades }}</value>
            </div>
            <div class="detail-row">
              <label>Stand:</label>
              <value>{{ flightPlan()!.stand || '-' }}</value>
            </div>
            <div class="detail-row">
              <label>Apron:</label>
              <value>{{ flightPlan()!.apron || '-' }}</value>
            </div>
            <div class="detail-row">
              <label>Terminal:</label>
              <value>{{ flightPlan()!.terminal || '-' }}</value>
            </div>
          </div>

          <div class="detail-section">
            <h3>Timing Information</h3>
            <div class="detail-row">
              <label>STD (Scheduled):</label>
              <value>{{ flightPlan()!.std | date: 'short' }}</value>
            </div>
            <div class="detail-row">
              <label>AOBT (Actual):</label>
              <value>{{ flightPlan()!.aobt | date: 'short' }}</value>
            </div>
            <div class="detail-row">
              <label>STA (Scheduled):</label>
              <value>{{ flightPlan()!.sta ? (flightPlan()!.sta | date: 'short') : '-' }}</value>
            </div>
            <div class="detail-row">
              <label>AIBT (Actual):</label>
              <value>{{ flightPlan()!.aibt ? (flightPlan()!.aibt | date: 'short') : '-' }}</value>
            </div>
          </div>

          <div class="detail-section">
            <h3>Linked Flight Information</h3>
            <div class="detail-row">
              <label>Linked Flight ID:</label>
              <value>{{ flightPlan()!.linkedFlightId || '-' }}</value>
            </div>
            <div class="detail-row">
              <label>Linked Plan Type:</label>
              <value>{{ flightPlan()!.linkedFlightPlanType || '-' }}</value>
            </div>
          </div>

          <div class="detail-section">
            <h3>Timestamps</h3>
            <div class="detail-row">
              <label>Created:</label>
              <value>{{ flightPlan()!.created | date: 'short' }}</value>
            </div>
            <div class="detail-row">
              <label>Updated:</label>
              <value>{{ flightPlan()!.updated | date: 'short' }}</value>
            </div>
          </div>
        </div>

        <div *ngIf="linkedPlans().length > 0" class="linked-plans">
          <h3>Linked Flight Plans</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Callsign</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let plan of linkedPlans()">
                <td>{{ plan.id }}</td>
                <td>{{ plan.calculatedCallsign }}</td>
                <td>{{ plan.flightPlanType }}</td>
                <td>
                  <span [class]="'status-' + plan.flightPlanAction.toLowerCase()">
                    {{ plan.flightPlanAction }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ng-template #notFound>
        <p class="not-found">Flight plan not found</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .flight-plan-detail {
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

      .status-active {
        background: #d4edda;
        color: #155724;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: 600;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .detail-section h3 {
        color: #667eea;
        margin-top: 0;
        font-size: 1rem;
        text-transform: uppercase;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .detail-row label {
        font-weight: 600;
        color: #666;
      }

      .detail-row value {
        color: #333;
      }

      .linked-plans {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #f0f0f0;
      }

      .linked-plans h3 {
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

      .not-found {
        text-align: center;
        padding: 2rem;
        color: #999;
      }
    `,
  ],
})
export class FlightPlanDetailComponent implements OnInit {
  flightPlan = signal<FlightPlan | null>(null);
  linkedPlans = signal<FlightPlan[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private flightPlansService: FlightPlansService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadFlightPlan(id);
    });
  }

  loadFlightPlan(id: number) {
    this.loading.set(true);
    this.flightPlansService.getById(id).subscribe({
      next: (plan) => {
        this.flightPlan.set(plan);
        if (plan.linkedFlightId) {
          this.loadLinkedPlans(plan.linkedFlightId);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading flight plan:', error);
        this.loading.set(false);
      },
    });
  }

  loadLinkedPlans(flightId: string) {
    this.flightPlansService.getLinkedFlightPlans(flightId).subscribe({
      next: (plans) => {
        this.linkedPlans.set(plans);
      },
      error: (error) => {
        console.error('Error loading linked plans:', error);
      },
    });
  }
}
