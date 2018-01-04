import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            running: false
        };
    }

    render() {
        const HEADER = 'Game of Life';

        return (
            <React.Fragment>
                <h1>{HEADER}</h1>
                <Board
                    size={15}
                    running={this.state.running}
                />
                <Controls
                    toStart={this.startGame.bind(this)}
                    toStop={this.stopGame.bind(this)}
                />
            </React.Fragment>
        );
    }

    startGame() {
        this.setState({running: true});
    }

    stopGame() {
        this.setState({running: false});
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cells:  Array.from({length: props.size ** 2}, () => 0),
            timeId: 0
        };
    }

    render() {
        const size = {length: this.props.size};

        return (
            <table>
                <tbody>{Array.from(size, (_, h) =>
                    <tr>{
                        Array.from(size, (_, w) => {
                            const index = this.props.size * h + w;
                            const cells = this.state.cells;

                            return (
                                <Cell
                                    life={cells[index]}
                                    onClick={() => this.handleClick(index)}
                                />
                            );
                        })
                    }</tr>
                )}</tbody>
            </table>
        );
    }

    componentWillReceiveProps({running = false}) {
        if (running) {
            this.startTicking();
        } else {
            this.stopTicking();
        }
    }

    startTicking() {
        this.setState({
            timeId: setTimeout(this.performTic.bind(this), 1000)
        });
    }

    performTic() {
        console.log('Tic');

        this.setState({
            timeId: setTimeout(this.performTic.bind(this), 1000)
        });
    }

    stopTicking() {
        clearTimeout(this.state.timeId);

        this.setState({
            timeId: 0
        });
    }

    handleClick(index) {
        this.setState({cells: Board.toggleState(this.state.cells, index)});
    }

    static toggleState(cells, index) {
        return Object.assign(cells.slice(), {
            [index]: cells[index] === 0 ? 1 : 0
        });
    }
}

function Cell({life, onClick}) {
    return (
        <td
            data-life={life}
            onClick={onClick}
        >{life}</td>
    );
}

function Controls(props) {
    const START = 'Start';
    const STOP  = 'Stop';

    return (
        <React.Fragment>
            <button onClick={() => props.toStart()}>{START}</button>
            <button onClick={() => props.toStop()}>{STOP}</button>
        </React.Fragment>
    );
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
