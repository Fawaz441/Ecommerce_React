import React, { Component } from 'react'
import { Divider, Grid, Header, Image, Menu, Segment, Form, Message, Dimmer, Loader, Select } from "semantic-ui-react";
import { addressListURL, addresscreateURL, countriesURL, useridURL } from '../constants';
import { authAxios } from '../utils';

class Profile extends Component {
    state = { activeItem: 'billingAddress', addresses: [],userID:null, loading: false, error: null, formData: { default: false }, countries: [], saving: false, success: false }

    componentDidMount() {
        this.handleFetchAddresses();
        this.handleFetchCountries();
        this.handleFetchUserID();
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

    handleFetchUserID = () =>{
        authAxios.get(useridURL)
        .then(res => {
            this.setState({userID:res.data.userID})
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


    handleFormatCountries = (countries) => {
        const keys = Object.keys(countries);
        return keys.map(k => {
            return {
                key: k,
                text: countries[k],
                value: k,
            }
        })
    }

    handleFetchCountries = () => {
        authAxios.get(countriesURL)
            .then(res => {
                this.setState({ countries: this.handleFormatCountries(res.data) })
            })
            .catch(err => { this.setState({ error: err }) })
    }

    handleToggleDefault = () => {
        const { formData } = this.state;
        const updatedFormData = {
            ...formData,
            defalt: !formData.default
        }
        this.setState({ formData: updatedFormData })
    }

    // creating addresses
    handleCreateAddresses = e => {
        this.setState({ saving: true })
        e.preventDefault();
        const { activeItem, formData,userID } = this.state;
        authAxios.post(addresscreateURL, {
            ...formData,
            user:userID,
            address_type: activeItem === 'billingAddress' ? 'B' : 'S'
        })
            .then(res => {
                this.setState({ saing: false, success: true })
            })
            .catch(err => { this.setState({ error: err }) })
    }

    handleSelectChange = (e, { name, value }) => {
        const { formData } = this.state;
        const updatedFormData = {
            ...formData,
            [name]: value
        }
        this.setState({ formData: updatedFormData })
    }

    handleItemClick = name => {
        this.setState({ activeItem: name })
        this.handleCreateAddresses();
    }
    render() {
        const { activeItem, error, loading, addresses, countries, saving, success } = this.state
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
                            return <div key={address.id}>
                                {address.street_address}
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
                        <Form onSubmit={this.handleCreateAddresses} success={success}>
                            <Form.Input name='street_address' required placeholder='Street Address' onChange={this.handleChange} />
                            <Form.Input name='apartment_address' required placeholder='Apartment Address' onChange={this.handleChange} />
                            {/* <Form.Input name='country' placeholder='Country'/> */}
                            <Form.Field>
                                <Select name='country' placeholder='Country' loading={countries.length < 1} required onChange={this.handleSelectChange} fluid clearable search options={countries} />
                            </Form.Field>
                            <Form.Input name='zip' placeholder='ZIP code' required onChange={this.handleChange} />
                            <Form.Checkbox name='default' primary label='Make this the default address' onChange={this.handleToggleDefault} />
                            <Form.Button type='submit' secondary disabled={saving} loading={saving}>Save</Form.Button>
                        </Form>
                        {success && (
                            <Message success content="Your address has been saved!">

                            </Message>
                        )}

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Profile
