class TimerDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now(),
            },
            {
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null,
            },
        ],
    }

    createTimer = (timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        })
    }

    editTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map(timer => {
                if (timer.id === attrs.id) {
                    return Object.assign({}, timer, attrs)
                } else {
                    return timer
                }
            })
        })
    }

    deleteTimer = (timerId) => {
        this.setState({
            timers: this.state.timers.filter(timer => timer.id !== timerId)
        })
    }

    toggleTimer = (timerId) => {
        const now = Date.now()
        this.setState({
            timers: this.state.timers.map(timer => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        runningSince: timer.runningSince === null ? now : null,
                        elapsed: timer.runningSince === null ? timer.elapsed : timer.elapsed + (now - timer.runningSince)
                    })
                } else {
                    return timer
                }
            })
        })
    }

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimeList
                        timers={this.state.timers}
                        onFormSubmit={this.editTimer}
                        onDeleteClick={this.deleteTimer}
                        onToggleClick={this.toggleTimer}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.createTimer}
                    />
                </div>
            </div>
        )
    }
}

class EditableTimeList extends React.Component {
    render() {
        const timers = this.props.timers.map((timer) => (
            <EditableTimer
                key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
                onFormSubmit={this.props.onFormSubmit}
                onDeleteClick={this.props.onDeleteClick}
                onToggleClick={this.props.onToggleClick}
            />
        ))
        return (
            <div id='timers'>
                {timers}
            </div>
        )
    }
}

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false,
    }

    openForm = () => {
        this.setState({ editFormOpen: true })
    }

    closeForm = () => {
        this.setState({ editFormOpen: false })
    }

    submitForm = (timer) => {
        this.props.onFormSubmit(timer)
        this.closeForm()
    }

    deleteTimer = () => {
        this.props.onDeleteClick(this.props.id)
    }


    toggleTimer = () => {
        this.props.onToggleClick(this.props.id)
    }

    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.submitForm}
                    onFormClose={this.closeForm}
                />
            )
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.openForm}
                    onDeleteClick={this.deleteTimer}
                    onToggleClick={this.toggleTimer}
                />
            )
        }
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || '',
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }

    handleProjectChange = (e) => {
        this.setState({ project: e.target.value })
    }

    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        })
    }

    render() {
        const submitText = this.props.title ? 'Update' : 'Create'
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input
                                type='text'
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input
                                type='text'
                                value={this.state.project}
                                onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button
                                className='ui basic blue button'
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>
                            <button
                                className='ui basic red button'
                                onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false,
    }

    openForm = () => {
        this.setState({ isOpen: true })
    }

    closeForm = () => {
        this.setState({ isOpen: false })
    }

    submitForm = (timer) => {
        this.props.onFormSubmit(timer)
        this.closeForm()
    }

    render() {
        if (this.state.isOpen) {
            return (
                <TimerForm
                    onFormSubmit={this.submitForm}
                    onFormClose={this.closeForm}
                />
            )
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button
                        className='ui basic button icon'
                        onClick={this.openForm}
                    >
                        <i className='plus icon' />
                    </button>
                </div>
            )
        }
    }
}

class Timer extends React.Component {

    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50)
    }

    componentWillUnmount() {
        clearInterval(this.forceUpdateInterval)
    }

    render() {
        const elapsedString = helpers.renderElapsedString(
            this.props.elapsed,
            this.props.runningSince
        )
        const buttonName = this.props.runningSince === null ? 'Start' : 'Stop'
        const buttonColor = this.props.runningSince === null ? 'green' : 'red'

        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
                        <span
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}
                        >
                            <i className='edit icon' />
                        </span>
                        <span
                            className='right floated trash icon'
                            onClick={this.props.onDeleteClick}
                        >
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div
                    className={`ui bottom attached ${buttonColor} basic button`}
                    onClick={this.props.onToggleClick}
                >
                    {buttonName}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <TimerDashboard />,
    document.getElementById('content')
)