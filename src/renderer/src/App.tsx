import { useState } from 'react'
import { ConfigProvider, Button, Input, Checkbox, Space, Card } from 'antd'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import 'antd/dist/reset.css'

type Task = {
  id: number
  text: string
  completed: boolean
}

function App(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const addTask = (): void => {
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false
        }
      ])
      setNewTask('')
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 4
        }
      }}
    >
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <img alt="logo" className="logo" src={electronLogo} />
        <div className="creator">Powered by electron-vite</div>

        {/* Task追加フォーム */}
        <Card title="新しいタスクを追加" style={{ marginBottom: '16px' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="タスクを入力..."
            />
            <Button type="primary" onClick={addTask}>
              追加
            </Button>
          </Space.Compact>
        </Card>

        {/* Taskリスト表示 */}
        <Card title="タスクリスト">
          <Space direction="vertical" style={{ width: '100%' }}>
            {tasks.map((todo) => (
              <Card
                key={todo.id}
                size="small"
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1
                }}
              >
                <Space>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => {
      setTasks(
        tasks.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
                      )
                    }}
                  />
                  {editingId === todo.id ? (
                    <Space.Compact>
                      <Input value={editText} onChange={(e) => setEditText(e.target.value)} />
                      <Button
                        type="primary"
                        onClick={() => {
                          setTasks(
                            tasks.map((t) => (t.id === todo.id ? { ...t, text: editText } : t))
                          )
                          setEditingId(null)
                        }}
                      >
                        保存
                      </Button>
                    </Space.Compact>
                  ) : (
                    <>
                      <span>{todo.text}</span>
                      <Button
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditText(todo.text)
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        danger
                        onClick={() => setTasks(tasks.filter((t) => t.id !== todo.id))}
                      >
                        削除
                      </Button>
                    </>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      </div>

      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </ConfigProvider>
  )
}

export default App
