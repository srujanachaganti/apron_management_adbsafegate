import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { StandAssignmentsService } from './stand-assignments.service';
import { StandAssignmentEntity } from '@database/entities/stand-assignment.entity';
import { FlightPlanEntity } from '@database/entities/flight-plan.entity';
import { StandEntity } from '@database/entities/stand.entity';
import { CreateStandAssignmentDto } from '../dtos/create-stand-assignment.dto';

describe('StandAssignmentsService', () => {
  let service: StandAssignmentsService;
  let standAssignmentRepository: jest.Mocked<Repository<StandAssignmentEntity>>;
  let flightPlanRepository: jest.Mocked<Repository<FlightPlanEntity>>;
  let standRepository: jest.Mocked<Repository<StandEntity>>;

  // Mock query builder
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandAssignmentsService,
        {
          provide: getRepositoryToken(StandAssignmentEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(FlightPlanEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(StandEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StandAssignmentsService>(StandAssignmentsService);
    standAssignmentRepository = module.get(getRepositoryToken(StandAssignmentEntity));
    flightPlanRepository = module.get(getRepositoryToken(FlightPlanEntity));
    standRepository = module.get(getRepositoryToken(StandEntity));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockFlightPlan: Partial<FlightPlanEntity> = {
      id: 1,
      calculatedCallsign: 'AF 063',
      flightPlanType: 'Arrival',
    };

    const mockStand: Partial<StandEntity> = {
      stand: 'F70',
      apron: 'Aire_T2F',
      terminal: 'Terminal_2',
    };

    const createDto: CreateStandAssignmentDto = {
      flightPlanId: 1,
      standId: 'F70',
      fromTime: '2026-03-06T08:00:00.000Z',
      toTime: '2026-03-06T10:00:00.000Z',
      remarks: 'Test assignment',
    };

    it('should create a stand assignment when no overlap exists', async () => {
      // Arrange
      flightPlanRepository.findOne.mockResolvedValue(mockFlightPlan as FlightPlanEntity);
      standRepository.findOne.mockResolvedValue(mockStand as StandEntity);
      mockQueryBuilder.getOne.mockResolvedValue(null); // No overlapping assignment

      const mockCreatedAssignment: Partial<StandAssignmentEntity> = {
        id: 'uuid-123',
        flightPlanId: 1,
        standId: 'F70',
        fromTime: new Date(createDto.fromTime),
        toTime: new Date(createDto.toTime),
        remarks: 'Test assignment',
      };

      standAssignmentRepository.create.mockReturnValue(mockCreatedAssignment as StandAssignmentEntity);
      standAssignmentRepository.save.mockResolvedValue(mockCreatedAssignment as StandAssignmentEntity);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(mockCreatedAssignment);
      expect(flightPlanRepository.findOne).toHaveBeenCalledWith({
        where: { id: createDto.flightPlanId },
      });
      expect(standRepository.findOne).toHaveBeenCalledWith({
        where: { stand: createDto.standId },
      });
      expect(standAssignmentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when flight plan does not exist', async () => {
      // Arrange
      flightPlanRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createDto)).rejects.toThrow(
        `FlightPlan with ID ${createDto.flightPlanId} not found`,
      );
    });

    it('should throw NotFoundException when stand does not exist', async () => {
      // Arrange
      flightPlanRepository.findOne.mockResolvedValue(mockFlightPlan as FlightPlanEntity);
      standRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createDto)).rejects.toThrow(
        `Stand ${createDto.standId} not found`,
      );
    });

    describe('overlap/conflict detection', () => {
      beforeEach(() => {
        // Common setup for overlap tests
        flightPlanRepository.findOne.mockResolvedValue(mockFlightPlan as FlightPlanEntity);
        standRepository.findOne.mockResolvedValue(mockStand as StandEntity);
      });

      it('should throw ConflictException when new assignment completely overlaps existing', async () => {
        // Existing: 08:00 - 10:00
        // New:      07:00 - 11:00 (completely covers existing)
        const existingAssignment: Partial<StandAssignmentEntity> = {
          id: 'existing-uuid',
          standId: 'F70',
          fromTime: new Date('2026-03-06T08:00:00.000Z'),
          toTime: new Date('2026-03-06T10:00:00.000Z'),
        };

        mockQueryBuilder.getOne.mockResolvedValue(existingAssignment as StandAssignmentEntity);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T07:00:00.000Z',
          toTime: '2026-03-06T11:00:00.000Z',
        };

        await expect(service.create(newDto)).rejects.toThrow(ConflictException);
        await expect(service.create(newDto)).rejects.toThrow(/Stand F70 already occupied/);
      });

      it('should throw ConflictException when new assignment is inside existing', async () => {
        // Existing: 07:00 - 11:00
        // New:      08:00 - 10:00 (inside existing)
        const existingAssignment: Partial<StandAssignmentEntity> = {
          id: 'existing-uuid',
          standId: 'F70',
          fromTime: new Date('2026-03-06T07:00:00.000Z'),
          toTime: new Date('2026-03-06T11:00:00.000Z'),
        };

        mockQueryBuilder.getOne.mockResolvedValue(existingAssignment as StandAssignmentEntity);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        await expect(service.create(newDto)).rejects.toThrow(ConflictException);
      });

      it('should throw ConflictException when new assignment overlaps start of existing', async () => {
        // Existing: 09:00 - 11:00
        // New:      08:00 - 10:00 (overlaps start)
        const existingAssignment: Partial<StandAssignmentEntity> = {
          id: 'existing-uuid',
          standId: 'F70',
          fromTime: new Date('2026-03-06T09:00:00.000Z'),
          toTime: new Date('2026-03-06T11:00:00.000Z'),
        };

        mockQueryBuilder.getOne.mockResolvedValue(existingAssignment as StandAssignmentEntity);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        await expect(service.create(newDto)).rejects.toThrow(ConflictException);
      });

      it('should throw ConflictException when new assignment overlaps end of existing', async () => {
        // Existing: 07:00 - 09:00
        // New:      08:00 - 10:00 (overlaps end)
        const existingAssignment: Partial<StandAssignmentEntity> = {
          id: 'existing-uuid',
          standId: 'F70',
          fromTime: new Date('2026-03-06T07:00:00.000Z'),
          toTime: new Date('2026-03-06T09:00:00.000Z'),
        };

        mockQueryBuilder.getOne.mockResolvedValue(existingAssignment as StandAssignmentEntity);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        await expect(service.create(newDto)).rejects.toThrow(ConflictException);
      });

      it('should throw ConflictException when new assignment exactly matches existing', async () => {
        // Existing: 08:00 - 10:00
        // New:      08:00 - 10:00 (exact same time)
        const existingAssignment: Partial<StandAssignmentEntity> = {
          id: 'existing-uuid',
          standId: 'F70',
          fromTime: new Date('2026-03-06T08:00:00.000Z'),
          toTime: new Date('2026-03-06T10:00:00.000Z'),
        };

        mockQueryBuilder.getOne.mockResolvedValue(existingAssignment as StandAssignmentEntity);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        await expect(service.create(newDto)).rejects.toThrow(ConflictException);
      });

      it('should allow assignment when new ends exactly when existing starts (no overlap)', async () => {
        // Existing: 10:00 - 12:00
        // New:      08:00 - 10:00 (ends exactly when existing starts - no overlap)
        mockQueryBuilder.getOne.mockResolvedValue(null); // Query returns no overlap

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        const mockCreatedAssignment: Partial<StandAssignmentEntity> = {
          id: 'new-uuid',
          flightPlanId: 1,
          standId: 'F70',
          fromTime: new Date(newDto.fromTime),
          toTime: new Date(newDto.toTime),
        };

        standAssignmentRepository.create.mockReturnValue(mockCreatedAssignment as StandAssignmentEntity);
        standAssignmentRepository.save.mockResolvedValue(mockCreatedAssignment as StandAssignmentEntity);

        const result = await service.create(newDto);
        expect(result).toEqual(mockCreatedAssignment);
      });

      it('should allow assignment when new starts exactly when existing ends (no overlap)', async () => {
        // Existing: 06:00 - 08:00
        // New:      08:00 - 10:00 (starts exactly when existing ends - no overlap)
        mockQueryBuilder.getOne.mockResolvedValue(null); // Query returns no overlap

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        const mockCreatedAssignment: Partial<StandAssignmentEntity> = {
          id: 'new-uuid',
          flightPlanId: 1,
          standId: 'F70',
          fromTime: new Date(newDto.fromTime),
          toTime: new Date(newDto.toTime),
        };

        standAssignmentRepository.create.mockReturnValue(mockCreatedAssignment as StandAssignmentEntity);
        standAssignmentRepository.save.mockResolvedValue(mockCreatedAssignment as StandAssignmentEntity);

        const result = await service.create(newDto);
        expect(result).toEqual(mockCreatedAssignment);
      });

      it('should allow assignment on different stand even with same time', async () => {
        // Existing on F70: 08:00 - 10:00
        // New on K21:      08:00 - 10:00 (different stand - allowed)
        mockQueryBuilder.getOne.mockResolvedValue(null); // No overlap on K21

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'K21',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        // Update stand mock for K21
        standRepository.findOne.mockResolvedValue({
          stand: 'K21',
          apron: 'Aire_T2E_S3',
          terminal: 'Terminal_2',
        } as StandEntity);

        const mockCreatedAssignment: Partial<StandAssignmentEntity> = {
          id: 'new-uuid',
          flightPlanId: 1,
          standId: 'K21',
          fromTime: new Date(newDto.fromTime),
          toTime: new Date(newDto.toTime),
        };

        standAssignmentRepository.create.mockReturnValue(mockCreatedAssignment as StandAssignmentEntity);
        standAssignmentRepository.save.mockResolvedValue(mockCreatedAssignment as StandAssignmentEntity);

        const result = await service.create(newDto);
        expect(result).toEqual(mockCreatedAssignment);
      });

      it('should allow assignment when completely before existing (no overlap)', async () => {
        // Existing: 12:00 - 14:00
        // New:      08:00 - 10:00 (completely before - no overlap)
        mockQueryBuilder.getOne.mockResolvedValue(null);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        const mockCreatedAssignment: Partial<StandAssignmentEntity> = {
          id: 'new-uuid',
          flightPlanId: 1,
          standId: 'F70',
          fromTime: new Date(newDto.fromTime),
          toTime: new Date(newDto.toTime),
        };

        standAssignmentRepository.create.mockReturnValue(mockCreatedAssignment as StandAssignmentEntity);
        standAssignmentRepository.save.mockResolvedValue(mockCreatedAssignment as StandAssignmentEntity);

        const result = await service.create(newDto);
        expect(result).toEqual(mockCreatedAssignment);
      });

      it('should allow assignment when completely after existing (no overlap)', async () => {
        // Existing: 06:00 - 07:00
        // New:      08:00 - 10:00 (completely after - no overlap)
        mockQueryBuilder.getOne.mockResolvedValue(null);

        const newDto: CreateStandAssignmentDto = {
          flightPlanId: 1,
          standId: 'F70',
          fromTime: '2026-03-06T08:00:00.000Z',
          toTime: '2026-03-06T10:00:00.000Z',
        };

        const mockCreatedAssignment: Partial<StandAssignmentEntity> = {
          id: 'new-uuid',
          flightPlanId: 1,
          standId: 'F70',
          fromTime: new Date(newDto.fromTime),
          toTime: new Date(newDto.toTime),
        };

        standAssignmentRepository.create.mockReturnValue(mockCreatedAssignment as StandAssignmentEntity);
        standAssignmentRepository.save.mockResolvedValue(mockCreatedAssignment as StandAssignmentEntity);

        const result = await service.create(newDto);
        expect(result).toEqual(mockCreatedAssignment);
      });
    });
  });

  describe('checkAvailability', () => {
    it('should return available true when no conflicts exist', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.checkAvailability(
        'F70',
        new Date('2026-03-06T08:00:00.000Z'),
        new Date('2026-03-06T10:00:00.000Z'),
      );

      expect(result.available).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should return available false with conflicts when overlaps exist', async () => {
      const conflictingAssignment: Partial<StandAssignmentEntity> = {
        id: 'conflict-uuid',
        standId: 'F70',
        fromTime: new Date('2026-03-06T09:00:00.000Z'),
        toTime: new Date('2026-03-06T11:00:00.000Z'),
      };

      mockQueryBuilder.getMany.mockResolvedValue([conflictingAssignment as StandAssignmentEntity]);

      const result = await service.checkAvailability(
        'F70',
        new Date('2026-03-06T08:00:00.000Z'),
        new Date('2026-03-06T10:00:00.000Z'),
      );

      expect(result.available).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].id).toBe('conflict-uuid');
    });

    it('should exclude specified assignment when checking availability', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.checkAvailability(
        'F70',
        new Date('2026-03-06T08:00:00.000Z'),
        new Date('2026-03-06T10:00:00.000Z'),
        'exclude-this-uuid',
      );

      // Verify that andWhere was called with exclusion
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'sa.id != :excludeId',
        { excludeId: 'exclude-this-uuid' },
      );
    });
  });

  describe('findAll', () => {
    it('should filter by standId when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ standId: 'F70' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'sa.standId = :standId',
        { standId: 'F70' },
      );
    });

    it('should filter by time range when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({
        from: '2026-03-06T08:00:00.000Z',
        to: '2026-03-06T18:00:00.000Z',
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'sa.toTime > :from',
        expect.any(Object),
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'sa.fromTime < :to',
        expect.any(Object),
      );
    });
  });
});
