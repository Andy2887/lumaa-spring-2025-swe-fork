import { Task } from "../../components/Task";
import TaskObject from "../../components/Task";
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';



export default function Tasks() { 
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState<string>('');
    const [newTaskDescription, setnewTaskDescription] = useState<string>('');
    const { username, userid } = useContext(AuthContext);

    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:3005/tasks', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDelete = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleStatusChange = (id: number) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    is_completed: !task.is_completed
                };
            }
            return task;
        }));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    async function createTask(ev : React.FormEvent) {
        ev.preventDefault();
        try {
            console.log('Sending request with:', {
                title: newTaskTitle,
                description: newTaskDescription,
                userid: userid
            });
            const response = await fetch('http://localhost:3005/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTaskTitle,
                    description: newTaskDescription,
                    userid: userid
                }),
                credentials: 'include'
            });
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create task');
            }
            setNewTaskTitle('');
            setnewTaskDescription('');
            
            await fetchTasks();
        }
        catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    }


    return (

        <div className="tasks-page">
            <h1>Welcome {username}</h1>
            
            <form onSubmit={createTask} className="task-form">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(ev) => setNewTaskTitle(ev.target.value)}
                    placeholder="Task Title"
                    required
                    className="task-input"
                />
                
                <textarea
                    value={newTaskDescription}
                    onChange={(ev) => setnewTaskDescription(ev.target.value)}
                    placeholder="Task Description"
                    required
                    className="task-input"
                />
                
                <button type="submit" className="submit-button">
                    Create Task
                </button>
            </form>

            <div className="tasks-list">
                {tasks.map(task => (
                    <TaskObject 
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        is_completed={task.is_completed}
                        on_delete={handleDelete}
                        on_status_change={handleStatusChange}
                    />
                ))}
            </div>
        </div>
    );
}