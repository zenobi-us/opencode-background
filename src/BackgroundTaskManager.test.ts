import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BackgroundTaskManager } from './BackgroundTaskManager';
import { execa } from 'execa';
import { EventEmitter } from 'events';

// Define an interface to match the task structure
interface TestTask {
  id: string;
  command: string;
  name: string;
  status: string;
  sessionId: string;
  tags: string[];
  global?: boolean;
  outputStream: string[];
}

// Custom MockSubprocess class to match the expected interface
class MockSubprocess extends EventEmitter {
  pid: number;
  stdout: EventEmitter;
  stderr: EventEmitter;

  constructor() {
    super();
    this.pid = Math.floor(Math.random() * 1000000);
    this.stdout = new EventEmitter();
    this.stderr = new EventEmitter();
  }

  then(resolveCallback: () => void) {
    // Simulate promise-like behavior
    process.nextTick(() => {
      if (resolveCallback) resolveCallback();
    });
    return this;
  }

  catch() {
    return this;
  }

  kill() {
    // Simulate process killing
    return true;
  }
}

// Mocking external dependencies
vi.mock('execa', () => ({
  execa: vi.fn((command, options) => {
    const mockSubprocess = new MockSubprocess();
    (mockSubprocess as any).kill = vi.fn();
    return mockSubprocess;
  }),
}));

vi.mock('process', () => ({
  kill: vi.fn(() => true),
}));

describe('BackgroundTaskManager', () => {
  let taskManager: BackgroundTaskManager;

  beforeEach(() => {
    taskManager = new BackgroundTaskManager();
  });

  describe('Task Creation', () => {
    it('should log task details when all parameters are provided', () => {
      const taskId = taskManager.createTask({
        command: 'echo hello',
        name: 'Test Task',
        tags: ['test'],
        global: true,
        sessionId: 'test-session',
      });

      const task = JSON.parse(taskManager.getTask(taskId));
      console.log('Full task object:', task);

      expect(task.global).toBe(true);
    });

    it('should have global as false when not explicitly set', () => {
      const taskId = taskManager.createTask({
        command: 'echo hello',
        name: 'Test Task',
      });

      const task = JSON.parse(taskManager.getTask(taskId));
      console.log('Full task object (no global):', task);

      expect(task.global).toBe(false);
    });
  });

  describe('Task Termination', () => {
    it('should kill a specific task by id', () => {
      const spy = vi.spyOn(process, 'kill');
      spy.mockImplementation(() => true);

      const taskId = taskManager.createTask({
        command: 'echo hello',
        global: true,
        sessionId: 'test-session',
      });

      const killedTasks = JSON.parse(taskManager.killTasks({ taskId })) as string[];
      expect(killedTasks.length).toBe(1);
      expect(killedTasks[0]).toBe(taskId);
      expect(spy).toHaveBeenCalled();

      const task = JSON.parse(taskManager.getTask(taskId));
      expect(task.status).toBe('cancelled');
      expect(task.outputStream).toContain('Task forcibly terminated');
    });
  });
});
