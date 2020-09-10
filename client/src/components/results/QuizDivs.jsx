import React, { useState } from 'react';
import { MDBBtn } from 'mdbreact';
import Collapse from 'react-bootstrap/Collapse'

const QuizDiv = ({ name, ID, results}) => {
    const [open, setOpen] = useState(false);
    return(
        <div class='text-center'>
        <MDBBtn
            class='btn btn-primary btn-md'
            onClick={() => setOpen(!open)}
            aria-controls={ID}
            aria-expanded={open}
        >
            {name}
        </MDBBtn>
        <Collapse in={open}>
            <div id={ID}>
            <table class='table table-bordered table-responsive-md table-striped text-center'>
                      <thead>
                        <tr>
                          <th class='text-center'>Rank</th>
                          <th class='text-center'>Email</th>
                          <th class='text-center'>Quiz Name</th>
                          <th class='text-center'>Score</th>
                          <th class='text-center'>Start Time</th>
                          <th class='text-center'>End Time</th>
                          <th class='text-center'>View Quiz</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results}
                      </tbody>
                    </table>
            </div>
        </Collapse>      
        </div>
    );
}


export default QuizDiv;