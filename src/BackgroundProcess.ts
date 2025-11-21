export class BackgroundProcess {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  command: string;
  outputStream: string[];
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  sessionId: string;
  tags: string[];
  pid?: number;
  global?: boolean;

  constructor(init: Partial<BackgroundProcess>) {
    this.id = init.id || 'task-' + Math.random().toString(36).substring(2, 9);
    this.name = init.name || '';
    this.status = init.status || 'pending';
    this.command = init.command || '';
    this.outputStream = init.outputStream || [];
    this.startedAt = init.startedAt;
    this.completedAt = init.completedAt;
    this.error = init.error;
    this.sessionId = init.sessionId || 'unknown';
    this.tags = init.tags || [];
    this.pid = init.pid;
    this.global = init.global || false;
  }

  recordOutput(line: string, isError: boolean = false): void {
    const formattedLine = isError ? `[ERROR] ${line}` : line;
    this.outputStream.push(formattedLine);
  }

  markCompleted(): void {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  markFailed(error: unknown): void {
    this.status = 'failed';
    this.error = error instanceof Error ? error.toString() : String(error);
    this.recordOutput(this.error, true);
  }

  cancel(): void {
    this.status = 'cancelled';
    this.recordOutput('Task forcibly terminated');
  }
}
