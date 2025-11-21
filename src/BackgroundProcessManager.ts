import { execa } from 'execa';
import { BackgroundProcess } from './BackgroundProcess';

export class BackgroundProcessManager {
  private tasks: Map<string, BackgroundProcess> = new Map();

  createTask(input: {
    command: string;
    name?: string;
    tags?: string[];
    global?: boolean;
    sessionId?: string;
  }): string {
    const subprocess = execa(input.command, {
      shell: true,
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const task = new BackgroundProcess({
      command: input.command,
      name: input.name || input.command,
      tags: input.tags,
      global: input.global ?? false, // Ensure default to false
      sessionId: input.sessionId,
      pid: subprocess.pid,
      status: 'running',
      startedAt: new Date(),
    });

    this.tasks.set(task.id, task);

    subprocess.stdout?.on('data', (chunk: Buffer) => {
      const line = chunk.toString().trim();
      if (line) task.recordOutput(line);
    });

    subprocess.stderr?.on('data', (chunk: Buffer) => {
      const line = chunk.toString().trim();
      if (line) task.recordOutput(line, true);
    });

    subprocess
      .then(() => {
        task.markCompleted();
      })
      .catch((error: unknown) => {
        task.markFailed(error);
      });

    return task.id;
  }

  getTask(taskId: string): string {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    return JSON.stringify({
      id: task.id,
      name: task.name,
      status: task.status,
      command: task.command,
      startedAt: task.startedAt?.toISOString() || '',
      completedAt: task.completedAt?.toISOString() || '',
      error: task.error || '',
      sessionId: task.sessionId,
      tags: task.tags,
      pid: task.pid,
      global: task.global,
      outputStream: task.outputStream.slice(-100),
    });
  }

  listTasks(filters: { sessionId?: string; status?: string; tags?: string[] }): string {
    const filteredTasks = Array.from(this.tasks.values()).filter((task) => {
      const sessionMatch = !filters.sessionId || task.sessionId === filters.sessionId;
      const statusMatch = !filters.status || task.status === filters.status;
      const tagMatch =
        !filters.tags ||
        filters.tags.length === 0 ||
        filters.tags.some((tag) => task.tags.includes(tag));

      return sessionMatch && statusMatch && tagMatch;
    });

    const taskList = filteredTasks.map((task) => ({
      id: task.id,
      name: task.name,
      status: task.status,
      command: task.command,
      startedAt: task.startedAt?.toISOString() || '',
      completedAt: task.completedAt?.toISOString() || '',
      error: task.error || '',
      sessionId: task.sessionId,
      tags: task.tags,
      pid: task.pid,
      global: task.global,
      outputStream: task.outputStream.slice(-10),
    }));

    return JSON.stringify(taskList);
  }

  killTasks(input: {
    taskId?: string;
    sessionId?: string;
    status?: string;
    tags?: string[];
  }): string {
    const killedTasks: string[] = [];

    const handleTaskKill = (task: BackgroundProcess) => {
      try {
        if (task.pid) {
          process.kill(task.pid);
        }
        task.cancel();
        killedTasks.push(task.id);
      } catch (error) {
        task.recordOutput(
          `Kill error: ${error instanceof Error ? error.toString() : String(error)}`,
          true
        );
      }
    };

    if (input.taskId) {
      const specificTask = this.tasks.get(input.taskId);
      if (specificTask) {
        handleTaskKill(specificTask);
        return JSON.stringify(killedTasks);
      }
    }

    const tasksToKill = Array.from(this.tasks.values()).filter((task) => {
      const sessionMatch = !input.sessionId || task.sessionId === input.sessionId;
      const statusMatch = !input.status || task.status === input.status;
      const tagMatch =
        !input.tags || input.tags.length === 0 || input.tags.some((tag) => task.tags.includes(tag));

      return sessionMatch && statusMatch && tagMatch;
    });

    tasksToKill.forEach(handleTaskKill);

    return JSON.stringify(killedTasks);
  }

  cleanupSessionTasks(sessionId: string): void {
    const tasksToRemove = Array.from(this.tasks.values()).filter(
      (task) => task.sessionId === sessionId && !task.global
    );

    tasksToRemove.forEach((task) => {
      try {
        if (task.pid) {
          process.kill(task.pid);
        }
      } catch {
        //
      }
      this.tasks.delete(task.id);
    });
  }

  clearAllTasks(): void {
    for (const task of this.tasks.values()) {
      try {
        if (task.pid) {
          process.kill(task.pid);
        }
      } catch {
        //
      }
    }
    this.tasks.clear();
  }
}
