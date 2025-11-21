# OpenCode Background Tasks Plugin

A flexible background task management plugin for OpenCode.

## Overview

This plugin extends OpenCode's functionality by providing robust background task management capabilities. It allows you to:

- Run long-running commands as background tasks
- Track tasks across OpenCode sessions
- Manage and filter tasks with advanced filtering
- Kill tasks selectively or en masse

## Features

- 🚀 Create background tasks with real-time output tracking
- 🏷️ Tag and categorize tasks
- 🔍 Advanced task filtering
- 🔪 Selective task termination

## Usage in OpenCode

### Creating a Background Task

```
⚙ createBackgroundTask 
  command=/tmp/long-task.sh 
  name="Long Running Task" 
  tags=["long-task", "processing"]
```

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
- `global` (optional): Boolean to mark task as persisting across sessions
  - `false` (default): Task is session-specific and will be terminated when the session ends
  - `true`: Task continues to run across sessions until explicitly stopped

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

- Tasks are tracked in-memory and reset between OpenCode sessions
- Output is captured for the last 100 lines
- Tasks can be in states: `pending`, `running`, `completed`, `failed`, `cancelled`

## Contributing

Contributions are welcome! Please file issues or submit pull requests on the GitHub repository.

## License

[To be determined]