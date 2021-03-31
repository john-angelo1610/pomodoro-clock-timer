function App() {
    const [displayTime, setDisplayTime] = React.useState(25*60);
    const [breakTime, setBreakTime] = React.useState(5*60);
    const [sessionTime, setSessionTime] = React.useState(25*60);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);
    const [breakAudio, setBreakAudio] = React.useState(new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"));

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    };


    const formatTime = time => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;

        return (
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        );
    };

    const changeTime = (amount, type) => {
        if (type === 'break') {
            if (breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime(prev => prev + amount);
        } else {
            if (sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime(prev => prev + amount);
            if (!timerOn) {
                setDisplayTime(sessionTime + amount);
            }
        }
    };

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;

        if (!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date > nextDate) {
                    setDisplayTime(prev => {
                        if (prev <= 0 && !onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if (prev <=0 && onBreakVariable) {
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval);
        }

        if (timerOn) {
            clearInterval(localStorage.getItem('interval-id'));
        }

        setTimerOn(!timerOn);
    };

    const resetTime = () => {
        setDisplayTime(25*60);
        setBreakTime(5*60);
        setSessionTime(25*60);
    };

    return (
        <React.Fragment>
            <h1>25 + 5 Clock</h1>
            <div className="row">
                <Length
                    title="Break Length"
                    changeTime={changeTime}
                    type="break"
                    time={breakTime}
                    formatTime={formatTime}
                />
                <Length
                    title="Session length"
                    changeTime={changeTime}
                    type="session"
                    time={sessionTime}
                    formatTime={formatTime}
                />
            </div>
            <div id="clock">
                <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
                <h1 id="time-left">{formatTime(displayTime)}</h1>
            </div>
            <button id="start_stop" className="btn-large yellow darken-2" onClick={controlTime}>
                {timerOn ? 
                    <i className="material-icons">pause_circle_filled</i>
                    : <i className="material-icons">play_circle_filled</i>
                }
            </button>
            <button id="reset" className="btn-large yellow darken-2" onClick={resetTime}>
            <i className="material-icons">autorenew</i>
            </button>
        </React.Fragment>
    );
}

function Length({title, changeTime, type, time, formatTime}) {
    return (
        <div className="col s12 m6">
            <h3 id={`${type}-label`}>{title}</h3>
            <div className="time-sets">
                <button id={`${type}-increment`} onClick={() => changeTime(-60, type)} className="btn yellow darken-2">
                    <i className="material-icons">exposure_neg_1</i>
                </button>
                <h3 id={`${type}-length`}>{formatTime(time)}</h3>
                <button id={`${type}-decrement`} onClick={() => changeTime(60, type)} className="btn yellow darken-2">
                    <i className="material-icons">exposure_plus_1</i>
                </button>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector("#root"));