import React, {Component} from 'react';
import {Flex, Box} from 'reflexbox';
import {Close} from 'rebass';
import calc from './calc';
import Chart from './Chart';
const LOCAL_STORAGE_ROWS_KEY = 'runwayRows';
const {localStorage} = window;

const makeRow = (label = "", value = "0", expr = "", enabled = true) => {
  return {
    id: `${0 | (Math.random() * 100000)}.${0 | (Math.random() * 100000)}`,
    label,
    value,
    expr,
    enabled,
  }
};

class RowEditor extends Component {
  render() {
    const {row, onRowChange} = this.props;
    return (<tr>
      <td>
        <input type="checkbox" checked={row.enabled} onChange={(e) => onRowChange(row, 'enabled', e.target.checked)}/>
      </td>
      <td>
        <input type="text" value={row.label} onInput={(e) => onRowChange(row, 'label', e.target.value)}/>
      </td>
      <td>
        <input type="text" value={row.value} onInput={(e) => onRowChange(row, 'value', e.target.value)}/>
      </td>
      <td>
        <input type="text" value={row.expr} onInput={(e) => onRowChange(row, 'expr', e.target.value)}/>
      </td>
      <td><Close onClick={() => onRowChange(row, 'delete', true)}/></td>
    </tr>);
  }
}

class RowTable extends Component {
  render() {
    const {rows, onRowChange} = this.props;
    const newRow = makeRow();
    return (
      <table className="row-table">
        <thead>
        <tr>
          <th>&nbsp;</th>
          <th>Label</th>
          <th>Value</th>
          <th>Date Expression</th>
          <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        {[].concat(rows, newRow).map((r) => <RowEditor row={r} onRowChange={onRowChange} key={r.id}/>)}
        </tbody>
      </table>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    const now = new Date();

    const rows = (localStorage ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_ROWS_KEY) || '[]') : []);
    this.state = {
      start: `${now.getFullYear()}-01-01`,
      end: `${now.getFullYear() + 2}-01-01`,
      rows,
    };
    this.onRowChange = this.onRowChange.bind(this);
  }

  componentDidUpdate() {
    if(localStorage) {
      localStorage.setItem(LOCAL_STORAGE_ROWS_KEY, JSON.stringify(this.state.rows));
    }
  }

  render() {
    const {rows, start, end} = this.state;
    const data = calc(rows, start, end);
    return (
      <Flex style={{minHeight: '100vh'}}>
        <Box col={4}>
          <RowTable rows={rows} onRowChange={this.onRowChange}/>
        </Box>
        <Box col={8}>
          <Flex column>
            <Box>
              <Flex>
                <Box>
                  <input type="date" value={start} onChange={(e) => this.setState({start: e.target.value})}/>
                </Box>
                <Box>
                  <input type="date" value={end} onChange={(e) => this.setState({end: e.target.value})}/>
                </Box>
              </Flex>
            </Box>
            <Box flex>
              <Chart data={data}/>
            </Box>
          </Flex>
        </Box>
      </Flex>
    );
  }

  onRowChange(row, prop, value) {
    let rows = this.state.rows;
    if (prop === 'delete') {
      rows = rows.filter((tRow) => tRow !== row);
    } else {
      row[prop] = value;
      if (rows.indexOf(row) === -1) {
        rows.push(row);
      }
    }
    this.setState({rows: rows});
  }
}

export default App;
