// Frontend/src/components/TaskList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../features/taskSlice';
import { Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material';

const TaskList = ({ onEditTask }) => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <Grid container spacing={2}>
      {items.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task._id}>
          <Card sx={{ minHeight: 200 }}>
            <CardContent>
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
              <Typography variant="body2" color="primary">
                Status: {task.status}
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => onEditTask(task)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TaskList;