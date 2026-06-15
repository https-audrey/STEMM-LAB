// services/simpleTaskManager.ts
export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed';
  timestamp: Date;
}

class SimpleTaskManager {
  private tasks: Task[] = [];
  private activeTask: Task | null = null;

  addTask(name: string): void {
    const task: Task = {
      id: Date.now().toString(),
      name,
      status: 'pending',
      timestamp: new Date()
    };
    this.tasks.push(task);
    console.log(`📋 [TASK ADDED] ${name}`);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.activeTask) return;
    
    const nextTask = this.tasks.find(t => t.status === 'pending');
    if (!nextTask) return;
    
    this.activeTask = nextTask;
    nextTask.status = 'running';
    console.log(`▶️ [TASK STARTED] ${nextTask.name}`);
    
    setTimeout(() => {
      nextTask.status = 'completed';
      console.log(`✅ [TASK COMPLETED] ${nextTask.name}`);
      this.activeTask = null;
      this.processQueue();
    }, 800);
  }

  getStats(): { total: number; completed: number; pending: number } {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      pending: this.tasks.filter(t => t.status === 'pending').length
    };
  }

  logStatus(): void {
    const stats = this.getStats();
    console.log(`\n📊 TASK MANAGER - Total: ${stats.total} | Done: ${stats.completed} | Pending: ${stats.pending}\n`);
  }
}

export const taskManager = new SimpleTaskManager();