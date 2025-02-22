import { on } from 'events';
import { useState } from 'react';

export interface Task {
    id: number;
    title: string;
    description: string;
    is_completed: boolean;
    on_delete: (id: number) => void;
    on_status_change: (id: number) => void;
}

export default function TaskObject(props: Task) {
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3005/tasks/${props.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            console.log('Response data:', data);
            props.on_delete(props.id);
        }
        catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }

    };

    const handleStatusChange = async () => {
        try{
            const response = await fetch(`http://localhost:3005/tasks/${props.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({is_completed: !props.is_completed}),
                credentials: 'include'
            });
            props.on_status_change(props.id);
        }
        catch(error){
            console.error('Error updating task:', error);
            alert('Failed to update task');
        }
    };
        

    return (
        <div className="task-container">
            <h2 className="task-title">{props.title}</h2>
            <p className="task-description">{props.description}</p>
            <div className="task-status">
                Status: {props.is_completed ? "Completed" : "Pending"}
            </div>
            <button className="task-button" onClick={handleStatusChange}>
                {props.is_completed ? "Mark Pending" : "Mark Completed"}
            </button>
            <button className="task-button" onClick={handleDelete}>Delete Task</button>
        </div>
    );
}