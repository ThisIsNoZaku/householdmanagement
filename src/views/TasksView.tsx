import * as React from "react";
import {FormattedDate, FormattedTime} from "react-intl";
import * as Modal from "react-modal";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {Button, Grid, IconButton, List, ListItem, ListItemText, Paper,
   TextField, Tooltip} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CancelCircleIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import NewTaskAction from "../actions/NewTaskAction";
import RemoveTaskAction from "../actions/RemoveTaskAction";

import AppState from "../state/AppState";
import ProtectedRoute from "../state/AuthenticatedRoute";
import Task from "../state/tasks/Task";
import TaskState from "../state/TaskState";

import css from "./TasksView.css";

Modal.setAppElement("#root");

const modalStyle = {
  content: {
    width: "50%",
    margin: "auto",
  }
}

@ProtectedRoute("/login")
export class TasksView extends React.Component<TasksViewProps & TasksViewActions, TasksViewState> {

  constructor(props: any) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.showNewTaskModal = this.showNewTaskModal.bind(this);
    this.createTask = this.createTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.state.showModal !== nextState.showModal;
  }

  public render() {
    return(<React.Fragment>
      <Grid
      container
      direction="column"
      justify="center"
      alignItems="stretch"
      spacing={16}
      >
        <Grid item xs={12}>
          <Paper>
            <Grid container
              justify="center"
              direction="column"
              alignItems="stretch">
              <Grid item>
                <div style={{textAlign: "center"}}>
                  To-Dos
                </div>
              </Grid>
              <Grid item>
                <List>
                  {this.props.tasks.tasks.map((task: Task, index: number) => {
                return (
                  <ListItem button key={task.title}>
                    <Tooltip title="Complete">
                      <IconButton>
                        <CheckCircleIcon color="primary"/>
                      </IconButton>
                    </Tooltip>
                    <ListItemText primary={task.title} secondary={
                      (<React.Fragment>
                        <FormattedDate value={task.due}/>
                        -
                        <FormattedTime value={task.due}/>
                       </React.Fragment>
                      )
                    }/>
                    <Tooltip title="Delete">
                      <IconButton onClick={this.removeTask.bind(this, task)}>
                        <CancelCircleIcon color="error"/>
                      </IconButton>
                    </Tooltip>
                  </ListItem>);
              })}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <div style={{textAlign: "center"}}>
            <Button variant="fab" color="primary" onClick={this.showNewTaskModal}>
              <AddIcon />
            </Button>
          </div>
        </Grid>
      </Grid>
      <Modal
        isOpen={this.state.showModal}
        style={modalStyle}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center">
          <Grid item  container xs={12}>
            <Grid item xs={12}>
              <div>Create new Task</div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                placeholder="Name"
                onChange={(e: any) => {
                this.setState({
                  taskTitle: e.target.value,
                });
                }}>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
              type="datetime-local"
              onChange={(e: any) => {this.setState({
                  taskDueDate: new Date(Date.parse(e.target.value)),
                });
              }}
                />
            </Grid>
          </Grid>
          <Grid xs={12} item>
            <Button color="primary" variant="contained" onClick={this.createTask}>Create</Button>
          </Grid>
        </Grid>
      </Modal>
    </React.Fragment>
    );
  }

  private showNewTaskModal() {
    this.setState({
      showModal: true,
    });
  }

  private hideNewTaskModal() {
    this.setState({
      showModal: false,
    });
  }

  private createTask() {
    if (this.state.taskTitle && this.state.taskDueDate) {
      this.props.createTask(new Task(this.state.taskTitle,
        new Date(),
        this.state.taskDueDate));
      this.hideNewTaskModal();
    }
  }

  private removeTask(task: Task) {
    this.props.removeTask(task);
  }
}

interface TasksViewProps extends AppState {
  tasks: TaskState;
}

interface TasksViewActions {
  createTask: (task: Task) => void;
  removeTask: (task: Task) => void;
}

interface TasksViewState {
  showModal: boolean;
  taskTitle?: string;
  taskDueDate?: Date;
}

const connected = connect((appState: AppState) => {
  return appState;
}, (dispatch: Dispatch) => {
  return {
    createTask: (task: Task) => {
      dispatch({... new NewTaskAction(task)});
    },
    removeTask: (task: Task) => {
      dispatch({... new RemoveTaskAction(task)});
    },
  };
})(TasksView);

export default connected;
