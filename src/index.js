import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Game() {
    const HEADER = 'Game of Life';

    return (
        <React.Fragment>
            <h1>{HEADER}</h1>
            <Table size={15}/>
        </React.Fragment>
    );
}

class Table extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cells: Array.from({length: props.size ** 2}, () => 0)
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

    handleClick(index) {
        this.setState({cells: Table.toggleState(this.state.cells, index)});
    }

    static toggleState(cells, index) {
        return Object.assign(cells.slice(), {
            [index]: cells[index] === 0 ? 1 : 0
        });
    }
}

function Cell(props) {
    return (
        <td
            data-life={props.life}
            onClick={props.onClick}
        >{props.life}</td>
    );
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
