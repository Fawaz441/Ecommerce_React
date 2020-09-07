import React from 'react'
import { Table, TableHeader, TableRow, TableHeaderCell, Container, TableBody, Button, TableCell, Label, Header, Message, Segment, Dimmer,Loader,Image } from 'semantic-ui-react'
import { authAxios } from '../utils'
import { orderSummaryURL } from '../constants'
import { Link } from 'react-router-dom'

class OrderSummary extends React.Component {
    state = {
        data: null,
        loading: false,
        error: null
    }
    componentDidMount() {
        this.setState({ loading: true })
        authAxios.get(orderSummaryURL)
            .then(res => {
                this.setState({
                    data: res.data,
                    loading: false
                })
            })
            .catch(err => {
                if (err.response.status === 404) {
                    this.setState({ error: "You currently have no order", loading: false })
                }
                else {
                    this.setState({
                        error: err, loading: false
                    })
                }
            })
    }

    renderVariation = (orderItem) =>{
        let text = ''
        orderItem.item_variations.forEach(iv => {
            text += `${iv.variation.name} :  ${iv.value}`
        })
        return text
    }
    render() {
        const { data, loading, error } = this.state;
        console.log(data)
        return (
            <Container>
                {error &&
                    <Message negative>
                        <Message.Header>Error</Message.Header>
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
                <Header as='h1'>Your Cart</Header>
                {data &&
                    <Table celled>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Item #</TableHeaderCell>
                                <TableHeaderCell>Item</TableHeaderCell>
                                <TableHeaderCell>Price</TableHeaderCell>
                                <TableHeaderCell>Quantity</TableHeaderCell>
                                <TableHeaderCell>Total Price</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.order_items.map((order_item, i) =>
                                <TableRow key={order_item.id}>
                                    <TableCell>{i + 1}</TableCell>
                            <TableCell>{order_item.item.title} - {this.renderVariation(order_item)}</TableCell>
                                    <TableCell>
                                        {order_item.item.discount_price ? <React.Fragment><strike>&#8358;{order_item.item.price}</strike>  &#8358;{order_item.item.discount_price}</React.Fragment> : <React.Fragment>&#8358;{order_item.item.price}</React.Fragment>}
                                    </TableCell>
                                    <TableCell>{order_item.quantity}</TableCell>
                                    <TableCell><Label color='green' ribbon>Limited</Label>&#8358;{order_item.total_price}</TableCell>
                                </TableRow>
                            )}
                            <Table.Row>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell textAlign='right'>Total: &#8358;{data.total} </Table.Cell>
                            </Table.Row>
                        </TableBody>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan="5" textAlign="right">
                                    <Link to='/checkout'>  <Button color='yellow' style={{ 'marginLeft': '1rem' }}>Checkout</Button></Link>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>}
            </Container>
        )

    }
}

export default OrderSummary