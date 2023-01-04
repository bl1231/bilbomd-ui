import Table from 'react-bootstrap/Table';

function JobList() {
  return (
    <Table  striped borderless hover responsive size="sm">
      <thead>
        <tr>
          <th>JobID</th>
          <th>Job Title</th>
          <th>Time Started</th>
          <th>Status</th>
          <th>results/download</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>TopoII-thing1</td>
          <td>2023-01-02 08:12:21</td>
          <td>completed</td>
          <td><button>download</button></td>
        </tr>
        <tr>
          <td>2</td>
          <td>TopoII-thing2</td>
          <td>2023-01-02 09:12:21</td>
          <td>running</td>
          <td><button>download</button></td>
        </tr>
        <tr>
          <td>3</td>
          <td>TopoII-thing3</td>
          <td>2023-01-02 10:12:21</td>
          <td>pending</td>
          <td><button>download</button></td>
        </tr>
        <tr>
        <td>3</td>
          <td>TopoII-thing4</td>
          <td>2023-01-03 10:12:21</td>
          <td>submited</td>
          <td><button>download</button></td>
        </tr>
      </tbody>
    </Table>
  );
}

export default JobList;