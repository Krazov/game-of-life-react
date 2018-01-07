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
                    key={'board'}
                    size={15}
                    running={this.state.running}
                />
                <Controls
                    key={'controls'}
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

const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], /* x */ [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

class Board extends React.Component {
    constructor(props) {
        super(props);

        const SIZE = props.size;

        this.state = {
            cells:  Array.from({length: SIZE ** 2}, () => 0),
            coords: Array.from({length: SIZE ** 2}, (_, i) => ({x: i % SIZE, y: (i / SIZE) | 0})),
            timeId: 0
        };
    }

    render() {
        const SIZE = this.props.size;
        const area = {length: SIZE};

        return (
            <table>
                <tbody>{Array.from(area, (_, h) =>
                    <tr key={'row-' + h}>{
                        Array.from(area, (_, w) => {
                            const index = SIZE * h + w;
                            const cells = this.state.cells;

                            return (
                                <Cell
                                    key={'cell-' + index}
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
        if (running && this.state.timeId === 0) {
            this.startTicking();
        } else {
            this.stopTicking();
        }
    }

    startTicking() {
        this.setState({
            timeId: setTimeout(this.performTick.bind(this), 1000)
        });
    }

    performTick() {
        console.log('Tick');

        this.setState({
            cells:  Board.getNewGeneration(this.state),
            timeId: setTimeout(this.performTick.bind(this), 1000)
        });
    }

    static getNewGeneration({coords, cells}) {
        return coords
            .map(Board.getNeighbours(cells, Math.sqrt(cells.length)))
            .map(Board.countNeighbours(cells))
            .map(Board.calculateLife(cells));
    }

    static getNeighbours(cells, size) {
        return ({x: baseX, y: baseY}, index, coords) =>
            directions
                .map(Board.calculatePosition(baseX, baseY, size))
                .map(Board.getIndexes(coords))
                .map(Board.extractNeighbours(cells));
    }

    static calculatePosition(baseX, baseY, size) {
        return ([currentX, currentY]) => {
            const x = baseX + currentX;
            const y = baseY + currentY;

            return [
                x > -1 ? x < size ? x : 0 : size - 1,
                y > -1 ? y < size ? y : 0 : size - 1
            ];
        };
    }

    static getIndexes(coords) {
        return ([nX, nY]) =>
            coords.findIndex(
                ({x, y}) => x == nX && y == nY
            );
    }

    static extractNeighbours(cells) {
        return (index) => cells[index];
    }

    static countNeighbours() {
        return (neighbours) =>
            neighbours.reduce(
                (count, life) => life > 0 ? count + 1 : count, 0
            );
    }

    static calculateLife(cells) {
        return (count, index) => {
            switch (Board.checkStatus(count)) {
            case true:
                return cells[index] + 1;
            case false:
                return 0;
            case null:
            default:
                return cells[index];
            }
        };
    }

    static checkStatus(neighbours) {
        return neighbours == 3
            ? true
            : neighbours == 2
                ? null
                : false;
    }

    stopTicking() {
        clearTimeout(this.state.timeId);

        this.setState({
            timeId: 0
        });
    }

    handleClick(index) {
        this.setState(Board.toggleState(this.state.cells, index));
    }

    static toggleState(cells, index) {
        return {
            cells: Object.assign(cells.slice(), {
                [index]: cells[index] === 0 ? 1 : 0
            })
        };
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
