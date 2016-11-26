import React, { Component, PropTypes } from 'react';

class FlightRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <input type="text" defaultValue="baggage" />
                <input type="number" step="any" defaultValue={4.04} />
                <select defaultValue="usd">
                    <option value="usd">USD</option>
                    <option value="euro">EURO</option>
                </select>
                <input type="text" />
            </div>
        );
    }
}

export default FlightRow;
