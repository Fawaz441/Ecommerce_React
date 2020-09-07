import React from 'react'
import { Button, Icon, Image, Item, Label, Container, Segment, Dimmer, Loader, Message } from 'semantic-ui-react'
import axios from 'axios'
import { productlistURL, addToCartURL } from '../constants'
import { authAxios } from '../utils'
import { cartFetch } from '../store/actions/cart'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class ProductList extends React.Component {
  state = {
    loading: true,
    error: null,
    data: []
  }

  componentDidMount() {
    axios.get(productlistURL)
      .then(res => {
        this.setState({ data: res.data, loading: false })
      })
      .catch(err => {
        this.setState({ error: err, loading: false })
      })
  }

  handleAddToCart = slug => {
    this.setState({loading:true})
    authAxios.post(addToCartURL, {slug})
      .then(res => {
        this.setState({ loading: false })
        this.props.getCart();
      })
      .catch(err => {
        this.setState({ error: err, loading: false })
      })
  }

  render() {
    const { loading, error, data } = this.state;
    return (
      <Container>
        {error &&
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{JSON.stringify(error)}</p>
          </Message>
        }
        {loading &&
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src='/images/wireframe/short-paragraph.png' />
          </Segment>
        }
        <Item.Group divided>
          {data.map(item => (
            <Item key={item.id}>
              <Item.Image src={item.image} />

              <Item.Content>
              <Link to={`/products/${item.slug}`}><Item.Header as='h1' style={{'textTransform':'capitalize'}}>{item.title}</Item.Header></Link>
                <Item.Meta>
                  <span className='cinema'>{item.category}</span>
                </Item.Meta>
                <Item.Description>{item.description}</Item.Description>
                <Item.Extra>
                  <Label color={item.label === 'Shirt' ? 'blue' : item.label === 'Secondary' ? 'red' : 'purple'} >{item.label}</Label>
                  {/* <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug) }> Add To Cart <Icon name='cart plus' >
                    </Icon></Button> */}
                </Item.Extra>
              </Item.Content>
            </Item>))}


        </Item.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch =>{
  return{
    getCart: () => dispatch(cartFetch())
  }
}

export default connect(null,mapDispatchToProps)(ProductList)
