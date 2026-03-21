/**
 * 未来人才网 - 登录功能测试用例
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8081/api';

test.describe('登录功能 (Login)', () => {
  
  const testEmail = 'test_' + Date.now() + '@futuretalent.com';
  const testPassword = 'Test123456!';
  const testNickname = '测试用户';

  // 先注册一个测试用户
  test.beforeAll(async ({ request }) => {
    await request.post(`${API_URL}/auth/register`, {
      data: {
        nickname: testNickname,
        email: testEmail,
        password: testPassword
      }
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  // ============ 表单验证测试 ============
  test.describe('表单验证', () => {
    
    test('应该显示登录页面标题', async ({ page }) => {
      await expect(page.locator('h1, h2')).toContainText(/登录|Login/i);
    });

    test('应该显示邮箱输入框', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="邮箱"]');
      await expect(emailInput).toBeVisible();
    });

    test('应该显示密码输入框', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"], input[placeholder*="密码"]');
      await expect(passwordInput).toBeVisible();
    });

    test('应该显示登录按钮', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], button:has-text("登录")');
      await expect(submitButton).toBeVisible();
    });

    test('空邮箱应该显示错误提示', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await passwordInput.fill(testPassword);
      await submitButton.click();
      
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });

    test('空密码应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(testEmail);
      await submitButton.click();
      
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });

    test('无效邮箱格式应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill('invalid-email');
      await passwordInput.fill(testPassword);
      await submitButton.click();
      
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"]');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ============ 登录流程测试 ============
  test.describe('登录流程', () => {
    
    test('使用正确的凭据应该登录成功', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(testEmail);
      await passwordInput.fill(testPassword);
      await submitButton.click();
      
      // 等待登录成功（跳转到首页或想法广场）
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl.includes('/ideas') || currentUrl === BASE_URL + '/').toBeTruthy();
    });

    test('错误的密码应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(testEmail);
      await passwordInput.fill('WrongPassword123');
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      // 应该显示错误消息
      const errorMessages = page.locator('.ant-message-error, [role="alert"]:has-text("错误"), .error-message');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });

    test('不存在的用户应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill('nonexistent@example.com');
      await passwordInput.fill(testPassword);
      await submitButton.click();
      
      await page.waitForTimeout(2000);
      
      const errorMessages = page.locator('.ant-message-error, [role="alert"]:has-text("错误")');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ============ 用户体验测试 ============
  test.describe('用户体验', () => {
    
    test('应该提供注册链接', async ({ page }) => {
      const registerLink = page.locator('a:has-text("注册"), a:has-text("Register"), a[href*="/register"]');
      await expect(registerLink.first()).toBeVisible();
    });

    test('点击注册链接应该跳转到注册页', async ({ page }) => {
      const registerLink = page.locator('a:has-text("注册"), a[href*="/register"]');
      await registerLink.first().click();
      
      await expect(page).toHaveURL(/.*\/register.*/);
    });

    test('忘记密码链接（如果有）', async ({ page }) => {
      const forgotLink = page.locator('a:has-text("忘记"), a:has-text("Forgot")');
      // 这个测试仅检查，如果没有忘记密码功能也不失败
      console.log('忘记密码链接数量:', await forgotLink.count());
    });
  });

  // ============ API 测试 ============
  test.describe('登录 API', () => {
    
    test('POST /api/auth/login 应该接受登录请求', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: testEmail,
          password: testPassword
        }
      });
      
      expect(response.ok()).toBeTruthy();
      
      const data = await response.json();
      expect(data.code).toBe(0);
      expect(data.data).toHaveProperty('token');
      expect(data.data).toHaveProperty('user');
    });

    test('错误的密码应该返回错误', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: testEmail,
          password: 'WrongPassword'
        }
      });
      
      const data = await response.json();
      expect(data.code).not.toBe(0);
    });
  });
});
