import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlightPlansService } from './flight-plans.service';
import { FlightPlan, PaginatedResponse, SearchFlightPlanRequest } from '../models/flight-plan.model';
import { environment } from '@environments/environment';

describe('FlightPlansService', () => {
  let service: FlightPlansService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/flight-plans`;

  // Mock flight plan data
  const mockFlightPlan: FlightPlan = {
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
  };

  const mockPaginatedResponse: PaginatedResponse<FlightPlan> = {
    data: [mockFlightPlan],
    total: 1,
    page: 1,
    limit: 50,
    pages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlightPlansService],
    });

    service = TestBed.inject(FlightPlansService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all flight plans with default pagination', () => {
      service.getAll().subscribe((response) => {
        expect(response).toEqual(mockPaginatedResponse);
        expect(response.data.length).toBe(1);
        expect(response.data[0].calculatedCallsign).toBe('AF 063');
      });

      const req = httpMock.expectOne(`${apiUrl}?page=1&limit=50`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should fetch all flight plans with custom pagination', () => {
      service.getAll(2, 25).subscribe((response) => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=2&limit=25`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('search', () => {
    it('should search flight plans with free-text search', () => {
      const searchParams: SearchFlightPlanRequest = {
        search: 'AF 063',
      };

      service.search(searchParams).subscribe((response) => {
        expect(response.data.length).toBe(1);
        expect(response.data[0].calculatedCallsign).toContain('AF');
      });

      const req = httpMock.expectOne(`${apiUrl}?search=AF+063`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should search flight plans with flightPlanType filter', () => {
      const searchParams: SearchFlightPlanRequest = {
        flightPlanType: 'Arrival',
      };

      service.search(searchParams).subscribe((response) => {
        expect(response.data.length).toBe(1);
        expect(response.data[0].flightPlanType).toBe('Arrival');
      });

      const req = httpMock.expectOne(`${apiUrl}?flightPlanType=Arrival`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should search flight plans with date range filter', () => {
      const searchParams: SearchFlightPlanRequest = {
        originDateFrom: '2026-03-06',
        originDateTo: '2026-03-07',
      };

      service.search(searchParams).subscribe((response) => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpMock.expectOne(
        `${apiUrl}?originDateFrom=2026-03-06&originDateTo=2026-03-07`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should search flight plans with multiple filters', () => {
      const searchParams: SearchFlightPlanRequest = {
        search: 'AF',
        flightPlanType: 'Arrival',
        carrier: 'AF',
        stand: 'K21',
      };

      service.search(searchParams).subscribe((response) => {
        expect(response.data.length).toBe(1);
      });

      const req = httpMock.expectOne((request) => {
        return (
          request.url.includes(apiUrl) &&
          request.url.includes('search=AF') &&
          request.url.includes('flightPlanType=Arrival') &&
          request.url.includes('carrier=AF') &&
          request.url.includes('stand=K21')
        );
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getById', () => {
    it('should fetch a single flight plan by ID', () => {
      const flightPlanId = 97238;

      service.getById(flightPlanId).subscribe((flightPlan) => {
        expect(flightPlan).toEqual(mockFlightPlan);
        expect(flightPlan.id).toBe(flightPlanId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${flightPlanId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFlightPlan);
    });
  });

  describe('getLinkedFlightPlans', () => {
    it('should fetch linked flight plans for a given flight plan ID', () => {
      const flightPlanId = 97238;
      const linkedFlightPlan: FlightPlan = {
        ...mockFlightPlan,
        id: 97239,
        flightPlanType: 'TowOutMovement',
        linkedFlightPlanType: 'Arrival',
      };

      service.getLinkedFlightPlans(flightPlanId).subscribe((linkedPlans) => {
        expect(linkedPlans.length).toBe(2);
        expect(linkedPlans[0].linkedFlightId).toBe(linkedPlans[1].linkedFlightId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${flightPlanId}/linked`);
      expect(req.request.method).toBe('GET');
      req.flush([mockFlightPlan, linkedFlightPlan]);
    });

    it('should return empty array when no linked flight plans exist', () => {
      const flightPlanId = 99999;

      service.getLinkedFlightPlans(flightPlanId).subscribe((linkedPlans) => {
        expect(linkedPlans).toEqual([]);
        expect(linkedPlans.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/${flightPlanId}/linked`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getByStand', () => {
    it('should fetch flight plans by stand', () => {
      const stand = 'K21';

      service.getByStand(stand).subscribe((flightPlans) => {
        expect(flightPlans.length).toBe(1);
        expect(flightPlans[0].stand).toBe(stand);
      });

      const req = httpMock.expectOne(`${apiUrl}/stand/${stand}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockFlightPlan]);
    });
  });

  describe('create', () => {
    it('should create a new flight plan', () => {
      const newFlightPlan = { ...mockFlightPlan, id: 0 };

      service.create(newFlightPlan).subscribe((created) => {
        expect(created.id).toBe(mockFlightPlan.id);
        expect(created.calculatedCallsign).toBe(mockFlightPlan.calculatedCallsign);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newFlightPlan);
      req.flush(mockFlightPlan);
    });
  });

  describe('update', () => {
    it('should update an existing flight plan', () => {
      const flightPlanId = 97238;
      const updates: Partial<FlightPlan> = {
        stand: 'F70',
        remarks: 'Updated stand',
      } as any;

      const updatedFlightPlan = { ...mockFlightPlan, ...updates };

      service.update(flightPlanId, updates).subscribe((updated) => {
        expect(updated.stand).toBe('F70');
      });

      const req = httpMock.expectOne(`${apiUrl}/${flightPlanId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updates);
      req.flush(updatedFlightPlan);
    });
  });

  describe('delete', () => {
    it('should delete a flight plan', () => {
      const flightPlanId = 97238;

      service.delete(flightPlanId).subscribe((result) => {
        expect(result).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${flightPlanId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('should handle 404 error when flight plan not found', () => {
      const flightPlanId = 99999;

      service.getById(flightPlanId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${flightPlanId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      service.getAll().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}?page=1&limit=50`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
