import { test, expect, APIRequestContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

test.describe('Users API', () => {
  let testUser: User;
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:3000',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test.beforeEach(async () => {
    // Create a fresh test user for each test
    testUser = {
      id: uuidv4(),
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Clean up any existing users
    try {
      const users = await apiContext.get('/users');
      const userList = await users.json() as User[];
      for (const user of userList) {
        await apiContext.delete(`/users/${user.id}`).catch((err: Error) => {
          console.warn(`Failed to delete user ${user.id}:`, err.message);
        });
      }
    } catch (err) {
      const error = err as Error;
      console.warn('Cleanup failed:', error.message);
    }
  });

  test('should create a new user', async () => {
    const response = await apiContext.post('/users', {
      data: testUser
    });
    
    expect(response.ok()).toBeTruthy();
    const user = await response.json() as User;
    expect(user).toEqual(testUser);
  });

  test('should handle user creation with minimal data', async () => {
    const minimalUser = {
      name: 'Minimal User'
    };

    const response = await apiContext.post('/users', {
      data: minimalUser
    });
    
    expect(response.ok()).toBeTruthy();
    const user = await response.json() as User;
    expect(user.name).toBe(minimalUser.name);
    expect(user.id).toBeTruthy();
  });

  test('should handle empty user data', async () => {
    const emptyUser = {};

    const response = await apiContext.post('/users', {
      data: emptyUser
    });

    // API might auto-generate data or reject the request
    if (response.ok()) {
      const user = await response.json() as User;
      expect(user.id).toBeTruthy();
    } else {
      expect(response.status()).toBe(400);
    }
  });

  test('should get all users', async () => {
    // Create test user first
    await apiContext.post('/users', {
      data: testUser
    });

    const response = await apiContext.get('/users');
    expect(response.ok()).toBeTruthy();
    
    const users = await response.json() as User[];
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBe(1);
    expect(users[0]).toEqual(testUser);
  });

  test('should get user by ID', async () => {
    // Create test user first
    await apiContext.post('/users', {
      data: testUser
    });

    const response = await apiContext.get(`/users/${testUser.id}`);
    expect(response.ok()).toBeTruthy();
    
    const user = await response.json() as User;
    expect(user).toEqual(testUser);
  });

  test('should handle non-existent user request', async () => {
    const nonExistentId = uuidv4();
    const response = await apiContext.get(`/users/${nonExistentId}`);
    
    // API should indicate that the resource was not found
    expect(response.ok()).toBeFalsy();
    const status = response.status();
    // Accept either 404 Not Found or 204 No Content
    expect([404, 204]).toContain(status);
  });

  test('should update existing user', async () => {
    // Create test user first
    await apiContext.post('/users', {
      data: testUser
    });

    const updatedUser = {
      ...testUser,
      name: 'Updated Name',
      updatedAt: new Date().toISOString()
    };

    const response = await apiContext.put(`/users/${testUser.id}`, {
      data: updatedUser
    });
    
    expect(response.ok()).toBeTruthy();
    const user = await response.json() as User;
    expect(user).toEqual(updatedUser);
  });

  test('should handle update of non-existent user', async () => {
    const nonExistentId = uuidv4();
    const response = await apiContext.put(`/users/${nonExistentId}`, {
      data: testUser
    });
    
    // API should indicate that the resource was not found
    expect(response.ok()).toBeFalsy();
    const status = response.status();
    // Accept either 404 Not Found or 204 No Content
    expect([404, 204]).toContain(status);
  });

  test('should delete existing user', async () => {
    // Create test user first
    await apiContext.post('/users', {
      data: testUser
    });

    // Delete the user
    const deleteResponse = await apiContext.delete(`/users/${testUser.id}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // Verify user is deleted
    const getResponse = await apiContext.get(`/users/${testUser.id}`);
    expect(getResponse.ok()).toBeFalsy();
    const status = getResponse.status();
    // Accept either 404 Not Found or 204 No Content
    expect([404, 204]).toContain(status);

    // Verify users list is empty
    const listResponse = await apiContext.get('/users');
    const users = await listResponse.json() as User[];
    expect(users.length).toBe(0);
  });

  test('should handle deletion of non-existent user', async () => {
    const nonExistentId = uuidv4();
    const response = await apiContext.delete(`/users/${nonExistentId}`);
    
    // API should indicate that the resource was not found
    expect(response.ok()).toBeFalsy();
    const status = response.status();
    // Accept either 404 Not Found or 204 No Content
    expect([404, 204]).toContain(status);
  });
});