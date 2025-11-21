import { describe, it, expect } from 'vitest';
import { BackgroundTask } from './BackgroundTask';

describe('BackgroundTask', () => {
  describe('constructor', () => {
    it('should generate a unique id if not provided', () => {
      const task1 = new BackgroundTask({});
      const task2 = new BackgroundTask({});
      expect(task1.id).not.toBe(task2.id);
    });

    it('should set default values when no init params are provided', () => {
      const task = new BackgroundTask({});
      expect(task.name).toBe('');
      expect(task.status).toBe('pending');
      expect(task.command).toBe('');
      expect(task.outputStream).toEqual([]);
      expect(task.sessionId).toBe('unknown');
      expect(task.tags).toEqual([]);
      expect(task.global).toBe(false);
    });

    it('should override default values with provided init params', () => {
      const initParams = {
        name: 'Test Task',
        status: 'running' as const,
        command: 'ls -l',
        sessionId: 'test-session',
        tags: ['test'],
        global: true,
      };
      const task = new BackgroundTask(initParams);
      expect(task.name).toBe('Test Task');
      expect(task.status).toBe('running');
      expect(task.command).toBe('ls -l');
      expect(task.sessionId).toBe('test-session');
      expect(task.tags).toEqual(['test']);
      expect(task.global).toBe(true);
    });
  });

  describe('recordOutput', () => {
    it('should add line to outputStream', () => {
      const task = new BackgroundTask({});
      task.recordOutput('Test output');
      expect(task.outputStream).toContain('Test output');
    });

    it('should add error line with [ERROR] prefix', () => {
      const task = new BackgroundTask({});
      task.recordOutput('Test error', true);
      expect(task.outputStream).toContain('[ERROR] Test error');
    });
  });

  describe('markCompleted', () => {
    it('should set status to completed and record completedAt', () => {
      const task = new BackgroundTask({});
      const beforeTime = new Date();
      task.markCompleted();
      expect(task.status).toBe('completed');
      expect(task.completedAt).toBeTruthy();
      expect(task.completedAt?.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    });
  });

  describe('markFailed', () => {
    it('should set status to failed and record error', () => {
      const task = new BackgroundTask({});
      const error = new Error('Test error');
      task.markFailed(error);
      expect(task.status).toBe('failed');
      expect(task.error).toBe(error.toString());
      expect(task.outputStream).toContain('[ERROR] ' + error.toString());
    });

    it('should handle non-Error objects', () => {
      const task = new BackgroundTask({});
      const error = 'Simple error string';
      task.markFailed(error);
      expect(task.status).toBe('failed');
      expect(task.error).toBe(error);
      expect(task.outputStream).toContain('[ERROR] ' + error);
    });
  });

  describe('cancel', () => {
    it('should set status to cancelled and record output', () => {
      const task = new BackgroundTask({});
      task.cancel();
      expect(task.status).toBe('cancelled');
      expect(task.outputStream).toContain('Task forcibly terminated');
    });
  });
});
