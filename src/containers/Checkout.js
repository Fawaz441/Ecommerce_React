import { authAxios } from '../utils'
import React, { Component } from 'react'
import { Container, Message, Loader, Segment, Image, Dimmer, Item } from 'semantic-ui-react'
import { orderSummaryURL } from '../constants'

class Checkout extends Component {
    state = {
        loading: false,
        data: {},
        error: null
    }

    componentDidMount() {
        this.setState({ loading: true })
        authAxios.get(orderSummaryURL)
            .then(res => {
                this.setState({
                    data: res.data,
                    loading: false,
                });
                console.log(res.data)
            })
            .catch(err => this.setState({ error: err, loading: false }))
    }

    render() {
        const { loading, data, error } = this.state;
        console.log(data.order_items)
        return (
            <Container>
                {loading &&
                    <Segment>
                        <Dimmer active inverted>
                            <Loader inverted>Loading</Loader>
                        </Dimmer>
                        <Image src='/images/wireframe/short-paragraph.png' />
                    </Segment>}
                {error && <Message negative content={JSON.stringify(error)}></Message>}
                <Item.Group>
                {data.order_items && data.order_items.map(item =>
                     <Item key={item.id}>
                       <Item.Image size='tiny' src={`http://127.0.0.1:8000${item.item.image}`} />
                 
                       <Item.Content>
                <Item.Header>{item.item.title} x {item.quantity}</Item.Header>
                         <Item.Meta>
                           <span className='price'>{item.total_price}</span>
                         </Item.Meta>
                         <Item.Description>{item.item.description}</Item.Description>
                       </Item.Content>
                     </Item>
                )}
                </Item.Group>
                <br></br>
                <Item>
                    <Item.Content>
                        <Item.Header><h1>Total Price: {data.total}</h1></Item.Header>
                    </Item.Content>
                </Item>
            </Container>
        )
    }
}

export default Checkout
