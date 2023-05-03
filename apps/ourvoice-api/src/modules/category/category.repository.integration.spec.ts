import { NotFoundException } from '@nestjs/common';
import { seedMainDb } from '../../../prisma/seed';
import { PrismaService } from '../../database/prisma.service';
import { Test } from '@nestjs/testing';
import { CategoryRepository } from './category.repository';
import { numberToCursor } from '../../utils/cursor-pagination';

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    await seedMainDb();
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, CategoryRepository],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    categoryRepository = moduleRef.get(CategoryRepository);
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await prismaService.$disconnect();
  });

  it('should create a new category', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'create');
    const categoryData = {
      name: 'Test Category',
      description: 'Test Description',
      parentId: null,
      weight: 0,
    };

    // Act
    const createdCategory = await categoryRepository.createCategory(
      categoryData,
    );

    // Assert
    expect(createdCategory.name).toEqual(categoryData.name);
    expect(createdCategory.description).toEqual(categoryData.description);
    expect(createdCategory.parentId).toEqual(categoryData.parentId);
    expect(createdCategory.weight).toEqual(categoryData.weight);
    expect(prismaService.category.create).toHaveBeenCalledTimes(1);
  });

  it('should create a new category with a parent id', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'create');
    const categoryData = {
      name: 'Child Category of Category 1',
      description: 'Test Description',
      parentId: 1,
      weight: 0,
    };

    // Act
    const createdCategory = await categoryRepository.createCategory(
      categoryData,
    );

    // Assert
    expect(createdCategory.name).toEqual(categoryData.name);
    expect(createdCategory.description).toEqual(categoryData.description);
    expect(createdCategory.parentId).toEqual(categoryData.parentId);
    expect(createdCategory.weight).toEqual(categoryData.weight);
    expect(prismaService.category.create).toHaveBeenCalledTimes(1);
  });

  it('should get a category by id', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'findUnique');
    const firstCategory = {
      id: 1,
      name: 'Work Environment',
      description: 'Discuss the work environment and facilities',
      active: true,
      createdAt: new Date('2023-04-13T10:00:00.000Z'),
      disabledAt: null,
      parentId: null,
      weight: 0,
    };

    // Act
    const category = await categoryRepository.getCategoryById(1);
    console.log(category);

    // Assert
    expect(category).toEqual(firstCategory);
    expect(prismaService.category.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should fail to get a category by id', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'findUnique');

    // Act
    const category = await categoryRepository.getCategoryById(999);

    // Assert
    expect(category).toBeNull();
    expect(prismaService.category.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should get all categories', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'findMany');

    const categories = {
      categories: [
        {
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          description: 'Discuss the work environment and facilities',
          disabledAt: null,
          id: 1,
          name: 'Work Environment',
          parentId: null,
          weight: 0,
        },
        {
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          description: 'Share feedback about management and leadership',
          disabledAt: null,
          id: 2,
          name: 'Management',
          parentId: null,
          weight: 0,
        },
        {
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          description: 'Discuss company policies and procedures',
          disabledAt: null,
          id: 3,
          name: 'Policies',
          parentId: null,
          weight: 0,
        },
        {
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          description: 'Talk about career development and growth opportunities',
          disabledAt: null,
          id: 4,
          name: 'Career Growth',
          parentId: null,
          weight: 0,
        },
        {
          active: true,
          createdAt: new Date('2023-04-13T10:00:00.000Z'),
          description: 'Discuss teamwork and collaboration within the company',
          disabledAt: null,
          id: 5,
          name: 'Teamwork',
          parentId: null,
          weight: 0,
        },
      ],
      totalCount: 5,
    };

    // Act
    const allCategories = await categoryRepository.getCategories();

    // Assert
    expect(allCategories).toEqual(categories);
    expect(prismaService.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return all categories when no filter or pagination is provided', async () => {
    // Act
    jest.spyOn(prismaService.category, 'findMany');
    const categories = await categoryRepository.getCategories();

    // Assert
    expect(categories.categories.length).toEqual(5);
    expect(categories.totalCount).toEqual(5);
    expect(prismaService.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return categories according to the limit provided', async () => {
    // Act
    jest.spyOn(prismaService.category, 'findMany');
    const categories = await categoryRepository.getCategories(undefined, {
      limit: 2,
    });

    // Assert
    expect(categories.categories.length).toEqual(2);
    expect(categories.totalCount).toEqual(5);
    expect(prismaService.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return categories according to the cursor and limit provided', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'findMany');

    // Act
    const categories = await categoryRepository.getCategories(undefined, {
      cursor: numberToCursor(2),
      limit: 2,
    });

    // Assert
    expect(categories.categories.length).toEqual(2);
    expect(categories.totalCount).toEqual(5);
    expect(prismaService.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return categories when filter is provided', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'findMany');

    // Act
    const categories = await categoryRepository.getCategories(
      { description: 'work', active: true },
      null,
    );

    // Assert
    expect(categories.categories.length).toEqual(2);
    expect(categories.totalCount).toEqual(2);
    expect(prismaService.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should not return category with a partial match of the filters', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'findMany');

    // Act
    const categories = await categoryRepository.getCategories(
      { description: 'non-existent-description', active: true },
      null,
    );

    // Assert
    expect(categories.categories.length).toEqual(0);
    expect(categories.totalCount).toEqual(0);
    expect(prismaService.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should update an existing category', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'update');
    const categoryData = {
      name: 'Updated Test Category',
      description: 'Updated Test Description',
      parentId: null,
      weight: 100,
    };

    // Act
    const updatedCategory = await categoryRepository.updateCategory(
      1,
      categoryData,
    );

    // Assert
    expect(updatedCategory.name).toEqual(categoryData.name);
    expect(updatedCategory.description).toEqual(categoryData.description);
    expect(updatedCategory.parentId).toEqual(categoryData.parentId);
    expect(updatedCategory.weight).toEqual(categoryData.weight);
    expect(prismaService.category.update).toHaveBeenCalledTimes(1);
  });

  it('should update an existing category and resolve parent-child relations correctly', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'update');
    const categoryData = {
      name: 'Updated Test Category',
      description: 'Updated Test Description',
      parentId: 1,
      weight: 100,
    };

    // Act
    const updatedCategory = await categoryRepository.updateCategory(
      2,
      categoryData,
    );

    // Assert
    expect(updatedCategory.name).toEqual(categoryData.name);
    expect(updatedCategory.description).toEqual(categoryData.description);
    expect(updatedCategory.parentId).toEqual(categoryData.parentId);
    expect(updatedCategory.weight).toEqual(categoryData.weight);
    expect(prismaService.category.update).toHaveBeenCalledTimes(1);
  });

  it('should fail to update non existent category', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'update');
    const categoryData = {
      id: 999,
      name: 'Updated Test Category',
      description: 'Updated Test Description',
      parentId: null,
      weight: 0,
    };

    // Act & Assert
    await expect(
      categoryRepository.updateCategory(999, categoryData),
    ).rejects.toThrow(NotFoundException);
    expect(prismaService.category.update).toHaveBeenCalledTimes(0);
  });

  it('should delete an existing category', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'delete');

    // Act
    const deletedPost = await categoryRepository.deleteCategory(1);

    // Assert
    expect(deletedPost.id).toEqual(1);
    expect(prismaService.category.delete).toHaveBeenCalledTimes(1);
  });

  it('should fail to delete a non-existent category', async () => {
    // Arrange
    jest.spyOn(prismaService.category, 'delete');

    // Act & Assert
    await expect(categoryRepository.deleteCategory(999)).rejects.toThrow(
      NotFoundException,
    );
    expect(prismaService.category.delete).toHaveBeenCalledTimes(0);
  });
});
