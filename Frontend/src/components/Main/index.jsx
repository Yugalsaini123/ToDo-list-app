// Frontend/src/components/Main/index.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  TextField,
  Stack,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  Modal,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { fetchTasks, addTask, updateTask, deleteTask } from '../../features/taskSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: tasks, status, error } = useSelector(state => state.tasks);

  // Modal states
  const [taskModal, setTaskModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [taskDetailModal, setTaskDetailModal] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form states
  const [data, setData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleEditInput = (e) => {
    setSelectedTask({ ...selectedTask, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = (formData) => {
    if (!formData.title?.trim()) return 'Title is required';
    if (!formData.description?.trim()) return 'Description is required';
    if (formData.title.length > 100) return 'Title must be less than 100 characters';
    if (formData.description.length > 500) return 'Description must be less than 500 characters';
    return '';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const error = validateForm(data);
    if (error) {
      setFormError(error);
      return;
    }

    try {
      await dispatch(addTask(data)).unwrap();
      setTaskModal(false);
      setData({ title: '', description: '', status: 'pending' });
    } catch (error) {
      setFormError(error || 'Failed to create task');
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    const error = validateForm(selectedTask);
    if (error) {
      setFormError(error);
      return;
    }

    try {
      await dispatch(updateTask({
        id: selectedTask._id,
        task: selectedTask
      })).unwrap();
      setEditModal(false);
      setSelectedTask(null);
    } catch (error) {
      setFormError(error || 'Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        alert(error || 'Failed to delete task');
      }
    }
  };

  const handleDetail = (task) => {
    setSelectedTask(task);
    setTaskDetailModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'info';
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: 'Light Blue' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task Management App
            </Typography>
            <Button 
              color="inherit" 
              startIcon={<PersonIcon />}
              onClick={() => navigate('/profile')}
              sx={{ mr: 2 }}
            >
              Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Container sx={{ mt: 5 }}>
        {/* Action Bar */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={() => setTaskModal(true)}
                fullWidth
              >
                Create Task
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Tasks</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* Task Stats */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip label={`Total: ${tasks.length}`} color="primary" />
          <Chip label={`Pending: ${tasks.filter(t => t.status === 'pending').length}`} color="info" />
          <Chip label={`In Progress: ${tasks.filter(t => t.status === 'in-progress').length}`} color="warning" />
          <Chip label={`Completed: ${tasks.filter(t => t.status === 'completed').length}`} color="success" />
        </Box>

        {status === 'loading' && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Create Task Modal */}
        <Modal open={taskModal} onClose={() => setTaskModal(false)}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Create New Task
            </Typography>
            <form onSubmit={handleCreate}>
              <TextField
                label="Task Title"
                name="title"
                value={data.title}
                onChange={handleInput}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Task Description"
                name="description"
                value={data.description}
                onChange={handleInput}
                multiline
                rows={4}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Status"
                name="status"
                value={data.status}
                onChange={handleInput}
                fullWidth
                sx={{ mb: 2 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  Create
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setTaskModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>

        {/* Edit Task Modal */}
        <Modal open={editModal} onClose={() => setEditModal(false)}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Edit Task
            </Typography>
            <form>
              <TextField
                label="Task Title"
                name="title"
                value={selectedTask?.title || ''}
                onChange={handleEditInput}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Task Description"
                name="description"
                value={selectedTask?.description || ''}
                onChange={handleEditInput}
                multiline
                rows={4}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Status"
                name="status"
                value={selectedTask?.status || 'pending'}
                onChange={handleEditInput}
                fullWidth
                sx={{ mb: 2 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Box>
        </Modal>

        {/* Task Details Modal */}
        <Modal open={taskDetailModal} onClose={() => setTaskDetailModal(false)}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Task Details
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedTask?.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedTask?.description}
            </Typography>
            <Chip 
              label={selectedTask?.status} 
              color={getStatusColor(selectedTask?.status)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Created: {new Date(selectedTask?.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Updated: {new Date(selectedTask?.updatedAt).toLocaleString()}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setTaskDetailModal(false)}
            >
              Close
            </Button>
          </Box>
        </Modal>

        {/* Tasks Grid */}
        <Grid container spacing={3}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                      {task.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {task.description}
                    </Typography>
                    <Chip 
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => handleDetail(task)}
                      >
                        Details
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No tasks match your search criteria' 
                  : 'No tasks found. Create your first task!'}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Main;