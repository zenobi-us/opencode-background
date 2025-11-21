# OpenCode Background Tasks Plugin

A flexible background task management plugin for OpenCode.

## Installation

1. Install the plugin:
```bash
bun add @zenobius/opencode-background
```

2. Add to OpenCode Configuration

Create or edit your OpenCode configuration file (typically `~/.config/opencode/config.json`):

```json
{
  "plugins": [
    {
      "name": "@zenobius/opencode-background",
      "enabled": true
    }
  ]
}
```

## Features

- 🚀 Create background tasks with real-time output tracking
- 🏷️ Tag and categorize tasks
- 🔍 Advanced task filtering
- 🔪 Selective task termination
- 🌐 Global and session-specific task support

## Usage in OpenCode

### Creating a Background Task

```
⚙ createBackgroundTask 
  command=/tmp/long-task.sh 
  name="Long Running Task" 
  tags=["long-task", "processing"]
  global=false  # Optional: default is false
```

### Task Types

- **Session-Specific Tasks** (default):
  - Automatically terminated when the session ends
  - Useful for temporary, session-bound operations

- **Global Tasks**:
  - Persist across sessions
  - Continues running until explicitly stopped
  - Useful for long-running services or background processes

### Listing Tasks

```
# List tasks in current session
⚙ listBackgroundTasks 
  sessionId=current_session_id

# List tasks with specific tags
⚙ listBackgroundTasks 
  tags=["processing"]
```

### Killing Tasks

```
# Kill a specific task
⚙ killTasks 
  taskId=specific-task-id

# Kill all tasks in a session
⚙ killTasks 
  sessionId=current_session_id
```

## Plugin Methods

### `createBackgroundTask`
- `command`: Shell command to execute
- `name` (optional): Descriptive name for the task
- `tags` (optional): List of tags to categorize the task
- `global` (optional): 
  - `false` (default): Session-specific task
  - `true`: Task persists across sessions

### `listBackgroundTasks`
- `sessionId` (optional): Filter tasks by session
- `status` (optional): Filter tasks by status
- `tags` (optional): Filter tasks by tags

### `killTasks`
- `taskId` (optional): Kill a specific task
- `sessionId` (optional): Kill tasks in a specific session
- `status` (optional): Kill tasks with a specific status
- `tags` (optional): Kill tasks with specific tags

## Considerations

- Tasks are tracked in-memory 
- Output is captured for the last 100 lines
- Tasks can be in states: `pending`, `running`, `completed`, `failed`, `cancelled`
- ALL tasks are killed when OpenCode closes

## Contributing

Contributions are welcome! Please file issues or submit pull requests on the GitHub repository.

## License

[To be determined]