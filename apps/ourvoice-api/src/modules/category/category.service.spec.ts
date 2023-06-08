// import { CategoryCreateDto } from './dto/category-create.dto';
import { PrismaService } from '../../database/prisma.service';
import { CategoryService } from './category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepositoryMock: DeepMocked<CategoryRepository>;

  const dummyCategory = {
    id: 1,
    name: 'Test Name',
    description: 'Test Description',
    weight: 0,
    active: true,
    createdAt: new Date('2023-05-03T00:04:54.956Z'),
    disabledAt: null,
    parentId: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: createMock<CategoryRepository>(),
        },
        { provide: PrismaService, useValue: createMock<PrismaService>() },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepositoryMock = module.get(CategoryRepository);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should create a category', async () => {
    // Arrange
    const categoryCreateInput = {
      name: 'Test Name',
      description: 'Test Description',
      parentId: null,
    };

    categoryRepositoryMock.createCategory.mockResolvedValue(dummyCategory);

    // Act
    const result = await categoryService.createCategory(categoryCreateInput);

    // Assert
    expect(result).toEqual(dummyCategory);

    expect(categoryRepositoryMock.createCategory).toHaveBeenCalledWith({
      ...categoryCreateInput,
    });
  });

  it('should throw an error if the category name is already taken', async () => {
    // Arrange
    const categoryCreateInput = {
      name: 'Test Name',
      description: 'Test Description',
      parentId: null,
    };

    categoryRepositoryMock.getCategories.mockResolvedValue({
      totalCount: 1,
      categories: [dummyCategory],
    });

    // Act & Assert
    await expect(
      categoryService.createCategory(categoryCreateInput),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw an error if the parent category does not exist', async () => {
    // Arrange
    const categoryCreateInput = {
      name: 'Test Name',
      description: 'Test Description',
      parentId: 1,
    };

    categoryRepositoryMock.getCategoryById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      categoryService.createCategory(categoryCreateInput),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw an error if the parent category is disabled', async () => {
    // Arrange
    const categoryCreateInput = {
      name: 'Test Name',
      description: 'Test Description',
      parentId: 1,
    };

    categoryRepositoryMock.getCategoryById.mockResolvedValue({
      ...dummyCategory,
      active: false,
    });

    // Act & Assert
    await expect(
      categoryService.createCategory(categoryCreateInput),
    ).rejects.toThrow(BadRequestException);
  });

  it('should get a category by id', async () => {
    // Arrange
    categoryRepositoryMock.getCategoryById.mockResolvedValue(dummyCategory);

    // Act
    const result = await categoryService.getCategoryById(1);

    // Assert
    expect(result).toEqual(dummyCategory);
    expect(categoryRepositoryMock.getCategoryById).toHaveBeenCalledWith(1);
  });

  it('should return null if the category does not exist', async () => {
    // Arrange
    categoryRepositoryMock.getCategoryById.mockResolvedValue(null);

    // Act
    const result = await categoryService.getCategoryById(1);

    // Assert
    expect(result).toEqual(null);
    expect(categoryRepositoryMock.getCategoryById).toHaveBeenCalledWith(1);
  });

  it('should get all categories', async () => {
    // Arrange
    categoryRepositoryMock.getCategories.mockResolvedValue({
      totalCount: 1,
      categories: [
        dummyCategory,
        { ...dummyCategory, id: 2 },
        { ...dummyCategory, id: 3 },
      ],
    });

    // Act
    const result = await categoryService.getCategories();

    // Assert
    expect(result).toEqual({
      totalCount: 1,
      edges: [
        { node: dummyCategory, cursor: 'MQ==' },
        { node: { ...dummyCategory, id: 2 }, cursor: 'Mg==' },
        { node: { ...dummyCategory, id: 3 }, cursor: 'Mw==' },
      ],
      pageInfo: { startCursor: 'MQ==', endCursor: 'Mw==', hasNextPage: false },
    });
    expect(categoryRepositoryMock.getCategories).toHaveBeenCalledWith(
      undefined,
      undefined,
    );
  });

  it('should fail to get categories with invalid filters', async () => {
    // Arrange
    const filters = {
      active: 'invalid',
      parentId: 'invalid',
    };

    // Act & Assert
    await expect(
      categoryService.getCategories(filters as unknown),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should update a category', async () => {
    // Arrange
    const categoryUpdateInput = {
      name: 'Test Name',
      description: 'Test Description',
      parentId: null,
    };

    categoryRepositoryMock.updateCategory.mockResolvedValue(dummyCategory);

    // Act
    const result = await categoryService.updateCategory(1, categoryUpdateInput);

    // Assert
    expect(result).toEqual(dummyCategory);

    expect(categoryRepositoryMock.updateCategory).toHaveBeenCalledWith(1, {
      ...categoryUpdateInput,
    });
  });

  it('should fail to update a category if the category does not exist', async () => {
    // Arrange
    const nonExistentCategoryId = 999;
    const categoryUpdateInput = {
      name: 'Updated Test Name',
      description: 'Updated Test Description',
      parentId: null,
    };

    categoryRepositoryMock.getCategoryById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      categoryService.updateCategory(
        nonExistentCategoryId,
        categoryUpdateInput,
      ),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should delete a category', async () => {
    // Arrange
    categoryRepositoryMock.deleteCategory.mockResolvedValue(dummyCategory);

    // Act
    const result = await categoryService.deleteCategory(1);

    // Assert
    expect(result).toEqual(dummyCategory);
    expect(categoryRepositoryMock.deleteCategory).toHaveBeenCalledWith(1);
  });

  it('should fail to delete a non-existent category', async () => {
    const nonExistentCategoryId = 999;

    categoryRepositoryMock.getCategoryById.mockResolvedValue(null);

    await expect(
      categoryService.deleteCategory(nonExistentCategoryId),
    ).rejects.toThrowError(NotFoundException);
  });
});
