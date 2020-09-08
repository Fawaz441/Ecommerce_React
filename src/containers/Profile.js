import React, { Component } from 'react'
import { Divider, Grid, Header, Image, Menu, Segment, Form, Message, Dimmer, Loader, Select, Card, Label, Button } from "semantic-ui-react";
import { addressListURL, addresscreateURL, countriesURL, useridURL, addressUpdateURL, addressDeleteURL } from '../constants';
import { authAxios } from '../utils';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
const UPDATE_FORM = 'UPDATE_FORM'
const CREATE_FORM = 'CREATE_FORM'


class AddressForm extends Component {
    state = {
        loading: false, error: null, formData: {
            default: false,
            address_type: "",
            apartment_address: "",
            country: "",
            default: true,
            id: '',
            street_address: "",
            user: '',
            zip: "",
        },
        saving: false, success: false
    }
    componentDidMount() {
        const { formType, address } = this.props;
        if (formType === UPDATE_FORM) {
            this.setState({ formData: address })
        }
    }

    handleToggleDefault = () => {
        const { formData } = this.state;
        const updatedFormData = {
            ...formData,
            default: !formData.default
        }
        this.setState({ formData: updatedFormData })
    }

    handleSubmit = () => {
        this.setState({ saving: true })
        const { formType } = this.props;
        if (formType === UPDATE_FORM) {
            this.handleupdateAddresses();
        }
        else {
            this.handleCreateAddresses();
        }
    }

    // creating addresses
    handleupdateAddresses = () => {
        this.setState({ saving: true })
        const { activeItem, userID } = this.props;
        const { formData } = this.state;
        authAxios.put(addressUpdateURL(formData.id), {
            ...formData,
            user: userID,
            address_type: activeItem === 'billingAddress' ? 'B' : 'S'
        })
            .then(res => {
                this.setState({ saving: false, success: true })
                this.props.Refesh();

            })
            .catch(err => { this.setState({ error: err }) })
    }

    handleCreateAddresses = e => {
        this.setState({ saving: true })
        e.preventDefault();
        const { userID, activeItem } = this.props;

        const { formData } = this.state;
        authAxios.post(addresscreateURL, {
            ...formData,
            user: userID,
            address_type: activeItem === 'billingAddress' ? 'B' : 'S'
        })
            .then(res => {
                this.setState({ saving: false, success: true })
                this.props.Refesh();
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

    render() {
        const { countries } = this.props;
        const { error, success, saving, formData } = this.state;
        return (
            <Form onSubmit={this.handleSubmit} success={success}>
                <Form.Input name='street_address' required placeholder='Street Address' onChange={this.handleChange} value={formData.street_address || ''} />
                <Form.Input name='apartment_address' required placeholder='Apartment Address' onChange={this.handleChange} value={formData.apartment_address} />
                {/* <Form.Input name='country' placeholder='Country'/> */}
                <Form.Field>
                    <Select name='country' placeholder='Country' loading={countries.length < 1} required onChange={this.handleSelectChange} fluid clearable search options={countries} value={formData.country} />
                </Form.Field>
                <Form.Input name='zip' placeholder='ZIP code' required onChange={this.handleChange} value={formData.zip} />
                <Form.Checkbox name='default' label='Make this the default address' onChange={this.handleToggleDefault} checked={formData.default} />
                <Form.Button type='submit' secondary disabled={saving} loading={saving}>Save</Form.Button>
                {success && (
                    <Message success content="Your address has been saved!" header='Success' />

                )}
                {error &&
                    <Message negative>
                        <Message.Header>There was an error</Message.Header>
                        <p>{JSON.stringify(error)}</p>
                    </Message>}
            </Form>

        )
    }
}




class Profile extends Component {
    state = { activeItem: 'billingAddress', addresses: [], userID: null, countries: [], selectedAddress: null, deleted: false }

    componentDidMount() {
        this.handleFetchAddresses();
        this.handleFetchCountries();
        this.handleFetchUserID();
    }


    handleSelectAddress = address => {
        this.setState({ selectedAddress: address })
        console.log(address)
    }

    // fetching addresses
    handleFetchAddresses = () => {
        this.setState({ loading: true })
        const { activeItem } = this.state;
        authAxios.get(addressListURL(activeItem === 'billingAddress' ? 'B' : 'S'))
            .then(res => {
                this.setState({ addresses: res.data, loading: false })
            })
            .catch(err => { this.setState({ error: err }) })

    }

    handleFetchUserID = () => {
        authAxios.get(useridURL)
            .then(res => {
                this.setState({ userID: res.data.userID })
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


    handleItemClick = name => {
        this.setState({ activeItem: name }, () => {
            this.handleFetchAddresses();
        })
    }

    handleRefresh = () => {
        this.handleFetchAddresses();
        this.setState({ selectedAddress: null })
    }


    handleDeleteAddress = address => {
        authAxios.delete(addressDeleteURL(address.id))
            .then(res =>{
                this.handleFetchAddresses()
                this.setState({ deleted: true })
    })
}

render() {
    const { activeItem, error, loading, addresses, countries, saving, success, selectedAddress, userID, deleted } = this.state
    const {isAuthenticated} = this.props;
    if(!isAuthenticated){
        return <Redirect to='/'></Redirect>
    }
    return (

        <Grid container columns={2} divided>
            {deleted && <Message>
                <Message.Header>Message deleted successfully</Message.Header>
            </Message>}
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
                        <Menu.Item
                            name='Payment History'
                            active={activeItem === 'shippingAddress'}
                            onClick={() => this.handleItemClick('shippingAddress')}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Header>{`Update your ${activeItem === 'billingAddress' ? 'Billing Address' : 'Shipping Address'}  `}</Header>
                    <Divider />
                    <Card.Group>
                        {addresses.map(address => {
                            return (
                                <Card key={address.id}>
                                    <Card.Content>
                                        {address.default && <Label as='a' color='blue' ribbon='right' >Default</Label>}
                                        <Card.Header>{address.country}</Card.Header>
                                        <Card.Meta>{address.street_address}</Card.Meta>
                                        <Card.Description>{address.zip}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Button color='green' onClick={() => this.handleSelectAddress(address)}>
                                            Update
                                            </Button>
                                        <Button color='red' onClick={() => this.handleDeleteAddress(address)}>
                                            Delete
                                            </Button>
                                    </Card.Content>
                                </Card>
                            )


                        })}
                    </Card.Group>
                    <Divider />
                    {selectedAddress === null ? <AddressForm countries={countries} formType={CREATE_FORM} userID={userID} activeItem={activeItem} Refresh={this.handleRefresh} />:null}
                    {selectedAddress && <AddressForm countries={countries} address={selectedAddress} formType={UPDATE_FORM} userID={userID} activeItem={activeItem} Refresh={this.handleRefresh} />}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
}


const mapStateToProps = state =>{
    return{
        isAuthenticated:state.auth.token !== null
    }
}

export default connect(mapStateToProps,null)(Profile)
