import React, { Component } from 'react'
import { Container, Divider, Dropdown, Grid, Header, Image, List, Menu, Segment, Form, Message, Dimmer, Loader,Select } from "semantic-ui-react";
import { addressListURL, addresscreateURL,countriesURL } from '../constants';
import { authAxios } from '../utils';

class Profile extends Component {
    state = { activeItem: 'billingAddress', addresses: [], loading: false, error: null, formData: {} }

    componentDidMount() {
        this.handleFetchAddresses();
    }

    // fetching addresses
    handleFetchAddresses = () => {
        this.setState({ loading: true })
        authAxios.get(addressListURL)
            .then(res => {
                this.setState({ addresses: res.data, loading: false })
            })
            .catch(err => { this.setState({ error: err }) })
    }

    // handle change
    handleChange = e => {
        const { formData } = this.state;
        const updatedFormData = {
            ...formData,
            [e.target.name]: e.target.value
        }
        this.setState({ formData: updatedFormData })
    }
    // creating addresses
    handleCreateAddresses = e => {
        e.preventDefault();
        const { formData } = this.state;
        console.log(formData)
    }

    handleItemClick = name => this.setState({ activeItem: name })
    render() {
        const { activeItem, error, loading, addresses } = this.state
        return (

            <Grid container columns={2} divided>
                {error &&
                    <Message negative>
                        <Message.Header>There was an error</Message.Header>
                        <p>{JSON.stringify(error)}</p>
                    </Message>}
                {loading &&
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>

                        <Image src='/images/wireframe/short-paragraph.png' />
                    </Segment>
                }
                <Grid.Row columns={1}>
                    <Grid.Column>
                        {addresses.map(address => {
                            return <div>
                                address.street_address
                    </div>

                        })}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Menu pointing vertical fluid>
                            <Menu.Item
                                name='Billing Address'
                                active={activeItem === 'billingAddress'}
                                onClick={() => this.handleItemClick('billingAddress')}
                            />
                            <Menu.Item
                                name='Shipping Address'
                                active={activeItem === 'shippingAddress'}
                                onClick={() => this.handleItemClick('shippingAddress')}
                            />
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Header>{`Update your ${activeItem === 'billingAddress' ? 'Billing Address' : 'Shipping Address'}  `}</Header>
                        <Divider />
                        <Form>
                            <Form.Input name='street_address' required placeholder='Street Address' onChange={this.handleChange} />
                            <Form.Input name='apartment_address' required placeholder='Apartment Address' onChange={this.handleChange} />
                            {/* <Form.Input name='country' placeholder='Country'/> */}
                            <Form.Field>
                                <Select name='country' placeholder='Country' required onChange={this.handleChange} fluid clearable search options={[]} />
                            </Form.Field>
                            <Form.Input name='zip' placeholder='ZIP code' required onChange={this.handleChange} />
                            <Form.Checkbox name='default' required primary label='Make this the default address' onChange={this.handleChange} />
                            <Form.Button secondary>Save</Form.Button>
                        </Form>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Profile
