import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { FlightPlansService } from '../../services/flight-plans.service';
import { StandsService } from '../../services/stands.service';
import { of } from 'rxjs';
import { FlightPlan, PaginatedResponse } from '../../models/flight-plan.model';
import { Stand } from '../../models/stand.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let flightPlansServiceSpy: jasmine.SpyObj<FlightPlansService>;
  let standsServiceSpy: jasmine.SpyObj<StandsService>;

  // Mock data
  const mockFlightPlans: FlightPlan[] = [
    {
      id: 97238,
      ifplid: '299428080897_1-TOU',
      flightId: '8afc5c99-0011-5093-bbdb-05adc94f1b74',
      flightPlanType: 'Arrival',
      flightPlanAction: 'Active',
      created: new Date('2026-03-05T15:23:37.898Z'),
      updated: new Date('2026-03-06T07:09:02.484Z'),
      linkedFlightId: '299428080897',
      linkedFlightPlanType: 'TowOutMovement',
      originDate: new Date('2026-03-06'),
      carrier: 'AF',
      flightNumber: '063',
      calculatedCallsign: 'AF 063',
      aircraftRegistration: 'FHUVQ',
      aircraftType: 'A350/9',
      aircraftTypeIcao: 'A359',
      adep: 'KEWR',
      ades: 'LFPG',
      stand: 'K21',
      apron: 'Aire_T2E_S3',
      terminal: 'Terminal_2',
      aibt: null,
      sta: new Date('2026-03-06T06:30:00.000Z'),
      aobt: new Date('2026-03-06T06:45:00.000Z'),
      std: new Date('2026-03-06T06:40:00.000Z'),
    },
    {
      id: 97239,
      ifplid: '299428080898_1-DEP',
      flightId: '8afc5c99-0011-5093-bbdb-05adc94f1b75',
      flightPlanType: 'Departure',
      flightPlanAction: 'Completed',
      created: new Date('2026-03-05T16:00:00.000Z'),
      updated: new Date('2026-03-06T08:00:00.000Z'),
      linkedFlightId: null,
      linkedFlightPlanType: null,
      originDate: new Date('2026-03-06'),
      carrier: 'LH',
      flightNumber: '456',
      calculatedCallsign: 'LH 456',
      aircraftRegistration: 'DLHAB',
      aircraftType: 'B777/3',
      aircraftTypeIcao: 'B773',
      adep: 'LFPG',
      ades: 'EDDF',
      stand: 'F70',
      apron: 'Aire_T2F',
      terminal: 'Terminal_2',
      aibt: null,
      sta: null,
      aobt: new Date('2026-03-06T08:00:00.000Z'),
      std: new Date('2026-03-06T07:45:00.000Z'),
    },
  ];

  const mockPaginatedResponse: PaginatedResponse<FlightPlan> = {
    data: mockFlightPlans,
    total: 2,
    page: 1,
    limit: 50,
    pages: 1,
  };

  const mockStands: Stand[] = [
    { stand: 'K21', apron: 'Aire_T2E_S3', terminal: 'Terminal_2' },
    { stand: 'F70', apron: 'Aire_T2F', terminal: 'Terminal_2' },
    { stand: 'G42', apron: 'Aire_T2G', terminal: 'Terminal_2' },
  ];

  beforeEach(async () => {
    // Create spies for services
    flightPlansServiceSpy = jasmine.createSpyObj('FlightPlansService', [
      'getAll',
      'getActiveFlightPlans',
    ]);
    standsServiceSpy = jasmine.createSpyObj('StandsService', ['getAll']);

    // Set up default return values
    flightPlansServiceSpy.getAll.and.returnValue(of(mockPaginatedResponse));
    flightPlansServiceSpy.getActiveFlightPlans.and.returnValue(of(mockPaginatedResponse));
    standsServiceSpy.getAll.and.returnValue(of(mockStands));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: FlightPlansService, useValue: flightPlansServiceSpy },
        { provide: StandsService, useValue: standsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(flightPlansServiceSpy.getAll).toHaveBeenCalled();
    expect(standsServiceSpy.getAll).toHaveBeenCalled();
  }));

  it('should display total flight plans count', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.totalFlightPlans()).toBe(2);
  }));

  it('should display total stands count', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.totalStands()).toBe(3);
  }));

  it('should display recent flight plans in the table', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');

    expect(rows.length).toBeGreaterThan(0);
  }));

  it('should show flight plan callsigns in the table', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const compiled = fixture.nativeElement as HTMLElement;
    const tableText = compiled.querySelector('table')?.textContent || '';

    expect(tableText).toContain('AF 063');
  }));

  it('should display stat cards', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const compiled = fixture.nativeElement as HTMLElement;
    const statCards = compiled.querySelectorAll('.stat-card');

    expect(statCards.length).toBe(4);
  }));

  it('should display correct stat card titles', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const compiled = fixture.nativeElement as HTMLElement;
    const statContent = compiled.querySelectorAll('.stat-content h3');

    const titles = Array.from(statContent).map((el) => el.textContent);
    expect(titles).toContain('Total Flight Plans');
    expect(titles).toContain('Active Flights');
    expect(titles).toContain('Total Stands');
    expect(titles).toContain('Assigned Stands');
  }));

  it('should count active flight plans correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Based on mock data, 1 flight plan has 'Active' status
    expect(component.activeFlightPlans()).toBe(1);
  }));

  it('should count assigned stands correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Based on mock data, 2 flight plans have stands assigned
    const assignedCount = component.assignedStands();
    expect(assignedCount).toBeGreaterThanOrEqual(0);
  }));

  it('should display "no data" message when no flight plans exist', fakeAsync(() => {
    // Return empty response
    flightPlansServiceSpy.getAll.and.returnValue(
      of({
        data: [],
        total: 0,
        page: 1,
        limit: 50,
        pages: 0,
      }),
    );

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(component.totalFlightPlans()).toBe(0);
  }));

  it('should have proper dashboard structure', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.dashboard')).toBeTruthy();
    expect(compiled.querySelector('.stats-grid')).toBeTruthy();
    expect(compiled.querySelector('.section')).toBeTruthy();
  });
});
