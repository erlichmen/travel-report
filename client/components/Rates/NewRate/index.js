import React, { PropTypes, Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Modal } from 'react-bootstrap';

class NewRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            value: 0,
        };
    }

    handleFormSubmit = data => {
        const { name, value } = this.state;
        this.props.closeModal({ name, value });
    }

    handleNameChange = e => {
        this.setState({ name: e.target.value });
    }

    handleValueChange = e => {
        this.setState({ value: e.target.value });
    }

    render() {
        const { name, value } = this.state;
        const { closeModal } = this.props;

        return (
            <Modal show={true} onHide={closeModal} bsSize="small">
                <Modal.Header>
                    <Modal.Title>Add Rate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup controlId="rate-name">
                        <ControlLabel>Name:</ControlLabel>
                        <FormControl
                            type="text"
                            onChange={this.handleNameChange}
                            value={name} />
                    </FormGroup>
                    <FormGroup controlId="rate-value">
                        <ControlLabel>Value:</ControlLabel>
                        <FormControl
                            type="number"
                            step="any"
                            min="0"
                            onChange={this.handleValueChange}
                            value={value} />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bsStyle="primary"
                        disabled={!Boolean(name) || !Boolean(value)}
                        onClick={this.handleFormSubmit}
                    >Add</Button>
                </Modal.Footer>
            </Modal>
        );
    }
};

export default NewRate;
