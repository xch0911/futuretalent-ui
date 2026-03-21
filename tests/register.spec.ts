/**
 * 未来人才网 - 注册功能测试用例
 * 测试范围：注册表单、验证、API 调用、错误处理
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8081/api';

test.describe('注册功能 (Register)', () => {
  
  // 生成随机邮箱
  const generateEmail = () => `test_${Date.now()}@futuretalent.com`;
  const password = 'Test123456!';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
  });

  // ============ 表单验证测试 ============
  test.describe('表单验证', () => {
    
    test('应该显示注册页面标题', async ({ page }) => {
      await expect(page.locator('h1, h2')).toContainText(/注册|Register/i);
    });

    test('应该显示邮箱输入框', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="邮箱"], input[placeholder*="Email"]');
      await expect(emailInput).toBeVisible();
    });

    test('应该显示密码输入框', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"], input[placeholder*="密码"], input[placeholder*="Password"]');
      await expect(passwordInput).toBeVisible();
    });

    test('应该显示注册按钮', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], button:has-text("注册"), button:has-text("Register")');
      await expect(submitButton).toBeVisible();
    });

    test('空邮箱应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await passwordInput.fill(password);
      await submitButton.click();
      
      // 检查是否有错误提示
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"], .error-message');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });

    test('空密码应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(generateEmail());
      await submitButton.click();
      
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"], .error-message');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });

    test('无效邮箱格式应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill('invalid-email');
      await passwordInput.fill(password);
      await submitButton.click();
      
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"], .error-message');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });

    test('密码长度不足应该显示错误提示', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(generateEmail());
      await passwordInput.fill('123'); // 密码太短
      
      await submitButton.click();
      
      const errorMessages = page.locator('.ant-form-item-explain-error, [role="alert"], .error-message');
      await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
    });
  });

  // ============ API 接口测试 ============
  test.describe('注册 API', () => {
    
    test('POST /api/auth/register 应该接受注册请求', async ({ request }) => {
      const email = generateEmail();
      
      const response = await request.post(`${API_URL}/auth/register`, {
        data: {
          email: email,
          password: password
        }
      });
      
      // 注册应该成功或返回明确的错误信息
      expect(response.ok() || response.status() === 400 || response.status() === 409).toBeTruthy();
      
      const data = await response.json();
      console.log('Register response:', data);
    });

    test('重复邮箱应该返回错误', async ({ request }) => {
      // 先注册一个用户
      const email = generateEmail();
      
      await request.post(`${API_URL}/auth/register`, {
        data: {
          email: email,
          password: password
        }
      });
      
      // 尝试用相同邮箱再次注册
      const response2 = await request.post(`${API_URL}/auth/register`, {
        data: {
          email: email,
          password: password
        }
      });
      
      // 应该返回错误（邮箱已存在）
      expect(response2.status()).toBe(400);
      
      const data = await response2.json();
      expect(data.code).not.toBe(0);
      expect(data.message).toContain(/已存在 | 重复 | exists/i);
    });
  });

  // ============ 完整注册流程测试 ============
  test.describe('完整注册流程', () => {
    
    test('应该能够成功注册新用户', async ({ page, request }) => {
      const email = generateEmail();
      const testName = 'Test User';
      
      // 填写注册表单
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const nameInput = page.locator('input[placeholder*="昵称"], input[placeholder*="Name"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(email);
      await passwordInput.fill(password);
      
      // 如果有昵称输入框
      if (await nameInput.count() > 0) {
        await nameInput.fill(testName);
      }
      
      // 提交表单
      await submitButton.click();
      
      // 等待响应（可能跳转到登录页或首页）
      await page.waitForTimeout(2000);
      
      // 检查是否注册成功（跳转到其他页面或显示成功消息）
      const currentUrl = page.url();
      const successMessages = page.locator('.ant-message-success, [role="alert"]:has-text("成功"), .success-message');
      
      // 要么跳转，要么显示成功消息
      const isNavigated = currentUrl.includes('/login') || currentUrl.includes('/ideas') || currentUrl === BASE_URL + '/';
      const isSuccessMessage = await successMessages.count() > 0;
      
      expect(isNavigated || isSuccessMessage).toBeTruthy();
    });

    test('注册后应该能够登录', async ({ page, request }) => {
      const email = generateEmail();
      
      // 先注册
      await request.post(`${API_URL}/auth/register`, {
        data: {
          email: email,
          password: password
        }
      });
      
      // 跳转到登录页
      await page.goto(`${BASE_URL}/login`);
      
      // 登录
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await emailInput.fill(email);
      await passwordInput.fill(password);
      await submitButton.click();
      
      // 等待登录成功
      await page.waitForTimeout(2000);
      
      // 检查是否登录成功（跳转到首页或显示用户信息）
      const currentUrl = page.url();
      expect(currentUrl.includes('/ideas') || currentUrl === BASE_URL + '/' || currentUrl.includes('/user')).toBeTruthy();
    });
  });

  // ============ 用户体验测试 ============
  test.describe('用户体验', () => {
    
    test('应该提供登录链接', async ({ page }) => {
      const loginLink = page.locator('a:has-text("登录"), a:has-text("Login"), a[href*="/login"]');
      await expect(loginLink.first()).toBeVisible();
    });

    test('点击登录链接应该跳转到登录页', async ({ page }) => {
      const loginLink = page.locator('a:has-text("登录"), a:has-text("Login"), a[href*="/login"]');
      await loginLink.first().click();
      
      await expect(page).toHaveURL(/.*\/login.*/);
    });

    test('密码输入框应该支持显示/隐藏', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');
      const toggleButton = page.locator('button[aria-label*="密码"], button[aria-label*="password"], .password-toggle');
      
      // 如果有显示/隐藏按钮
      if (await toggleButton.count() > 0) {
        await passwordInput.fill(password);
        await toggleButton.first().click();
        
        // 密码应该变成明文输入框
        const textInput = page.locator('input[type="text"]');
        await expect(textInput.first()).toBeVisible({ timeout: 2000 });
      }
    });
  });

  // ============ 安全性测试 ============
  test.describe('安全性', () => {
    
    test('密码不应该在 URL 中显示', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill(password);
      
      const currentUrl = page.url();
      expect(currentUrl).not.toContain(password);
    });

    test('注册请求应该使用 HTTPS（生产环境）', async ({ request }) => {
      // 这个测试仅用于提醒，开发环境可以使用 HTTP
      console.log('当前 API URL:', API_URL);
      console.log('生产环境建议使用 HTTPS');
    });
  });

  // ============ 响应式设计测试 ============
  test.describe('响应式设计', () => {
    
    test('应该在移动端正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
      
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('应该在桌面端正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput).toBeVisible();
    });
  });
});
